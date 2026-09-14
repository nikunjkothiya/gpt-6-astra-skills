# Visual Engineering Intelligence

Visual Engineering Intelligence is a host-neutral package of nineteen visual design and implementation skills. It provides standard `SKILL.md` folders for native skill discovery and a local, read-only MCP server for compatible clients.

Give an installing agent this instruction:

> Read `install-visual-engineering/SKILL.md` in this package and add Visual Engineering Intelligence through the host's native skill mechanism or local MCP configuration. Keep the package intact, preserve existing configuration, and enable the supplied activation guidance when necessary.

## Native skill route

Add the `skills/` directory through the host's supported skill discovery mechanism. It must retain all nineteen sibling directories. Load `visual-engineering-intelligence` for broad visual work, or load a specialist directly for a focused task.

## Local MCP route

Node.js 20+ is required only for MCP. From the package root:

```text
npm ci --omit=dev --ignore-scripts --no-audit --no-fund
node mcp/config.mjs
```

Merge the printed JSON server entry into the host's MCP configuration. Run `node mcp/config.mjs --format toml` when the host uses TOML. The server exposes visual-work startup, catalog, and full-skill retrieval tools without API keys or runtime network access.

Read [the installer skill](install-visual-engineering/SKILL.md) before configuring a host. It covers scope, updates, removal, native skill loading, MCP activation, and preservation of existing configuration.
