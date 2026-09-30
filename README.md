# Visual Engineering Intelligence

Visual Engineering Intelligence is a portable set of instructions for designing and building websites, interfaces, cinematic motion, and interactive 3D. It helps an LLM choose a visual direction from the **actual project brief**, implement the relevant behavior, and check the result. Version **1.4.0** contains **29 skills, 57 supporting references, and five ready-to-load bundles**.

Use it with an LLM that can read local skills, connect to a local MCP server, or accept Markdown as context. The package supplies guidance and implementation recipes; the host's tools perform the editing, asset work, and visual inspection in your project.

## Start in three steps

1. Get the complete package and keep its `skills/`, `mcp/`, `prompts/`, and `scripts/` directories together. From Git:

   ```sh
   git clone https://github.com/nikunjkothiya/gpt-6-astra-skills.git
   cd gpt-6-astra-skills
   ```

2. Choose **one loading method** below. For a first text-based run, install Node.js 20 or later and print the `premium-ui` bundle:

   ```sh
   node scripts/export.mjs --bundle premium-ui
   ```

   Supply that output to your LLM as a file or context. The exporter needs no `npm install`. If your host discovers skill folders or supports local MCP, use the corresponding method below instead.

3. Give the LLM your **target project's** location or files, audience, main task, existing identity, available assets, requested interactions, and target devices. The LLM should work in that project. See the [task prompt](prompts/requirements-to-design.md) if you want a fill-in brief.

## Choose how your LLM loads the package

| Method | Best when | Setup |
| --- | --- | --- |
| Native skills | Your host discovers and reads `SKILL.md` folders | Expose the complete `skills/` directory through the host's supported skill mechanism. Start with `visual-engineering-intelligence` for broad work, or a specialist for a focused repair. |
| Local MCP | Your host supports a local stdio MCP server | Install runtime dependencies, generate the server entry, add it to the host, and restart the connection. |
| Markdown context | Your LLM accepts pasted text or attached files | Export a named bundle or selected documents and supply their full text. |

The [installation guide](install-visual-engineering/SKILL.md) covers host configuration, updates, and removal. Keep the skill folders as siblings so links to their references resolve. A link to a reference does not load its contents into a text-only host.

### Native skills

Point your host's skill discovery mechanism at this package's `skills/` directory. The coordinator is `skills/visual-engineering-intelligence/SKILL.md`; it selects specialists as the task develops. This method has no runtime dependencies. Check the host's documentation for its discovery path and confirm that it sees the skills after installation.

### Local MCP

From the package root, with Node.js 20 or later:

```sh
npm ci --omit=dev --ignore-scripts --no-audit --no-fund
node mcp/config.mjs
```

The second command prints a JSON entry with **absolute paths** for this package and your local Node executable. Merge that entry into your host's MCP configuration, preserving its other entries, then restart the MCP connection. For a TOML host, run `node mcp/config.mjs --format toml`. On Windows PowerShell, use `npm.cmd` if the `npm.ps1` launcher is blocked.

Ask the host to call `visual_engineering_start` for a broad design task, then `visual_engineering_read`, `visual_engineering_reference`, or `visual_engineering_bundle` for the required full instructions. `visual_engineering_list` discovers names and reference IDs. The server also exposes the same content as MCP resources and a `visual-engineering` prompt. It is read-only and performs no project editing.

### Markdown context

Run these commands from the package root and supply the printed output to your LLM:

```sh
node scripts/export.mjs --bundle premium-ui
node scripts/export.mjs --bundle award-ui --bundle premium-ui
node scripts/export.mjs --bundle interactive-motion
node scripts/export.mjs --bundle luxury-cinematic
node scripts/export.mjs --bundle product-3d
```

Combine bundles when the project needs both sets of guidance; shared documents appear once:

```sh
node scripts/export.mjs --bundle premium-ui --bundle interactive-motion
```

For a focused task, select full documents using exact names and IDs from [the catalog](mcp/catalog.json):

```sh
node scripts/export.mjs --skill threejs-engineering --reference threejs-engineering/references/scene-lifecycle.md
```

`node scripts/export.mjs` prints the coordinator and catalog. `--all` prints every body and requires a large context window. Prefer selected documents or staged loading when your host has limited context. You can also copy the Markdown files directly without running the exporter.

## Which bundle should I use?

| Bundle | Starting point for | Included instructions |
| --- | --- | --- |
| `award-ui` | Original flagship, editorial, portfolio or launch design; combine with `premium-ui` | Creative direction, concept comparison, typography, checked palettes, tokens, component craft and critique |
| `premium-ui` | A complete, responsive interface | Visual direction, typography, color and theme decisions, interaction states, mobile composition, accessibility, motion, and visual QA |
| `interactive-motion` | Motion graphics, cursor effects, scroll behavior, GIF/video, and image sequences | Topic-to-motion selection, pointer mapping, media preparation, scrubbing, frame caches, cinematic progress, and verification |
| `luxury-cinematic` | An editorial or luxury site with directed motion | Subject-led art direction, cinematic storytelling, recorded media, object response, and motion verification |
| `product-3d` | A live 3D product, configurator, or exploded view | Geometry, pivots, assembly and reassembly, materials, light, camera, rendering, and Three.js lifecycle |

A bundle is a **starting selection**, not a fixed design template. Load additional specialists when the task requires them. For example, pair `product-3d` with `premium-ui` for the surrounding controls and mobile layout. Add responsive and accessibility guidance to a cinematic experience when building a complete site. The [capability map](CAPABILITIES.md) lists each requirement, its owning skill, and what to verify.

## Example use cases

These are example **requests** for a target project. Replace the product, assets, stack, and constraints with your real brief. They do not require demonstration files in this package.

| Project | Start with | Example request to your LLM |
| --- | --- | --- |
| SaaS dashboard | `premium-ui` | Redesign our analytics dashboard around comparing campaign performance. Use our existing React app and real data. Improve hierarchy, chart states, keyboard access, and narrow-screen layouts. Keep our brand colors and verify the finished screens. |
| Luxury product site | `luxury-cinematic`; add `responsive-composition` and `visual-accessibility` | Build an editorial launch page for our watch collection using our approved photos and copy. Create a restrained scroll story, considered typography, and clear product actions. Verify mobile, reduced motion, and loading states. |
| Interactive 3D configurator | `product-3d` plus `premium-ui` | In our product app, build an inspectable modular lamp. Preserve real part dimensions and attachment points; let users select finishes and view a reversible exploded assembly. Provide keyboard and touch controls, a static fallback, and responsive product details. |
| Scroll-controlled image sequence | `interactive-motion` plus `premium-ui` | Use our licensed manufacturing clip to create a scroll-controlled frame sequence with chapter labels. Verify the extracted frame inventory, crop, memory budget, reverse scroll, missing frames, and a mobile poster view. |
| Creative portfolio | `interactive-motion` plus `premium-ui` | Refine our portfolio with cursor-following project previews and SVG motion graphics. Keep links clickable, show the same project information on focus and touch, stop idle work, and preserve readable case studies. |
| Service or healthcare site | `premium-ui` | Improve our appointment flow for quick comprehension and trust. Make forms, errors, focus, contrast, and enlarged-text layouts work first; use only motion that helps explain a state change. |
| Reference-led redesign | `visual-reconstruction` plus relevant direction/composition skills | Study the supplied public reference and our current page. Record what is observed and inferred, then create an original layout with comparable hierarchy and pacing using our own content. Compare matched views and state what remains unverified. |

For any of these, include the target repository or page scope, actual content, brand rules, asset rights, frameworks, supported devices, and what must be preserved. A useful general request is:

```text
Use Visual Engineering Intelligence in my existing project.
Goal: [who the site serves and the main action]
Scope: [page or component to create or improve]
Preserve: [brand, content, behavior, stack, and constraints]
Assets: [photos, video, models, fonts, and rights]
Interactions: [scroll, cursor, motion graphics, media, or 3D requirements]
Delivery: [target devices, browser support, performance constraints]

Inspect the project, choose the relevant skill bodies, implement the requested
experience, then verify actual views and interactions. Report the tests and
observations you performed and any material limits.
```

For a directed scene, the [cinematic build prompt](prompts/cinematic-build.md) adds storyboard and playback requirements.

## What is in the repository?

| Path | Purpose |
| --- | --- |
| `skills/` | 29 independently usable skill entrypoints and 57 supporting references |
| `mcp/` | Catalog and local read-only MCP server |
| `prompts/` | Reusable task prompts for broad design and cinematic builds |
| `scripts/export.mjs` | Prints selected full instructions for text-only hosts |
| `scripts/tokens.mjs` | Checks declared color pairs and generates fluid scales, springs and CSS tokens |
| `scripts/audit.mjs`, `scripts/capture.mjs` | Optional source heuristics and browser evidence collection |
| `install-visual-engineering/SKILL.md` | Host installation and activation guidance |
| `tests/`, `scripts/validate.mjs` | Package and reference-code verification |

The repository ships instructions and code recipes. It does not contain a website template, media library, or a rendered example site. The user's project supplies the content and assets. The host must provide the tools needed to edit code, prepare media, browse, and inspect rendered results.

## Creative craft and optional helpers

For an original site, combine `award-ui` with `premium-ui`. The creative workflow compares directions using real content, develops a representative opening, ordinary section and working action, then fixes observed weaknesses. Existing products preserve useful brand and interaction conventions. Creativity can live in a data comparison or a still composition as well as motion.

The helper paths in skills are relative to this package. From a target project, use its absolute package location:

```sh
node "<package-root>/scripts/tokens.mjs" contrast "#111111" "#ffffff"
node "<package-root>/scripts/audit.mjs" .
node "<package-root>/scripts/capture.mjs" --url http://localhost:3000 --out captures-review-1
```

Replace `<package-root>` with the real path. Tokens and source audit need only Node. Capture requires Playwright (or playwright-core / @playwright/test) and a usable browser provided by the project or host; neither is a package dependency. Read each command's `--help`. Capture requires a new output directory with an existing parent. Its source checks, sampled screenshots and lab observations support review; they do not certify aesthetics, WCAG conformance, field performance or physical-device smoothness. The MCP server remains read-only and does not execute helpers.

## Check or build the package

For development, install the locked dependencies and run the checks:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run check
```

The checks cover the catalog, links, MCP retrieval, exports, distribution staging, and algorithms executed from reference text. They do not prove that an arbitrary generated site looks good or runs smoothly; inspect that site's real pages and motion on its target devices. See [validation and evidence limits](PACKAGE-VALIDATION.md).

To stage the maintained sources for distribution, choose a **new** directory inside this workspace, outside source and dependency folders:

```sh
npm run build:package -- --out package-stage
```

The builder refuses to overwrite an existing directory. Generated exports, archives, installed dependencies, caches, and local settings are excluded from Git by the repository's allowlist.
