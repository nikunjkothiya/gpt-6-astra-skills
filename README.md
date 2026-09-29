# Visual Engineering Intelligence

A reusable skill package for designing and implementing distinctive websites, interfaces, cinematic motion and interactive 3D. Version 1.3.0 contains **22 skills, 32 implementation references and four predefined bundles**. It adapts to the user's topic, existing project, assets and constraints.

The distribution contains skills, reference algorithms, prompts, a read-only MCP server and package verification tools. It contains no demonstration websites, branded page templates, stock media or required frontend framework. The model host supplies editing, asset preparation, browsing and rendering capabilities.

## What the package covers

| Capability | Guidance |
| --- | --- |
| Requirements to design | Audience, task, trust, content, identity, assets and constraints → a specific visual thesis and working UI |
| Luxury/editorial design | Subject, hierarchy, typography, color roles, imagery, layout rhythm, material and finish |
| Different visual languages | Editorial, sculptural, architectural, expressive, service, technical and cinematic relationships; theme variations and script-aware typography |
| Motion graphics | DOM/SVG/canvas diagrams, kinetic type, vector runtimes, meaningful loops and transitions |
| Cursor response | Followers, masks, reveals, parallax, tilt, local coordinates and input ownership |
| Recorded motion | GIF handling, video encoding, timeline scrubbing, seek queues, posters and failure recovery |
| Scroll-controlled pictures | Video-to-JPG preparation, numbered manifests, frame mapping, bounded decode/cache and responsive crop |
| Real objects and 3D | Three.js geometry, pivots, attachment, materials, light, camera, raycasting, constrained tracking and reset |
| Assembly and disassembly | Part hierarchy, release order, clearance paths, exploded states, interruption and exact reassembly |
| Rendering and blending | CSS/canvas compositing, alpha edges, crossfades, transparent depth, glass and color/output boundaries |
| Cinematic scroll | Numeric storyboards, GSAP ownership, reversible scenes, camera travel and reading holds |
| Verification | Responsive composition, keyboard/touch, reduced motion, lifecycle, performance and observed playback |

The skills select techniques that serve the actual interface. They do not require every effect on every page. No prompt can guarantee awards, identical results across LLMs, or reproduction of a model's private reasoning.

See the [complete capability map](CAPABILITIES.md) for requirement-to-skill routes, bundle selection and the evidence each capability needs in the target project.

## Choose a loading route

| Route | Requirements | Load |
| --- | --- | --- |
| Native skills | A host that reads skill folders | The complete `skills/` directory and its references |
| Local MCP | Node.js 20+ and local stdio MCP support | The server entry printed by `mcp/config.mjs` |
| Markdown context | A host that accepts text or files | An exported bundle or selected full documents |

### Native skills

Use the host's documented discovery mechanism and [installer instructions](install-visual-engineering/SKILL.md). Preserve sibling folders and references. Load `visual-engineering-intelligence` for substantial work; use the owning specialist directly for a narrow correction. Native skills have no runtime dependency.

### Markdown context for any suitable LLM

```text
node scripts/export.mjs --bundle premium-ui
node scripts/export.mjs --bundle interactive-motion
node scripts/export.mjs --bundle luxury-cinematic
node scripts/export.mjs --bundle product-3d
node scripts/export.mjs --skill threejs-engineering --reference threejs-engineering/references/scene-lifecycle.md
```

The dependency-free exporter prints full Markdown bodies. Save or attach that output through the host's supported mechanism. People can also copy the files without Node. `--all` includes the complete suite; use it only when the host's context budget permits. Links to missing documents do not load those documents.

| Bundle | Included bodies | Intended use |
| --- | --- | --- |
| `premium-ui` | 8 skills + 10 references | Visual language, typography/themes, complete interaction, mobile composition, accessibility, motion and QA |
| `interactive-motion` | 6 skills + 12 references | Topic-led UI, motion graphics, cursor/scroll interactions, GIF/video/image sequences, visual direction and QA |
| `luxury-cinematic` | 8 skills + 12 references | Premium/editorial direction plus cinematic media, live object behavior, Three.js and motion engineering |
| `product-3d` | 8 skills + 9 references | Geometry, hierarchy, assembly/disassembly, material, lighting, camera, rendering and Three.js runtime |

Bundles contain the listed bodies; the host retrieves further guidance when needed. The motion bundles need responsive/accessibility owners for full interface work, and `product-3d` focuses on the scene. Combine selections with repeated `--bundle` flags to deduplicate shared documents, or load individual owners in stages when context is limited. Text exports always include the coordinator; `product-3d` therefore exports nine skill bodies. The [cinematic build prompt](prompts/cinematic-build.md) and [requirements-driven design prompt](prompts/requirements-to-design.md) provide task instructions to use alongside the actual skill bodies.

### Local MCP

```text
npm ci --omit=dev --ignore-scripts --no-audit --no-fund
node mcp/config.mjs
```

On Windows PowerShell use `npm.cmd` if execution policy blocks `npm.ps1`. Merge the printed server entry into the host configuration. For a TOML host use `node mcp/config.mjs --format toml`. Restart the connection after updating packaged content.

| Tool | Result |
| --- | --- |
| `visual_engineering_start` | Coordinator and catalog for the task |
| `visual_engineering_list` | Skill/reference/bundle discovery |
| `visual_engineering_read` | Full bodies for 1–8 exact skill names |
| `visual_engineering_reference` | Full bodies for 1–4 exact reference IDs |
| `visual_engineering_bundle` | One complete named bundle |

Resources also expose the catalog, individual documents and `visual-engineering://bundles/NAME` for each bundle above. The `visual-engineering` MCP prompt starts the same workflow. Avoid loading duplicate bodies when using both native and MCP routes.

The server serves only documents declared in [the catalog](mcp/catalog.json), with bounded sizes, resolved-path containment and validated documentation links. It has no runtime network, editing, shell or browser behavior. It does not call an LLM or supply missing tools.

## Activate the guidance

Add this through the host's supported instruction mechanism when needed:

> For substantial visual work, load Visual Engineering Intelligence and the specialists/references relevant to the user's topic, assets and requested behavior. For cursor, scroll, GIF, video or image-sequence work load interactive-motion; for premium/editorial work also load luxury editorial direction. Make concrete design decisions, implement inside the actual project, inspect available evidence and complete the authorized work. Use the owning specialist directly for a narrow repair. Preserve the existing identity and user scope.

## Verify and maintain the package

```text
npm ci --ignore-scripts --no-audit --no-fund
npm run check
```

Checks cover inventory, metadata, links, full stdio MCP retrieval, named bundles, portable exports, input rejection and algorithms executed directly from the distributed reference text. They do not build a website or certify appearance. Rendering and playback verification belong in the target project's workflow.

To stage a clean distribution, use `npm run build:package -- --out PATH` with a new directory inside this workspace and an existing parent directory. The destination must be outside source and dependency folders. It includes the package sources and lockfile while excluding installed dependencies and generated artifacts.

[Package validation and evidence limits](PACKAGE-VALIDATION.md) distinguish tested algorithms from instructions requiring real assets, devices and browser observation. When extending the package, register documents in the catalog, link them from the owning skill and test relevant behavior. Keep numerical design proposals distinct from actual measurements.
