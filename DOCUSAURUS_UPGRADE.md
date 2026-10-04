# Docusaurus 3.10.2 upgrade assessment

For the consolidated proposed sequence and acceptance criteria, see the
[execution plan](DOCUSAURUS_EXECUTION_PLAN.md). This assessment retains the
evidence and limits of the package upgrade.

Assessed on October 4, 2026. The starting point is the upstream `docusaurus`
branch at `ca35845fab8072d48c7a8ef39a125dca97b79366`.

## Changes made

* Upgraded and pinned all five directly declared Docusaurus packages to `3.10.2`:
  core, preset-classic, module-type-aliases, tsconfig, and types.
* Regenerated `package-lock.json`. The other direct dependencies retain their
  previously locked versions.
* Moved `onBrokenMarkdownLinks` into `markdown.hooks`, removing the deprecated
  top-level configuration without changing its current migration-time policy.
* Updated the README's Docusaurus version and npm installation/build instructions.

The official [version list](https://docusaurus.io/versions) and npm's `latest`
tag both identify `3.10.2` as the current stable version. Docusaurus 4 is a canary,
not the target of this upgrade. All Docusaurus packages should use matching
versions; see the [upgrade instructions](https://docusaurus.io/docs/installation#updating-your-docusaurus-version).

## Verification

The upgrade was installed and built with Node.js `24.18.0` and npm `11.16.0`.
The earlier 3.9.2 production-build baseline used Node.js `20.17.0`, so build-time
differences cannot be attributed solely to Docusaurus.

| Check | Result |
| --- | --- |
| Clean locked installation | `npm ci --offline --ignore-scripts --no-audit --no-fund` passed using a populated temporary npm cache |
| Dependency consistency | `npm ls --all --json` passed without dependency-tree problems |
| Production build | `npm run build` passed; 1,239 HTML files emitted |
| Generated route keys | 1,254 before and after; no added or removed keys |
| Broken link references | 581 before and after; identical source-page/target pairs |
| Broken anchor references | 100 before and after; identical source-page/target pairs |
| Docusaurus source/configuration typecheck | Passed on both versions with the same 19 project source/configuration files selected |
| Repository-wide `tsc --noEmit` | Fails on both versions with the same 15 syntax errors in two legacy Jekyll JavaScript files |
| Browser smoke check | Homepage, Prebid.js navigation, an AdDefend bidder page with its custom features component, and the download route rendered; no captured console errors or warnings in those checks |
| Documentation lint | README and this assessment pass the repository's Markdown configuration |
| Legacy Jekyll build | Not run: `bundle check` reports missing Gemfile dependencies |

The scoped typecheck used a temporary tsconfig extending the repository's
`tsconfig.json` and explicitly including `src/**/*`, `_plugins/**/*.ts`,
`docusaurus.config.ts`, and `sidebars*.ts`. The selected project files were
enumerated with `--listFilesOnly`. This checks the Docusaurus source/configuration;
it is not a claim that legacy assets or MDX examples pass TypeScript checking.

The build's broken-link policy is still `warn`, and Markdown-link handling is
still `ignore`. A successful build is therefore not a production-readiness gate.
The upgraded build also emitted non-fatal Webpack cache snapshot warnings;
persistent build-cache effectiveness has not been established.

## Accompanying upgrades and decisions

### 1. Standardize the Node.js environment

Docusaurus 3.10.2 requires Node.js 20 or later. However, Node.js 20 and 18 are now
end-of-life; use a supported LTS line, preferably Node.js 24 for this branch.
See the official [Node.js release table](https://nodejs.org/en/about/previous-releases).

The project still declares `node >=20.0`, has no checked-in Node version pin,
uses Node.js 18 in `.github/workflows/code-path-changes.yml`, and supplies a
Jekyll devcontainer. The notification workflow installs dependencies from the
repository root, so its runtime is already below the package's declared minimum.

Next: align a Node version pin, the engine policy, CI, and the development
container. This upgrade used an already installed Node.js 24 runtime without
changing the machine's default Node installation.

### 2. Refresh and triage transitive dependencies

The npm audit snapshot changed as follows:

| npm severity | Original lockfile | Upgraded lockfile |
| --- | ---: | ---: |
| Low | 4 | 2 |
| Moderate | 11 | 9 |
| High | 46 | 35 |
| Critical | 2 | 2 |
| Total affected-package entries | 63 | 48 |

There were no newly flagged package names or newly introduced advisory URLs in
the upgraded tree. These are npm's dependency-graph findings, including
propagated/transitive entries, not 48 independently verified exploitable issues
in the deployed static website. Build tooling and the local development server
must be assessed separately from generated browser assets.

Examples of remaining flagged packages with npm-reported fixes include
`@babel/runtime`, `lodash`, `webpack`, `webpack-dev-server`, `shell-quote`, and
`websocket-driver`. Other findings, including the `braces` dependency chain,
report no available fix. A targeted transitive dependency refresh and exposure
review should follow; do not use a forced major-version audit fix as a substitute
for compatibility verification. This change does not attempt that broader refresh.

### 3. Make validation part of the repository

The existing CI workflow lints Markdown on `master`; it does not build this
Docusaurus branch. Add a Docusaurus build check for pull requests targeting the
migration branch and pin its runtime to the agreed Node.js LTS version.

The root TypeScript configuration currently includes legacy files such as
`assets/js/prebid-api-doc.js` and `assets/js/video/pb-ve-jwplayer-platform-m.js`.
They fail parsing before a useful whole-project typecheck can finish. Add an
explicit Docusaurus source scope and a `typecheck` script, keeping any intended
legacy-JavaScript validation separate. This upgrade has not changed that scope.

After the migration backlog is repaired, make broken links and anchors fail CI.
Until then, preserve and compare the explicit warning inventory.

### 4. Consider other direct dependencies separately

The following npm versions were queried during this assessment:

| Dependency | Locked after this upgrade | Latest observed | Recommendation |
| --- | --- | --- | --- |
| React / React DOM | 19.2.4 / 19.2.4 | 19.3.0 / 19.3.0 | Compatible with Docusaurus's React 19 peer range; consider a paired update with browser checks |
| TypeScript | 5.9.3 | 7.0.2 | Separate major-version evaluation after making the typecheck scope useful |
| MDX React | 3.1.1 | 3.1.1 | No accompanying update indicated |
| clsx | 2.1.1 | 2.1.1 | No accompanying update indicated |
| prism-react-renderer | 2.4.1 | 2.4.1 | No accompanying update indicated |

React 19 and MDX 3 are already supported by Docusaurus 3.10.2. No custom-component
API changes were required for the production build or scoped typecheck.

### 5. Adopt optional Docusaurus features deliberately

[Docusaurus 3.10](https://docusaurus.io/blog/releases/3.10) stabilizes the Faster
build system and adds preparation flags for version 4. Faster can be evaluated
separately with build correctness and timing comparisons. Do not enable all
`future.v4` flags as part of a routine 3.10.2 upgrade: those flags intentionally
opt into upcoming behavior changes, including stricter MDX compatibility rules.

The existing `markdown.format: 'detect'` setting and the theme's spread of
`@theme-original/MDXComponents` remain in place. The latter preserves heading
registration and internal-link validation.

## Migration work still outstanding

The framework upgrade does not complete the Jekyll migration:

* Reconcile the migration branch with newer production documentation. At the
  assessment snapshot it was 517 commits behind `master`, with a July 2025
  common ancestor.
* Migrate remaining legacy sections, including Ad Ops and supporting guides.
* Implement the custom download form, unfinished bidder/API/module listings,
  and 22 `IncludeTodo` instances across 21 documentation files.
* Resolve the 581 broken link references and 100 broken anchor references.
* Decide the Prebid.js version policy: the full migrated documentation remains
  under `/dev-docs/prebidjs/next`, while the small `0.0.1` sample occupies the
  default version route. The bidder-data plugin also only processes `current`.
* Complete site search, homepage content, navigation, and legacy URL handling.
  The migration plan currently chooses not to preserve old developer-documentation
  URLs; review that decision before the public cutover.
* Establish Docusaurus deployment and domain handling. Production Pages still
  builds from `master` using its legacy configuration.
* Refresh the migration notes and `CLAUDE.md`, which contain stale version,
  broken-link-policy, and phase-completion statements.

No production deployment, backend download-service integration test, exhaustive
browser/accessibility audit, or complete advisory exploitability analysis was
performed as part of this framework upgrade.
