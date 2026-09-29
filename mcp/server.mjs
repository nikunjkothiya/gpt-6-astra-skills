#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { loadPackage, catalogText, startText, bundleText, SERVER_NAME } from './content.mjs';

async function main() {
  const args = process.argv.slice(2);
  const metadata = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    process.stdout.write('Visual Engineering Intelligence ' + metadata.version + '\n\nUsage: node mcp/server.mjs\n\nRead-only MCP over stdio.\nTools: visual_engineering_start, visual_engineering_list, visual_engineering_read, visual_engineering_reference, visual_engineering_bundle\nResources: catalog, skills, supporting references, and bundles.\nPrompt: visual-engineering (required argument: task)\n\nOnly inventoried package documents are served. No API key or runtime network access.\nOptions: --help, --version\n');
    return;
  }
  if (args.length === 1 && ['--version', '-v'].includes(args[0])) {
    process.stdout.write(metadata.version + '\n');
    return;
  }
  if (args.length) throw new Error('Unexpected arguments. Use --help.');
  const pkg = await loadPackage();
  let dependencies;
  try {
    dependencies = await Promise.all([
      import('@modelcontextprotocol/server'), import('@modelcontextprotocol/server/stdio'), import('zod/v4'),
    ]);
  } catch (error) {
    throw new Error('Install runtime dependencies with npm ci in the package directory. ' + error.message);
  }
  const [{ McpServer }, { serveStdio }, z] = dependencies;
  const annotations = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
  const taskSchema = z.string().trim().min(1).max(16000);
  const block = text => ({ type: 'text', text });

  serveStdio(() => {
    const server = new McpServer({ name: SERVER_NAME, version: pkg.metadata.version }, {
      instructions: 'For substantial visual work, call visual_engineering_start, then read the selected specialists and references. Narrow tasks can read their specialist directly. Complete the requested artifact through host capabilities. This server supplies guidance and does not edit or render.',
    });
    server.registerTool('visual_engineering_start', {
      description: 'Start visual design, implementation, redesign, or reconstruction. Returns the coordinator and catalog; choose relevant specialists and references before applying their guidance.',
      inputSchema: z.object({ task: taskSchema.optional() }).strict(), annotations,
    }, async ({ task }) => ({ content: [block(startText(pkg, task))] }));
    server.registerTool('visual_engineering_list', {
      description: 'List skills and their reference IDs. Optional query matches every space-separated term in skill names, descriptions, or reference titles, ignoring case.',
      inputSchema: z.object({ query: z.string().trim().max(200).optional() }).strict(), annotations,
    }, async ({ query }) => ({ content: [block(catalogText(pkg, query))] }));
    server.registerTool('visual_engineering_read', {
      description: 'Read full instructions for 1 to 8 exact skill names from the catalog. Linked references need a separate visual_engineering_reference call.',
      inputSchema: z.object({ names: z.array(z.enum([...pkg.skills.keys()])).min(1).max(8) }).strict(), annotations,
    }, async ({ names }) => ({ content: [...new Set(names)].map(name => block(pkg.skills.get(name).text)) }));
    if (pkg.references.size) server.registerTool('visual_engineering_reference', {
      description: 'Read 1 to 4 full supporting references using exact IDs from the catalog or linked resource URI suffix. Only inventoried documents are accepted; no arbitrary filesystem paths.',
      inputSchema: z.object({ ids: z.array(z.enum([...pkg.references.keys()])).min(1).max(4) }).strict(), annotations,
    }, async ({ ids }) => ({ content: [...new Set(ids)].map(id => block(pkg.references.get(id).text)) }));
    if (pkg.bundles.size) server.registerTool('visual_engineering_bundle', {
      description: 'Read a predefined bundle of full skill and reference bodies for a broad task. Select a named bundle from the catalog; preserve topic-specific choices and load additional references only when needed.',
      inputSchema: z.object({ name: z.enum([...pkg.bundles.keys()]) }).strict(), annotations,
    }, async ({ name }) => ({ content: [block(bundleText(pkg, name))] }));
    server.registerResource('visual-engineering-catalog', 'visual-engineering://catalog', {
      description: 'All skills and supporting reference IDs.', mimeType: 'text/markdown',
    }, async uri => ({ contents: [{ uri: uri.href, mimeType: 'text/markdown', text: catalogText(pkg) }] }));
    for (const doc of pkg.documentsByPath.values()) {
      server.registerResource(doc.name, doc.uri, {
        description: doc.description ?? doc.title, mimeType: 'text/markdown',
      }, async uri => ({ contents: [{ uri: uri.href, mimeType: 'text/markdown', text: doc.text }] }));
    }
    for (const bundle of pkg.bundles.values()) server.registerResource(`bundle-${bundle.name}`, bundle.uri, {
      description: bundle.description, mimeType: 'text/markdown',
    }, async uri => ({ contents: [{ uri: uri.href, mimeType: 'text/markdown', text: bundleText(pkg, bundle.name) }] }));
    server.registerPrompt('visual-engineering', {
      description: 'Load the coordinator and catalog for the requested visual task.',
      argsSchema: z.object({ task: taskSchema }).strict(),
    }, async ({ task }) => ({ messages: [{ role: 'user', content: block(startText(pkg, task)) }] }));
    server.server.onerror = error => process.stderr.write('[' + SERVER_NAME + '] ' + error.message + '\n');
    return server;
  });
}

main().catch(error => {
  process.stderr.write('[' + SERVER_NAME + '] ' + error.message + '\n');
  process.exitCode = 1;
});
