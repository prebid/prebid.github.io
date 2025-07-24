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

### Phase 3: Content Migration - Overview Section

- [ ] **Step 3.1**: Migrate overview/ directory content
  - [ ] Move overview/ files to docs/content/ using git mv
  - [ ] Update frontmatter and links
  - [ ] Fix image and asset references
  - [ ] Update sidebar configuration

### Phase 4: Content Migration - Prebid.js Documentation

- [ ] **Step 4.1**: Copy dev-docs content to docs/dev-docs/prebidjs/
  - [ ] Move file by file using git mv, preserving structure
  - [ ] Update frontmatter and links
  - [ ] Fix image and asset references
  - [ ] Update sidebar configuration
  - [ ] Test versioning functionality

### Phase 5: Content Migration - Prebid Server Documentation

- [ ] **Step 5.1**: Copy prebid-server content to docs/dev-docs/prebid-server/
  - [ ] Move file by file using git mv, preserving structure
  - [ ] Separate Java and Go documentation
  - [ ] Update frontmatter and links
  - [ ] Configure versioning for both Java and Go
  - [ ] Test versioning functionality

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

## Timeline Estimate

- **Phase 3-10**: 4-6 weeks (Content Migration)
- **Phase 11**: 2-3 weeks (Layout and Include Analysis)
- **Phase 12**: 1 week (Download Page)
- **Phase 13**: 1 week (Testing and Cleanup)

**Total Estimated Time**: 8-11 weeks

## Next Steps

1. Begin with Phase 3: Migrate overview/ directory content using git mv
2. Set up development environment for testing
3. Create backup of current documentation
4. Start file-by-file migration process
