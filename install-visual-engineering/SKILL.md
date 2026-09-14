---
name: install-visual-engineering
description: Add the Visual Engineering Intelligence skill suite and local MCP server to an agent host. Use when a host needs the packaged skills to be discoverable and available for visual work; do not use for the visual work itself.
---

# Install Visual Engineering Intelligence

This package is host-neutral. It has two independent integration surfaces:

- `skills/` contains nineteen sibling skills, each with a `SKILL.md` entrypoint.
- `mcp/server.mjs` is a local, read-only MCP server that serves the same instructions through standard input/output.

Keep the complete package in a stable directory. Do not copy individual skill folders: the coordinator relies on its specialist siblings, and the MCP server relies on the complete `skills/` directory. Resolve the package root as the parent of this `install-visual-engineering` folder.

Inspect the target host's supported skill-discovery mechanism, MCP transport, configuration format, desired scope, and existing installation before changing configuration. Use the host's documented installation mechanism and preserve unrelated configuration. If a differing existing copy uses the same package or server name, report the conflict and obtain an explicit replacement decision before overwriting it.

## Add the native skills

Point the host's skill discovery directory, plugin loader, or workspace configuration at `<package-root>/skills`. It must expose all nineteen subdirectories as individual skills, preserving their names and sibling relationship. The coordinator is `visual-engineering-intelligence`; it selects the relevant specialists. A host that supports only one monolithic instruction file should load the coordinator and then load every specialist it selects.

The native route has no runtime dependency. It is sufficient when the host can discover and read `SKILL.md` files. Do not register a second copy at another precedence level unless the host requires it; duplicate copies cause conflicting instructions and unclear updates.

## Add the local MCP server

Use this route when the host supports MCP over a local stdio process. It is compatible with Node.js 20 or later.

From the package root, install the locked runtime dependencies:

```text
npm ci --omit=dev --ignore-scripts --no-audit --no-fund
```

Then run:

```text
node mcp/config.mjs
```

The command prints a JSON `mcpServers` entry containing absolute paths to the local Node executable and `mcp/server.mjs`. Merge only that entry into the host's MCP configuration. For a TOML host, run:

```text
node mcp/config.mjs --format toml
```

Do not copy configuration secrets into the package or replace unrelated server entries. Keep standard output reserved for MCP protocol traffic; any server error appears on standard error. Restart the host or its MCP connection after configuring it.

The server has no API key, runtime network, write, shell, or HTTP behavior. It offers `visual_engineering_start`, `visual_engineering_list`, and `visual_engineering_read`; hosts that support MCP resources and prompts also receive a catalog, nineteen skill resources, and a visual-work prompt. Restart the process after editing any packaged skill because it caches the suite when it starts.

## Make the guidance active

Native skill hosts should expose the coordinator's description during discovery and load the coordinator for substantial visual design, implementation, redesign, reference reconstruction, or polish. They should load a named specialist directly for a narrow repair.

For an MCP-only host, add the following instruction through its documented scoped instruction mechanism if it does not automatically present the server instructions. Preserve an existing differing instruction instead of overwriting it.

```markdown
For substantial visual design, implementation, redesign, reference reconstruction, or polish, call `visual_engineering_start` with the user's task before making visual decisions. Then call `visual_engineering_read` for each relevant specialist. For a narrow repair, use `visual_engineering_list` to find and read the owning specialist directly. A coordinator link does not load another skill.

Use the loaded guidance to complete the requested artifact through available host capabilities and preserve the user's scope. These skills do not supply missing editing, rendering, browser, or permission capabilities.
```

Use the native skill route, MCP route, or both only when the host can keep their instruction loading coherent. When both are enabled, treat the native files and MCP output as one identical suite and avoid loading the same body twice.

## Update and remove

Keep a single canonical package directory. When replacing its contents, preserve the directory path or update the host's stored skill and MCP paths. Reinstall dependencies after a package-lock change, and restart the MCP connection after any update.

To remove the package, use the host's documented skill and MCP removal actions, then remove only the configuration entry named `visual-engineering-intelligence`. Do not delete the package directory or a scoped activation instruction if it contains user edits.

## Handoff

Report the package version, package location, selected scope, whether native skills and MCP are enabled, and any activation instruction added. Do not claim discovery or successful use without observing the target host's own status output or a requested visual task.
