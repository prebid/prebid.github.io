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

- TOC
{:toc}

## Overview

The Prebid Universal Creative (PUC) is a collection of rendering routines
that can pull a particular ad ID from Prebid's cache and do the right
thing to display it. The scripts are generally entered into the ad server for
when a Prebid ad has won the auction. There are a number of use cases:

{: .table .table-bordered .table-striped }
| Use Case | PUC file | Alternate Approach |
| --- | --- | --- |
| Web Banner: iframe | banner.js (or creative.js) | [Dynamic creatives](#alt-dyn), [Banner and In-Renderer Video iframes](#alt-iframes) |
| Web Banner: safeframe | banner.js (or creative.js) | [Dynamic creatives](#alt-dyn), [Banner Safeframes](#alt-safeframes) |
| Web In-Renderer Video: iframe | video.js (or creative.js) | [Dynamic creatives](#alt-dyn), [Banner and In-Renderer Video iframes](#alt-iframes) |
| Web In-Renderer Video: safeframe | n/a | Renderers each choose where to render differently, but none writes to the safeframe. |
| AMP Banner: always safeframe | amp.js (or creative.js) | n/a |
| native: iframe | native.js (or native-render.js) | [Dynamic creatives](#alt-dyn) |
| native: safeframe | native.js (or native-render.js) | [Dynamic creatives](#alt-dyn) |

Note that as of PUC v1.15, the recommended way of loading the creative
in the ad server involves using the `hb_format` ad server key-value. Before 1.15, the ad server needed to load creative.js which covered banner and in-renderer video, or native-render.js for native. 1.15 simplifies this
by allowing the ad server creative to load banner.js, video.js, or native.js, which can be done programmatically using ad server macros. e.g.

```html
<script src="https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/%%PATTERN:hb_format%%.js"></script>
```

This loads the PUC from the Prebid-maintained location. Your managed
service provider may have a different location.

## Features of the PUC

### What the PUC does for Web iframe Banners/In-Renderer

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

<a name="alt-dyn"></a>

### Prebid.js dynamic creatives

If you only need to display creatives rendered by Prebid.js (as opposed platforms like AMP or mobile SDKs), 
you can avoid loading the PUC script - and the performance cost that entails - but still keep some of its advantages, such as regular updates,
by using [Prebid.js dynamic creatives](/adops/js-dynamic-creative.html). 

<a name="alt-iframes"></a>

### Alternate methods for Banner and In-Renderer Video iframes

If you only ever need to display non-safeframed banner and in-renderer-video creatives, there are several ways to replace the `jsdelivr` call in your ad server creative:

1. Copy the contents of `https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/creative.js` into each creative.
1. Directly call the Prebid.js `renderAd` function:

```html
<script> var w = window; for (i = 0; i < 10; i++) { w = w.parent; if (w.pbjs) { try { w.pbjs.renderAd(document, '%%PATTERN:hb_adid%%'); break; } catch (e) { continue; } } } </script>
```

<a name="alt-safeframes"></a>

### Alternate Method for Banner Safeframes

If safeframe support is required, some options are:

1. Copy the contents of `https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/creative.js` into each ad server creative.
2. [Prebid.js dynamic creatives](/adops/js-dynamic-creative.html)

## Further Reading

- [Step by Step Guide to Google Ad Manager Setup](/adops/step-by-step.html)
- [Setting up Prebid with the Xandr Monetize Ad Server](/adops/setting-up-prebid-with-the-appnexus-ad-server.html)
- [Prebid.js dynamic creatives](/adops/js-dynamic-creative.html)
