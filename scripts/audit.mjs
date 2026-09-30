#!/usr/bin/env node
import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', 'out', 'coverage', 'vendor', 'storybook-static', 'target']);
const MARKUP = new Set(['.html', '.htm', '.vue', '.svelte', '.astro', '.php', '.liquid', '.njk', '.hbs', '.twig', '.erb', '.jsx', '.tsx', '.mdx']);
const STYLE = new Set(['.css', '.scss', '.sass', '.less', '.pcss']);
const SCRIPT = new Set(['.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.astro']);
const DOCUMENT = new Set(['.html', '.htm']);
const SCANNED = new Set([...MARKUP, ...STYLE, ...SCRIPT]);
const MAX_BYTES = 1024 * 1024;
const PER_RULE_FILE_LIMIT = 12;
const GENERIC_FONTS = new Set(['inter', 'roboto', 'arial', 'helvetica', 'helvetica neue', 'open sans', 'montserrat', 'poppins', 'lato', 'system-ui', '-apple-system', 'segoe ui', 'sans-serif']);
const LAYOUT_PROPERTIES = /^(width|height|min-width|min-height|max-width|max-height|top|left|right|bottom|inset|margin(-\w+)*|padding(-\w+)*)$/;

async function collect(root, limit) {
  const files = [];
  const skippedOversized = [];
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      // One extra eligible file distinguishes a full scan from a truncated one.
      if (files.length > limit) return;
      if (entry.isSymbolicLink()) continue;
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name) && !entry.name.startsWith('.')) await walk(path);
      } else if (entry.isFile() && SCANNED.has(extname(entry.name).toLowerCase()) && !/\.min\.(js|css)$/i.test(entry.name)) {
        if ((await stat(path)).size <= MAX_BYTES) files.push(path);
        else skippedOversized.push(relative(root, path).split('\\').join('/'));
      }
    }
  }
  await walk(root);
  return { paths: files.slice(0, limit), truncated: files.length > limit, skippedOversized };
}

function lineLookup(text) {
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text.charCodeAt(i) === 10) starts.push(i + 1);
  return index => {
    let low = 0;
    let high = starts.length - 1;
    while (low < high) {
      const mid = (low + high + 1) >> 1;
      if (starts[mid] <= index) low = mid; else high = mid - 1;
    }
    return low + 1;
  };
}

function fileRules(file, add, project) {
  const { text, ext } = file;
  const markup = MARKUP.has(ext);
  const document = DOCUMENT.has(ext);
  const script = SCRIPT.has(ext);

  if (markup) {
    const tagFlags = ['.jsx', '.tsx', '.mdx'].includes(ext) ? 'g' : 'gi';
    for (const m of text.matchAll(new RegExp('<img\\b[^>]*>', tagFlags))) {
      if (/\{\s*\.\.\./.test(m[0])) continue;
      if (!/\salt\s*=/i.test(m[0])) add('a11y/img-alt', 'error', m.index, 'Image has no alt attribute in this source tag.', 'Describe what the image shows or does; use alt="" only for decoration.');
      if (!/\swidth\s*=/i.test(m[0]) || !/\sheight\s*=/i.test(m[0])) add('perf/img-dimensions', 'warn', m.index, 'Image lacks intrinsic width or height in this source tag; inspect whether CSS reserves its space.', 'Set intrinsic width/height (or a CSS aspect-ratio on its frame).');
    }
    for (const m of text.matchAll(/<video\b[^>]*>/gi)) {
      if (/\bautoplay\b/i.test(m[0]) && !(/\bmuted\b/i.test(m[0]) && /\bplaysinline\b/i.test(m[0]))) add('media/autoplay', 'warn', m.index, 'Autoplaying video without muted and playsinline.', 'Add muted and playsinline, a poster, and a visible pause control for motion longer than 5 s.');
    }
    for (const m of text.matchAll(/<(div|span|li|section|article)\b[^>]*>/g)) {
      if (/\s(onclick|onClick|@click|v-on:click|on:click)\s*=/.test(m[0]) && !/\srole\s*=/i.test(m[0])) add('a11y/clickable-non-control', 'warn', m.index, `Click handler on <${m[1]}> without a role.`, 'Use <button> for actions and <a href> for navigation so keyboard and assistive tech work.');
    }
    for (const m of text.matchAll(/tabindex\s*=\s*["'{]?\s*([1-9]\d*)/gi)) add('a11y/positive-tabindex', 'warn', m.index, `tabindex=${m[1]} reorders focus unpredictably.`, 'Use DOM order and tabindex 0 or -1 only.');
    for (const m of text.matchAll(/<meta\b[^>]*name\s*=\s*["']viewport["'][^>]*>/gi)) {
      if (/user-scalable\s*=\s*(no|0)\b|maximum-scale\s*=\s*1(\.0+)?(?![\d.])/i.test(m[0])) add('a11y/zoom-blocked', 'error', m.index, 'Viewport meta blocks pinch zoom.', 'Remove user-scalable=no and maximum-scale=1.');
    }
    for (const m of text.matchAll(/\btransition-all\b/g)) add('perf/transition-all', 'warn', m.index, 'Utility transition-all animates every changing property.', 'Use transition-transform, transition-opacity or transition-colors.');
    for (const m of text.matchAll(/\b(?:min-)?h-screen\b/g)) add('layout/100vh', 'info', m.index, 'h-screen maps to 100vh, which ignores mobile browser chrome.', 'Prefer h-dvh / min-h-svh for full-height sections.');
    for (const m of text.matchAll(/(?:from|via|to)-(?:purple|violet|indigo|fuchsia)-\d{3}/g)) add('design/generic-gradient', 'info', m.index, 'Purple/indigo gradient utility, a common generated-UI default.', 'Derive gradients from the brand palette, or remove them if they only decorate.');
    for (const m of text.matchAll(/\bcursor-none\b/g)) add('a11y/cursor-none', 'info', m.index, 'Native cursor hidden by utility.', 'Hide it only under (pointer: fine) with a visible replacement; never on text fields.');
  }

  if (document) {
    const html = text.match(/<html\b[^>]*>/i);
    if (html && !/\slang\s*=/i.test(html[0])) add('a11y/html-lang', 'error', html.index, '<html> has no lang attribute.', 'Add lang, e.g. <html lang="en">.');
    if (/<head\b/i.test(text)) {
      const head = text.search(/<head\b/i);
      if (!/<title\b/i.test(text)) add('seo/title', 'warn', head, 'Document has no <title>.', 'Write a specific page title.');
      if (!/<meta\b[^>]*name\s*=\s*["']description["']/i.test(text)) add('seo/description', 'warn', head, 'No meta description.', 'Add a 140-160 character description of the page.');
      if (!/property\s*=\s*["']og:image["']/i.test(text)) add('seo/og-image', 'info', head, 'No og:image for link previews.', 'Add a 1200x630 share image that carries the visual identity.');
    }
    const h1 = (text.match(/<h1\b/gi) ?? []).length;
    if (/<body\b/i.test(text) && h1 !== 1) add('seo/h1', 'info', Math.max(0, text.search(/<body\b/i)), `Page has ${h1} <h1> elements.`, 'Give each page one h1 that names its subject.');
    const firstImage = text.match(/<img\b[^>]*>/);
    if (firstImage && /loading\s*=\s*["']lazy["']/i.test(firstImage[0])) add('perf/lazy-first-image', 'warn', firstImage.index, 'First image is lazy-loaded; it is often the LCP element.', 'Load the hero image eagerly with fetchpriority="high".');
    if (/<(nav|header)\b/i.test(text) && !/href\s*=\s*["']#(main|content|main-content)["']/i.test(text) && !/skip/i.test(text)) add('a11y/skip-link', 'info', text.search(/<(nav|header)\b/i), 'No skip link before repeated navigation.', 'Add <a class="skip-link" href="#main"> as the first focusable element.');
  }

  for (const m of text.matchAll(/transition(?:-property)?\s*:\s*([^;{}]+)/g)) {
    const segments = m[1].split(',').map(part => part.trim().split(/\s+/)[0].toLowerCase());
    if (segments.includes('all')) add('perf/transition-all', 'warn', m.index, '"transition: all" animates every changing property.', 'List the properties you animate: transform, opacity, color, background-color.');
    else if (segments.some(name => LAYOUT_PROPERTIES.test(name))) add('perf/layout-transition', 'warn', m.index, 'Transition animates a layout property.', 'Animate transform/opacity, or clip-path/scale for reveals; use grid-template-rows or interpolate-size for height.');
  }
  if (/\b100vh\b/.test(text) && !/\b\d+(?:\.\d+)?[dsl]vh\b/.test(text)) {
    for (const m of text.matchAll(/\b100vh\b/g)) add('layout/100vh', 'warn', m.index, '100vh without a dynamic viewport unit.', 'Use 100svh/100dvh (keep 100vh as the preceding fallback only if needed).');
  }
  for (const m of text.matchAll(/@font-face\s*\{[^}]*\}/g)) {
    if (!/font-display\s*:/.test(m[0])) add('fonts/font-display', 'warn', m.index, '@font-face without font-display.', 'Use font-display: swap (or optional for decorative faces) and preload the critical file.');
  }
  for (const m of text.matchAll(/cursor\s*:\s*none/g)) {
    if (!/pointer\s*:\s*fine|hover\s*:\s*hover/.test(text)) add('a11y/cursor-none', 'warn', m.index, 'Native cursor hidden without a fine-pointer condition.', 'Scope custom cursors to @media (hover: hover) and (pointer: fine); keep native cursors on inputs.');
  }
  for (const m of text.matchAll(/font-family\s*:\s*([^;{}]+)/g)) {
    const first = m[1].split(',')[0].trim().replace(/^['"]|['"]$/g, '').toLowerCase();
    if (GENERIC_FONTS.has(first)) add('design/generic-font', 'info', m.index, `Primary font "${first}" is a common default.`, 'Confirm the face is a deliberate brand choice; pair or replace it per the typography system.');
  }
  for (const m of text.matchAll(/family=(Inter|Roboto|Poppins|Montserrat|Open\+Sans|Lato)\b/g)) add('design/generic-font', 'info', m.index, `Web font ${m[1].replace('+', ' ')} is a common default.`, 'Confirm the face is a deliberate brand choice.');
  for (const m of text.matchAll(/gradient\([^)]*#(?:6366f1|8b5cf6|a855f7|7c3aed|4f46e5|9333ea|c084fc)/gi)) add('design/generic-gradient', 'info', m.index, 'Indigo/violet gradient, a common generated-UI default.', 'Derive gradients from the brand palette or remove them.');
  for (const m of text.matchAll(/z-index\s*:\s*(\d{4,})|z-\[(\d{4,})\]/g)) add('tokens/z-index', 'info', m.index, `z-index ${m[1] ?? m[2]} suggests an unmanaged stacking order.`, 'Use a small layer scale (base, raised, sticky, overlay, modal, toast).');
  for (const m of text.matchAll(/overflow-x\s*:\s*hidden/g)) add('layout/overflow-x-hidden', 'info', m.index, 'overflow-x: hidden can mask overflow bugs and breaks position: sticky in descendants.', 'Fix the overflowing element, or use overflow-x: clip.');
  for (const m of text.matchAll(/animation(?:-iteration-count)?\s*:[^;{}]*\binfinite\b|repeat\s*:\s*-1\b/g)) add('motion/infinite', 'info', m.index, 'Infinite animation.', 'Pause it offscreen, stop it under reduced motion, and offer pause if it runs longer than 5 s.');
  const willChange = [...text.matchAll(/will-change\s*:/g)];
  if (willChange.length >= 6) add('perf/will-change', 'info', willChange[0].index, `${willChange.length} will-change declarations in one file.`, 'Apply will-change just before an animation and remove it afterwards.');
  const backdrop = [...text.matchAll(/backdrop-filter\s*:/g)];
  if (backdrop.length >= 4) add('perf/backdrop-filter', 'info', backdrop[0].index, `${backdrop.length} backdrop-filter declarations.`, 'Limit blurred layers; each one re-renders what is behind it every frame.');

  if (script) {
    for (const m of text.matchAll(/addEventListener\(\s*['"](scroll|wheel|touchmove|touchstart)['"]/g)) {
      if (!/passive/.test(text.slice(m.index, m.index + 320))) add('perf/non-passive-listener', 'warn', m.index, `"${m[1]}" listener without { passive: true }.`, 'Mark it passive unless it must call preventDefault; prefer IntersectionObserver or scroll timelines.');
    }
    for (const m of text.matchAll(/userScalable\s*:\s*false|maximumScale\s*:\s*1(?![\d.])/g)) add('a11y/zoom-blocked', 'error', m.index, 'Viewport configuration blocks zoom.', 'Remove userScalable: false and maximumScale: 1.');
    const animates = /gsap\.(to|from|fromTo|timeline|set)\(|ScrollTrigger\.create\(/.test(text);
    const lifecycle = /\b(useEffect|useLayoutEffect|onMounted|onMount|connectedCallback)\b/.test(text);
    if (animates && lifecycle && !/useGSAP|gsap\.context|\.revert\(|\.kill\(|gsap\.matchMedia/.test(text)) {
      add('motion/gsap-cleanup', 'warn', text.search(/gsap\.|ScrollTrigger/), 'GSAP animations created in a component lifecycle without cleanup.', 'Wrap them in useGSAP() or gsap.context() and revert on unmount.');
    }
  }

  for (const m of text.matchAll(/outline\s*:\s*(none|0)\b|\b(?:focus:)?outline-none\b/g)) {
    if (!project.focusVisible) add('a11y/focus-hidden', 'warn', m.index, 'Focus outline removed and the project defines no :focus-visible style.', 'Add a high-contrast :focus-visible ring (2px or more, 3:1 or more against its surroundings).');
  }
}

export async function audit(root, { maxFiles = 5000 } = {}) {
  if (!Number.isSafeInteger(maxFiles) || maxFiles < 1) throw new Error('--max-files needs a positive safe integer');
  const base = resolve(root);
  if (!(await stat(base)).isDirectory()) throw new Error(`Not a directory: ${root}`);
  const { paths, truncated, skippedOversized } = await collect(base, maxFiles);
  const files = [];
  for (const path of paths) {
    const text = (await readFile(path, 'utf8')).replace(/^\uFEFF/, '');
    files.push({ path, rel: relative(base, path).split('\\').join('/'), ext: extname(path).toLowerCase(), text });
  }
  const scripts = files.filter(file => SCRIPT.has(file.ext)).map(file => file.text).join('\n');
  const all = files.map(file => file.text).join('\n');
  const project = {
    focusVisible: /focus-visible/.test(all),
    jsMotion: /\bgsap\b|ScrollTrigger|new Lenis\b|from\s+['"]lenis|['"]motion\/react['"]|['"]framer-motion['"]|from\s+['"]motion['"]|requestAnimationFrame|\banime\(|from\s+['"]animejs/.test(scripts),
    jsReduced: /prefers-reduced-motion|useReducedMotion|reducedMotion|prefersReducedMotion/.test(scripts),
    cssMotion: /@keyframes|animation-timeline|view-transition|startViewTransition/.test(all),
    cssReduced: /prefers-reduced-motion/.test(all),
    lenis: /new Lenis\b|from\s+['"]lenis|ReactLenis/.test(scripts),
    lenisCss: /lenis(\/dist)?\/lenis\.css|lenis\.css|\.lenis-smooth|\.lenis\.lenis-stopped/.test(all),
  };
  const findings = [];
  let suppressedFindings = 0;
  for (const file of files) {
    const line = lineLookup(file.text);
    const counts = new Map();
    fileRules(file, (rule, severity, index, message, fix) => {
      const count = (counts.get(rule) ?? 0) + 1;
      counts.set(rule, count);
      if (count <= PER_RULE_FILE_LIMIT) findings.push({ rule, severity, file: file.rel, line: line(index), message, fix });
      else suppressedFindings++;
    }, project);
  }
  if (project.jsMotion && !project.jsReduced) findings.push({ rule: 'motion/reduced-motion-js', severity: 'warn', file: null, line: null, message: 'Motion-related JavaScript was found, but no reduced-motion handler was detected in scanned scripts. This does not prove that the code creates visible movement.', fix: 'Inspect actual motion and shared configuration; where needed branch with matchMedia("(prefers-reduced-motion: reduce)") or useReducedMotion to preserve meaning without unnecessary travel.' });
  if (project.cssMotion && !project.cssReduced) findings.push({ rule: 'motion/reduced-motion-css', severity: 'warn', file: null, line: null, message: 'Animation-related syntax was found without a detected prefers-reduced-motion rule in scanned files.', fix: 'Inspect actual movement and imported styles; where needed add reduced-motion overrides that keep content visible and remove travel.' });
  if (project.lenis && !project.lenisCss) findings.push({ rule: 'motion/lenis-css', severity: 'warn', file: null, line: null, message: 'Lenis is used without its stylesheet.', fix: 'Import lenis/dist/lenis.css (or copy its rules) so stopped state, nested scrollers and scroll-behavior are handled.' });
  const order = { error: 0, warn: 1, info: 2 };
  findings.sort((a, b) => order[a.severity] - order[b.severity] || String(a.file).localeCompare(String(b.file)) || (a.line ?? 0) - (b.line ?? 0));
  const summary = { files: files.length, errors: 0, warnings: 0, notes: 0 };
  for (const finding of findings) summary[finding.severity === 'error' ? 'errors' : finding.severity === 'warn' ? 'warnings' : 'notes']++;
  return { root: base, summary, findings, truncated, skippedOversized, suppressedFindings,
    limitations: 'Static heuristics only; unsupported, hidden, generated, dependency, minified, linked and oversized files are excluded. Findings require contextual review and cannot certify design quality or WCAG conformance.' };
}

function human(result) {
  const lines = [];
  const labels = { error: 'ERROR', warn: 'WARN ', info: 'NOTE ' };
  for (const finding of result.findings) {
    const where = finding.file ? `${finding.file}:${finding.line}` : 'project';
    lines.push(`${labels[finding.severity]} ${finding.rule}  ${where}\n       ${finding.message}\n       Fix: ${finding.fix}`);
  }
  const { files, errors, warnings, notes } = result.summary;
  lines.push(`\nAudited ${files} files: ${errors} errors, ${warnings} warnings, ${notes} notes.${result.truncated ? ' File limit reached; pass --max-files to scan more.' : ''}`);
  if (result.skippedOversized.length) lines.push(`Skipped ${result.skippedOversized.length} source files larger than ${MAX_BYTES} bytes; see --json for paths.`);
  if (result.suppressedFindings) lines.push(`${result.suppressedFindings} additional repeated findings omitted from the report.`);
  lines.push(result.limitations);
  lines.push('Confirm rendered behavior and task access in a browser. Common fonts and visual styles are advisory notes, not failures.');
  return lines.join('\n') + '\n';
}

const HELP = `Usage: node scripts/audit.mjs [project-dir] [--json] [--strict] [--max-files N]

Static audit of HTML, CSS and component source for motion, accessibility,
performance, SEO and generic-design risks. Reads files only; no network.
Exit 1 when errors exist (or warnings with --strict); exit 2 on invalid input
or an incomplete scan. Common-style notes never fail the audit.
`;

export function parseArgs(args) {
  let root = '.';
  let rootSeen = false;
  let json = false;
  let strict = false;
  let maxFiles = 5000;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--help' || args[i] === '-h') return { help: true };
    if (args[i] === '--json') json = true;
    else if (args[i] === '--strict') strict = true;
    else if (args[i] === '--max-files') {
      const value = args[++i];
      if (!value || !/^\d+$/.test(value)) throw new Error('--max-files needs a positive integer');
      maxFiles = Number(value);
      if (!Number.isSafeInteger(maxFiles) || maxFiles < 1) throw new Error('--max-files needs a positive safe integer');
    } else if (args[i].startsWith('-')) throw new Error(`Unknown option: ${args[i]}`);
    else {
      if (rootSeen || !args[i]) throw new Error('Supply exactly one project directory');
      root = args[i]; rootSeen = true;
    }
  }
  return { root, json, strict, maxFiles, help: false };
}

async function main(args) {
  const { root, json, strict, maxFiles, help } = parseArgs(args);
  if (help) return process.stdout.write(HELP);
  const result = await audit(root, { maxFiles });
  process.stdout.write(json ? JSON.stringify(result, null, 2) + '\n' : human(result));
  if (result.truncated || result.skippedOversized.length) process.exitCode = 2;
  else if (result.summary.errors || (strict && result.summary.warnings)) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).catch(error => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 2;
  });
}
