#!/usr/bin/env node
// Source compilation and one bounded formatting rule; no bundling or MDX execution.
// Internal Docusaurus APIs below are intentionally pinned and covered by fixtures.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';
import {isUtf8} from 'node:buffer';

const require = createRequire(import.meta.url);
const {loadSiteConfig} = require('@docusaurus/core/lib/server/config.js');
const {loadI18n} = require('@docusaurus/core/lib/server/i18n.js');
const {compileToJSX} = require('@docusaurus/mdx-loader/lib/utils.js');
const {getFormat} = require('@docusaurus/mdx-loader/lib/format.js');
const {DEFAULT_PARSE_FRONT_MATTER, Globby} = require('@docusaurus/utils');
const grayMatter = createRequire(require.resolve('@docusaurus/utils/lib/markdownUtils.js'))('@11ty/gray-matter');
const {normalizePluginOptions} = require('@docusaurus/utils-validation');
const docsOptions = require('@docusaurus/plugin-content-docs/lib/options.js');
const pagesOptions = require('@docusaurus/plugin-content-pages/lib/options.js');
const {readVersionNames, getVersionDocsDirPath} = require('@docusaurus/plugin-content-docs/lib/versions/files.js');
const {filterVersions} = require('@docusaurus/plugin-content-docs/lib/versions/version.js');
const classic = require('@docusaurus/preset-classic').default;
const COMPILER_VERSION = '3.10.2';
const RULE = 'remark-lint:fenced-code-flag';
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const relative = (root, file) => path.relative(root, file).split(path.sep).join('/');
const within = (root, file) => file.startsWith(`${root}${path.sep}`);
const markdownFile = file => /\.mdx?$/i.test(file);
const sorted = values => [...values].sort();

function packageVersion(name) {
  try { return require(`${name}/package.json`).version; }
  catch (error) { if (error.code !== 'ERR_PACKAGE_PATH_NOT_EXPORTED') throw error; }
  let directory = path.dirname(require.resolve(name));
  for (let depth = 0; depth < 5; depth++) {
    const file = path.join(directory, 'package.json');
    if (fs.existsSync(file)) {
      const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (manifest.name === name) return manifest.version;
    }
    directory = path.dirname(directory);
  }
  throw new Error(`Cannot identify the installed package version: ${name}`);
}

function compilerOptionIdentity(options) {
  const keys = ['remarkPlugins', 'rehypePlugins', 'recmaPlugins', 'beforeDefaultRemarkPlugins', 'beforeDefaultRehypePlugins'];
  return digest(JSON.stringify(Object.fromEntries(keys.map(key => [key, options[key]])), (_key, value) =>
    typeof value === 'function' ? {function_sha256: digest(value.toString())} : value));
}

function markdownSemantics(markdown) {
  const {hooks: _reportingHooks, ...semantics} = markdown;
  return JSON.parse(JSON.stringify(semantics, (_key, value) =>
    typeof value === 'function' ? {function_sha256: digest(value.toString())} : value));
}

function checkedFile(siteDir, file) {
  if (!within(siteDir, file) || fs.realpathSync(file) !== file || !fs.lstatSync(file).isFile()) {
    throw new Error(`Authored input must be a regular file inside the site, without symlink traversal: ${file}`);
  }
  return file;
}

function pluginTuple(entry) {
  return Array.isArray(entry) ? entry : [entry, {}];
}

function standardModuleKinds(siteDir) {
  const identities = new Map();
  function register(identity, kind) {
    const existing = identities.get(identity);
    if (existing && existing !== kind) throw new Error(`Ambiguous standard Docusaurus module identity: ${existing} and ${kind}`);
    identities.set(identity, kind);
  }
  const sourceRequire = createRequire(path.join(siteDir, 'package.json'));
  for (const kind of ['docs', 'pages', 'blog', 'classic']) {
    const name = kind === 'classic' ? '@docusaurus/preset-classic' : `@docusaurus/plugin-content-${kind}`;
    register(kind, kind); register(name, kind);
    for (const resolver of [require, sourceRequire]) {
      let resolved;
      try { resolved = resolver.resolve(name); }
      catch (error) { if (error.code === 'MODULE_NOT_FOUND') continue; throw error; }
      register(resolved, kind);
      // Compare exact installed exports; do not infer identity from a function
      // name or execute arbitrary plugin factories to discover what they do.
      const module = resolver(resolved);
      const factory = module.default ?? module;
      if (typeof factory !== 'function') throw new Error(`Unsupported standard Docusaurus module export: ${name}`);
      register(factory, kind);
    }
  }
  return identities;
}

export async function discoverAuthoredContent({siteDir, siteConfig}) {
  siteDir = fs.realpathSync(siteDir);
  if (siteConfig.i18n.locales.length !== 1) throw new Error('Authored-content selection currently supports one configured locale; expand selection before enabling translations.');
  const i18n = await loadI18n({siteDir, config: siteConfig, currentLocale: siteConfig.i18n.defaultLocale,
    automaticBaseUrlLocalizationDisabled: false});
  if (i18n.localeConfigs[i18n.currentLocale].translate) {
    throw new Error('Translated authored sources are unsupported, including automatic single-locale translations; add localized discovery before enabling translations.');
  }
  const moduleKinds = standardModuleKinds(siteDir);
  const plugins = [...siteConfig.plugins];
  for (const entry of siteConfig.presets) {
    const [preset, options] = pluginTuple(entry);
    if (moduleKinds.get(preset) !== 'classic') {
      throw new Error('Unsupported preset in authored-content selection; add explicit discovery instead of silently skipping content.');
    }
    plugins.push(...classic({siteConfig}, options).plugins);
  }
  const instances = [];
  const ignoredPlugins = [];
  const instanceIds = new Set();
  const selectionInputs = [];
  for (const entry of plugins) {
    const [plugin, provided] = pluginTuple(entry);
    if (plugin === false || plugin == null) continue;
    const kind = moduleKinds.get(plugin);
    if (kind === 'blog') throw new Error('Blog content is outside the authored-content selector; add discovery before enabling it.');
    if (kind === 'classic') throw new Error('The classic preset is not a content plugin; configure it under presets.');
    if (!kind) { ignoredPlugins.push(typeof plugin === 'function' ? `function:${plugin.name || 'anonymous'}` : String(plugin)); continue; }
    const options = (kind === 'docs' ? docsOptions : pagesOptions).validateOptions({validate: normalizePluginOptions, options: provided});
    options.id ??= 'default';
    const instanceId = `${kind}:${options.id}`;
    if (instanceIds.has(instanceId)) throw new Error(`Duplicate content instance: ${instanceId}`);
    instanceIds.add(instanceId);
    const versionNames = kind === 'docs' ? filterVersions(await readVersionNames(siteDir, options), options) : ['current'];
    if (!versionNames.length) throw new Error(`No selected versions for ${instanceId}`);
    if (kind === 'docs') {
      const versionFile = path.join(siteDir, `${options.id === 'default' ? '' : `${options.id}_`}versions.json`);
      if (fs.existsSync(versionFile)) selectionInputs.push(checkedFile(siteDir, versionFile));
    }
    for (const version of versionNames) {
      const root = version === 'current' ? path.resolve(siteDir, options.path) : getVersionDocsDirPath(siteDir, options.id, version);
      if (!within(siteDir, root) || fs.realpathSync(root) !== root) throw new Error(`Content root must be inside the site without symlinks: ${root}`);
      const allMarkdown = sorted(await Globby('**/*.{md,mdx}', {cwd: root, dot: true, caseSensitiveMatch: false, followSymbolicLinks: false}));
      const selected = sorted((await Globby(options.include, {cwd: root, ignore: options.exclude, followSymbolicLinks: false})).filter(markdownFile));
      if (kind === 'docs' && !selected.length) throw new Error(`No selected Markdown/MDX in ${instanceId}:${version}`);
      for (const name of selected) checkedFile(siteDir, path.join(root, name));
      instances.push({id: `${instanceId}:${version}`, kind, version, root, options, selected,
        excluded: allMarkdown.filter(name => !selected.includes(name))});
    }
  }
  if (!instances.some(instance => instance.selected.length)) throw new Error('No authored Markdown/MDX selected; an empty check cannot pass.');
  return {siteDir, instances, ignoredPlugins, selectionInputs: sorted(new Set(selectionInputs))};
}

function collectMdxImports(tree) {
  const imports = new Set();
  const seenEstree = new WeakSet();
  const seenMdx = new WeakSet();
  function visitEstree(node) {
    if (!node || typeof node !== 'object' || seenEstree.has(node)) return;
    seenEstree.add(node);
    if (['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration', 'ImportExpression'].includes(node.type)) {
      const source = node.source;
      const specifier = source?.type === 'TemplateLiteral' && source.expressions.length === 0
        ? source.quasis[0]?.value.cooked : source?.value;
      if (typeof specifier === 'string') imports.add(specifier);
    }
    for (const child of Object.values(node)) {
      if (Array.isArray(child)) child.forEach(visitEstree);
      else if (child && typeof child === 'object') visitEstree(child);
    }
  }
  function visit(node) {
    if (!node || typeof node !== 'object' || seenMdx.has(node)) return;
    seenMdx.add(node);
    visitEstree(node.data?.estree);
    // JSX spread attributes hold ESTree directly; named expression attributes
    // hold it on their value. Neither position is part of MDX's children list.
    for (const attribute of Array.isArray(node.attributes) ? node.attributes : []) {
      visit(attribute);
      visit(attribute.value);
    }
    for (const child of node.children ?? []) visit(child);
  }
  visit(tree);
  return [...imports];
}

function codeContext(tree, message) {
  const line = message.line ?? message.place?.start?.line;
  let match;
  function visit(node) {
    if (node.type === 'code' && node.position?.start?.line === line) match = node;
    for (const child of node.children ?? []) visit(child);
  }
  visit(tree);
  if (!match) throw new Error('Formatting diagnostic has no corresponding parsed code node; update the formatter adapter.');
  // Identical violations on identical code are counted, rather than collapsed.
  // Positions are deliberately absent so inserting prose does not reset a baseline.
  return digest(JSON.stringify({type: match.type, value: match.value, lang: match.lang ?? null, meta: match.meta ?? null}));
}

function positionOf(error) {
  const cause = error.cause ?? error;
  return {line: cause.line ?? cause.position?.start?.line ?? (cause.mark ? cause.mark.line + 1 : null),
    column: cause.column ?? cause.position?.start?.column ?? (cause.mark ? cause.mark.column + 1 : null)};
}

function parseFrontMatterWithoutStaleFailure(params) {
  // The pinned parser caches before parsing. An earlier failed parse otherwise
  // makes identical malformed input in a second file return empty frontmatter.
  grayMatter.clearCache();
  return DEFAULT_PARSE_FRONT_MATTER(params);
}

export async function compileAuthoredFile({filePath, fileContent, siteDir, siteConfig, options, formattingPlugin}) {
  const messages = [];
  let imports = [];
  let format = null;
  function captureDiagnostics() {
    return (tree, file) => {
      imports = collectMdxImports(tree);
      for (const message of file.messages) {
        const ruleId = `${message.source}:${message.ruleId}`;
        if (ruleId !== RULE) continue;
        messages.push({kind: 'formatting', rule_id: ruleId, context_sha256: codeContext(tree, message),
          message: message.reason, line: message.line ?? message.place?.start?.line ?? null,
          column: message.column ?? message.place?.start?.column ?? null});
      }
    };
  }
  try {
    grayMatter.clearCache();
    const {frontMatter} = await siteConfig.markdown.parseFrontMatter({filePath, fileContent, defaultParseFrontMatter: parseFrontMatterWithoutStaleFailure});
    format = getFormat({filePath, frontMatterFormat: frontMatter.mdx?.format, markdownConfigFormat: siteConfig.markdown.format});
    await compileToJSX({filePath, fileContent, frontMatter, compilerName: 'server', options: {
      ...options, siteDir, staticDirs: siteConfig.staticDirectories.map(directory => path.resolve(siteDir, directory)),
      markdownConfig: siteConfig.markdown,
      // Apply the established lint rule to the parser's actual tree in either format.
      remarkPlugins: [...options.remarkPlugins, formattingPlugin, captureDiagnostics],
    }});
    return {format, imports, diagnostics: messages, compiled: true};
  } catch (error) {
    const cause = error.cause ?? error;
    return {format, imports, compiled: false, diagnostics: [...messages, {kind: 'compilation', rule_id: 'docusaurus:source-compilation',
      message: cause.reason ?? cause.message, ...positionOf(error)}]};
  }
}

function formattingKey(row) {
  return JSON.stringify([row.path, row.instance, row.rule_id, row.context_sha256]);
}

export function compareFormatting(candidate, baseline) {
  for (const report of [candidate, baseline]) {
    if (report.schema_version !== 1 || report.kind !== 'authored-content-validation'
        || !report.documents?.length || !report.selection?.length || !Array.isArray(report.diagnostics)) {
      throw new Error('Empty or malformed authored-content report cannot be used for formatting comparison.');
    }
    for (const row of report.diagnostics) {
      if (!['compilation', 'formatting'].includes(row.kind)) throw new Error('Unknown authored diagnostic kind');
      if (row.kind === 'formatting' && (typeof row.path !== 'string' || !row.path || typeof row.instance !== 'string'
          || row.rule_id !== RULE || !/^[a-f0-9]{64}$/.test(row.context_sha256 ?? ''))) {
        throw new Error('Unbound formatting diagnostic cannot be compared.');
      }
    }
    if (report.compilation_failures !== report.diagnostics.filter(row => row.kind === 'compilation').length) {
      throw new Error('Compilation diagnostic count mismatch');
    }
  }
  if (baseline.compilation_failures !== 0) throw new Error('Baseline source compilation failed; it cannot establish an accepted formatting comparison.');
  if (!candidate.tool_sha256 || candidate.tool_sha256 !== baseline.tool_sha256) {
    throw new Error('Formatting reports were produced by different validator versions; regenerate both with the same validator.');
  }
  if (JSON.stringify(baseline.scope) !== JSON.stringify(candidate.scope)) {
    throw new Error('Formatting report scope mismatch; use the same locked compiler/rule and review selector changes explicitly.');
  }
  const remaining = new Map();
  for (const row of baseline.diagnostics.filter(item => item.kind === 'formatting')) {
    const key = formattingKey(row); remaining.set(key, (remaining.get(key) ?? 0) + 1);
  }
  const newFindings = [];
  let acceptedExisting = 0;
  for (const row of candidate.diagnostics.filter(item => item.kind === 'formatting')) {
    const key = formattingKey(row); const count = remaining.get(key) ?? 0;
    if (count) { remaining.set(key, count - 1); acceptedExisting++; }
    else newFindings.push(row);
  }
  return {new_findings: newFindings, accepted_existing: acceptedExisting,
    resolved_findings: [...remaining.values()].reduce((sum, count) => sum + count, 0),
    status: candidate.compilation_failures || newFindings.length ? 'failed' : 'passed',
    baseline_source_manifest_sha256: digest(JSON.stringify(baseline.documents)),
    candidate_source_manifest_sha256: digest(JSON.stringify(candidate.documents)),
    authority: 'Caller must obtain the baseline report from the independently pinned base source; this comparator does not choose or authorize a baseline.'};
}

export async function validateAuthoredContent({siteDir, siteConfig, siteConfigPath}) {
  siteDir = fs.realpathSync(siteDir);
  const compilerVersions = Object.fromEntries(['core', 'mdx-loader', 'utils', 'utils-validation', 'plugin-content-docs', 'plugin-content-pages', 'preset-classic']
    .map(name => [name, packageVersion(`@docusaurus/${name}`)]));
  if (Object.values(compilerVersions).some(version => version !== COMPILER_VERSION)) throw new Error('Unsupported Docusaurus internal API version; revalidate the adapter before changing the compiler pin.');
  const formatterVersion = packageVersion('remark-lint-fenced-code-flag');
  const runtimeLockPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'package-lock.json');
  const runtimeLockSha = digest(fs.readFileSync(runtimeLockPath));
  const formattingPlugin = (await import('remark-lint-fenced-code-flag')).default;
  const discovery = await discoverAuthoredContent({siteDir, siteConfig});
  const lintConfigPath = path.join(siteDir, '.markdownlint.json');
  const lintConfig = JSON.parse(fs.readFileSync(lintConfigPath, 'utf8'));
  if (lintConfig.MD040 === false || (lintConfig.default === false && lintConfig.MD040 !== true)) {
    throw new Error('The selected formatting rule mirrors enabled MD040; review the validator contract if repository lint policy disables it.');
  }
  const documents = [];
  const diagnostics = [];
  for (const instance of discovery.instances) {
    const pending = instance.selected.map(name => ({file: path.join(instance.root, name), role: 'selected'}));
    const seen = new Set();
    for (let index = 0; index < pending.length; index++) {
      const {file, role} = pending[index];
      if (seen.has(file)) continue;
      seen.add(file); checkedFile(siteDir, file);
      const bytes = fs.readFileSync(file);
      const result = isUtf8(bytes)
        ? await compileAuthoredFile({filePath: file, fileContent: bytes.toString('utf8'), siteDir, siteConfig, options: instance.options, formattingPlugin})
        : {format: null, imports: [], compiled: false, diagnostics: [{kind: 'compilation', rule_id: 'source:utf8',
          message: 'Markdown/MDX source is not valid UTF-8.', line: null, column: null}]};
      const sourcePath = relative(siteDir, file);
      documents.push({path: sourcePath, instance: instance.id, role, format: result.format,
        sha256: digest(bytes), bytes: bytes.length, compiled: result.compiled});
      diagnostics.push(...result.diagnostics.map(row => ({path: sourcePath, instance: instance.id, ...row})));
      for (const specifier of result.imports) {
        if (!markdownFile(specifier)) continue;
        const imported = specifier.startsWith('@site/') ? path.resolve(siteDir, specifier.slice(6))
          : specifier.startsWith('.') ? path.resolve(path.dirname(file), specifier) : null;
        if (!imported) throw new Error(`Unsupported Markdown import alias in ${sourcePath}: ${specifier}`);
        if (!within(instance.root, imported)) {
          throw new Error(`Cross-root Markdown/MDX import in ${sourcePath}: ${specifier}; only imports within ${relative(siteDir, instance.root)} are supported until compiler ownership is resolved.`);
        }
        if (discovery.instances.filter(owner => within(owner.root, imported)).length > 1) {
          throw new Error(`Ambiguous content-root ownership for Markdown/MDX import in ${sourcePath}: ${specifier}`);
        }
        try { checkedFile(siteDir, imported); }
        catch (error) {
          diagnostics.push({path: sourcePath, instance: instance.id, kind: 'compilation', rule_id: 'docusaurus:markdown-import',
            message: `Cannot validate imported Markdown/MDX ${specifier}: ${error.message}`, line: null, column: null});
          continue;
        }
        pending.push({file: imported, role: 'imported_partial'});
      }
    }
  }
  const scope = {compiler: COMPILER_VERSION, formatter: formatterVersion, rule: RULE, runtime_lock_sha256: runtimeLockSha,
    selector: 'classic-docs-pages-and-explicit-markdown-imports-v2',
    markdown: markdownSemantics(siteConfig.markdown),
    instances: discovery.instances.map(instance => ({id: instance.id, root: relative(siteDir, instance.root),
      include: instance.options.include, exclude: instance.options.exclude, admonitions: instance.options.admonitions,
      configured_compiler_plugins_sha256: compilerOptionIdentity(instance.options)}))};
  const compilationFailures = diagnostics.filter(row => row.kind === 'compilation');
  const identities = sorted(new Set([...discovery.selectionInputs, lintConfigPath, ...(siteConfigPath ? [siteConfigPath] : [])]));
  for (const file of identities) checkedFile(siteDir, file);
  const sourceInputs = identities.map(file => ({path: relative(siteDir, file), sha256: digest(fs.readFileSync(file))}));
  const lockPath = path.join(siteDir, 'package-lock.json');
  return {schema_version: 1, kind: 'authored-content-validation', scope, compiler_versions: compilerVersions,
    tool_sha256: digest(fs.readFileSync(fileURLToPath(import.meta.url))), node: process.version, source_root: siteDir,
    input_metadata: sourceInputs, source_lock_sha256: fs.existsSync(lockPath) ? digest(fs.readFileSync(lockPath)) : null,
    runtime_lock_path: runtimeLockPath,
    selection: discovery.instances.map(instance => ({id: instance.id, root: relative(siteDir, instance.root),
      include: instance.options.include, exclude: instance.options.exclude,
      selected: instance.selected.length, excluded_files: instance.excluded})), ignored_plugins: discovery.ignoredPlugins,
    coverage: {compilation_units: documents.length, unique_files: new Set(documents.map(row => row.path)).size,
      md: documents.filter(row => row.format === 'md').length, mdx: documents.filter(row => row.format === 'mdx').length,
      imported_partials: documents.filter(row => row.role === 'imported_partial').length},
    documents, diagnostics, formatting: {findings: diagnostics.filter(row => row.kind === 'formatting').length,
      verdict: 'observations_only_until_compared_with_independently_pinned_baseline'},
    compilation_failures: compilationFailures.length,
    status: compilationFailures.length ? 'failed' : 'compiled',
    limitations: [
      'Source compilation only: emitted JSX is not evaluated, bundled, rendered, or typechecked for component props.',
      'The pinned default frontmatter parser cache is cleared before each parse so a failed parse cannot clear identical malformed input in a later file.',
      'Formatting is limited to the established fenced-code-flag rule corresponding to enabled MD040, using the compiler AST. Other markdownlint rules are not asserted for MDX.',
      'Reported parser positions refer to Docusaurus-preprocessed input; configured preprocessors may change source positions.',
      'Classic preset docs/pages and explicit standard docs/pages plugins are recognized by package names, resolved installed paths, or exact installed factory exports. Arbitrary wrappers and other plugins are listed but not lifecycle-executed.',
      'Selected versions and one untranslated locale are supported. Explicit or automatically enabled translations are rejected until localized discovery is implemented.',
      'Static imports, re-exports, and literal dynamic relative or @site imports ending .md/.mdx are followed only within their unique importing content root. Cross-root imports and overlapping content-root ownership are rejected until compiler ownership and fallback options are modeled.',
      'Indirect imports through JS/TS, non-literal dynamic imports, extensionless imports, query-suffixed imports, and bundler aliases still require the site build.',
      'Per-version Markdown link resolution, final route/anchor/asset checks, metadata semantics, domain component contracts, and production fidelity remain separate checks.',
      'Config and remark/rehype plugins execute trusted build-time code; run this check in the same unprivileged environment as a PR build.',
      'The runtime lock identifies the validator dependency declaration. The orchestrator must establish a matching locked installation; the source tree may have a different historical lock.',
    ]};
}

export async function main(argv = process.argv.slice(2)) {
  const {values} = parseArgs({args: argv, options: {'site-dir': {type: 'string', default: process.cwd()}, out: {type: 'string'}, 'baseline-report': {type: 'string'}}});
  const siteDir = fs.realpathSync(values['site-dir']);
  const {siteConfig, siteConfigPath} = await loadSiteConfig({siteDir});
  const report = await validateAuthoredContent({siteDir, siteConfig, siteConfigPath});
  if (values['baseline-report']) {
    const bytes = fs.readFileSync(values['baseline-report']);
    report.comparison = {...compareFormatting(report, JSON.parse(bytes)), baseline_report_sha256: digest(bytes)};
  }
  if (values.out) fs.writeFileSync(values.out, `${JSON.stringify(report, null, 2)}\n`, {flag: 'wx'});
  console.log(JSON.stringify({status: report.status, coverage: report.coverage, compilation_failures: report.compilation_failures,
    formatting_findings: report.formatting.findings, comparison: report.comparison ? {status: report.comparison.status,
      new_findings: report.comparison.new_findings.length, accepted_existing: report.comparison.accepted_existing} : null}));
  if (report.status === 'failed' || report.comparison?.status === 'failed') process.exitCode = 1;
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
