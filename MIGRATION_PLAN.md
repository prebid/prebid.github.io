# Prebid Documentation Migration Plan: Jekyll to Docusaurus

## Overview
This document outlines the step-by-step migration plan for converting the Prebid documentation from Jekyll to Docusaurus. The migration will be done in small, manageable steps to ensure quality and maintainability.

## Current State Analysis

- **Current Platform**: Jekyll-based documentation
- **Target Platform**: Docusaurus 3.x
- **Existing Docusaurus Setup**: Partially configured with basic structure
- **Current Docs Structure**: Mixed Jekyll and Docusaurus content

## Target Folder Structure

```
docs/
├── content/                # Main documentation
│   ├── download/
│   ├── formats/
│   │   ├── display/
│   │   ├── video/
│   │   ├── native/
│   │   ├── ctv/
│   │   ├── amp/
│   │   ├── audio/
│   │   └── interstitial/
│   └── guides/
│       ├── ad-ops/
│       ├── privacy/
│       ├── sustainability/
│       └── identity/
└── dev-docs/              # Versioned documentation
    ├── prebidjs/          # Versioned
    ├── prebid-server/
    │   ├── java/          # Versioned
    │   └── go/            # Versioned
    ├── prebid-mobile/
    │   ├── ios/           # Versioned
    │   └── android/       # Versioned
    └── tools/
        ├── line-item-manager/
        └── professor-prebid/
```

## Migration Steps

### Phase 1: Foundation Setup ✅ (Complete)

- [x] Basic Docusaurus configuration
- [x] Custom tocPlugin implementation
- [x] Initial docs structure setup
- [x] **Step 1.1**: Create target folder structure
- [x] **Step 1.2**: Generate sample files in each target directory
- [x] **Step 1.3**: Configure Docusaurus plugins for versioned documentation

### Phase 2: Layout and Include Components Migration ✅ (Complete)

- [x] **Step 2.1**: Create React components for essential layouts
- [x] **Step 2.2**: Create React components for essential includes
- [x] **Step 2.3**: Identify and remove unnecessary layouts/includes
- [x] **Step 2.4**: Move bidders directory

### Phase 3: Content Migration - Overview Section ✅ (Complete)

- [x] **Step 3.1**: Migrate overview/ directory content
  - [x] Move overview/ files to docs/content/ using git mv
  - [x] Update frontmatter and links for key files (intro.mdx, intro-to-header-bidding, glossary, analytics, what-is-post-bid)
  - [x] Remaining overview files moved, awaiting full conversion

### Phase 3.5: Fix Build Blocker ⏳ (Next)

The build currently fails with **472 broken links** caused by boilerplate Docusaurus template links in the footer and homepage that point to non-existent routes (`/docs/intro` and `/blog`).

- [ ] **Step 3.5.1**: Fix footer links in `docusaurus.config.ts` (lines ~144-182)
  - [ ] Change `/docs/intro` → `/intro` (the real overview page)
  - [ ] Remove `/blog` link (blog is disabled)
  - [ ] Update copyright from "My Project, Inc." → "Prebid.org"
- [ ] **Step 3.5.2**: Fix homepage link in `src/pages/index.js` (line ~20)
  - [ ] Change `/docs/intro` → `/intro`
  - [ ] Update button label to "Get Started with Prebid"
- [ ] **Step 3.5.3**: Verify build passes with `npm run build`

### Phase 4: Content Migration - Prebid.js Documentation ✅ (Mostly Complete)

**Scope: 372 files in `dev-docs/`** (bidders already migrated separately)

Migration script created and all batches processed. ~367 files migrated, 5 deferred.

- [x] **Step 4.0**: Created migration script (`scripts/migrate-devdocs.mjs`)
- [x] **Step 4.1**: Migrated analytics adapters (69 files including `_category_.json`)
- [x] **Step 4.2**: Migrated UserID submodules (64 files including `_category_.json`)
- [x] **Step 4.3**: Migrated remaining modules (115 files) — **4 files deferred** (see below)
- [x] **Step 4.4**: Migrated publisher API reference (52 files including `_category_.json`)
- [x] **Step 4.5**: Migrated root-level dev-docs guides (41 files) — **1 file deferred** (`pbs-bidders.md`)
- [x] **Step 4.6**: Migrated examples, plugins, requirements, internal-api
- [ ] **Step 4.7**: Update sidebar configuration and test versioning

#### Deferred: Files requiring custom MDX components

These 5 files use Liquid `site.pages` queries to dynamically build tables from other pages' frontmatter. They cannot be converted with the migration script and need a custom Docusaurus plugin or MDX component that reads from a generated JSON manifest:

| File | What it does |
|---|---|
| `dev-docs/modules/index.md` | Queries `page_type: "module"` pages, renders 4 filtered tables (Recommended, General, Vendor-Specific, User ID) |
| `dev-docs/modules/userId.md` | Queries `layout: "userid"` pages, renders Sub-Modules table and dynamic `name` values list |
| `dev-docs/modules/consentManagementUsp.md` | Queries bidder pages for USP support flags |
| `dev-docs/modules/consentManagementGpp.md` | Queries bidder pages for GPP support flags |
| `dev-docs/pbs-bidders.md` | Queries bidder `site.pages` with `{% for %}`, `{% unless %}`, `{% case %}` |

**Recommended approach**: Extend `_plugins/toc-plugin.ts` to also scan module and userid frontmatter at build time, outputting a `modules.json` (similar to existing `bidders.json`). Then create MDX components that import and render from this data.

### Phase 5: Content Migration - Prebid Server Documentation ✅ (Complete)

- [x] **Step 5.1**: Migrated 70 files using `scripts/migrate-devdocs.mjs` across 10 subdirectories
- [x] **Step 5.2**: Post-migration fixes (stripped `{%raw%}` tags, rewrote ~373 link prefixes, fixed MDX compatibility)
- [x] **Step 5.3**: Build passes successfully, spot-checked critical files
- Skipped root-level `hosted-servers.md` (duplicate). Left `java/` and `go/` stubs in place.

### Phase 6: Content Migration - Prebid Mobile Documentation

- [ ] **Step 6.1**: Copy prebid-mobile content to docs/dev-docs/prebid-mobile/
  - [ ] Move file by file using git mv, preserving structure
  - [ ] Separate iOS and Android documentation
  - [ ] Update frontmatter and links
  - [ ] Configure versioning for both platforms
  - [ ] Test versioning functionality

### Phase 7: Content Migration - Guides

- [ ] **Step 7.1**: Copy guide content to docs/content/guides/
  - [ ] Move file by file using git mv, preserving structure
  - [ ] Organize into subdirectories (ad-ops, privacy, etc.)
  - [ ] Update frontmatter and links
  - [ ] Fix any Jekyll-specific syntax
  - [ ] Test navigation and links

### Phase 8: Content Migration - Formats

- [ ] **Step 8.1**: Copy formats content to docs/content/formats/
  - [ ] Move file by file using git mv, preserving structure
  - [ ] Organize into subdirectories
  - [ ] Update frontmatter and links
  - [ ] Fix any Jekyll-specific syntax
  - [ ] Test navigation and links

### Phase 9: Content Migration - Tools Documentation

- [ ] **Step 9.1**: Copy tools content to docs/dev-docs/tools/
  - [ ] Move file by file using git mv, preserving structure
  - [ ] Organize into subdirectories
  - [ ] Update frontmatter and links
  - [ ] Fix any Jekyll-specific syntax
  - [ ] Test navigation and links

### Phase 10: Content Migration - Remaining Sections

- [ ] **Step 10.1**: Migrate remaining content sections
  - [ ] features/ directory
  - [ ] troubleshooting/ directory
  - [ ] support/ directory
  - [ ] faq/ directory
  - [ ] policies/ directory
  - [ ] identity/ directory
  - [ ] prebid/ directory
  - [ ] prebid-video/ directory
  - [ ] adops/ directory

### Phase 11: Layout and Include Components Analysis

- [ ] **Step 11.1**: Analyze _layouts/ directory usage
  - [ ] Identify which markdown files use each layout
  - [ ] Create React components for needed layouts
  - [ ] Update migrated content to use new components
  - [ ] Remove unused layouts

- [ ] **Step 11.2**: Analyze _includes/ directory usage
  - [ ] Identify which markdown files use each include
  - [ ] Create React components for needed includes
  - [ ] Update migrated content to use new components
  - [ ] Remove unused includes

### Phase 12: Download Page Migration

- [ ] **Step 12.1**: Analyze current download.md structure
- [ ] **Step 12.2**: Create React component for download page
- [ ] **Step 12.3**: Migrate JavaScript functionality
- [ ] **Step 12.4**: Integrate with Firebase API
- [ ] **Step 12.5**: Test download functionality

### Phase 13: Final Cleanup and Testing

- [ ] **Step 13.1**: Create comprehensive migration checklist
- [ ] **Step 13.2**: Identify unmigrated files
- [ ] **Step 13.3**: Test all navigation and links
- [ ] **Step 13.4**: Validate search functionality
- [ ] **Step 13.5**: Performance testing
- [ ] **Step 13.6**: Create MIGRATION.md for tracking

## URL Preservation Policy

- **Preserve**: `/download`, `/` (home) — these are already correctly routed in Docusaurus
- **Don't need to preserve**: Adapter/module/dev-docs content — these get new URLs under `/dev-docs/prebidjs/` etc.

## Files to NOT Migrate

- consentmanager (excluded per requirements)
- algolia site search (excluded per requirements)

## Technical Requirements

### Content Migration Requirements

- **Always use `git mv` instead of `cp`**: This maintains git history and makes merges easier
- **Preserve file structure**: Maintain the original directory organization where possible
- **Update frontmatter**: Convert Jekyll frontmatter to Docusaurus format
- **Fix internal links**: Update all internal links to match new structure
- **Convert Jekyll syntax**: Replace Liquid templates and Jekyll-specific includes with React components
- **Replace includes with IncludeTodo component**: Use `<IncludeTodo include="{% include ... %}"/>` for unmigrated includes
- **If a markdown file requires a React component, change its extension from `.md` to `.mdx` using `git mv`**
- **When batch-migrating with a script, verify each batch with `npm run build` and spot-checks**
- **Build validation**: `npm run build` should not have any errors after each migration step

### Conversion Patterns (Jekyll → Docusaurus)

These are the specific transformations needed for each file:

| Jekyll Pattern | Docusaurus Replacement |
|---|---|
| `layout: page_v2` (and all layout values) | Remove entirely (Docusaurus handles via directory) |
| `sidebarType: 1` | Remove entirely |
| `{: .no_toc}` / `* TOC` / `{:toc}` | Remove (Docusaurus auto-generates TOC) |
| `{: .table .table-bordered .table-striped }` | Remove (use default table styling) |
| `{{ site.baseurl }}/path` | `/path` |
| `{{ site.github.url }}/path` | Direct GitHub URL |
| `.html` in internal links | Remove extension (clean URLs) |
| `{{ site.baseurl }}/assets/images/...` | `/images/...` (static/ dir has copies) |
| `{% include alerts/alert_warning.html content="..." %}` | `:::warning\n...\n:::` |
| `{% include alerts/alert_note.html content="..." %}` | `:::note\n...\n:::` |
| `{% include alerts/alert_tip.html content="..." %}` | `:::tip\n...\n:::` |
| `{% include alerts/alert_important.html content="..." %}` | `:::caution\n...\n:::` |
| `{% capture var %}...{% endcapture %}` + `{% include alerts/... content=var %}` | Extract captured content into `:::warning\n...\n:::` admonition (21 files, 36 instances) |
| `{% include dev-docs/loads-external-javascript.md %}` | Inline as `:::warning Disclosure` admonition |
| `{% include legal-warning.html %}` | `<LegalWarning />` (existing component, requires .mdx) |
| `{% include dev-docs/vendor-exception.md %}` | Inline as `:::warning` admonition |
| `{% include code/web-example.html ... %}` | `<IncludeTodo />` placeholder (requires .mdx) |
| `{% assign %}`, `{% for %}`, `site.pages` | **Manual conversion** — cannot be auto-migrated |

### Available React Components (in `src/components/DevDocs/`)

| Component | Replaces | Import Path |
|---|---|---|
| `IncludeTodo` | Placeholder for any unmigrated include | `@site/src/components/IncludeTodo` |
| `LegalWarning` | `{% include legal-warning.html %}` | `@site/src/components/DevDocs` |
| `StorageAllowed` | Storage config warning | `@site/src/components/DevDocs` |
| `Fingerprinting` | Fingerprinting API warning | `@site/src/components/DevDocs` |
| `DefaultKeywordTargeting` | Keyword targeting table | `@site/src/components/DevDocs` |
| `SendAllBidsKeywordTargeting` | Send-all-bids table | `@site/src/components/DevDocs` |
| `PbjsAdapterRequiredForPbs` | PBS adapter requirement warning | `@site/src/components/DevDocs` |

### IncludeTodo Component

Located at `src/components/IncludeTodo.tsx`. It:

- Accepts an `include` prop containing the original Jekyll include string
- Renders a red warning box saying "this include is not yet migrated"
- Displays the include string in monospace for reference
- Used as a temporary placeholder while includes are being migrated to React components

### Download Page

- Maintain current functionality
- Support Firebase integration
- Preserve module selection logic
- Keep version compatibility checks

### tocPlugin Enhancement

- Support multiple content sources
- Generate JSON files for overview pages
- Handle versioned content properly
- Maintain current filtering capabilities

## Success Criteria

- [ ] All documentation accessible via Docusaurus
- [ ] Version dropdowns work correctly for all projects
- [ ] Download page functions as expected
- [ ] All internal links work correctly
- [ ] Search functionality works
- [ ] Performance is acceptable
- [ ] No broken links or missing assets

## Risk Mitigation

- **Content Loss**: Create backups before each migration step
- **Link Breaking**: Use automated link checking tools
- **Version Conflicts**: Test versioning thoroughly
- **Performance Issues**: Monitor build times and page load speeds

## Files Requiring Manual Conversion

These files use `site.pages` queries and Liquid loops — they **cannot** be handled by the migration script:

| File | Reason |
|---|---|
| `dev-docs/pbs-bidders.md` | `{% for %}` over `site.pages` with `{% unless %}`, `{% case %}` |
| `dev-docs/modules/index.md` | Queries `site.pages` to list modules |
| `dev-docs/modules/userId.md` | Queries `site.pages` to list userid submodules |
| `dev-docs/modules/consentManagementUsp.md` | Queries bidder pages for USP support flags |
| `dev-docs/modules/consentManagementGpp.md` | Queries bidder pages for GPP support flags |
| `dev-docs/requirements/tcf2/PrebidSupportforEnforcingTCF2.html` | HTML file, not markdown |

These will need custom MDX components or static data generated from frontmatter.

## Migration Script Approach

For Phase 4+, a Node.js migration script (`scripts/migrate-devdocs.mjs`) should handle the mechanical conversions in batch. The script should:

1. Accept `--source`, `--dest`, and `--dry-run` arguments
2. Apply all conversion patterns from the table above in order, including:
   - Simple alert includes (string content) → admonitions
   - Capture + alert pairs → extract captured content into admonitions
   - Image path rewrites (`{{ site.baseurl }}/assets/images/` → `/images/`)
3. Use `git mv` for file movement
4. Rename `.md` → `.mdx` only when React components are needed
5. Output a summary of transformations and files needing manual review
6. Skip files with Liquid template logic (`{% assign %}`, `{% for %}`, `site.pages`) — see "Files Requiring Manual Conversion" above

### Batch execution order (by complexity, simplest first):
1. Analytics adapters (68 files) — most uniform
2. UserID submodules (63 files) — similarly uniform
3. Remaining modules (~57 files) — some includes
4. Publisher API reference (51 files) — link-heavy
5. Root-level guides (~36 files) — varied
6. Examples, plugins, requirements (~39 files) — some need placeholders

## File Count Summary

| Old Location | Files | Destination | Complexity |
|---|---|---|---|
| `dev-docs/analytics/` | 68 | `docs/dev-docs/prebidjs/analytics/` | Low |
| `dev-docs/modules/userid-submodules/` | 63 | `docs/dev-docs/prebidjs/modules/userid-submodules/` | Low |
| `dev-docs/modules/` (top-level) | ~57 | `docs/dev-docs/prebidjs/modules/` | Medium |
| `dev-docs/publisher-api-reference/` | 51 | `docs/dev-docs/prebidjs/publisher-api-reference/` | Medium |
| `dev-docs/` (root-level guides) | ~36 | `docs/dev-docs/prebidjs/` | Medium-High |
| `dev-docs/plugins/` | 21 | `docs/dev-docs/prebidjs/plugins/` | Medium |
| `dev-docs/examples/` | 14 | `docs/dev-docs/prebidjs/examples/` | High (interactive) |
| `dev-docs/requirements/` | 3 | `docs/dev-docs/prebidjs/requirements/` | Low |
| `dev-docs/internal-api-reference/` | 1 | `docs/dev-docs/prebidjs/internal-api-reference/` | Low |
| `prebid-server/` | 71 | `docs/dev-docs/prebid-server/` | Medium |
| `prebid-mobile/` | 63 | `docs/dev-docs/prebid-mobile/` | Medium |
| `adops/` | 24 | `docs/content/guides/ad-ops/` | Medium |
| `prebid/` | 9 | `docs/content/` | Medium |
| `features/` | 8 | `docs/content/` | Low |
| `formats/` | 7 | `docs/content/formats/` | Low |
| `prebid-video/` | 6 | `docs/content/` | Low |
| `support/` | 7 | `docs/content/` | Low |
| `policies/` | 5 | `docs/content/` | Low |
| `faq/` | 3 | `docs/content/` | Low |
| `identity/` | 3 | `docs/content/guides/identity/` | Low |
| `tools/` | 3 | `docs/dev-docs/tools/` | Low |
| `troubleshooting/` | 3 | `docs/content/` | Low |

## Next Steps

1. **Fix build blocker** (Phase 3.5) — 2 file edits to fix footer/homepage links
2. **Convert Phase 4 deferred files** — 5 files needing custom MDX components/plugin for `site.pages` queries
3. **Begin Phase 6** — Prebid Mobile documentation (63 files)
4. **Continue Phases 7-10** — Guides, Formats, Tools, Remaining sections
