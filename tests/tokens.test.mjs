import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseColor, toHex, srgbToOklch, oklchToSrgb, srgbToLinear, linearToSrgb,
  relativeLuminance, contrastRatio, wcagLevels, checkPalette, paletteBlocks,
  fluidClamp, typeScale, spaceScale, parseSteps, springPosition, springCurve, tokensCss,
} from '../scripts/tokens.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const script = fileURLToPath(new URL('../scripts/tokens.mjs', import.meta.url));
const palettePath = join(root, 'skills/color-system/references/palette-library.md');
const run = (...args) => spawnSync(process.execPath, [script, ...args], { cwd: root, encoding: 'utf8' });
const close = (actual, expected, epsilon = 1e-8) => assert.ok(Math.abs(actual - expected) <= epsilon, `${actual} differs from ${expected}`);
const palette = () => ({ name: 'Test', colors: { ink: '#000', ground: '#fff' }, pairs: [['ink', 'ground', 7]] });

test('opaque hex and both RGB syntaxes produce known channel values', () => {
  assert.deepEqual(parseColor('#f80').rgb, [1, 136 / 255, 0]);
  assert.deepEqual(parseColor(' #FF8800 ').rgb, parseColor('#f80').rgb);
  assert.deepEqual(parseColor('rgb(255, 128, 0)').rgb, [1, 128 / 255, 0]);
  assert.deepEqual(parseColor('rgb(100% 50% 0%)').rgb, [1, 0.5, 0]);
  assert.deepEqual(parseColor('rgb(100%, 50%, 0%)').rgb, [1, 0.5, 0]);
  assert.equal(toHex(parseColor('rgb(255 128 0)').rgb), '#ff8000');
});

test('alpha, unsupported units and malformed color syntax fail closed', () => {
  for (const value of ['#0000', '#12345678', 'rgb(0 0 0 / 1)', 'rgba(0,0,0,1)', 'red', 'transparent', 'hsl(0 0% 0%)', 'rgb(1..2 0 0)', 'rgb(. 0 0)', 'rgb(256 0 0)', 'rgb(-1 0 0)', 'rgb(0, 0 0)', 'rgb(0, 0, 0, 1)', 'rgb(1%, 0, 0)', 'oklch(50% .2 none)', 'oklch(.5 .2 1rad)', 'oklch(.5 20% 60)', 'oklch(NaN .2 60)', 'oklch(1.1 .2 60)', 'oklch(.5 -.2 60)', 'oklch(.5 .2 60 / .5)', null, 0]) {
    assert.throws(() => parseColor(value), undefined, String(value));
  }
});

test('sRGB transfer, luminance and WCAG contrast match known values', () => {
  close(srgbToLinear(0.04045), 0.04045 / 12.92);
  close(linearToSrgb(srgbToLinear(0.5)), 0.5);
  close(relativeLuminance([1, 0, 0]), 0.2126);
  assert.equal(contrastRatio('#000', '#fff'), 21);
  assert.equal(contrastRatio('#123456', '#123456'), 1);
  close(contrastRatio('#777', '#fff'), 4.478089453577214);
  close(contrastRatio('#f00', '#fff'), 3.9984767707539985);
  assert.equal(contrastRatio('#fff', '#777'), contrastRatio('#777', '#fff'));
});

test('contrast thresholds use full precision, not rounded display values', () => {
  assert.equal(wcagLevels(4.499999999).normalAA, false);
  assert.equal(wcagLevels(4.5).normalAA, true);
  assert.equal(wcagLevels(6.999999999).normalAAA, false);
  assert.equal(wcagLevels(7).normalAAA, true);
  assert.equal(wcagLevels(2.999999999).nonTextAA, false);
  assert.equal(wcagLevels(3).nonTextAA, true);
  assert.throws(() => wcagLevels(NaN));
});

test('OKLCH red matches the published OKLab coordinates and round-trips', () => {
  const [L, C, H] = srgbToOklch([1, 0, 0]);
  close(L, 0.6279553606, 1e-7);
  close(C, 0.2576833077, 1e-7);
  close(H, 29.23388519, 1e-6);
  assert.equal(toHex(oklchToSrgb(L, C, H).rgb), '#ff0000');
  for (const hex of ['#000000', '#ffffff', '#8f4f1a', '#2231d6', '#c8ff3d']) {
    const rgb = parseColor(hex).rgb;
    assert.equal(toHex(oklchToSrgb(...srgbToOklch(rgb)).rgb), hex);
  }
});

test('out-of-gamut OKLCH explicitly reduces chroma at constant lightness and hue', () => {
  const parsed = parseColor('oklch(60% .4 30deg)');
  assert.equal(parsed.gamutMapped, true);
  assert.ok(parsed.chroma > 0 && parsed.chroma < 0.4);
  assert.ok(parsed.rgb.every(c => Number.isFinite(c) && c >= 0 && c <= 1));
  const [L, C, H] = srgbToOklch(parsed.rgb);
  close(L, 0.6, 1e-6); close(C, parsed.chroma, 1e-6); close(H, 30, 1e-4);
  assert.deepEqual(parseColor('oklch(0 .4 30)').rgb, [0, 0, 0]);
  assert.deepEqual(parseColor('oklch(1 .4 30)').rgb, [1, 1, 1]);
  assert.deepEqual(parseColor('oklch(.6 .1 -330)').rgb, parseColor('oklch(.6 .1 30)').rgb);
});

test('palette checks do not quantize floating RGB channels to hex before measuring', () => {
  const spec = { colors: { ink: 'rgb(118.7 118.7 118.7)', ground: '#fff' }, pairs: [['ink', 'ground', 4.49]] };
  const result = checkPalette(spec);
  assert.ok(contrastRatio(result.colors.ink.hex, '#fff') < 4.49);
  assert.equal(result.pass, true);
  close(result.pairs[0].ratio, contrastRatio(spec.colors.ink, '#fff'));
});

test('palette checks reject missing declarations, malformed tuples and invalid thresholds', () => {
  const invalid = [null, [], {}, { colors: {}, pairs: [] }, { colors: { ink: '#000' } }, { colors: { ink: '#000' }, pairs: [] }];
  for (const pairs of [[['ink', 'missing', 4.5]], [['ink', 'ground']], [['ink', 'ground', '4.5']], [['ink', 'ground', 0]], [['ink', 'ground', 22]], [['ink', 'ground', NaN]], [['ink', 'ground', 4.5, true]], ['ink'], [['constructor', 'ground', 1]]]) invalid.push({ ...palette(), pairs });
  invalid.push({ ...palette(), colors: { 'ink;bad': '#000', ground: '#fff' } });
  for (const spec of invalid) assert.throws(() => checkPalette(spec));
  assert.equal(checkPalette(palette()).pass, true);
  assert.equal(checkPalette({ ...palette(), colors: { ink: '#777', ground: '#fff' } }).pass, false);
});

test('palette fences support CRLF and reject malformed or unclosed JSON', () => {
  const source = `before\r\n\`\`\`json palette\r\n${JSON.stringify(palette())}\r\n\`\`\`\r\nafter`;
  assert.equal(paletteBlocks(source).length, 1);
  assert.equal(paletteBlocks('```json\n{}\n```').length, 0);
  assert.equal(paletteBlocks(`~~~json palette\n${JSON.stringify(palette())}\n~~~`).length, 1);
  assert.throws(() => paletteBlocks('```json palette\n{}'), /Unclosed/);
  assert.throws(() => paletteBlocks('```json palette\n{bad}\n```'), /Invalid palette JSON/);
});

test('all shipped palettes have six checked pairs and pass their declared thresholds', async () => {
  const specs = paletteBlocks(await readFile(palettePath, 'utf8'));
  assert.equal(specs.length, 16);
  for (const spec of specs) {
    const result = checkPalette(spec);
    assert.equal(result.pairs.length, 6, spec.name);
    assert.equal(result.pass, true, `${spec.name}: ${JSON.stringify(result.pairs.filter(pair => !pair.pass))}`);
  }
});

function evaluateClamp(value, viewport, rootPx = 16) {
  if (!value.startsWith('clamp(')) return parseFloat(value) * rootPx;
  const match = value.match(/^clamp\(([-\d.]+)rem, ([-\d.]+)rem ([+-]) ([\d.]+)vw, ([-\d.]+)rem\)$/);
  assert.ok(match, value);
  const preferred = Number(match[2]) * rootPx + (match[3] === '-' ? -1 : 1) * Number(match[4]) * viewport / 100;
  return Math.max(Number(match[1]) * rootPx, Math.min(Number(match[5]) * rootPx, preferred));
}

test('fluid sizes hit both viewport endpoints, interpolate, and clamp outside them', () => {
  for (const [minPx, maxPx] of [[17, 19], [24, 16], [16, 16]]) {
    const value = fluidClamp(minPx, maxPx, 360, 1440);
    close(evaluateClamp(value, 360), minPx, 0.002);
    close(evaluateClamp(value, 1440), maxPx, 0.002);
    close(evaluateClamp(value, 900), (minPx + maxPx) / 2, 0.002);
    close(evaluateClamp(value, 100), minPx, 0.002);
    close(evaluateClamp(value, 2000), maxPx, 0.002);
  }
});

test('type and spacing scales produce the documented tokens and usable custom viewports', () => {
  const rows = typeScale({ minSize: 17, maxSize: 19, minRatio: 1.2, maxRatio: 1.333, steps: parseSteps('-1..6') });
  assert.equal(rows.length, 8);
  assert.equal(rows[0].name, '--step--1');
  assert.equal(rows[1].value, 'clamp(1.0625rem, 1.0208rem + 0.1852vw, 1.1875rem)');
  for (let i = 0; i < rows.length; i++) {
    close(evaluateClamp(rows[i].value, 360), 17 * 1.2 ** (i - 1), 0.002);
    close(evaluateClamp(rows[i].value, 1440), 19 * 1.333 ** (i - 1), 0.002);
  }
  const spacing = spaceScale({ minVw: 400, maxVw: 1200 });
  assert.equal(spacing.length, 10);
  assert.equal(spacing[0].name, '--space-3xs');
  assert.equal(spacing.at(-1).name, '--space-4xl');
  assert.equal(spacing.find(row => row.name === '--space-m').minPx, 24);
  close(evaluateClamp(spacing.at(-1).value, 400), 128);
  close(evaluateClamp(spacing.at(-1).value, 1200), 160);
});

test('scale validation rejects invalid values, duplicated steps and unbounded ranges', () => {
  for (const options of [{ minSize: 0 }, { maxSize: NaN }, { minRatio: -2 }, { maxRatio: Infinity }, { steps: [] }, { steps: [0, 0] }, { steps: [0.5] }, { steps: [51] }, { minVw: 1000, maxVw: 400 }, { prefix: 'x;bad' }, { minSzie: 16 }]) assert.throws(() => typeScale(options));
  for (const options of [null, [], { minSize: -1 }, { maxVw: 0 }, { multipliers: {} }]) assert.throws(() => spaceScale(options));
  for (const input of ['', '1,', '1.5', 'NaN', '-1000000000..1000000000', '0,0', '0,,1']) assert.throws(() => parseSteps(input));
  assert.deepEqual(parseSteps('2..-1'), [2, 1, 0, -1]);
  assert.deepEqual(parseSteps('0..0'), [0]);
  assert.throws(() => fluidClamp(16, 20, 360, 1440, 0));
});

test('analytic springs start at zero with the requested initial velocity', () => {
  for (const damping of [10, 20, 30]) {
    for (const velocity of [0, 3, -2]) {
      const options = { stiffness: 100, damping, velocity };
      close(springPosition(options, 0), 0);
      close((springPosition(options, 1e-7) - springPosition(options, 0)) / 1e-7, velocity, 0.00002);
    }
  }
  close(springPosition({ stiffness: 100, damping: 20 }, 0.2), 1 - 3 * Math.exp(-2));
});

test('under, critical and over damped curves stay settled after their duration', () => {
  for (const damping of [10, 20, 30]) {
    for (const velocity of [0, 3, -2]) {
      const options = { stiffness: 100, damping, velocity, points: 48 };
      const curve = springCurve(options);
      const values = curve.linear.slice(7, -1).split(', ').map(Number);
      assert.equal(values.length, 48);
      assert.equal(values[0], 0);
      assert.equal(values.at(-1), 1);
      assert.ok(values.every(Number.isFinite));
      for (let t = curve.duration / 1000; t < curve.duration / 1000 + 2; t += 0.002) {
        assert.ok(Math.abs(springPosition(options, t) - 1) <= 0.001000001, `damping ${damping}, velocity ${velocity}, t ${t}`);
      }
      if (velocity === 0) assert.equal(curve.overshoot > 0, damping < 20);
    }
  }
  const snappy = springCurve({ stiffness: 320, damping: 28, points: 24 });
  assert.ok(snappy.duration >= 465 && snappy.duration <= 470);
  assert.ok(snappy.overshoot > 0.018 && snappy.overshoot < 0.021);
  const slow = springCurve({ stiffness: 0.04, damping: 0.4 });
  assert.ok(slow.duration > 46000 && slow.duration < 47000);
  assert.ok(Math.abs(springPosition({ stiffness: 0.04, damping: 0.4 }, slow.duration / 1000) - 1) <= 0.001);
});

test('springs reject invalid inputs and never silently truncate unsettled motion', () => {
  for (const options of [{ stiffness: 0 }, { damping: 0 }, { mass: -1 }, { points: 7 }, { points: 401 }, { points: 10.5 }, { velocity: NaN }, { epsilon: 0 }, { epsilon: -1 }, { epsilon: 1 }, { stiffness: Infinity }, { damping: 0.0001 }, { stiffness: 0.0001, damping: 10 }, { dampng: 20 }]) assert.throws(() => springCurve(options));
  assert.throws(() => springPosition({}, -1));
});

test('CSS creates semantic colors, fonts, scales, default motion and named springs', () => {
  const css = tokensCss({ ...palette(), fonts: { display: '"Fraunces Variable", "Fraunces Fallback", serif', text: 'system-ui, sans-serif' }, type: { steps: [-1, 0, 1] }, space: {}, springs: { snappy: { stiffness: 320, damping: 28, points: 24 } } });
  for (const expected of ['--color-ink: #000;', '--font-display: "Fraunces Variable", "Fraunces Fallback", serif;', '--step--1:', '--space-4xl:', '--dur-base: 240ms;', '--ease-spring-snappy: linear(', '--dur-spring-snappy: 466ms;']) assert.ok(css.includes(expected), expected);
  assert.ok(css.startsWith(':root {\n'));
  assert.ok(css.endsWith('\n}\n'));
  assert.doesNotMatch(tokensCss({ ...palette(), motion: false }), /--dur-|--ease-/);
  assert.match(tokensCss({ type: { steps: [0] }, motion: false }), /--step-0/);
});

test('CSS rejects failing palettes, unsafe names and values, and invalid optional sections', () => {
  const invalid = [null, {}, { ...palette(), colors: { ink: '#777', ground: '#fff' } }, { ...palette(), fonts: { text: 'serif; color: red' } }, { ...palette(), fonts: { 'text}': 'serif' } }, { ...palette(), fonts: { 'text\n': 'serif' } }, { ...palette(), fonts: { text: '"unclosed, serif' } }, { ...palette(), fonts: [] }, { ...palette(), springs: { 'bad;name': {} } }, { ...palette(), type: null }, { ...palette(), space: false }, { ...palette(), springs: false }, { ...palette(), motion: 'false' }, { ...palette(), colour: '#fff' }];
  for (const spec of invalid) assert.throws(() => tokensCss(spec));
});

test('CSS emits the same mapped sRGB channels that were checked', () => {
  const spec = { colors: { ground: '#fff', ink: 'oklch(.4 .4 30)' }, pairs: [['ink', 'ground', 4.5]], motion: false };
  const css = tokensCss(spec);
  assert.match(css, /chroma reduced to sRGB/);
  const emitted = css.match(/--color-ink: (rgb\([^;]+\));/)[1];
  close(contrastRatio(emitted, '#fff'), checkPalette(spec).pairs[0].ratio, 1e-10);
});

test('documented CLI commands run successfully and use consistent spring names', () => {
  const commands = [
    ['contrast', '#000', '#fff'],
    ['convert', '#8F4F1A', 'oklch(0.72 0.12 60)'],
    ['type', '--min-size', '17', '--max-size', '19', '--min-ratio', '1.2', '--max-ratio', '1.333', '--steps', '-1..6'],
    ['space', '--min-vw', '400', '--max-vw', '1200'],
    ['spring', '--stiffness', '320', '--damping', '28', '--name', 'snappy'],
    ['palettes', palettePath],
    ['--help'],
  ];
  for (const args of commands) {
    const result = run(...args);
    assert.equal(result.status, 0, `${args.join(' ')}: ${result.stderr}`);
    assert.ok(result.stdout.length);
    assert.equal(result.stderr, '');
  }
  assert.match(run('spring', '--name', 'snappy').stdout, /--ease-spring-snappy:/);
  assert.match(run('contrast', 'oklch(.5 .4 30)', '#fff').stdout, /chroma reduced to sRGB/);
});

test('CLI rejects unknown, missing, repeated and malformed options without stdout', () => {
  for (const args of [['missing'], ['contrast', '#fff'], ['contrast', '#0000', '#fff'], ['convert'], ['convert', '#fff', 'red'], ['type', '--min-szie', '17'], ['type', '--min-size'], ['type', '--min-size', ''], ['type', '--min-size', '0x10'], ['type', '--min-size', '16', '--min-size', '17'], ['type', '--steps', '1..1000000000'], ['space', '--min-ratio', '1.2'], ['spring', '--name', 'x;bad'], ['check'], ['css', 'missing-file.json']]) {
    const result = run(...args);
    assert.notEqual(result.status, 0, args.join(' '));
    assert.equal(result.stdout, '', args.join(' '));
    assert.ok(result.stderr.length, args.join(' '));
  }
  assert.equal(run('contrast', '#777', '#fff').status, 1);
});

test('file CLI commands fail closed on invalid/failing specs and empty palette libraries', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'ui-tokens-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const path = join(directory, 'spec.json');
  await writeFile(path, JSON.stringify(palette()));
  assert.equal(run('check', path).status, 0);
  assert.equal(run('css', path).status, 0);
  for (const spec of [{ ...palette(), colors: { ink: '#777', ground: '#fff' } }, { ...palette(), type: { minSize: -1 } }, { ...palette(), pairs: [] }, { ...palette(), springs: { stuck: { damping: 0.0001 } } }, {}]) {
    await writeFile(path, JSON.stringify(spec));
    const result = run('css', path);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.ok(result.stderr.length);
  }
  await writeFile(path, JSON.stringify({ ...palette(), colors: { ink: '#777', ground: '#fff' } }));
  const check = run('check', path);
  assert.equal(check.status, 1);
  assert.match(check.stdout, /FAIL/);
  await writeFile(path, '{not json}');
  assert.equal(run('check', path).status, 1);
  const markdown = join(directory, 'palettes.md');
  await writeFile(markdown, '# No palette blocks');
  assert.equal(run('palettes', markdown).status, 1);
  await writeFile(markdown, `\`\`\`json palette\n${JSON.stringify({ ...palette(), colors: { ink: '#777', ground: '#fff' } })}\n\`\`\``);
  assert.equal(run('palettes', markdown).status, 1);
});
