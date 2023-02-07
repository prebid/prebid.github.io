---
layout: page_v2
title: Prebid Universal Creative
description: An overview of Prebid Universal Creative
sidebarType: 3
nav_section: intro
---

<div class="bs-docs-section" markdown="1">

# Prebid Universal Creative
{:.no_toc}

* TOC
{:toc}

## Overview

The Prebid Universal Creative (PUC) is a collection of rendering routines
that can pull a particular ad ID from Prebid's cache and do the right
thing to display it. The scripts are generally entered into the ad server for
when a Prebid ad has won the auction. There are a number of use cases:

{: .table .table-bordered .table-striped }
| Use Case | PUC file | Alternate Approach |
| --- | --- | --- |
| web banner: iframe | creative.js | [Banner and Outstream Video iframes](#banner-and-outstream-video-iframes) |
| web banner: safeframe | creative.js | [Banner Safeframes](#banner-safeframes) |
| web outstream video: iframe | creative.js | [Banner and Outstream Video iframes](#banner-and-outstream-video-iframes) |
| web outstream video: safeframe | n/a | Outstream renderers each choose where to render differently, but none writes to the safeframe. |
| AMP banner: always safeframe | creative.js | n/a |
| native: iframe | native-render.js | n/a |
| native: safeframe | native-render.js | n/a |

The Prebid Universal Creative is the simplest approach for publishers to configure Prebid in their ad server. The PUC provides a creative configuration that can be used across several formats, platforms, devices, and ad servers.

Here are the features of the PUC in various scenarios:

### What the PUC does for Web iframe Banners/Outstream
1. Simply calls the Prebid.js renderAd function

### What the PUC does for Web Safeframe Banners
1. Calls PostMessage to get the winning ad from Prebid.js
1. Creates an iframe of the appropriate size and displays the winning ad within it

### What the PUC does for AMP and Mobile Apps
1. Updates the size of the iframe to the size of the winning ad.
1. Retrieves the body of the creative from Prebid Cache based on the UUID
1. If the 'burl' parameter is present, creates a tracking pixel. Includes special support for triggering the viewable billing url for mobile MRAID creatives.
1. If the 'nurl' parameter is present, creates the appropriate HTML to fire the notice URL.
1. If the 'wurl' parameter is present, creates a tracking pixel. This is needed for [Programmatic Guaranteed](/prebid-server/features/pg/pbs-pg-idx.html) support.
1. Resolves any `${AUCTION_PRICE}` macro in the creative body.

### What the PUC does for Native
1. Retrieves the native attributes from the winning ad.
1. Coordinates the rendering of the native ad using the template method specified by the publisher.

## Alternate Approaches

Some publishers prefer to not load the extra creative.js code at render time
due to a tiny but measurable impact on measurement discrepancies.

While Prebid recommends the use of creative.js because we regularly add
features and fix bugs, publishers may choose to hardcode the functionality
into their ad server creatives.

They would do this differently for each of the scenarios below.

### Alternate method for Banner and Outstream Video iframes

If you only ever need to display non-safeframed banner and outstream-video creatives, you may use
the simple approach of just calling the Prebid.js `renderAd` function directly:

```
<script> var w = window; for (i = 0; i < 10; i++) { w = w.parent; if (w.pbjs) { try { w.pbjs.renderAd(document, '%%PATTERN:hb_adid%%'); break; } catch (e) { continue; } } } </script>
```

### Alternate Method for Banner Safeframes

See the example at [https://github.com/prebid/Prebid.js/blob/master/integrationExamples/gpt/x-domain/creative.html](https://github.com/prebid/Prebid.js/blob/master/integrationExamples/gpt/x-domain/creative.html)

This is basically just part of the PUC that's been isolated to be standalone.

## Further Reading

- [Step by Step Guide to Google Ad Manager Setup](/adops/step-by-step.html)
- [Setting up Prebid with the Xandr Monetize Ad Server](/adops/setting-up-prebid-with-the-appnexus-ad-server.html)
