#!/usr/bin/env node
import { loadPackage, catalogText, bundleDocuments, SERVER_NAME } from '../mcp/content.mjs';

try {
  const args = process.argv.slice(2);
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    process.stdout.write('Usage: node scripts/export.mjs [--bundle NAME] [--skill NAME] [--reference ID] [--all]\n\nPrint a Markdown context bundle to stdout. Default: coordinator and catalog.\nRepeat flags to include named bundles or selected bodies.\n--all includes every document and can consume substantial context.\nNo dependencies, network, or file writes. Supply the output to your host.\n');
  } else {
    const skills = new Set([SERVER_NAME]);
    const refs = new Set();
    const bundles = new Set();
    let all = false;
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--all') { all = true; continue; }
      if (!['--skill', '--reference', '--bundle'].includes(args[i]) || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error('Use --help for export options.');
      (args[i] === '--skill' ? skills : args[i] === '--bundle' ? bundles : refs).add(args[++i]);
    }
    const pkg = await loadPackage();
    for (const name of bundles) for (const doc of bundleDocuments(pkg, name)) (doc.id ? refs : skills).add(doc.id ?? doc.name);
    if (all) { for (const name of pkg.skills.keys()) skills.add(name); for (const id of pkg.references.keys()) refs.add(id); }
    for (const name of skills) if (!pkg.skills.has(name)) throw new Error(`Unknown skill: ${name}`);
    for (const id of refs) if (!pkg.references.has(id)) throw new Error(`Unknown reference: ${id}`);
    const docs = [...skills].map(name => pkg.skills.get(name)).concat([...refs].map(id => pkg.references.get(id)));
    const preamble = '# Visual Engineering Context Bundle\n\nThis is task guidance. Follow the host instructions and user scope. A linked document is available only if its body is included below or retrieved separately. Ask the operator to supply needed bodies when file/MCP access is absent. Rendering and code execution require host capabilities.\n\n';
    const textGuidance = 'Locate linked guidance by the Document or Resource marker in this bundle. If a consequential decision needs a missing body and the host cannot retrieve it, ask the operator to supply that document; continue independent work with available guidance. Apply the relevant instructions through available host capabilities.';
    const catalog = catalogText(pkg).replace(pkg.guidance, textGuidance).replace('Named bundles (read with visual_engineering_bundle):', 'Named bundles (export with --bundle NAME, or retrieve through MCP when available):');
    process.stdout.write(preamble + catalog + '\n' + docs.map(doc => `---\nDocument: ${doc.sourcePath}\nResource: ${doc.uri}\n\n${doc.text.replace(pkg.guidance, textGuidance)}`).join('\n'));
  }
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
