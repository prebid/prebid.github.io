---
layout: page_v2
page_type: module
title: Module - SeenThis Brand Stories
description: Enable SeenThis Brand Stories ad format integration with fullscreen support
module_code: seenthisBrandStories
display_name: SeenthisBrandStories
enable_download: true
vendor_specific: true
sidebarType: 1
---

# SeenthisBrandStories Module

{:.no_toc}

- TOC
  {:toc}

## Overview

The module enables publishers to integrate SeenThis Brand Stories ads within Prebid.js. This module provides communication between the publisher's page and Brand Stories ad iframes, handling dynamic resizing, fullscreen mode, and responsive design considerations.

The module is bidder adapter agnostic and works with all Prebid.js adapters that serve Brand Stories creative content.

## Configuration

This module requires no configuration. Once included in your Prebid.js build, it automatically handles Brand Stories ads when they are served.

## Implementation

### Basic Setup

1. Include the SeenThis Brand Stories module in your Prebid.js build
2. Configure your ad units as normal - no special configuration needed
3. The module will automatically detect Brand Stories creatives and manage their behavior

## Technical Details

### Message Event Management

The module listens for specific message events from Brand Stories iframes and responds accordingly:

- Iframe resizing requests
- Fullscreen mode transitions
- Style and class modifications
- Margin calculations for responsive layout

### CSS and Styling

The module dynamically applies CSS modifications to ensure proper display:

- Full-width responsive behavior
- Auto-height adjustments
- Dynamic margin calculations
- Class-based style modifications

## Testing

A test page has been created to validate the integration:

- **Test Page**: [https://cdn.staging.sitestream.co/libs/storylines/branch-prebid-test-page-b52cdb5a/examples/prebid.html](https://cdn.staging.sitestream.co/libs/storylines/branch-prebid-test-page-b52cdb5a/examples/prebid.html)

### Local Testing

For testing with your own Prebid.js build:

1. Open the test page in Chrome
2. Use the Network tab's "Override content" feature
3. Replace the Prebid.js file with your custom build
4. Verify that Brand Stories ads display and behave correctly

## Troubleshooting

### Common Issues

1. **Ads not resizing properly**: Ensure the module is included in your Prebid.js build
2. **Fullscreen mode not working**: Check for conflicting CSS or JavaScript on the page
3. **Multiple instances interfering**: The module handles this automatically, but ensure unique ad unit codes
