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

### Step 1.4: Configure Docusaurus plugins ✅

- [x] Updated main docs plugin to exclude dev-docs folder
- [x] Created separate plugins for versioned documentation
- [x] Updated navbar configuration
- [x] Created sidebar configurations for each plugin

### Step 1.3: Copy matching files from existing Jekyll documentation ⏳

- [ ] Copy dev-docs content to docs/dev-docs/prebidjs/
- [ ] Copy prebid-server content to docs/dev-docs/prebid-server/
- [ ] Copy prebid-mobile content to docs/dev-docs/prebid-mobile/
- [ ] Copy formats content to docs/formats/
- [ ] Copy guide content to docs/guides/
- [ ] Copy tools content to docs/dev-docs/tools/

## Phase 2: Custom Version Dropdown Implementation ⏳

### Step 2.1: Create custom version dropdown component

- [ ] Create CustomVersionDropdown component
- [ ] Implement project identification logic
- [ ] Add styling and UI components

### Step 2.2: Implement version selection logic

- [ ] Handle multiple versioned projects
- [ ] Maintain version selection state
- [ ] Integrate with Docusaurus routing

### Step 2.3: Add project identification to dropdown

- [ ] Show project ID in selection
- [ ] Handle project-specific versioning
- [ ] Test with existing versioned content

### Step 2.4: Test with existing versioned content

- [ ] Test with prebidjs versions
- [ ] Test with prebid-server versions
- [ ] Validate routing and navigation

## Phase 3: Download Page Migration ⏳

### Step 3.1: Analyze current download.md structure ✅

- [x] Reviewed download.md content
- [x] Identified JavaScript dependencies
- [x] Mapped Firebase integration
- [x] Documented module selection logic

### Step 3.2: Create React component for download page

- [ ] Create DownloadPage component
- [ ] Implement form structure
- [ ] Add module selection checkboxes
- [ ] Create version selector

### Step 3.3: Migrate JavaScript functionality

- [ ] Port download.js logic to React
- [ ] Implement Firebase integration
- [ ] Add module validation
- [ ] Create download generation logic

### Step 3.4: Integrate with Firebase API

- [ ] Set up Firebase configuration
- [ ] Implement version fetching
- [ ] Add error handling
- [ ] Test API integration

### Step 3.5: Test download functionality

- [ ] Test module selection
- [ ] Test version compatibility
- [ ] Test download generation
- [ ] Validate error handling

## Phase 4: Prebid.js Documentation Migration ⏳

### Step 4.1: Copy dev-docs content to docs/dev-docs/prebidjs/

- [ ] Copy all .md files
- [ ] Preserve directory structure
- [ ] Maintain file relationships

### Step 4.2: Update frontmatter and links

- [ ] Convert Jekyll frontmatter to Docusaurus
- [ ] Update internal links
- [ ] Fix image references
- [ ] Update sidebar references

### Step 4.3: Fix image and asset references

- [ ] Move images to static/img/
- [ ] Update image paths
- [ ] Verify all assets load correctly

### Step 4.4: Update sidebar configuration

- [ ] Create custom sidebar for prebidjs
- [ ] Organize content logically
- [ ] Test navigation

### Step 4.5: Test versioning functionality

- [ ] Test version switching
- [ ] Validate version-specific content
- [ ] Test version dropdown

## Phase 5: Prebid Server Documentation Migration ⏳

### Step 5.1: Copy prebid-server content to docs/dev-docs/prebid-server/

- [ ] Copy all .md files
- [ ] Preserve directory structure
- [ ] Maintain file relationships

### Step 5.2: Separate Java and Go documentation

- [ ] Organize Java-specific content
- [ ] Organize Go-specific content
- [ ] Create platform-specific indexes

### Step 5.3: Update frontmatter and links

- [ ] Convert Jekyll frontmatter to Docusaurus
- [ ] Update internal links
- [ ] Fix image references
- [ ] Update sidebar references

### Step 5.4: Configure versioning for both Java and Go

- [ ] Set up Java versioning
- [ ] Set up Go versioning
- [ ] Test version switching

### Step 5.5: Test versioning functionality

- [ ] Test Java version switching
- [ ] Test Go version switching
- [ ] Validate version-specific content

## Phase 6: Prebid Mobile Documentation Migration ⏳

### Step 6.1: Copy prebid-mobile content to docs/dev-docs/prebid-mobile/

- [ ] Copy all .md files
- [ ] Preserve directory structure
- [ ] Maintain file relationships

### Step 6.2: Separate iOS and Android documentation

- [ ] Organize iOS-specific content
- [ ] Organize Android-specific content
- [ ] Create platform-specific indexes

### Step 6.3: Update frontmatter and links

- [ ] Convert Jekyll frontmatter to Docusaurus
- [ ] Update internal links
- [ ] Fix image references
- [ ] Update sidebar references

### Step 6.4: Configure versioning for both platforms

- [ ] Set up iOS versioning
- [ ] Set up Android versioning
- [ ] Test version switching

### Step 6.5: Test versioning functionality

- [ ] Test iOS version switching
- [ ] Test Android version switching
- [ ] Validate version-specific content

## Phase 7: Guides Migration ⏳

### Step 7.1: Copy guide content to docs/guides/

- [ ] Copy all .md files
- [ ] Preserve directory structure
- [ ] Maintain file relationships

### Step 7.2: Organize into subdirectories (ad-ops, privacy, etc.)

- [ ] Organize ad-ops content
- [ ] Organize privacy content
- [ ] Organize sustainability content
- [ ] Organize identity content

### Step 7.3: Update frontmatter and links

- [ ] Convert Jekyll frontmatter to Docusaurus
- [ ] Update internal links
- [ ] Fix image references
- [ ] Update sidebar references

### Step 7.4: Fix any Jekyll-specific syntax

- [ ] Convert Liquid templates
- [ ] Update include statements
- [ ] Fix conditional logic

### Step 7.5: Test navigation and links

- [ ] Test all internal links
- [ ] Validate navigation structure
- [ ] Test search functionality

## Phase 8: Formats Migration ⏳

### Step 8.1: Copy formats content to docs/formats/

- [ ] Copy all .md files
- [ ] Preserve directory structure
- [ ] Maintain file relationships

### Step 8.2: Organize into subdirectories

- [ ] Organize display content
- [ ] Organize video content
- [ ] Organize native content
- [ ] Organize other format content

### Step 8.3: Update frontmatter and links

- [ ] Convert Jekyll frontmatter to Docusaurus
- [ ] Update internal links
- [ ] Fix image references
- [ ] Update sidebar references

### Step 8.4: Fix any Jekyll-specific syntax

- [ ] Convert Liquid templates
- [ ] Update include statements
- [ ] Fix conditional logic

### Step 8.5: Test navigation and links

- [ ] Test all internal links
- [ ] Validate navigation structure
- [ ] Test search functionality

## Phase 9: Tools Documentation Migration ⏳

### Step 9.1: Copy tools content to docs/dev-docs/tools/

- [ ] Copy all .md files
- [ ] Preserve directory structure
- [ ] Maintain file relationships

### Step 9.2: Organize into subdirectories

- [ ] Organize line-item-manager content
- [ ] Organize professor-prebid content
- [ ] Create tool-specific indexes

### Step 9.3: Update frontmatter and links

- [ ] Convert Jekyll frontmatter to Docusaurus
- [ ] Update internal links
- [ ] Fix image references
- [ ] Update sidebar references

### Step 9.4: Fix any Jekyll-specific syntax

- [ ] Convert Liquid templates
- [ ] Update include statements
- [ ] Fix conditional logic

### Step 9.5: Test navigation and links

- [ ] Test all internal links
- [ ] Validate navigation structure
- [ ] Test search functionality

## Phase 10: Final Cleanup and Testing ⏳

### Step 10.1: Create comprehensive migration checklist

- [ ] Document all migrated files
- [ ] Create unmigrated files list
- [ ] Validate migration completeness

### Step 10.2: Identify unmigrated files

- [ ] Scan for remaining Jekyll files
- [ ] Document excluded files
- [ ] Create cleanup plan

### Step 10.3: Test all navigation and links

- [ ] Run link checker
- [ ] Test all internal navigation
- [ ] Validate external links

### Step 10.4: Validate search functionality

- [ ] Test search indexing
- [ ] Validate search results
- [ ] Test search performance

### Step 10.5: Performance testing

- [ ] Test build times
- [ ] Test page load speeds
- [ ] Optimize performance

### Step 10.6: Create MIGRATION.md for tracking

- [ ] Document final migration status
- [ ] Create maintenance guide
- [ ] Document lessons learned

## Files to NOT Migrate

- [x] consentmanager (excluded per requirements)
- [x] algolia site search (excluded per requirements)

## Current Status

- **Phase 1**: ✅ Complete (Foundation Setup)
- **Phase 2**: ⏳ In Progress (Custom Version Dropdown)
- **Phase 3**: ⏳ Pending (Download Page)
- **Phase 4**: ⏳ Pending (Prebid.js Migration)
- **Phase 5**: ⏳ Pending (Prebid Server Migration)
- **Phase 6**: ⏳ Pending (Prebid Mobile Migration)
- **Phase 7**: ⏳ Pending (Guides Migration)
- **Phase 8**: ⏳ Pending (Formats Migration)
- **Phase 9**: ⏳ Pending (Tools Migration)
- **Phase 10**: ⏳ Pending (Final Cleanup)

## Next Steps

1. Begin Phase 2: Implement custom version dropdown
2. Set up development environment for testing
3. Create backup of current documentation
4. Start implementing custom version dropdown component
