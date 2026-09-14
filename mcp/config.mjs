#!/usr/bin/env node

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const name = 'visual-engineering-intelligence';
const args = process.argv.slice(2);

function main() {
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    process.stdout.write('Usage: node mcp/config.mjs [--format json|toml]\n\nPrint a local stdio MCP configuration using absolute paths.\nThe default JSON uses mcpServers; TOML uses mcp_servers.\nMerge only this server entry into your host\'s supported configuration.\nThis command does not install dependencies or modify any files.\n');
    return;
  }
  let format = 'json';
  if (args.length !== 0) {
    if (args.length !== 2 || args[0] !== '--format' || !['json', 'toml'].includes(args[1])) {
      throw new Error('Use --format json, --format toml, or --help.');
    }
    format = args[1];
  }
  const serverPath = resolve(dirname(fileURLToPath(import.meta.url)), 'server.mjs');
  const entry = { command: process.execPath, args: [serverPath] };
  const output = format === 'json'
    ? JSON.stringify({ mcpServers: { [name]: entry } }, null, 2)
    : `[mcp_servers.${name}]\ncommand = ${JSON.stringify(entry.command)}\nargs = [${JSON.stringify(serverPath)}]`;
  process.stdout.write(`${output}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`[${name}] ${error.message}\n`);
  process.exitCode = 1;
}
