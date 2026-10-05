// Executes first-party TSX components through React SSR. CSS lookup is stubbed;
// no browser hydration, stylesheet appearance, or network behavior is implied.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

const require = createRequire(import.meta.url);
export function componentHarness({root = path.resolve('src/components'), overrides = {}} = {}) {
  root = fs.realpathSync(root);
  const cache = new Map(); const inputs = {};
  const load = file => {
    file = path.resolve(file);
    if (!file.startsWith(root + path.sep) || fs.realpathSync(file) !== file) throw new Error('Component fixture must stay within its source root');
    if (cache.has(file)) return cache.get(file).exports;
    const original = fs.readFileSync(file, 'utf8'); const source = overrides[file] ?? original;
    inputs[path.relative(root, file)] = crypto.createHash('sha256').update(source).digest('hex');
    const module = {exports: {}}; cache.set(file, module);
    if (file.endsWith('.css')) {
      module.exports = Object.fromEntries([...source.matchAll(/\.([A-Za-z][\w-]*)/g)].map(match => [match[1], match[1]]));
      return module.exports;
    }
    const {outputText, diagnostics} = ts.transpileModule(source, {fileName: file, reportDiagnostics: true,
      compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true}});
    if (diagnostics?.some(item => item.category === ts.DiagnosticCategory.Error)) throw new Error('Component transpilation failed');
    const importModule = name => {
      if (['react', 'fs', 'path'].includes(name)) return require(name);
      if (!name.startsWith('.')) throw new Error(`Unreviewed component dependency: ${name}`);
      const base = path.resolve(path.dirname(file), name);
      const found = [base, `${base}.ts`, `${base}.tsx`, `${base}/index.tsx`].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
      if (!found) throw new Error(`Missing component dependency: ${name}`);
      return load(found);
    };
    const execute = new vm.Script(`(function(require,module,exports){${outputText}\n})`, {filename: file}).runInThisContext();
    execute(importModule, module, module.exports);
    return module.exports;
  };
  return {loadModule: load, render(name, props) {
    const component = load(path.join(root, name, 'index.tsx')).default;
    return renderToStaticMarkup(React.createElement(component, props));
  }, inputs};
}
