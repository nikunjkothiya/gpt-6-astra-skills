#!/usr/bin/env node
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const HELP = `Usage: node scripts/capture.mjs --url URL [options]

Render a running site with Playwright and record evidence:
first-view and scroll-step screenshots per viewport, a contact sheet, a
12-sample wheel-scroll strip, reduced-motion captures, idle pixel differences,
a scroll-direction comparison, horizontal overflow, console/page
errors, failed requests, broken images and fonts, CLS/LCP/long animation
frames where supported, wheel-scroll frame intervals, keyboard focus geometry
and indicator hints, and optional axe-core violations.

Options
  --url URL              page to capture (http(s):// or file://)
  --out DIR              new output directory; never overwrite (default: captures)
  --viewports LIST       WxH list (default: 390x844,768x1024,1440x900)
  --steps N              scroll screenshots per viewport (default: 6)
  --settle MS            wait after load and each scroll step (default: 700)
  --browser NAME         chromium | firefox | webkit (default: chromium)
  --channel NAME         installed browser channel, e.g. chrome or msedge
  --tabs N               keyboard focus steps (default: 12)
  --timeout MS           navigation timeout (default: 45000)
  --axe                  run axe-core when it is installed in the project

Playwright is resolved from the current project (playwright, playwright-core
or @playwright/test) or from PLAYWRIGHT_MODULE. Exit 1 when problems are found,
2 when capture cannot run. The output parent must exist. Headless timings and
pixel/indicator comparisons are review hints, not device results or conformance.
`;

export function parseArgs(argv) {
  const options = { out: 'captures', viewports: '390x844,768x1024,1440x900', steps: 6, settle: 700, browser: 'chromium', channel: undefined, tabs: 12, timeout: 45000, axe: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') { options.help = true; continue; }
    if (arg === '--axe') { options.axe = true; continue; }
    const key = { '--url': 'url', '--out': 'out', '--viewports': 'viewports', '--steps': 'steps', '--settle': 'settle', '--browser': 'browser', '--channel': 'channel', '--tabs': 'tabs', '--timeout': 'timeout' }[arg];
    if (!key) throw new Error(`Unknown option: ${arg}`);
    const value = argv[++i];
    if (value === undefined || value === '' || value.startsWith('--')) throw new Error(`Missing value for ${arg}`);
    if (['steps', 'settle', 'tabs', 'timeout'].includes(key) && !/^\d+$/.test(value)) throw new Error(`${arg} needs a decimal integer`);
    options[key] = ['steps', 'settle', 'tabs', 'timeout'].includes(key) ? Number(value) : value;
  }
  if (options.help) return options;
  let url;
  try { url = new URL(options.url); } catch { throw new Error('--url must be a valid http(s):// or file:// URL'); }
  if (!/^(https?|file):\/\//i.test(options.url) || !['http:', 'https:', 'file:'].includes(url.protocol)) throw new Error('--url must be a valid http(s):// or file:// URL');
  for (const key of ['steps', 'settle', 'tabs', 'timeout']) {
    const maximum = ['steps', 'tabs'].includes(key) ? 1000 : 300000;
    const minimum = key === 'timeout' ? 1 : 0;
    if (!Number.isSafeInteger(options[key]) || options[key] < minimum || options[key] > maximum) throw new Error(`--${key} must be between ${minimum} and ${maximum}`);
  }
  if (!['chromium', 'firefox', 'webkit'].includes(options.browser)) throw new Error('--browser must be chromium, firefox or webkit');
  options.viewports = String(options.viewports).split(',').map(entry => {
    const match = entry.trim().match(/^(\d{1,4})x(\d{1,4})$/);
    if (!match) throw new Error(`Invalid viewport: ${entry}`);
    const width = Number(match[1]);
    const height = Number(match[2]);
    if (width < 1 || height < 1 || width > 8192 || height > 8192 || width * height > 16777216) throw new Error(`Viewport exceeds supported capture bounds: ${entry}`);
    return { width, height };
  });
  if (options.viewports.length > 16) throw new Error('Use at most 16 viewports per capture');
  if (new Set(options.viewports.map(({ width, height }) => `${width}x${height}`)).size !== options.viewports.length) throw new Error('Duplicate viewports would overwrite evidence');
  return options;
}

function loadPlaywright() {
  const names = process.env.PLAYWRIGHT_MODULE ? [process.env.PLAYWRIGHT_MODULE] : ['playwright', 'playwright-core', '@playwright/test'];
  for (const base of [join(process.cwd(), 'package.json'), import.meta.url]) {
    const require = createRequire(base);
    for (const name of names) {
      try { return require(require.resolve(name)); } catch {}
    }
  }
  return null;
}

function resolveAxe() {
  try { return createRequire(join(process.cwd(), 'package.json')).resolve('axe-core/axe.min.js'); } catch { return null; }
}

export function installObservers() {
  const supported = typeof PerformanceObserver === 'undefined' ? [] : PerformanceObserver.supportedEntryTypes ?? [];
  const store = { lcp: null, cls: null, loaf: null, loafMax: null };
  window.__veiMetrics = store;
  let sessionStart = 0;
  let lastShift = 0;
  let sessionValue = 0;
  const observe = (type, handle) => {
    if (!supported.includes(type)) return false;
    try {
      new PerformanceObserver(list => list.getEntries().forEach(handle)).observe({ type, buffered: true });
      return true;
    } catch { return false; }
  };
  observe('largest-contentful-paint', entry => { store.lcp = Math.round(entry.startTime); });
  if (observe('layout-shift', entry => {
    if (entry.hadRecentInput) return;
    // CLS is the largest session window: gaps under 1 s and total span under 5 s.
    if (sessionValue > 0 && entry.startTime - lastShift < 1000 && entry.startTime - sessionStart < 5000) sessionValue += entry.value;
    else { sessionStart = entry.startTime; sessionValue = entry.value; }
    lastShift = entry.startTime;
    store.cls = Math.max(store.cls ?? 0, sessionValue);
  })) store.cls ??= 0;
  if (observe('long-animation-frame', entry => { store.loaf = (store.loaf ?? 0) + 1; store.loafMax = Math.max(store.loafMax ?? 0, Math.round(entry.duration)); })) {
    store.loaf ??= 0;
    store.loafMax ??= 0;
  }
}

function pageFacts() {
  const root = document.documentElement;
  const fonts = document.fonts ? [...document.fonts] : [];
  return {
    title: document.title,
    lang: root.lang || null,
    scrollHeight: root.scrollHeight,
    horizontalOverflow: Math.max(0, root.scrollWidth - root.clientWidth),
    h1: document.querySelectorAll('h1').length,
    fontsLoaded: [...new Set(fonts.filter(font => font.status === 'loaded').map(font => font.family.replace(/["']/g, '')))],
    fontsFailed: [...new Set(fonts.filter(font => font.status === 'error').map(font => font.family.replace(/["']/g, '')))],
    imagesBroken: [...document.images].filter(image => image.complete && image.naturalWidth === 0 && image.currentSrc).map(image => image.currentSrc).slice(0, 10),
    imagesMissingAlt: [...document.images].filter(image => !image.hasAttribute('alt')).length,
    runningInfiniteAnimations: document.getAnimations ? document.getAnimations().filter(animation => animation.playState === 'running' && animation.effect?.getComputedTiming?.().iterations === Infinity).length : null,
    entryTypes: typeof PerformanceObserver !== 'undefined' ? PerformanceObserver.supportedEntryTypes : [],
    metrics: window.__veiMetrics ?? null,
  };
}

function focusFacts() {
  const element = document.activeElement;
  if (!element || element === document.body || element === document.documentElement) return null;
  const style = getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  const outline = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
  const shadow = Boolean(style.boxShadow) && style.boxShadow !== 'none';
  return {
    element: `${element.tagName.toLowerCase()}${element.id ? '#' + element.id : ''}`,
    name: (element.getAttribute('aria-label') || element.textContent || element.getAttribute('title') || '').trim().replace(/\s+/g, ' ').slice(0, 60),
    indicator: outline || shadow,
    visible: style.visibility !== 'hidden' && style.display !== 'none' && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth,
    size: [Math.round(rect.width), Math.round(rect.height)],
  };
}

function quantiles(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const at = p => Math.round(sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))] * 10) / 10;
  return { frames: sorted.length, p50: at(0.5), p95: at(0.95), p99: at(0.99), over50ms: sorted.filter(value => value > 50).length };
}

async function settleLoad(page, options) {
  await page.goto(options.url, { waitUntil: 'load', timeout: options.timeout });
  try { await page.waitForLoadState('networkidle', { timeout: 10000 }); } catch {}
  await page.evaluate(() => (document.fonts ? document.fonts.ready.then(() => true) : true));
  await page.waitForTimeout(options.settle);
}

export async function capture(pw, options) {
  const out = resolve(options.out);
  // A fresh directory protects previous evidence, including files behind links.
  try { await mkdir(out); } catch (error) {
    if (error.code === 'EEXIST') throw new Error(`Output already exists; choose a new directory: ${out}`);
    throw error;
  }
  const browser = await pw[options.browser].launch({ headless: true, channel: options.channel });
  const report = { url: options.url, browser: options.browser, channel: options.channel ?? null, capturedAt: new Date().toISOString(), viewports: [], problems: [], notes: [] };
  const axePath = options.axe ? resolveAxe() : null;
  if (options.axe && !axePath) report.notes.push('axe-core is not installed in this project; accessibility rules were not run.');
  try {
    for (const [index, viewport] of options.viewports.entries()) {
      const label = `${viewport.width}x${viewport.height}`;
      const entry = { viewport: label, files: [], console: [], pageErrors: [], failedRequests: [] };
      const context = await browser.newContext({ viewport, reducedMotion: 'no-preference', hasTouch: viewport.width < 800 });
      await context.addInitScript(installObservers);
      const page = await context.newPage();
      page.on('console', message => { if (message.type() === 'error') entry.console.push(message.text().slice(0, 300)); });
      page.on('pageerror', error => entry.pageErrors.push(String(error.message).slice(0, 300)));
      page.on('requestfailed', request => entry.failedRequests.push(`${request.failure()?.errorText ?? 'failed'} ${request.url()}`.slice(0, 300)));
      page.on('response', response => { if (response.status() >= 400) entry.failedRequests.push(`${response.status()} ${response.url()}`.slice(0, 300)); });
      await settleLoad(page, options);
      const shot = async name => {
        const file = `${label}-${name}.png`;
        const buffer = await page.screenshot({ path: join(out, file) });
        entry.files.push(file);
        return buffer;
      };
      const first = await shot('view');
      await page.waitForTimeout(1500);
      entry.idleMotion = !first.equals(await page.screenshot());
      entry.facts = await page.evaluate(pageFacts);
      const maxScroll = await page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - innerHeight));
      for (let step = 1; step <= options.steps && maxScroll > 0; step++) {
        await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), Math.round((maxScroll * step) / options.steps));
        await page.waitForTimeout(options.settle);
        await shot(`scroll-${String(step).padStart(2, '0')}`);
      }
      entry.facts.clsAfterScroll = await page.evaluate(() => window.__veiMetrics?.cls ?? null);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(options.settle);
      if (maxScroll > 0) {
        await page.mouse.move(viewport.width / 2, viewport.height / 2);
        await page.evaluate(() => {
          window.__veiFrames = [];
          window.__veiStop = false;
          let last = performance.now();
          const tick = now => { window.__veiFrames.push(now - last); last = now; if (!window.__veiStop) requestAnimationFrame(tick); };
          requestAnimationFrame(tick);
        });
        for (let i = 0; i < 60; i++) { await page.mouse.wheel(0, 120); await page.waitForTimeout(16); }
        await page.waitForTimeout(800);
        entry.wheelFrames = quantiles(await page.evaluate(() => { window.__veiStop = true; return window.__veiFrames.slice(1); }));
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.waitForTimeout(options.settle);
        const strip = [];
        for (let i = 0; i < 12; i++) {
          await page.mouse.wheel(0, Math.max(80, Math.round(viewport.height / 6)));
          await page.waitForTimeout(60);
          strip.push((await page.screenshot({ type: 'jpeg', quality: 70 })).toString('base64'));
        }
        const stripFile = `${label}-strip.png`;
        await composeSheet(browser, join(out, stripFile), [{ title: `${label} wheel scroll, 12 sampled screenshots (not consecutive frames)`, width: viewport.width < 800 ? 260 : 400, images: strip.map((data, i) => ({ src: `data:image/jpeg;base64,${data}`, caption: `sample ${i + 1}` })) }]);
        entry.files.push(stripFile);
        entry.directionMismatch = [];
        for (const fraction of [0.25, 0.5, 0.75]) {
          const y = Math.round(maxScroll * fraction);
          await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
          await page.waitForTimeout(options.settle);
          await page.evaluate(target => window.scrollTo({ top: target, behavior: 'instant' }), y);
          await page.waitForTimeout(options.settle);
          const down = await page.screenshot();
          await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
          await page.waitForTimeout(options.settle);
          await page.evaluate(target => window.scrollTo({ top: target, behavior: 'instant' }), y);
          await page.waitForTimeout(options.settle);
          const up = await page.screenshot();
          if (!down.equals(up)) {
            const tag = String(Math.round(fraction * 100));
            await writeFile(join(out, `${label}-direction-${tag}-down.png`), down);
            await writeFile(join(out, `${label}-direction-${tag}-up.png`), up);
            entry.directionMismatch.push(fraction);
          }
        }
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      }
      entry.focus = [];
      for (let i = 0; i < options.tabs; i++) {
        await page.keyboard.press('Tab');
        const facts = await page.evaluate(focusFacts);
        if (!facts) continue;
        entry.focus.push(facts);
        if (entry.focus.length === 1) await shot('focus-01');
      }
      if (axePath && index === 0) {
        await page.addScriptTag({ path: axePath });
        entry.axe = await page.evaluate(async () => (await window.axe.run(document, { resultTypes: ['violations'] })).violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help })));
      }
      // Lazy media can fail after scrolling; retain final observations as well.
      entry.finalFacts = await page.evaluate(pageFacts);
      entry.facts.clsAfterScroll = entry.finalFacts.metrics?.cls ?? null;
      await context.close();

      const reduced = await browser.newContext({ viewport, reducedMotion: 'reduce', hasTouch: viewport.width < 800 });
      const reducedPage = await reduced.newPage();
      entry.reducedErrors = [];
      reducedPage.on('pageerror', error => entry.reducedErrors.push(String(error.message).slice(0, 300)));
      reducedPage.on('console', message => { if (message.type() === 'error') entry.reducedErrors.push(message.text().slice(0, 300)); });
      reducedPage.on('requestfailed', request => entry.reducedErrors.push(`${request.failure()?.errorText ?? 'failed'} ${request.url()}`.slice(0, 300)));
      reducedPage.on('response', response => { if (response.status() >= 400) entry.reducedErrors.push(`${response.status()} ${response.url()}`.slice(0, 300)); });
      await settleLoad(reducedPage, options);
      const reducedFile = `${label}-reduced-view.png`;
      const reducedFirst = await reducedPage.screenshot({ path: join(out, reducedFile) });
      entry.files.push(reducedFile);
      await reducedPage.waitForTimeout(1500);
      entry.reducedIdleMotion = !reducedFirst.equals(await reducedPage.screenshot());
      entry.reducedInfiniteAnimations = (await reducedPage.evaluate(pageFacts)).runningInfiniteAnimations;
      const reducedMaxScroll = await reducedPage.evaluate(() => Math.max(0, document.documentElement.scrollHeight - innerHeight));
      if (reducedMaxScroll > 0) {
        await reducedPage.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), Math.round(reducedMaxScroll / 2));
        await reducedPage.waitForTimeout(options.settle);
        const middle = `${label}-reduced-scroll-mid.png`;
        await reducedPage.screenshot({ path: join(out, middle) });
        entry.files.push(middle);
      }
      entry.reducedFacts = await reducedPage.evaluate(pageFacts);
      await reduced.close();

      const problem = text => report.problems.push(`${label}: ${text}`);
      if (entry.pageErrors.length) problem(`${entry.pageErrors.length} uncaught page errors`);
      if (entry.console.length) problem(`${entry.console.length} console errors`);
      if (entry.failedRequests.length) problem(`${entry.failedRequests.length} failed requests`);
      if (entry.reducedErrors.length) problem(`${entry.reducedErrors.length} reduced-motion page, console or request errors`);
      for (const [mode, facts] of [['initial', entry.facts], ['after interaction', entry.finalFacts], ['reduced motion', entry.reducedFacts]]) {
        if (facts.horizontalOverflow > 1) problem(`${mode}: horizontal overflow of ${facts.horizontalOverflow}px`);
        if (facts.imagesBroken.length) problem(`${mode}: ${facts.imagesBroken.length} broken images`);
        if (facts.imagesMissingAlt) problem(`${mode}: ${facts.imagesMissingAlt} images missing an alt attribute`);
        if (facts.fontsFailed.length) problem(`${mode}: fonts failed to load: ${facts.fontsFailed.join(', ')}`);
      }
      if (entry.reducedIdleMotion) report.notes.push(`${label}: first-view pixels change under prefers-reduced-motion; inspect whether this is motion, a live value or delayed content.`);
      if (entry.reducedInfiniteAnimations) report.notes.push(`${label}: ${entry.reducedInfiniteAnimations} infinite CSS/WAAPI animations run under reduced motion; inspect their purpose and movement.`);
      const cls = entry.facts.clsAfterScroll;
      if (typeof cls === 'number' && entry.facts.entryTypes.includes('layout-shift') && cls > 0.1) problem(`CLS ${cls.toFixed(3)} exceeds 0.1`);
      const noIndicator = entry.focus.filter(item => !item.indicator).map(item => item.element);
      if (noIndicator.length) report.notes.push(`${label}: no outline/box-shadow focus indicator detected on: ${[...new Set(noIndicator)].slice(0, 6).join(', ')}; other indicator styles require visual inspection.`);
      const small = entry.focus.filter(item => item.visible && (item.size[0] < 24 || item.size[1] < 24)).map(item => item.element);
      if (small.length) report.notes.push(`${label}: focus targets smaller than 24x24px: ${[...new Set(small)].slice(0, 6).join(', ')}; inspect target spacing and applicable exceptions.`);
      if (entry.focus.some(item => !item.visible)) problem('keyboard focus reaches an element outside visible viewport geometry or with hidden styling');
      if (entry.axe?.length) problem(`${entry.axe.length} axe-core violation types`);
      if (entry.idleMotion) report.notes.push(`${label}: first view changes while idle; confirm it is intentional, pausable and stops offscreen.`);
      if (entry.wheelFrames?.p95 > 34) report.notes.push(`${label}: wheel-scroll p95 frame interval ${entry.wheelFrames.p95} ms (headless indicator).`);
      if (entry.directionMismatch?.length) report.notes.push(`${label}: page differs when reaching ${entry.directionMismatch.map(f => `${Math.round(f * 100)}%`).join(', ')} from above vs below; scrubbed scenes should depend only on scroll position (see ${label}-direction-*.png).`);
      report.viewports.push(entry);
    }
    const rows = report.viewports.map(entry => ({
      title: entry.viewport,
      width: Number(entry.viewport.split('x')[0]) < 800 ? 220 : 400,
      images: entry.files.filter(file => /-(view|scroll-\d+|reduced-view|reduced-scroll-mid|focus-01)\.png$/.test(file)).map(file => ({ src: file, caption: file.replace(`${entry.viewport}-`, '').replace('.png', '') })),
    }));
    await composeSheet(browser, join(out, 'contact-sheet.png'), rows, out);
    report.contactSheet = 'contact-sheet.png';
  } finally {
    await browser.close();
  }
  await writeFile(join(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  return { report, out };
}

async function composeSheet(browser, path, rows, base) {
  const escape = value => String(value).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const sheetWidth = 1680;
  const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:16px;width:${sheetWidth}px;background:#202124;color:#e8eaed;font:13px/1.4 system-ui,sans-serif}h2{margin:18px 0 8px;font-size:14px;font-weight:600}section{display:flex;flex-wrap:wrap;gap:10px}figure{margin:0}img{display:block;height:auto;background:#000}figcaption{margin-top:4px;color:#9aa0a6}</style>${rows.map(row => `<h2>${escape(row.title)}</h2><section>${row.images.map(image => `<figure><img src="${escape(image.src)}" style="width:${row.width}px"><figcaption>${escape(image.caption)}</figcaption></figure>`).join('')}</section>`).join('')}`;
  const context = await browser.newContext({ viewport: { width: sheetWidth + 32, height: 600 } });
  const page = await context.newPage();
  if (base) {
    const file = join(base, 'contact-sheet.html');
    await writeFile(file, html);
    await page.goto(pathToFileURL(file).href);
  } else {
    await page.setContent(html);
  }
  await page.evaluate(() => Promise.all([...document.images].map(image => image.decode().catch(() => null))));
  await page.screenshot({ path, fullPage: true });
  await context.close();
}

export function summary({ report, out }) {
  const lines = [`Captured ${report.url} with ${report.browser}${report.channel ? ` (${report.channel})` : ''} -> ${out}`];
  for (const entry of report.viewports) {
    const m = entry.facts.metrics ?? {};
    const frames = entry.wheelFrames ? `wheel p50/p95 ${entry.wheelFrames.p50}/${entry.wheelFrames.p95} ms` : 'not scrollable';
    lines.push(`  ${entry.viewport}: ${entry.files.length} images, overflow ${entry.facts.horizontalOverflow}px, LCP ${m.lcp ?? 'n/a'} ms, CLS ${typeof entry.facts.clsAfterScroll === 'number' ? entry.facts.clsAfterScroll.toFixed(3) : 'n/a'}, long frames ${m.loaf ?? 'n/a'}, ${frames}, fonts ${entry.facts.fontsLoaded.join(', ') || 'none reported'}`);
  }
  if (report.contactSheet) lines.push(`  contact sheet: ${join(out, report.contactSheet)}`);
  lines.push(report.problems.length ? `Problems (${report.problems.length}):\n  - ${report.problems.join('\n  - ')}` : 'No problems detected by automated checks.');
  if (report.notes.length) lines.push(`Notes:\n  - ${report.notes.join('\n  - ')}`);
  lines.push('Open the screenshots and inspect actual playback and tasks; sampled stills and automated checks do not establish visual quality, full motion behavior or WCAG conformance. INP is not measured.');
  return lines.join('\n') + '\n';
}

async function main(argv) {
  const options = parseArgs(argv);
  if (options.help) return process.stdout.write(HELP);
  const pw = loadPlaywright();
  if (!pw) {
    process.stderr.write('Playwright is not installed in this project. Install it as a dev dependency (npm i -D playwright, then npx playwright install chromium) or pass --channel chrome/msedge with playwright-core to use an installed browser. Set PLAYWRIGHT_MODULE to point at another installation.\n');
    process.exitCode = 2;
    return;
  }
  const result = await capture(pw, options);
  process.stdout.write(summary(result));
  if (result.report.problems.length) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).catch(error => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 2;
  });
}
