// Execute the exact framework-neutral algorithms distributed in the skill bodies.
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PACKAGE_ROOT } from '../mcp/content.mjs';

export async function motionRuntimeSource(names = ['cursor-choreography', 'media-scrubbing']) {
  const allowed = new Set(['cursor-choreography', 'media-scrubbing', 'scroll-image-sequences']);
  const blocks = [];
  for (const name of names) {
    if (!allowed.has(name)) throw new Error(`Unknown runtime recipe: ${name}`);
    const text = await readFile(resolve(PACKAGE_ROOT, `skills/interactive-motion/references/${name}.md`), 'utf8');
    const match = text.match(/<!-- runtime:start -->\s*```js\r?\n([\s\S]*?)\r?\n```\s*<!-- runtime:end -->/);
    if (!match) throw new Error(`Missing canonical runtime block: ${name}`);
    blocks.push(match[1]);
  }
  return '// Extracted from packaged reference recipes.\n' + blocks.join('\n\n') + '\n';
}

export async function importMotionRecipes() {
  const source = await motionRuntimeSource(['cursor-choreography', 'media-scrubbing', 'scroll-image-sequences']);
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
}
