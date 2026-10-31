// Product sync report (#5612): compare what the docs say about each bidder and module with what Prebid.js,
// Prebid Server (Go) and Prebid Server (Java) actually contain, and list where they disagree.
//
// Usage: node check-product-sync.js
//   PBJS_DIR      Prebid.js checkout with metadata/modules.json and modules/   (default _ext/Prebid.js)
//   PBS_GO_DIR    prebid-server checkout with static/bidder-info/                (default _ext/prebid-server)
//   PBS_JAVA_DIR  prebid-server-java checkout with src/main/resources/bidder-config/ (default _ext/prebid-server-java)
//   CHANGED_FILES optional newline-separated docs paths: findings on them become ::warning annotations
//   REPORT_DIR    optional directory for product-sync-report.md / .json
// It reports; it does not fail the build.
const fs = require('fs');
const path = require('path');

const PBJS = process.env.PBJS_DIR || '_ext/Prebid.js';
const PBS_GO = process.env.PBS_GO_DIR || '_ext/prebid-server';
const PBS_JAVA = process.env.PBS_JAVA_DIR || '_ext/prebid-server-java';

const read = file => fs.readFileSync(file, 'utf8');
const list = dir => (fs.existsSync(dir) ? fs.readdirSync(dir) : []);

function frontMatter(file) {
  // Jekyll accepts trailing spaces on the delimiter lines (e.g. dev-docs/analytics/yuktamedia.md).
  const match = read(file).match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  const data = {};
  if (match) {
    for (const line of match[1].split(/\r?\n/)) {
      const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
      if (kv) data[kv[1]] = kv[2].replace(/\s+#.*$/, '').replace(/^["']|["']$/g, '').trim();
    }
  }
  return data;
}
const yes = value => value === 'true';

// ---- Prebid.js: registered components (bidders incl. aliases, analytics, userId, rtd) and module files
const components = JSON.parse(read(path.join(PBJS, 'metadata/modules.json'))).components;
const pbjsBidders = new Map(components.filter(c => c.componentType === 'bidder').map(c => [c.componentName, c]));
const pbjsModules = new Set(list(path.join(PBJS, 'modules'))
  .filter(name => !name.startsWith('.') && !/\.(md|d\.ts)$/.test(name))
  .map(name => name.replace(/\.(js|ts)$/, '')));

// ---- Prebid Server Go: one static/bidder-info/<code>.yaml per bidder or alias
const pbsGo = new Map();
for (const file of list(path.join(PBS_GO, 'static/bidder-info')).filter(f => /\.ya?ml$/.test(f))) {
  const aliasOf = (read(path.join(PBS_GO, 'static/bidder-info', file)).match(/^aliasOf:\s*"?([^"\s]+)"?/m) || [])[1];
  pbsGo.set(file.replace(/\.ya?ml$/, ''), aliasOf || null);
}

// ---- Prebid Server Java: bidder-config/*.yaml, `adapters: <code>:` with nested `aliases: <alias>:`
const pbsJava = new Map();
for (const file of list(path.join(PBS_JAVA, 'src/main/resources/bidder-config')).filter(f => /\.ya?ml$/.test(f))) {
  let inAdapters = false, adapter = null, aliasIndent = -1;
  for (const line of read(path.join(PBS_JAVA, 'src/main/resources/bidder-config', file)).split(/\r?\n/)) {
    if (/^adapters:\s*$/.test(line)) { inAdapters = true; continue; }
    if (/^\S/.test(line)) { inAdapters = false; continue; }
    if (!inAdapters) continue;
    const top = line.match(/^ {2}([\w-]+):\s*$/);
    if (top) { adapter = top[1]; pbsJava.set(adapter, null); aliasIndent = -1; continue; }
    const aliases = line.match(/^( {4})aliases:\s*$/);
    if (aliases) { aliasIndent = 6; continue; }
    if (aliasIndent > 0) {
      const indent = line.match(/^( *)/)[1].length;
      if (line.trim() && indent < aliasIndent) aliasIndent = -1;
      const alias = line.match(/^ {6}([\w-]+):\s*$/);
      if (alias && aliasIndent > 0) pbsJava.set(alias[1], adapter);
    }
  }
}

// ---- Docs
const docs = dir => list(dir).filter(f => f.endsWith('.md')).map(f => ({ file: `${dir}/${f}`, ...frontMatter(path.join(dir, f)) }));
const bidderDocs = docs('dev-docs/bidders').filter(d => d.biddercode);
const moduleDocs = docs('dev-docs/modules').filter(d => d.module_code)
  .map(d => ({ ...d, code: d.module_code }))
  // The download page always appends "AnalyticsAdapter" to modulecode; a page whose modulecode already ends with it
  // names the module correctly but gets a doubled checkbox name (reported as a download finding below).
  .concat(docs('dev-docs/analytics').filter(d => d.modulecode).map(d => ({
    ...d,
    code: /AnalyticsAdapter$/.test(d.modulecode) ? d.modulecode : d.modulecode + 'AnalyticsAdapter',
    downloadCode: d.modulecode + 'AnalyticsAdapter',
  })))
  .concat(docs('dev-docs/modules/userid-submodules').filter(d => d.useridmodule).map(d => ({ ...d, code: d.useridmodule })));

// A removal noted in the docs (e.g. pbjs_version_notes: removed in 9.0) is acknowledged, not a finding.
const acknowledgedRemoval = doc => /remov|deprecat|not (supported|available)/i.test(doc.pbjs_version_notes || '');
const caseHint = (code, known) => {
  const other = [...known].find(k => k.toLowerCase() === code.toLowerCase() && k !== code);
  return other ? ` (case differs: the code is \`${other}\`)` : '';
};
const docsByCode = new Map();
for (const doc of bidderDocs) {
  const key = doc.biddercode.toLowerCase();
  docsByCode.set(key, (docsByCode.get(key) || []).concat(doc));
}

const findings = [];
const add = (category, file, message) => findings.push({ category, file, message });
const CATEGORIES = {
  download: 'Download page asks for a Prebid.js module that does not exist',
  notInPbjs: 'Docs say Prebid.js (`pbjs: true`), but Prebid.js has no such bidder code',
  undocumentedPbjs: 'Prebid.js bidder with no docs page',
  undocumentedPbjsAlias: 'Prebid.js alias with no docs page of its own',
  pbjsNotFlagged: 'Prebid.js bidder whose docs do not say `pbjs: true`',
  notInPbs: 'Docs say Prebid Server (`pbs: true`), but neither PBS Go nor PBS Java has the bidder',
  undocumentedPbs: 'Prebid Server bidder with no docs page',
  undocumentedPbsAlias: 'Prebid Server alias with no docs page of its own',
  pbsNotFlagged: 'Prebid Server bidder whose docs do not say `pbs: true`',
  missingModule: 'Module page names a Prebid.js module that does not exist',
  acknowledged: 'Removed from Prebid.js, as the page says (informational)',
};

for (const doc of bidderDocs) {
  const code = doc.biddercode;
  if (yes(doc.pbjs)) {
    const moduleCode = doc.filename || (doc.aliasCode ? doc.aliasCode + 'BidAdapter' : code + 'BidAdapter');
    if (acknowledgedRemoval(doc) && !pbjsBidders.has(code)) {
      // Acknowledged for Prebid.js only; the Prebid Server check below still applies.
      add('acknowledged', doc.file, `\`${code}\`: ${doc.pbjs_version_notes}`);
    } else {
      if (doc.enable_download !== 'false' && !pbjsModules.has(moduleCode)) {
        add('download', doc.file, `checkbox module \`${moduleCode}\` is not in Prebid.js \`modules/\`${caseHint(moduleCode, pbjsModules)}`);
      }
      if (!pbjsBidders.has(code)) {
        add('notInPbjs', doc.file, `\`${code}\`${caseHint(code, pbjsBidders.keys())}`);
      }
    }
  }
  // The Prebid.js and Prebid Server bidder codes can differ in case.
  // Keep biddercode as the PBJS identifier, using an explicit PBS code when supplied.
  const pbsCode = doc.pbs_biddercode || code;
  if (yes(doc.pbs) && !pbsGo.has(pbsCode) && !pbsJava.has(pbsCode)) {
    add('notInPbs', doc.file, `\`${pbsCode}\`${caseHint(pbsCode, new Set([...pbsGo.keys(), ...pbsJava.keys()]))}`);
  }
}

for (const [code, component] of pbjsBidders) {
  const pages = docsByCode.get(code.toLowerCase()) || [];
  const alias = component.aliasOf ? ` (alias of \`${component.aliasOf}\`)` : '';
  if (!pages.length) add(component.aliasOf ? 'undocumentedPbjsAlias' : 'undocumentedPbjs', null, `\`${code}\`${alias}`);
  else if (!pages.some(d => yes(d.pbjs))) add('pbjsNotFlagged', pages[0].file, `\`${code}\`${alias}`);
}

for (const code of new Set([...pbsGo.keys(), ...pbsJava.keys()])) {
  const where = [pbsGo.has(code) && 'Go', pbsJava.has(code) && 'Java'].filter(Boolean).join(' and ');
  const parent = pbsGo.get(code) || pbsJava.get(code);
  const label = `\`${code}\` (PBS ${where}${parent ? `, alias of \`${parent}\`` : ''})`;
  const pages = docsByCode.get(code.toLowerCase()) || [];
  if (!pages.length) add(parent ? 'undocumentedPbsAlias' : 'undocumentedPbs', null, label);
  else if (!pages.some(d => yes(d.pbs))) add('pbsNotFlagged', pages[0].file, label);
}

for (const doc of moduleDocs) {
  if (doc.downloadCode && doc.downloadCode !== doc.code && doc.enable_download !== 'false' && pbjsModules.has(doc.code)) {
    add('download', doc.file, `checkbox module \`${doc.downloadCode}\` does not exist: the download page appends "AnalyticsAdapter" to \`modulecode: ${doc.modulecode}\`, which should be \`${doc.code.replace(/AnalyticsAdapter$/, '')}\``);
  }
  if (pbjsModules.has(doc.code)) continue;
  if (acknowledgedRemoval(doc) || doc.enable_download === 'false') {
    add('acknowledged', doc.file, `\`${doc.code}\`${doc.pbjs_version_notes ? ': ' + doc.pbjs_version_notes : ' (enable_download: false)'}`);
  } else {
    add('missingModule', doc.file, `\`${doc.code}\`${caseHint(doc.code, pbjsModules)}`);
  }
}

// ---- Report
const counts = Object.keys(CATEGORIES).map(key => [key, findings.filter(f => f.category === key).length]);
let report = '## Docs vs. product sync report\n\n';
report += `Compared ${bidderDocs.length} bidder pages and ${moduleDocs.length} module pages with Prebid.js ` +
  `(${pbjsBidders.size} bidder codes, ${pbjsModules.size} modules), PBS Go (${pbsGo.size} bidders) and PBS Java (${pbsJava.size} bidders).\n\n`;
report += '| Finding | Count |\n| --- | --- |\n' + counts.map(([key, n]) => `| ${CATEGORIES[key]} | ${n} |`).join('\n') + '\n\n';
for (const [key, n] of counts) {
  if (!n) continue;
  report += `<details><summary>${CATEGORIES[key]} (${n})</summary>\n\n`;
  report += findings.filter(f => f.category === key)
    .map(f => `- ${f.file ? `\`${f.file}\`: ` : ''}${f.message}`).sort().join('\n') + '\n\n</details>\n\n';
}

console.log(report);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);
if (process.env.REPORT_DIR) {
  fs.mkdirSync(process.env.REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(process.env.REPORT_DIR, 'product-sync-report.md'), report);
  fs.writeFileSync(path.join(process.env.REPORT_DIR, 'product-sync-report.json'), JSON.stringify(findings, null, 2));
}
const changed = new Set((process.env.CHANGED_FILES || '').split(/\r?\n/).filter(Boolean));
for (const f of findings) {
  if (f.file && changed.has(f.file) && f.category !== 'acknowledged') {
    console.log(`::warning file=${f.file},title=${CATEGORIES[f.category].replace(/[`,]/g, '')}::${f.message.replace(/`/g, '')}`);
  }
}
