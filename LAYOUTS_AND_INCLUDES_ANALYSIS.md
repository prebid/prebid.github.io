# Layouts and Includes Analysis

## Overview
This document summarizes the analysis of Jekyll layouts and includes, the React components we've created to replace them, and recommendations for cleanup.

## React Components Created

### Layouts

1. **HomeLayout** (`src/components/layouts/HomeLayout.tsx`)
   - Replaces `_layouts/home.html`
   - Features: Product cards, format sections, GitHub banner, subscribe form
   - TypeScript interfaces for type safety

2. **BidderLayout** (`src/components/layouts/BidderLayout.tsx`)
   - Replaces `_layouts/bidder.html`
   - Features: Sidebar navigation, bidder-specific content, send-all-bids table
   - Handles full-screen mode and bidder metadata

3. **DocsLayout** (`src/components/layouts/DocsLayout.tsx`)
   - Replaces `_layouts/page_v2.html`
   - Features: General documentation layout with sidebar
   - Optional partners section

### Includes

1. **Navigation** (`src/components/includes/Navigation.tsx`)
   - Replaces `_includes/nav.html`
   - Features: Dropdown menus, mobile responsive, search integration
   - State management for dropdown interactions

2. **Sidebar** (`src/components/includes/Sidebar.tsx`)
   - Replaces `_includes/left_nav.html`
   - Features: Collapsible sections, active state management
   - Complex navigation structure support

3. **Footer** (`src/components/includes/Footer.tsx`)
   - Replaces `_includes/footer.html`
   - Features: Links, social media, copyright
   - Responsive design

## Layouts Analysis

### Essential Layouts (Created React Components)

- ✅ `home.html` → HomeLayout
- ✅ `bidder.html` → BidderLayout  
- ✅ `page_v2.html` → DocsLayout
- ✅ `example.html` → Can be consolidated into DocsLayout

### Layouts That Can Be Removed

1. **`test.html`** - Test layout, not needed in production
2. **`userid.html`** - User ID specific, can be consolidated
3. **`video_sample.html`** - Video specific, can be consolidated
4. **`api_prebidjs.html`** - API docs, can be consolidated with DocsLayout
5. **`internal_api_prebidjs.html`** - Internal API, can be consolidated
6. **`pb-video-template.html`** - Video template, can be consolidated
7. **`analytics.html`** - Analytics layout, can be consolidated
8. **`fourofour.html`** - 404 page, Docusaurus handles automatically

## Includes Analysis

### Essential Includes (Created React Components)

- ✅ `nav.html` → Navigation
- ✅ `left_nav.html` → Sidebar
- ✅ `footer.html` → Footer
- ✅ `partners.html` → Can be added to Navigation or Footer
- ✅ `live_demo.html` → Can be componentized
- ✅ `wth_form.html` → Can be componentized

### Includes That Can Be Removed

1. **`vimeo-iframe.html`** - Simple iframe wrapper, can be inline
2. **`prebidjs-non-prod.html`** - Non-production warning, can be component
3. **`gptjs.html`** - Simple script include, can be inline
4. **`astjs.html`** - Simple script include, can be inline
5. **`legal-warning.html`** - Legal warning, can be component
6. **`body-end.html`** - Body end scripts, Docusaurus handles
7. **`example_tab.html`** - Example tab, can be simplified
8. **`head.html`** - Simple head include, can be consolidated

### SVG Icons
All SVG icons in `_includes/` can be moved to `static/assets/icons/` and imported as React components:

- `icon__format--*.svg` files
- Other icon files

## Directory Structure Changes

### Completed

- ✅ Moved `dev-docs/bidders/` to `docs/dev-docs/prebidjs/bidders/` using `git mv`

### Recommended Next Steps

1. Remove unnecessary layout files
2. Remove unnecessary include files
3. Move SVG icons to static assets
4. Update any remaining references to old paths

## Benefits of React Components

1. **Type Safety** - TypeScript interfaces for all props
2. **Reusability** - Components can be used across different pages
3. **Maintainability** - Easier to update and modify
4. **Performance** - React's virtual DOM optimization
5. **Accessibility** - Better ARIA support and keyboard navigation
6. **State Management** - Proper state handling for interactive elements

## Migration Status

- ✅ Phase 2.1: Create React components for essential layouts
- ✅ Phase 2.2: Create React components for essential includes  
- ✅ Phase 2.3: Identify and remove unnecessary layouts/includes
- ✅ Phase 2.4: Move bidders directory

## Next Steps

1. **Remove unnecessary files** - Delete the identified layouts and includes
2. **Move SVG icons** - Relocate to static assets
3. **Update references** - Fix any remaining links to old paths
4. **Test components** - Ensure all React components work correctly
5. **Add styling** - Ensure CSS classes are properly applied 
