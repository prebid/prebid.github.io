# Migration Tracking - Jekyll to Docusaurus

## Phase 1: Foundation Setup ✅

### Step 1.1: Create target folder structure ✅

- [x] Created docs/content/download/
- [x] Created docs/dev-docs/prebidjs/
- [x] Created docs/dev-docs/prebid-server/java/
- [x] Created docs/dev-docs/prebid-server/go/
- [x] Created docs/dev-docs/prebid-mobile/ios/
- [x] Created docs/dev-docs/prebid-mobile/android/
- [x] Created docs/dev-docs/tools/line-item-manager/
- [x] Created docs/dev-docs/tools/professor-prebid/
- [x] Created docs/content/formats/display/
- [x] Created docs/content/formats/video/
- [x] Created docs/content/formats/native/
- [x] Created docs/content/formats/ctv/
- [x] Created docs/content/formats/amp/
- [x] Created docs/content/formats/audio/
- [x] Created docs/content/formats/interstitial/
- [x] Created docs/content/guides/ad-ops/
- [x] Created docs/content/guides/privacy/
- [x] Created docs/content/guides/sustainability/
- [x] Created docs/content/guides/identity/

### Step 1.2: Generate sample files in each target directory ✅

- [x] docs/content/download/index.md
- [x] docs/dev-docs/prebidjs/index.md
- [x] docs/dev-docs/prebid-server/index.md
- [x] docs/dev-docs/prebid-server/java/index.md
- [x] docs/dev-docs/prebid-server/go/index.md
- [x] docs/dev-docs/prebid-mobile/index.md
- [x] docs/dev-docs/prebid-mobile/ios/index.md
- [x] docs/dev-docs/prebid-mobile/android/index.md
- [x] docs/dev-docs/tools/index.md
- [x] docs/dev-docs/tools/line-item-manager/index.md
- [x] docs/dev-docs/tools/professor-prebid/index.md
- [x] docs/content/formats/index.md
- [x] docs/content/formats/display/index.md
- [x] docs/content/guides/index.md
- [x] docs/content/guides/ad-ops/index.md
- [x] docs/content/guides/privacy/index.md
- [x] docs/content/guides/sustainability/index.md
- [x] docs/content/guides/identity/index.md

### Step 1.3: Configure Docusaurus plugins ✅

- [x] Updated main docs plugin to exclude dev-docs folder
- [x] Created separate plugins for versioned documentation
- [x] Updated navbar configuration
- [x] Created sidebar configurations for each plugin

## Phase 2: Layout and Include Components Migration ✅

### Step 2.1: Create React components for essential layouts ✅

- [x] Created HomeLayout component
- [x] Created BidderLayout component  
- [x] Created DocsLayout component
- [x] Implemented responsive design patterns
- [x] Added TypeScript interfaces

### Step 2.2: Create React components for essential includes ✅

- [x] Created Navigation component with dropdown menus
- [x] Created Sidebar component with collapsible sections
- [x] Created Footer component
- [x] Implemented state management for dropdowns
- [x] Added accessibility features

### Step 2.3: Identify and remove unnecessary layouts/includes ✅

- [x] Identified layouts to remove: test.html, userid.html, video_sample.html, api_prebidjs.html, internal_api_prebidjs.html, pb-video-template.html, analytics.html, fourofour.html
- [x] Identified includes to remove: vimeo-iframe.html, prebidjs-non-prod.html, gptjs.html, astjs.html, legal-warning.html, body-end.html, example_tab.html, head.html
- [x] Consolidated similar functionality into reusable components

### Step 2.4: Move bidders directory ✅

- [x] Used git mv to move dev-docs/bidders to docs/dev-docs/prebidjs/bidders
- [x] Preserved git history
- [x] Updated directory structure

## Phase 3: Content Migration - Overview Section ✅

### Step 3.1: Migrate overview/ directory content ✅

- [x] Move overview/ files to docs/content/ using git mv
- [x] Update frontmatter and links
- [x] Fix image and asset references
- [x] Update sidebar configuration

**Files migrated and converted:**

- [x] intro.mdx (already converted)
- [x] intro-to-header-bidding.md (converted to Docusaurus format)
- [x] glossary.md (converted to Docusaurus format)
- [x] analytics.md (converted to Docusaurus format)
- [x] what-is-post-bid.md (converted to Docusaurus format)
- [x] All other overview files moved (awaiting conversion)

## Build Fix ⚠️ (Blocker)

Build currently fails with 472 broken links from boilerplate Docusaurus template defaults:

- [ ] Fix `docusaurus.config.ts` footer: `/docs/intro` → `/intro`, remove `/blog` link, update copyright
- [ ] Fix `src/pages/index.js`: `/docs/intro` → `/intro`, update button label
- [ ] Verify: `npm run build` passes

## Phase 4: Content Migration - Prebid.js Documentation ✅ (Mostly Complete)

**Total: ~372 files in `dev-docs/`** (bidders already done in Phase 2)

### Step 4.0: Create migration script ✅

- [x] Create `scripts/migrate-devdocs.mjs` for batch processing mechanical conversions
- [x] Script handles: frontmatter cleanup, TOC removal, CSS class removal, alert includes → admonitions, link rewrites, simple includes → inline admonitions
- [x] Script flags files with Liquid logic (`{% assign %}`, `{% for %}`, `site.pages`) for manual handling
- [x] `--dry-run` mode for previewing changes

### Step 4.1: Migrate analytics adapters (68 files) ✅

- [x] Source: `dev-docs/analytics/` → `docs/dev-docs/prebidjs/analytics/` (69 files including _category_.json)
- [x] Create `_category_.json` for sidebar
- [x] Run migration script
- [x] Build and spot-check

### Step 4.2: Migrate UserID submodules (63 files) ✅

- [x] Source: `dev-docs/modules/userid-submodules/` → `docs/dev-docs/prebidjs/modules/userid-submodules/` (64 files including _category_.json)
- [x] Create `_category_.json` for sidebar
- [x] Run migration script
- [x] Build and spot-check

### Step 4.3: Migrate remaining modules (~57 files) ⚠️ Mostly Complete

- [x] Source: `dev-docs/modules/` (excluding userid-submodules) → `docs/dev-docs/prebidjs/modules/` (115 files migrated)
- [x] Run migration script
- [x] Build and spot-check
- [ ] **Deferred — Manual conversion needed**: 4 files remain in `dev-docs/modules/` requiring custom MDX components or a Docusaurus plugin to replace Liquid `site.pages` queries:
  - `modules/index.md` — dynamically queries all module pages by `page_type: "module"` frontmatter, generates 4 filtered tables (Recommended, General, Vendor-Specific, User ID modules)
  - `modules/userId.md` — queries all pages with `layout: "userid"`, generates User ID Sub-Modules table and dynamically builds valid `name` values list
  - `modules/consentManagementUsp.md` — queries bidder pages for USP support flags
  - `modules/consentManagementGpp.md` — queries bidder pages for GPP support flags

### Step 4.4: Migrate publisher API reference (51 files) ✅

- [x] Source: `dev-docs/publisher-api-reference/` → `docs/dev-docs/prebidjs/publisher-api-reference/` (52 files including _category_.json)
- [x] Run migration script
- [x] Build and spot-check

### Step 4.5: Migrate root-level dev-docs guides (~36 files) ✅

- [x] Source: `dev-docs/*.md` (root-level) → `docs/dev-docs/prebidjs/` (41 files migrated)
- [x] Individual review likely needed after script pass
- [x] Build and spot-check
- [ ] **Deferred**: `dev-docs/pbs-bidders.md` remains — uses `{% for %}` over `site.pages` with `{% unless %}`, `{% case %}` (listed in "Files Requiring Manual Conversion")

### Step 4.6: Migrate examples, plugins, requirements, internal-api (~39 files) ✅

- [x] Source: `dev-docs/examples/`, `dev-docs/plugins/`, `dev-docs/requirements/`, `dev-docs/internal-api-reference/`
- [x] Examples use `{% include code/web-example.html %}` → `<IncludeTodo />` placeholders
- [x] Build and spot-check
- **Minor remainders** (non-markdown assets, not blocking):
  - `dev-docs/examples/intercept-banner-not-for-prod.js` — JS file, not a doc page
  - `dev-docs/plugins/bc/` and `dev-docs/plugins/cross-player-prebid-component/` — subdirectory content (already migrated to `docs/`)
  - `dev-docs/requirements/tcf2/PrebidSupportforEnforcingTCF2.html` + 2 images — HTML file, needs manual review (listed in "Files Requiring Manual Conversion")

### Step 4.7: Final verification ⏳

- [ ] Update sidebar configuration
- [ ] Test versioning functionality
- [ ] Grep all migrated files for leftover Jekyll syntax

### Phase 4 Deferred Items — Files Requiring Custom Components

These 5 files use Liquid `site.pages` queries to dynamically generate content at build time. They need a **Docusaurus plugin or custom MDX component** that reads from a static JSON manifest (similar to how `tocPlugin` generates `bidders.json`). Conversion options:

1. **Plugin approach**: Extend `_plugins/toc-plugin.ts` (or create a new plugin) to scan module/userid frontmatter at build time and output a `modules.json` manifest. Then create MDX components that import and render from the JSON.
2. **Static data approach**: Generate a one-time `modules.json` from the existing frontmatter, commit it, and build MDX components that render from it. Requires manual updates when modules are added/removed.
3. **Hardcoded tables**: Least maintainable — paste current table data directly. Breaks on any module addition.

| File | Liquid Pattern | Data Needed |
|---|---|---|
| `modules/index.md` | `site.pages \| where: "page_type", "module"` | All module pages with `recommended`, `vendor_specific`, `enable_download`, `module_type` fields |
| `modules/userId.md` | `site.pages \| where: "layout", "userid"` | All userid pages with `useridmodule`, `bidRequestUserId`, `eidsource`, `example` fields |
| `modules/consentManagementUsp.md` | Queries bidder pages for USP support | Bidder pages with USP-related frontmatter |
| `modules/consentManagementGpp.md` | Queries bidder pages for GPP support | Bidder pages with GPP-related frontmatter |
| `dev-docs/pbs-bidders.md` | `{% for %}` over `site.pages` with `{% unless %}`, `{% case %}` | Bidder pages with PBS-related frontmatter |

## Phase 5: Content Migration - Prebid Server Documentation ✅ (70 files migrated)

### Step 5.0: Pre-migration setup ✅

- [x] Created 10 `_category_.json` files for sidebar organization (overview, use-cases, features, endpoints, endpoints/openrtb2, endpoints/info, developers, hosting, pbs-modules, versions)
- [x] Skipped root-level `hosted-servers.md` (duplicate of `hosting/hosted-servers.md`)
- [x] Old `java/` and `go/` stub directories left in place (harmless, can clean up later)

### Step 5.1: Run migration script (10 batches) ✅

- [x] `overview/` (3 files) — 2 renamed to `.mdx` for Vimeo `<IncludeTodo />`
- [x] `use-cases/` (6 files)
- [x] `features/` (18 files) — 4 renamed to `.mdx` for `<LegalWarning />`
- [x] `endpoints/` top-level (9 files)
- [x] `endpoints/openrtb2/` (4 files) — 1 renamed to `.mdx` for `<LegalWarning />`
- [x] `endpoints/info/` (1 file)
- [x] `developers/` (13 files) — 3 flagged for `{%raw%}` tags
- [x] `hosting/` (4 files)
- [x] `pbs-modules/` (9 files)
- [x] `versions/` (3 files)

### Step 5.2: Post-migration fixes ✅

- [x] Stripped `{%raw%}/{%endraw%}` tags from 4 files (~30 occurrences)
- [x] Rewrote `/prebid-server/` links → `/dev-docs/prebid-server/` (~318 occurrences)
- [x] Rewrote `/dev-docs/modules/` etc. → `/dev-docs/prebidjs/modules/` (~55 cross-section links)
- [x] Stripped `{:class="pb-xlg-img"}` and `{: .pb-lg-img :}` image CSS markers (14 occurrences)
- [x] Fixed MDX issues: self-closing `<br/>`, `<img />`, escaped `{lat,lon}`, wrapped bare braces in backticks
- [x] Created new landing page `docs/dev-docs/prebid-server/index.md`
- [x] Left 2 links to `/dev-docs/pbs-bidders` as-is (deferred Phase 4 file)

### Step 5.3: Build validation ✅

- [x] `npm run build` compiles successfully (Server + Client)
- [x] No broken link errors
- [x] Broken anchor warnings are non-blocking (from TOC heading ID changes across pre-existing Phase 3 files)
- [x] Spot-checked critical files: `pbs-endpoint-auction.md`, `add-new-bidder-go.md`, `pbs-modules/index.md`, `pbs-feature-idx.md`

### Remaining known issues

- ~33 links to unmigrated sections (`/overview/`, `/formats/`, `/adops/`, `/faq/`, `/prebid-mobile/`) — will be fixed when those sections migrate (Phases 6-10)
- 2 links to `/dev-docs/pbs-bidders` — deferred Phase 4 file
- Broken anchor warnings from Phase 3 overview files (non-blocking)

## Phase 6: Content Migration - Prebid Mobile Documentation ⏳ (63 files)

### Step 6.1: Copy prebid-mobile content to docs/dev-docs/prebid-mobile/

- [ ] Move file by file using git mv, preserving structure
- [ ] Separate iOS and Android documentation
- [ ] Update frontmatter and links
- [ ] Configure versioning for both platforms
- [ ] Test versioning functionality

**Note:** 3 index files already exist as stubs in `docs/dev-docs/prebid-mobile/`.

## Phase 7: Content Migration - Guides ⏳

### Step 7.1: Copy guide content to docs/content/guides/

- [ ] Move file by file using git mv, preserving structure
- [ ] Organize into subdirectories (ad-ops, privacy, etc.)
- [ ] Update frontmatter and links
- [ ] Fix any Jekyll-specific syntax
- [ ] Test navigation and links

## Phase 8: Content Migration - Formats ⏳

### Step 8.1: Copy formats content to docs/content/formats/

- [ ] Move file by file using git mv, preserving structure
- [ ] Organize into subdirectories
- [ ] Update frontmatter and links
- [ ] Fix any Jekyll-specific syntax
- [ ] Test navigation and links

## Phase 9: Content Migration - Tools Documentation ⏳

### Step 9.1: Copy tools content to docs/dev-docs/tools/

- [ ] Move file by file using git mv, preserving structure
- [ ] Organize into subdirectories
- [ ] Update frontmatter and links
- [ ] Fix any Jekyll-specific syntax
- [ ] Test navigation and links

## Phase 10: Content Migration - Remaining Sections ⏳

### Step 10.1: Migrate remaining content sections

- [ ] adops/ directory (24 files → docs/content/guides/ad-ops/)
- [ ] prebid/ directory (9 files)
- [ ] features/ directory (8 files)
- [ ] support/ directory (7 files)
- [ ] formats/ directory (7 files → docs/content/formats/)
- [ ] prebid-video/ directory (6 files)
- [ ] policies/ directory (5 files)
- [ ] faq/ directory (3 files)
- [ ] identity/ directory (3 files → docs/content/guides/identity/)
- [ ] troubleshooting/ directory (3 files)
- [ ] debugging/ directory (1 file)

## Phase 11: Layout and Include Components Analysis ⏳

### Step 11.1: Analyze _layouts/ directory usage

- [ ] Identify which markdown files use each layout
- [ ] Create React components for needed layouts
- [ ] Update migrated content to use new components
- [ ] Remove unused layouts

### Step 11.2: Analyze _includes/ directory usage

- [ ] Identify which markdown files use each include
- [ ] Create React components for needed includes
- [ ] Update migrated content to use new components
- [ ] Remove unused includes

## Phase 12: Download Page Migration ⏳

### Step 12.1: Analyze current download.md structure ✅

- [x] Reviewed download.md content
- [x] Identified JavaScript dependencies
- [x] Mapped Firebase integration
- [x] Documented module selection logic

### Step 12.2: Create React component for download page

- [ ] Create DownloadPage component
- [ ] Implement form structure
- [ ] Add module selection checkboxes
- [ ] Create version selector

### Step 12.3: Migrate JavaScript functionality

- [ ] Port download.js logic to React
- [ ] Implement Firebase integration
- [ ] Add module validation
- [ ] Create download generation logic

### Step 12.4: Integrate with Firebase API

- [ ] Set up Firebase configuration
- [ ] Implement version fetching
- [ ] Add error handling
- [ ] Test API integration

### Step 12.5: Test download functionality

- [ ] Test module selection
- [ ] Test version compatibility
- [ ] Test download generation
- [ ] Validate error handling

## Phase 13: Final Cleanup and Testing ⏳

### Step 13.1: Create comprehensive migration checklist

- [ ] Document all migrated files
- [ ] Create unmigrated files list
- [ ] Validate migration completeness

### Step 13.2: Identify unmigrated files

- [ ] Scan for remaining Jekyll files
- [ ] Document excluded files
- [ ] Create cleanup plan

### Step 13.3: Test all navigation and links

- [ ] Run link checker
- [ ] Test all internal navigation
- [ ] Validate external links

### Step 13.4: Validate search functionality

- [ ] Test search indexing
- [ ] Validate search results
- [ ] Test search performance

### Step 13.5: Performance testing

- [ ] Test build times
- [ ] Test page load speeds
- [ ] Optimize performance

### Step 13.6: Create MIGRATION.md for tracking

- [ ] Document final migration status
- [ ] Create maintenance guide
- [ ] Document lessons learned

## Files to NOT Migrate

- [x] consentmanager (excluded per requirements)
- [x] algolia site search (excluded per requirements)

## Current Status

- **Phase 1**: ✅ Complete (Foundation Setup)
- **Phase 2**: ✅ Complete (Layout and Include Components Migration)
- **Phase 3**: ✅ Complete (Content Migration - Overview Section)
- **Build Fix**: ⚠️ Blocker — 2 template default links need fixing
- **Phase 4**: ✅ Mostly Complete (Content Migration - Prebid.js) — 5 files deferred, need custom components for Liquid `site.pages` queries
- **Phase 5**: ✅ Complete (Content Migration - Prebid Server, 70 files migrated)
- **Phase 6**: ⏳ Pending (Content Migration - Prebid Mobile, 63 files)
- **Phase 7**: ⏳ Pending (Content Migration - Guides)
- **Phase 8**: ⏳ Pending (Content Migration - Formats)
- **Phase 9**: ⏳ Pending (Content Migration - Tools)
- **Phase 10**: ⏳ Pending (Content Migration - Remaining Sections, ~76 files)
- **Phase 11**: ⏳ Pending (Layout and Include Components Analysis)
- **Phase 12**: ⏳ Pending (Download Page Migration)
- **Phase 13**: ⏳ Pending (Final Cleanup and Testing)

## Next Steps

1. Fix build blocker (2 file edits in `docusaurus.config.ts` and `src/pages/index.js`)
2. Convert Phase 4 deferred files (5 files needing custom MDX components/plugin for `site.pages` queries)
3. Begin Phase 6: Prebid Mobile documentation (63 files)
4. Continue through Phases 7-10 for remaining content sections
