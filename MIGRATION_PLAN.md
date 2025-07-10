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

### Phase 1: Foundation Setup ✅ (Partially Complete)

- [x] Basic Docusaurus configuration
- [x] Custom tocPlugin implementation
- [x] Initial docs structure setup
- [ ] **Step 1.1**: Create target folder structure
- [ ] **Step 1.2**: Generate sample files in each target directory
- [ ] **Step 1.3**: Copy matching files from existing Jekyll documentation

### Phase 2: Custom Version Dropdown Implementation

- [ ] **Step 2.1**: Create custom version dropdown component
- [ ] **Step 2.2**: Implement version selection logic
- [ ] **Step 2.3**: Add project identification to dropdown
- [ ] **Step 2.4**: Test with existing versioned content

### Phase 3: Download Page Migration

- [ ] **Step 3.1**: Analyze current download.md structure
- [ ] **Step 3.2**: Create React component for download page
- [ ] **Step 3.3**: Migrate JavaScript functionality
- [ ] **Step 3.4**: Integrate with Firebase API
- [ ] **Step 3.5**: Test download functionality

### Phase 4: Prebid.js Documentation Migration

- [ ] **Step 4.1**: Copy dev-docs content to docs/dev-docs/prebidjs/
- [ ] **Step 4.2**: Update frontmatter and links
- [ ] **Step 4.3**: Fix image and asset references
- [ ] **Step 4.4**: Update sidebar configuration
- [ ] **Step 4.5**: Test versioning functionality

### Phase 5: Prebid Server Documentation Migration

- [ ] **Step 5.1**: Copy prebid-server content to docs/dev-docs/prebid-server/
- [ ] **Step 5.2**: Separate Java and Go documentation
- [ ] **Step 5.3**: Update frontmatter and links
- [ ] **Step 5.4**: Configure versioning for both Java and Go
- [ ] **Step 5.5**: Test versioning functionality

### Phase 6: Prebid Mobile Documentation Migration

- [ ] **Step 6.1**: Copy prebid-mobile content to docs/dev-docs/prebid-mobile/
- [ ] **Step 6.2**: Separate iOS and Android documentation
- [ ] **Step 6.3**: Update frontmatter and links
- [ ] **Step 6.4**: Configure versioning for both platforms
- [ ] **Step 6.5**: Test versioning functionality

### Phase 7: Guides Migration

- [ ] **Step 7.1**: Copy guide content to docs/content/guides/
- [ ] **Step 7.2**: Organize into subdirectories (ad-ops, privacy, etc.)
- [ ] **Step 7.3**: Update frontmatter and links
- [ ] **Step 7.4**: Fix any Jekyll-specific syntax
- [ ] **Step 7.5**: Test navigation and links

### Phase 8: Formats Migration

- [ ] **Step 8.1**: Copy formats content to docs/content/formats/
- [ ] **Step 8.2**: Organize into subdirectories
- [ ] **Step 8.3**: Update frontmatter and links
- [ ] **Step 8.4**: Fix any Jekyll-specific syntax
- [ ] **Step 8.5**: Test navigation and links

### Phase 9: Tools Documentation Migration

- [ ] **Step 9.1**: Copy tools content to docs/dev-docs/tools/
- [ ] **Step 9.2**: Organize into subdirectories
- [ ] **Step 9.3**: Update frontmatter and links
- [ ] **Step 9.4**: Fix any Jekyll-specific syntax
- [ ] **Step 9.5**: Test navigation and links

### Phase 10: Final Cleanup and Testing

- [ ] **Step 10.1**: Create comprehensive migration checklist
- [ ] **Step 10.2**: Identify unmigrated files
- [ ] **Step 10.3**: Test all navigation and links
- [ ] **Step 10.4**: Validate search functionality
- [ ] **Step 10.5**: Performance testing
- [ ] **Step 10.6**: Create MIGRATION.md for tracking

## Files to NOT Migrate

- consentmanager (excluded per requirements)
- algolia site search (excluded per requirements)

## Technical Requirements

### Custom Version Dropdown

- Must show project ID in selection
- Support multiple versioned projects
- Maintain current version selection state
- Integrate with Docusaurus routing

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

- **Phase 1-2**: 1-2 weeks (Foundation and Version Dropdown)
- **Phase 3**: 1 week (Download Page)
- **Phase 4-6**: 2-3 weeks (Project Documentation)
- **Phase 7-9**: 1-2 weeks (Guides, Formats, Tools)
- **Phase 10**: 1 week (Testing and Cleanup)

**Total Estimated Time**: 6-9 weeks

## Next Steps

1. Begin with Phase 1.1: Create target folder structure
2. Set up development environment for testing
3. Create backup of current documentation
4. Start implementing custom version dropdown
