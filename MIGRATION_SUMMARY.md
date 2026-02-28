# Migration Summary - Current State

## What Has Been Accomplished ✅

### Phase 1: Foundation Setup - COMPLETE

1. **Target Folder Structure Created**
   - All required directories have been created under `docs/`
   - Structure follows the specified organization:
     - `docs/content/download/` - Download page
     - `docs/dev-docs/prebidjs/` - Prebid.js documentation (versioned)
     - `docs/dev-docs/prebid-server/java/` - Prebid Server Java (versioned)
     - `docs/dev-docs/prebid-server/go/` - Prebid Server Go (versioned)
     - `docs/dev-docs/prebid-mobile/ios/` - Prebid Mobile iOS (versioned)
     - `docs/dev-docs/prebid-mobile/android/` - Prebid Mobile Android (versioned)
     - `docs/dev-docs/tools/` - Tools documentation
     - `docs/content/formats/` - Ad formats documentation
     - `docs/content/guides/` - Implementation guides

2. **Sample Files Generated**
   - Created index.md files in each directory with proper Docusaurus frontmatter
   - Established navigation structure and placeholder content
   - All files use consistent formatting and structure

3. **Docusaurus Configuration Refined**
   - **Main docs plugin**: Uses single plugin for `docs/` folder with `exclude: ['**/dev-docs/**']`
   - **Versioned plugins**: Separate plugins for each versioned documentation section:
     - `prebidjs` - Prebid.js documentation
     - `prebidServer` - Prebid Server documentation
     - `prebidMobile` - Prebid Mobile documentation
     - `tools` - Tools documentation
   - **Navbar configuration**: Updated to reflect new structure
   - **Sidebar configurations**: Created for each plugin

4. **Plugin Structure**

   ```typescript
   // Main docs (content only, dev-docs handled by separate plugins)
   docs: {
     path: "docs/content",
     routeBasePath: "/",
     sidebarPath: "./sidebars.ts",
   }

   // Versioned plugins (each has its own sidebar and route)
   plugins: [
     { id: 'prebidjs', path: 'docs/dev-docs/prebidjs', routeBasePath: 'dev-docs/prebidjs' },
     { id: 'prebidServer', path: 'docs/dev-docs/prebid-server', routeBasePath: 'dev-docs/prebid-server' },
     { id: 'prebidMobile', path: 'docs/dev-docs/prebid-mobile', routeBasePath: 'dev-docs/prebid-mobile' },
     { id: 'tools', path: 'docs/dev-docs/tools', routeBasePath: 'dev-docs/tools' },
   ]
   ```

### Phase 2: Layout and Include Components Migration - COMPLETE

1. **React Components Created**
   - Created HomeLayout component
   - Created BidderLayout component
   - Created DocsLayout component
   - Created Navigation component with dropdown menus
   - Created Sidebar component with collapsible sections
   - Created Footer component

2. **DevDocs Components Created** (in `src/components/DevDocs/`)
   - `IncludeTodo` — placeholder for unmigrated Jekyll includes
   - `LegalWarning` — replaces `{% include legal-warning.html %}`
   - `StorageAllowed` — storage config warning
   - `Fingerprinting` — fingerprinting API warning
   - `DefaultKeywordTargeting` — keyword targeting table
   - `SendAllBidsKeywordTargeting` — send-all-bids table
   - `PbjsAdapterRequiredForPbs` — PBS adapter requirement warning

3. **Directory Structure Updated**
   - Moved bidders directory from dev-docs/bidders to docs/dev-docs/prebidjs/bidders (676+ files)
   - Preserved git history during move

4. **Unnecessary Components Identified**
   - Identified layouts to remove: test.html, userid.html, video_sample.html, api_prebidjs.html, internal_api_prebidjs.html, pb-video-template.html, analytics.html, fourofour.html
   - Identified includes to remove: vimeo-iframe.html, prebidjs-non-prod.html, gptjs.html, astjs.html, legal-warning.html, body-end.html, example_tab.html, head.html

### Phase 3: Content Migration - Overview Section - COMPLETE

1. **Overview files migrated to `docs/content/`** using `git mv`
2. **Key files fully converted** to Docusaurus format:
   - `intro.mdx`, `intro-to-header-bidding.mdx`, `glossary.md`, `analytics.mdx`, `what-is-post-bid.md`
3. **Additional files moved** (awaiting full conversion):
   - `all-videos.md`, `analytics-video.mdx`, `intro-video.mdx`, `how-many-bidders-for-header-bidding.md`, `how-to-simplify-line-item-setup.md`, `optimal-header-bidding-setup.md`, `prebid-management-committees.md`, `prebid-troubleshooting-guide.md`, `prebid-universal-creative.md`, `statement-on-sustainability.md`, `what-is-prebid-org.md`
4. **Files using IncludeTodo** (pending proper component):
   - `analytics.mdx` — vimeo-iframe include
   - `intro-to-header-bidding.mdx` — vimeo-iframe include
   - `intro-video.mdx` — vimeo-iframe include
   - `analytics-video.mdx` — vimeo-iframe include

### Phase 4: Content Migration - Prebid.js Documentation - MOSTLY COMPLETE

1. **Migration script created** (`scripts/migrate-devdocs.mjs`) for batch processing
2. **All batches migrated** (~367 files moved and converted):
   - Analytics adapters (69 files) → `docs/dev-docs/prebidjs/analytics/`
   - UserID submodules (64 files) → `docs/dev-docs/prebidjs/modules/userid-submodules/`
   - Remaining modules (115 files) → `docs/dev-docs/prebidjs/modules/`
   - Publisher API reference (52 files) → `docs/dev-docs/prebidjs/publisher-api-reference/`
   - Root-level dev-docs guides (41 files) → `docs/dev-docs/prebidjs/`
   - Examples, plugins, requirements, internal-api → respective subdirectories
3. **5 files deferred** — require custom MDX components to replace Liquid `site.pages` queries:
   - `dev-docs/modules/index.md` — dynamically lists all modules in filtered tables
   - `dev-docs/modules/userId.md` — dynamically lists all UserID sub-modules
   - `dev-docs/modules/consentManagementUsp.md` — queries bidders for USP support
   - `dev-docs/modules/consentManagementGpp.md` — queries bidders for GPP support
   - `dev-docs/pbs-bidders.md` — queries bidder pages with complex Liquid logic
4. **Recommended approach for deferred files**: Extend `_plugins/toc-plugin.ts` to scan module/userid frontmatter and output `modules.json`, then create MDX components that render from this data

### Phase 5: Content Migration - Prebid Server Documentation - COMPLETE

1. **70 files migrated** from `prebid-server/` → `docs/dev-docs/prebid-server/` using the existing migration script
   - 10 subdirectories: overview, use-cases, features, endpoints (+ openrtb2, info), developers, hosting, pbs-modules, versions
   - 7 files renamed to `.mdx` (6 for `<LegalWarning />`, 2 for Vimeo `<IncludeTodo />`)
   - 10 `_category_.json` files created for sidebar organization
2. **Post-migration fixes applied**:
   - Stripped `{%raw%}/{%endraw%}` tags from 4 files (~30 occurrences)
   - Rewrote ~318 internal PBS link prefixes (`/prebid-server/` → `/dev-docs/prebid-server/`)
   - Rewrote ~55 cross-section links to migrated Prebid.js paths (`/dev-docs/modules/` → `/dev-docs/prebidjs/modules/`)
   - Fixed MDX compatibility: self-closing HTML tags, escaped bare braces, stripped image CSS markers
3. **Build passes** — compiled successfully with no broken link errors
4. **1 root file skipped** (`prebid-server/hosted-servers.md`) — duplicate of `hosting/hosted-servers.md`
5. **Known remaining issues**:
   - ~33 links to unmigrated sections (`/overview/`, `/formats/`, `/adops/`, etc.) — will resolve in Phases 6-10
   - 2 links to `/dev-docs/pbs-bidders` — deferred Phase 4 file

## Current Build Status

**Build FAILS** with 472 broken links. Root cause: default Docusaurus template links in the footer (`/docs/intro`, `/blog`) that appear on every page. These are boilerplate — not real Prebid URLs. Fix requires 2 edits to `docusaurus.config.ts` and `src/pages/index.js`.

## Current Configuration

### Docusaurus Config (`docusaurus.config.ts`)

- ✅ Main docs plugin configured with exclusion
- ✅ Separate plugins for versioned documentation
- ✅ Navbar updated with new structure
- ✅ tocPlugin configured for bidder documentation

### Sidebar Configurations

- ✅ `sidebars.ts` - Main documentation
- ✅ `sidebars.pbjs.ts` - Prebid.js
- ✅ `sidebars.pbs.ts` - Prebid Server
- ✅ `sidebars.pbm.ts` - Prebid Mobile
- ✅ `sidebars.tools.ts` - Tools

### Folder Structure

```
docs/
├── content/           # Main documentation
│   ├── download/      # Download page
│   ├── formats/       # Ad formats
│   └── guides/        # Implementation guides
└── dev-docs/          # Versioned documentation
    ├── prebidjs/      # Versioned plugin
    ├── prebid-server/ # Versioned plugin
    ├── prebid-mobile/ # Versioned plugin
    └── tools/         # Versioned plugin
```

## Next Steps

### Immediate: Fix Build Blocker

Fix 2 files with boilerplate Docusaurus template links causing build failure:
- `docusaurus.config.ts` footer: `/docs/intro` → `/intro`, remove `/blog` link, update copyright
- `src/pages/index.js`: `/docs/intro` → `/intro`, update button label

### Phase 4 Deferred: Convert 5 files with Liquid `site.pages` queries

These files dynamically generate content from other pages' frontmatter. Need custom Docusaurus plugin/MDX components. Recommended approach: extend `_plugins/toc-plugin.ts` to generate `modules.json` similar to `bidders.json`.

### Phase 6-10: Content Migration - Remaining Sections

1. **File-by-file migration process**
   - Prebid Mobile documentation (63 files: prebid-mobile/ → docs/dev-docs/prebid-mobile/)
   - Guides content (guide/ → docs/content/guides/)
   - Formats content (formats/ → docs/content/formats/)
   - Tools content (tools/ → docs/dev-docs/tools/)
   - Remaining sections: adops/ (24), prebid/ (9), features/ (8), support/ (7), formats/ (7), prebid-video/ (6), policies/ (5), faq/ (3), identity/ (3), troubleshooting/ (3), tools/ (3)

2. **Update frontmatter and links**
   - Convert Jekyll frontmatter to Docusaurus
   - Fix internal links using sidebar.yml as reference
   - Update image references
   - Adapt sidebar ordering as needed

### Phase 11: Layout and Include Components Analysis

1. **Analyze _layouts/ directory usage**
   - Identify which markdown files use each layout
   - Create React components for needed layouts
   - Update migrated content to use new components

2. **Analyze _includes/ directory usage**
   - Identify which markdown files use each include
   - Create React components for needed includes
   - Update migrated content to use new components

### Phase 12: Download Page Migration

1. **Create React component for download page**
   - Port existing download.md functionality
   - Implement Firebase integration
   - Add module selection logic

## Key Benefits of Current Setup

1. **Clean Separation**: Main docs and versioned docs are properly separated
2. **Versioning Support**: Each project can have its own versioning
3. **Scalable Structure**: Easy to add new versioned projects
4. **Maintainable**: Clear organization and configuration
5. **Docusaurus Best Practices**: Follows recommended patterns

## Files to Monitor

- `docusaurus.config.ts` - Main configuration
- `sidebars.*.ts` - Sidebar configurations
- `docs/` - Main documentation structure
- `docs/dev-docs/` - Versioned documentation
- `_data/sidebar.yml` - Reference for old URL structure and linking

## Testing Recommendations

1. **Build Test**: Run `npm run build` to ensure no configuration errors
2. **Development Server**: Run `npm start` to test navigation
3. **Version Switching**: Test version dropdowns work correctly
4. **Link Validation**: Check all internal links are working

## Migration Status

- **Phase 1**: ✅ Complete
- **Phase 2**: ✅ Complete
- **Phase 3**: ✅ Complete
- **Build Fix**: ⚠️ Blocker — 2 file edits needed (template defaults)
- **Phase 4**: ✅ Mostly Complete — ~367 files migrated, 5 deferred (need custom components for `site.pages` queries)
- **Phase 5**: ✅ Complete — Prebid Server (70 files migrated)
- **Phase 6**: ⏳ Pending — Prebid Mobile (63 files)
- **Phase 7-10**: ⏳ Pending — Guides, Formats, Tools, Remaining (~58 files)
- **Phase 11**: ⏳ Pending
- **Phase 12**: ⏳ Pending
- **Phase 13**: ⏳ Pending

## URL Preservation Policy

- **Preserve**: `/download`, `/` (home) — already correctly routed
- **Don't need to preserve**: Adapter/module/dev-docs content — gets new `/dev-docs/prebidjs/` prefix
