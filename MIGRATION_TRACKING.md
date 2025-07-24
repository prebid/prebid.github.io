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

## Phase 4: Content Migration - Prebid.js Documentation ⏳

### Step 4.1: Copy dev-docs content to docs/dev-docs/prebidjs/

- [ ] Move file by file using git mv, preserving structure
- [ ] Update frontmatter and links
- [ ] Fix image and asset references
- [ ] Update sidebar configuration
- [ ] Test versioning functionality

## Phase 5: Content Migration - Prebid Server Documentation ⏳

### Step 5.1: Copy prebid-server content to docs/dev-docs/prebid-server/

- [ ] Move file by file using git mv, preserving structure
- [ ] Separate Java and Go documentation
- [ ] Update frontmatter and links
- [ ] Configure versioning for both Java and Go
- [ ] Test versioning functionality

## Phase 6: Content Migration - Prebid Mobile Documentation ⏳

### Step 6.1: Copy prebid-mobile content to docs/dev-docs/prebid-mobile/

- [ ] Move file by file using git mv, preserving structure
- [ ] Separate iOS and Android documentation
- [ ] Update frontmatter and links
- [ ] Configure versioning for both platforms
- [ ] Test versioning functionality

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

- [ ] features/ directory
- [ ] troubleshooting/ directory
- [ ] support/ directory
- [ ] faq/ directory
- [ ] policies/ directory
- [ ] identity/ directory
- [ ] prebid/ directory
- [ ] prebid-video/ directory
- [ ] adops/ directory

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
- **Phase 4**: ⏳ Pending (Content Migration - Prebid.js)
- **Phase 5**: ⏳ Pending (Content Migration - Prebid Server)
- **Phase 6**: ⏳ Pending (Content Migration - Prebid Mobile)
- **Phase 7**: ⏳ Pending (Content Migration - Guides)
- **Phase 8**: ⏳ Pending (Content Migration - Formats)
- **Phase 9**: ⏳ Pending (Content Migration - Tools)
- **Phase 10**: ⏳ Pending (Content Migration - Remaining Sections)
- **Phase 11**: ⏳ Pending (Layout and Include Components Analysis)
- **Phase 12**: ⏳ Pending (Download Page Migration)
- **Phase 13**: ⏳ Pending (Final Cleanup and Testing)

## Next Steps

1. Begin Phase 3: Migrate overview/ directory content file by file
2. Set up development environment for testing
3. Create backup of current documentation
4. Start file-by-file migration process using sidebar.yml as reference
