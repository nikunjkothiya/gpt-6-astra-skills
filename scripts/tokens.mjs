#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const round = (value, digits = 4) => Number(value.toFixed(digits));
const format = value => String(round(value, 4));
const NUMBER = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
const NAME = /^[a-z][a-z0-9-]*$(?![\s\S])/;

function object(value, label) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value;
}

function number(value, label, min = -Infinity, max = Infinity) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) throw new Error(`${label} must be a finite number from ${min} to ${max}`);
  return value;
}

function positive(value, label) {
  number(value, label);
  if (value <= 0) throw new Error(`${label} must be positive`);
  return value;
}

function tokenName(value, label = 'Token name') {
  if (typeof value !== 'string' || !NAME.test(value)) throw new Error(`${label} must start with a lowercase letter and contain only lowercase letters, digits or hyphens`);
  return value;
}

function knownKeys(value, keys, label) {
  object(value, label);
  for (const key of Object.keys(value)) if (!keys.includes(key)) throw new Error(`Unknown ${label} option: ${key}`);
}

function rgbChannels(rgb) {
  if (!Array.isArray(rgb) || rgb.length !== 3) throw new Error('RGB must contain three channels');
  rgb.forEach(c => number(c, 'RGB channel', 0, 1));
  return rgb;
}

export const MOTION_TOKENS = Object.freeze({
  'dur-instant': '80ms',
  'dur-fast': '160ms',
  'dur-base': '240ms',
  'dur-slow': '480ms',
  'dur-slower': '800ms',
  'dur-cinematic': '1200ms',
  'ease-standard': 'cubic-bezier(0.2, 0, 0, 1)',
  'ease-out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
  'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
  'ease-in-quart': 'cubic-bezier(0.5, 0, 0.75, 0)',
  'ease-in-out-quart': 'cubic-bezier(0.76, 0, 0.24, 1)',
  'ease-in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
  'ease-emphasized': 'cubic-bezier(0.05, 0.7, 0.1, 1)',
});

export const SPACE_MULTIPLIERS = Object.freeze({ '3xs': 0.25, '2xs': 0.5, xs: 0.75, s: 1, m: 1.5, l: 2, xl: 3, '2xl': 4, '3xl': 6, '4xl': 8 });

export function srgbToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function linearToSrgb(c) {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
}

export function linearRgbToOklab([r, g, b]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

export function oklabToLinearRgb([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = rgb => rgb.every(c => c >= -1e-7 && c <= 1 + 1e-7);

export function oklchToSrgb(L, C, H) {
  const lightness = number(L, 'OKLCH lightness', 0, 1);
  number(C, 'OKLCH chroma', 0, 4);
  number(H, 'OKLCH hue');
  if (L === 0 || L === 1) return { rgb: [L, L, L], gamutMapped: C > 0, chroma: 0 };
  const hue = (((H % 360) + 360) % 360 * Math.PI) / 180;
  const linear = chroma => oklabToLinearRgb([lightness, chroma * Math.cos(hue), chroma * Math.sin(hue)]);
  let chroma = C;
  let rgb = linear(chroma);
  let gamutMapped = false;
  if (!inGamut(rgb)) {
    gamutMapped = true;
    let low = 0;
    let high = chroma;
    for (let i = 0; i < 32; i++) {
      const mid = (low + high) / 2;
      if (inGamut(linear(mid))) low = mid; else high = mid;
    }
    chroma = low;
    rgb = linear(chroma);
  }
  return { rgb: rgb.map(c => Math.min(1, Math.max(0, linearToSrgb(Math.min(1, Math.max(0, c)))))), gamutMapped, chroma };
}

export function srgbToOklch(rgb) {
  rgbChannels(rgb);
  const [L, a, b] = linearRgbToOklab(rgb.map(srgbToLinear));
  const C = Math.hypot(a, b);
  const H = C < 1e-6 ? 0 : ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
  return [L, C, H];
}

export function parseColor(input) {
  if (typeof input !== 'string') throw new Error('Color must be a string');
  const text = input.trim().toLowerCase();
  if (text.includes('/')) throw new Error(`Use an opaque color; composite alpha over its actual backdrop first: ${input}`);
  let match = text.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (match) {
    const hex = match[1].length === 3 ? [...match[1]].map(x => x + x).join('') : match[1];
    return { rgb: [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255), gamutMapped: false };
  }
  match = text.match(/^rgb\((.*)\)$/);
  if (match) {
    const channels = match[1].includes(',') ? match[1].split(',').map(x => x.trim()) : match[1].trim().split(/\s+/);
    if (channels.length !== 3) throw new Error('rgb() needs exactly three opaque channels');
    // Legacy comma syntax requires all numbers or all percentages.
    if (match[1].includes(',') && new Set(channels.map(x => x.endsWith('%'))).size !== 1) throw new Error('Comma rgb() cannot mix numbers and percentages');
    const rgb = channels.map(channel => {
      const percent = channel.endsWith('%');
      const numeric = percent ? channel.slice(0, -1) : channel;
      if (!NUMBER.test(numeric)) throw new Error(`Invalid RGB channel: ${channel}`);
      return number(Number(numeric), 'RGB channel', 0, percent ? 100 : 255) / (percent ? 100 : 255);
    });
    return { rgb, gamutMapped: false };
  }
  match = text.match(/^oklch\((.*)\)$/);
  if (match) {
    const channels = match[1].trim().split(/\s+/);
    if (channels.length !== 3) throw new Error('oklch() needs exactly three opaque channels');
    const [lightness, chroma, hue] = channels;
    const lightNumber = lightness.endsWith('%') ? lightness.slice(0, -1) : lightness;
    const hueNumber = hue.endsWith('deg') ? hue.slice(0, -3) : hue;
    if (!NUMBER.test(lightNumber) || !NUMBER.test(chroma) || !NUMBER.test(hueNumber)) throw new Error('Use numeric OKLCH lightness (or %), chroma and hue (or deg); missing channels and other units are unsupported');
    return oklchToSrgb(Number(lightNumber) / (lightness.endsWith('%') ? 100 : 1), Number(chroma), Number(hueNumber));
  }
  throw new Error(`Unsupported color (use #hex, rgb() or oklch()): ${input}`);
}

export function toHex(rgb) {
  rgbChannels(rgb);
  return '#' + rgb.map(c => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, '0')).join('');
}

export function relativeLuminance(rgb) {
  rgbChannels(rgb);
  const [r, g, b] = rgb.map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground, background) {
  const [high, low] = [foreground, background].map(color => relativeLuminance(parseColor(color).rgb)).sort((a, b) => b - a);
  return (high + 0.05) / (low + 0.05);
}

export function wcagLevels(ratio) {
  number(ratio, 'Contrast ratio', 1, 21);
  return {
    normalAA: ratio >= 4.5,
    normalAAA: ratio >= 7,
    largeAA: ratio >= 3,
    largeAAA: ratio >= 4.5,
    nonTextAA: ratio >= 3,
  };
}

export function fluidClamp(minPx, maxPx, minVw = 360, maxVw = 1440, rootPx = 16) {
  for (const [label, value] of Object.entries({ minPx, maxPx, minVw, maxVw, rootPx })) positive(value, label);
  if (!(maxVw > minVw)) throw new Error('max viewport must exceed min viewport');
  const slope = (maxPx - minPx) / (maxVw - minVw);
  const intercept = minPx - slope * minVw;
  if (Math.abs(slope) < 1e-9) return `${format(minPx / rootPx)}rem`;
  const low = Math.min(minPx, maxPx) / rootPx;
  const high = Math.max(minPx, maxPx) / rootPx;
  return `clamp(${format(low)}rem, ${format(intercept / rootPx)}rem ${slope < 0 ? '-' : '+'} ${format(Math.abs(slope) * 100)}vw, ${format(high)}rem)`;
}

export function typeScale(options = {}) {
  knownKeys(options, ['minSize', 'maxSize', 'minVw', 'maxVw', 'minRatio', 'maxRatio', 'steps', 'prefix'], 'type');
  const { minSize = 16, maxSize = 20, minVw = 360, maxVw = 1440, minRatio = 1.2, maxRatio = 1.25, steps = [-2, -1, 0, 1, 2, 3, 4, 5, 6], prefix = 'step' } = options;
  positive(minSize, 'minSize'); positive(maxSize, 'maxSize');
  number(minRatio, 'minRatio', 1); number(maxRatio, 'maxRatio', 1);
  tokenName(prefix, 'Type prefix');
  if (!Array.isArray(steps) || !steps.length || steps.length > 101 || new Set(steps).size !== steps.length || steps.some(step => !Number.isInteger(step) || Math.abs(step) > 50)) throw new Error('steps must be distinct integers from -50 to 50');
  return steps.map(step => {
    const minPx = minSize * minRatio ** step;
    const maxPx = maxSize * maxRatio ** step;
    return { name: `--${prefix}-${step}`, minPx: round(minPx, 2), maxPx: round(maxPx, 2), value: fluidClamp(minPx, maxPx, minVw, maxVw) };
  });
}

export function spaceScale(options = {}) {
  knownKeys(options, ['minSize', 'maxSize', 'minVw', 'maxVw', 'prefix'], 'space');
  const { minSize = 16, maxSize = 20, minVw = 360, maxVw = 1440, prefix = 'space' } = options;
  positive(minSize, 'minSize'); positive(maxSize, 'maxSize');
  tokenName(prefix, 'Space prefix');
  const multipliers = SPACE_MULTIPLIERS;
  return Object.entries(multipliers).map(([key, factor]) => ({
    name: `--${prefix}-${key}`,
    minPx: round(minSize * factor, 2),
    maxPx: round(maxSize * factor, 2),
    value: fluidClamp(minSize * factor, maxSize * factor, minVw, maxVw),
  }));
}

function springOptions(options) {
  knownKeys(options, ['stiffness', 'damping', 'mass', 'velocity', 'epsilon', 'points'], 'spring');
  const { stiffness = 170, damping = 26, mass = 1, velocity = 0, epsilon = 0.001, points = 48 } = options;
  for (const [key, value] of Object.entries({ stiffness, damping, mass })) positive(value, key);
  number(velocity, 'velocity');
  positive(epsilon, 'epsilon'); number(epsilon, 'epsilon', 0, 0.1);
  if (!Number.isInteger(points) || points < 8 || points > 400) throw new Error('points must be an integer from 8 to 400');
  if (!Number.isFinite(stiffness / mass) || !Number.isFinite(damping / mass) || !Number.isFinite(stiffness * mass) || stiffness / mass === 0 || stiffness * mass === 0) throw new Error('Spring parameters exceed numeric limits');
  return { stiffness, damping, mass, velocity, epsilon, points };
}

function positionAt({ stiffness, damping, mass, velocity }, t) {
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  const y0 = -1;
  if (Math.abs(zeta - 1) < 1e-6) return 1 + Math.exp(-w0 * t) * (y0 + (velocity + w0 * y0) * t);
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    return 1 + Math.exp(-zeta * w0 * t) * (y0 * Math.cos(wd * t) + ((velocity + zeta * w0 * y0) / wd) * Math.sin(wd * t));
  }
  const root = Math.sqrt(zeta * zeta - 1);
  const r1 = -w0 / (zeta + root);
  const r2 = -w0 * (zeta + root);
  const A = (velocity - r2 * y0) / (r1 - r2);
  return 1 + A * Math.exp(r1 * t) + (y0 - A) * Math.exp(r2 * t);
}

export function springPosition(options, t) {
  number(t, 'Spring time', 0);
  return positionAt(springOptions(options), t);
}

export function springCurve(input = {}) {
  const options = springOptions(input);
  const { stiffness, damping, mass, velocity, epsilon, points } = options;
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  const extrema = [0];
  let bound;
  // The envelope bounds all later error. Find the last threshold crossing
  // between analytic extrema, avoiding time-step aliasing or a false rest at
  // the first crossing of 1. Springs needing more than 60s fail explicitly.
  if (Math.abs(zeta - 1) < 1e-6) {
    const B = velocity - w0;
    const extremum = velocity / (w0 * B);
    if (Number.isFinite(extremum) && extremum > 0) extrema.push(extremum);
    bound = Math.max(1 / w0, ...extrema);
    while (Math.exp(-w0 * bound) * (1 + Math.abs(B) * bound) > epsilon && bound <= 600) bound *= 2;
  } else if (zeta < 1) {
    const a = zeta * w0;
    const w = w0 * Math.sqrt(1 - zeta * zeta);
    const B = (velocity - a) / w;
    bound = Math.log(Math.hypot(1, B) / epsilon) / a;
    if (bound <= 600) {
      const phase = Math.atan2(-velocity, w - a * B);
      const first = Math.ceil(-phase / Math.PI);
      const count = Math.floor((w * bound - phase) / Math.PI) - first + 1;
      if (count > 100000) throw new Error('Spring has too many oscillations to sample reliably');
      for (let n = first; n < first + count; n++) {
        const t = (phase + n * Math.PI) / w;
        if (t > 0) extrema.push(t);
      }
    }
  } else {
    const root = Math.sqrt(zeta * zeta - 1);
    const r1 = -w0 / (zeta + root);
    const r2 = -w0 * (zeta + root);
    const A = (velocity + r2) / (r1 - r2);
    const B = -1 - A;
    const ratio = (-B * r2) / (A * r1);
    const extremum = ratio > 0 ? Math.log(ratio) / (r1 - r2) : 0;
    if (Number.isFinite(extremum) && extremum > 0) extrema.push(extremum);
    bound = Math.max(1 / w0, ...extrema);
    while (Math.abs(A) * Math.exp(r1 * bound) + Math.abs(B) * Math.exp(r2 * bound) > epsilon && bound <= 600) bound *= 2;
  }
  if (!Number.isFinite(bound) || bound > 600) throw new Error('Spring does not settle within the supported 60 seconds; increase damping or stiffness');
  extrema.push(bound);
  extrema.sort((a, b) => a - b);
  let last = 0;
  for (let i = 0; i < extrema.length - 1; i++) if (Math.abs(positionAt(options, extrema[i]) - 1) > epsilon) last = i;
  let low = extrema[last];
  let high = extrema[last + 1];
  for (let i = 0; i < 60; i++) {
    const mid = (low + high) / 2;
    if (Math.abs(positionAt(options, mid) - 1) > epsilon) low = mid; else high = mid;
  }
  const duration = Math.max(1, Math.ceil(high * 1000));
  if (duration > 60000) throw new Error('Spring does not settle within the supported 60 seconds; increase damping or stiffness');
  const values = [];
  let peak = 0;
  for (let i = 0; i < points; i++) {
    const value = i === points - 1 ? 1 : positionAt(options, (duration / 1000) * (i / (points - 1)));
    peak = Math.max(peak, value);
    values.push(i === 0 ? 0 : round(value, 4));
  }
  return {
    duration,
    overshoot: round(Math.max(0, peak - 1), 4),
    dampingRatio: round(damping / (2 * Math.sqrt(stiffness * mass)), 4),
    linear: `linear(${values.join(', ')})`,
  };
}

export function checkPalette(spec) {
  object(spec, 'Palette');
  if (spec.name !== undefined && (typeof spec.name !== 'string' || !spec.name.trim())) throw new Error('Palette name must be a nonempty string');
  object(spec.colors, 'colors');
  if (!Object.keys(spec.colors).length) throw new Error('colors must contain at least one named color');
  if (!Array.isArray(spec.pairs) || !spec.pairs.length) throw new Error('pairs must contain at least one [foreground, background, minimum] tuple');
  const colors = Object.create(null);
  for (const [name, value] of Object.entries(spec.colors)) {
    tokenName(name, 'Color name');
    const parsed = parseColor(value);
    colors[name] = { value, rgb: parsed.rgb, hex: toHex(parsed.rgb), gamutMapped: parsed.gamutMapped };
  }
  const pairs = spec.pairs.map(pair => {
    if (!Array.isArray(pair) || pair.length !== 3) throw new Error('Each pair must be [foreground, background, minimum]');
    const [foreground, background, minimum] = pair;
    if (typeof foreground !== 'string' || typeof background !== 'string' || !Object.hasOwn(colors, foreground) || !Object.hasOwn(colors, background)) throw new Error(`Unknown color in pair: ${foreground}/${background}`);
    number(minimum, 'Contrast minimum', 1, 21);
    const [high, low] = [colors[foreground], colors[background]].map(color => relativeLuminance(color.rgb)).sort((a, b) => b - a);
    const ratio = (high + 0.05) / (low + 0.05);
    return { foreground, background, minimum, ratio, pass: ratio >= minimum };
  });
  return { name: spec.name, colors, pairs, pass: pairs.every(pair => pair.pass) };
}

export function paletteBlocks(markdown) {
  if (typeof markdown !== 'string') throw new Error('Palette Markdown must be text');
  const palettes = [];
  const lines = markdown.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const open = lines[i].match(/^ {0,3}(`{3,}|~{3,})json[ \t]+palette[ \t]*$/);
    if (!open) continue;
    const start = i + 1;
    const fence = open[1][0];
    const close = new RegExp(`^ {0,3}${fence}{${open[1].length},}[ \\t]*$`);
    const body = [];
    for (i++; i < lines.length && !close.test(lines[i]); i++) body.push(lines[i]);
    if (i === lines.length) throw new Error(`Unclosed palette block at line ${start}`);
    try { palettes.push(JSON.parse(body.join('\n'))); }
    catch (error) { throw new Error(`Invalid palette JSON at line ${start}: ${error.message}`); }
  }
  return palettes;
}

export function tokensCss(spec) {
  knownKeys(spec, ['name', 'colors', 'pairs', 'fonts', 'type', 'space', 'motion', 'springs'], 'spec');
  if (spec.motion !== undefined && typeof spec.motion !== 'boolean') throw new Error('motion must be boolean');
  if (spec.colors === undefined && spec.pairs === undefined && spec.fonts === undefined && spec.type === undefined && spec.space === undefined && spec.springs === undefined && spec.motion === undefined) throw new Error('Spec must contain token values');
  const palette = spec.colors !== undefined || spec.pairs !== undefined ? checkPalette(spec) : null;
  if (palette && !palette.pass) throw new Error(report(palette));
  const lines = [];
  for (const [name, color] of Object.entries(palette?.colors ?? {})) {
    // Normalize functional colors to the sRGB channels actually checked. Do
    // not emit an out-of-gamut OKLCH value and let the browser map it differently.
    const value = color.value.trim().startsWith('#') ? color.value.trim() : `rgb(${color.rgb.map(c => round(c * 255, 12)).join(' ')})`;
    lines.push(`  --color-${name}: ${value};${color.gamutMapped ? ' /* chroma reduced to sRGB */' : ''}`);
  }
  if (spec.fonts !== undefined) {
    object(spec.fonts, 'fonts');
    const family = `(?:"[^"\\\\\\r\\n]+"|'[^'\\\\\\r\\n]+'|[a-zA-Z][a-zA-Z0-9 -]*)`;
    const fontList = new RegExp(`^\\s*${family}(?:\\s*,\\s*${family})*\\s*$`);
    for (const [name, value] of Object.entries(spec.fonts)) {
      tokenName(name, 'Font name');
      if (typeof value !== 'string' || /[;{}\x00-\x1f]/.test(value) || !fontList.test(value)) throw new Error(`Invalid font-family list: ${name}`);
      lines.push(`  --font-${name}: ${value.trim()};`);
    }
  }
  if (spec.type !== undefined) for (const step of typeScale(spec.type)) lines.push(`  ${step.name}: ${step.value};`);
  if (spec.space !== undefined) for (const step of spaceScale(spec.space)) lines.push(`  ${step.name}: ${step.value};`);
  if (spec.motion !== false) for (const [name, value] of Object.entries(MOTION_TOKENS)) lines.push(`  --${name}: ${value};`);
  if (spec.springs !== undefined) object(spec.springs, 'springs');
  for (const [name, options] of Object.entries(spec.springs ?? {})) {
    tokenName(name, 'Spring name');
    const curve = springCurve(options);
    lines.push(`  --ease-spring-${name}: ${curve.linear};`, `  --dur-spring-${name}: ${curve.duration}ms;`);
  }
  return `:root {\n${lines.join('\n')}\n}\n`;
}

function options(args, allowed) {
  const result = {};
  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith('--')) throw new Error(`Unexpected argument: ${args[i]}`);
    const key = args[i].slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    if (!allowed.includes(key)) throw new Error(`Unknown option: ${args[i]}`);
    if (Object.hasOwn(result, key)) throw new Error(`Repeated option: ${args[i]}`);
    const value = args[i + 1];
    if (value === undefined || value.startsWith('--')) throw new Error(`Missing value for ${args[i]}`);
    if (!['steps', 'prefix', 'name'].includes(key) && !NUMBER.test(value)) throw new Error(`Invalid number for ${args[i]}`);
    result[key] = key === 'steps' ? parseSteps(value) : key === 'prefix' || key === 'name' ? value : Number(value);
    if (typeof result[key] === 'number' && !Number.isFinite(result[key])) throw new Error(`Invalid number for ${args[i]}`);
    i++;
  }
  return result;
}

export function parseSteps(value) {
  if (typeof value !== 'string') throw new Error('steps must be a range or comma-separated integers');
  const range = value.match(/^(-?\d+)\.\.(-?\d+)$/);
  if (range) {
    const [from, to] = [Number(range[1]), Number(range[2])];
    if (Math.abs(from) > 50 || Math.abs(to) > 50) throw new Error('steps must be from -50 to 50');
    return Array.from({ length: Math.abs(to - from) + 1 }, (_, i) => from + i * Math.sign(to - from || 1));
  }
  if (!/^-?\d+(?:,-?\d+)*$/.test(value)) throw new Error('steps must be a range or comma-separated integers');
  const steps = value.split(',').map(Number);
  if (new Set(steps).size !== steps.length || steps.some(step => Math.abs(step) > 50)) throw new Error('steps must be distinct integers from -50 to 50');
  return steps;
}

function report(result) {
  const lines = [`Palette ${result.name ?? '(unnamed)'}: ${result.pass ? 'PASS' : 'FAIL'}`];
  for (const [name, color] of Object.entries(result.colors)) lines.push(`  ${name.padEnd(12)} ${color.hex}  ${color.value}${color.gamutMapped ? '  (chroma reduced to sRGB)' : ''}`);
  for (const pair of result.pairs) lines.push(`  ${pair.pass ? 'pass' : 'FAIL'} ${pair.foreground} on ${pair.background}: ${(Math.floor(pair.ratio * 100) / 100).toFixed(2)} (needs ${pair.minimum})`);
  return lines.join('\n');
}

const HELP = `Usage: node scripts/tokens.mjs <command> [options]

contrast <fg> <bg>          WCAG 2 contrast ratio and levels
convert <color>...          hex and oklch for #hex, rgb() or oklch() colors
type [options]              fluid type scale: --min-size 16 --max-size 20 --min-vw 360
                            --max-vw 1440 --min-ratio 1.2 --max-ratio 1.25 --steps -2..6
space [options]             fluid space scale: --min-size 16 --max-size 20 --min-vw 360 --max-vw 1440
spring [options]            CSS linear() spring: --stiffness 170 --damping 26 --name default
                            --mass 1 --velocity 0 --epsilon 0.001 --points 48
check <spec.json>           verify palette colors and contrast pairs
css <spec.json>             print :root tokens (fails when a contrast pair fails)
palettes <file.md>          verify every json palette block in a Markdown file

Scales also accept --prefix. Steps accept -2..6 or -2,-1,0,1 (integers -50 to 50).
Colors: opaque #rgb, #rrggbb, rgb() numbers/percentages, oklch(L C H).
OKLCH accepts L 0..1 (or 0..100%), C 0..4 and degree hue; out-of-sRGB chroma is reduced at
constant lightness/hue. CSS prints the checked sRGB channels. Alpha, named
colors, missing channels and other color functions are unsupported.
Spring points: 8..400. Springs must settle within 60 seconds (mass defaults to 1).
contrast exits 1 below normal-text AA (4.5:1); check/palettes/css use pair minimums.
No dependencies, network access or file writes.
`;

async function main(args) {
  const [command, ...rest] = args;
  if (!command || ['--help', '-h', 'help'].includes(command)) return process.stdout.write(HELP);
  if (rest.length === 1 && ['--help', '-h'].includes(rest[0])) return process.stdout.write(HELP);
  if (command === 'contrast') {
    if (rest.length !== 2) throw new Error('contrast needs <foreground> <background>');
    const ratio = contrastRatio(rest[0], rest[1]);
    const levels = wcagLevels(ratio);
    process.stdout.write(`${(Math.floor(ratio * 100) / 100).toFixed(2)}:1  normal text AA ${levels.normalAA ? 'pass' : 'fail'}, AAA ${levels.normalAAA ? 'pass' : 'fail'}; large text/UI AA ${levels.largeAA ? 'pass' : 'fail'}\n`);
    if (rest.some(color => parseColor(color).gamutMapped)) process.stdout.write('OKLCH chroma reduced to sRGB before contrast calculation.\n');
    if (!levels.normalAA) process.exitCode = 1;
    return;
  }
  if (command === 'convert') {
    if (!rest.length) throw new Error('convert needs at least one color');
    const lines = rest.map(color => {
      const parsed = parseColor(color);
      const [L, C, H] = srgbToOklch(parsed.rgb);
      return `${color}  ${toHex(parsed.rgb)}  oklch(${format(L)} ${format(C)} ${format(H)})${parsed.gamutMapped ? '  (chroma reduced to sRGB)' : ''}`;
    });
    process.stdout.write(lines.join('\n') + '\n');
    return;
  }
  if (command === 'type' || command === 'space') {
    const allowed = ['minSize', 'maxSize', 'minVw', 'maxVw', 'prefix'];
    const rows = command === 'type' ? typeScale(options(rest, [...allowed, 'minRatio', 'maxRatio', 'steps'])) : spaceScale(options(rest, allowed));
    process.stdout.write(rows.map(row => `${row.name}: ${row.value}; /* ${row.minPx}px -> ${row.maxPx}px */`).join('\n') + '\n');
    return;
  }
  if (command === 'spring') {
    const { name = 'default', ...rest2 } = options(rest, ['name', 'stiffness', 'damping', 'mass', 'velocity', 'epsilon', 'points']);
    tokenName(name, 'Spring name');
    const curve = springCurve(rest2);
    process.stdout.write(`--ease-spring-${name}: ${curve.linear};\n--dur-spring-${name}: ${curve.duration}ms;\n/* damping ratio ${curve.dampingRatio}, overshoot ${curve.overshoot} */\n`);
    return;
  }
  if (['check', 'css', 'palettes'].includes(command)) {
    if (rest.length !== 1) throw new Error(`${command} needs one file`);
    const text = await readFile(resolve(rest[0]), 'utf8');
    if (command === 'palettes') {
      const results = paletteBlocks(text).map(checkPalette);
      if (!results.length) throw new Error('No ```json palette blocks found');
      process.stdout.write(results.map(report).join('\n\n') + '\n');
      if (!results.every(result => result.pass)) process.exitCode = 1;
      return;
    }
    const spec = JSON.parse(text);
    if (command === 'css') {
      process.stdout.write(tokensCss(spec));
      return;
    }
    const result = checkPalette(spec);
    process.stdout.write(report(result) + '\n');
    if (!result.pass) process.exitCode = 1;
    return;
  }
  throw new Error(`Unknown command: ${command}. Use --help.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).catch(error => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
