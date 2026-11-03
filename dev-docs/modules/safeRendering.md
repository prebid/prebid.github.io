---
layout: page_v2
page_type: module
title: Module - Safe Rendering
description: Render winning bids in isolated, SafeFrame-style iframes without an ad server
module_code : safeRendering
display_name : Safe Rendering
enable_download : true
sidebarType : 1
---

# Safe Rendering Module
{:.no_toc}

* TOC
{:toc}

## Overview

The Safe Rendering module adds [`pbjs.renderBid`](/dev-docs/publisher-api-reference/renderBid.html), which renders a winning bid in an iframe that can't reach the publisher's page: a `data:` URL frame, which has an opaque origin, with the same `sandbox` attribute Google Ad Manager uses for its SafeFrames. You don't need GPT, an ad server or a separately hosted creative.

Use it when Prebid.js selects the winner itself, for example when [running Prebid.js as an ad server](/dev-docs/examples/no-adserver.html), and you want the creative isolated from the page. It works with any way of picking the winner, including [deal priority](/dev-docs/publisher-api-reference/bidderSettings.html#212-allowprioritybids).

This is the recommended way to isolate Prebid.js demand without an ad server. Prefer it to hosting the IAB SafeFrame 1.1 reference implementation or building your own frames. It uses modern browser messaging (a `MessageChannel` per render, tied to a one-time token), and keeps Prebid.js's rendering, events and tracking.

## Usage

Include the module in your Prebid.js build, then render a bid once the auction ends:

```javascript
pbjs.requestBids({
  bidsBackHandler: function () {
    pbjs.getHighestCpmBids().forEach(function (bid) {
      pbjs.renderBid(bid);
    });
  }
});
```

`renderBid` replaces the contents of the bid's element with a single iframe and renders the ad inside it. The element is the ad unit's [`element`](/dev-docs/adunit-reference.html#adunit), or `document.getElementById(adUnitCode)` by default. It must be in the page that loaded Prebid.js, or in a same-origin iframe inside it.

It honors `auctionOptions.suppressStaleRender` and `auctionOptions.suppressExpiredRender`: a suppressed render leaves the element untouched.

## Configuration

{: .table .table-bordered .table-striped }
| Param | Type | Description | Default |
| --- | --- | --- | --- |
| `safeRendering.exclusive` | Boolean | If `true`, Prebid.js only answers rendering messages from frames created by `renderBid`, and ignores all others. | `false` |

```javascript
pbjs.setConfig({
  safeRendering: {
    exclusive: true
  }
});
```

By default, any frame that knows a bid's `adId` can message Prebid.js to get that ad's markup and trigger its rendering logic. This is how ad server creatives such as the [Prebid Universal Creative](/overview/prebid-universal-creative.html) render in GAM SafeFrames. With `exclusive: true`, only messages carrying the one-time token `renderBid` gives its frame are accepted.

{: .alert.alert-warning :}
`exclusive: true` also turns off rendering through ad server creatives (Prebid Universal Creative, or any creative calling Prebid.js from a cross-origin frame). Only enable it when every ad is rendered with `renderBid`.

Even without `exclusive`, once a bid has been rendered with `renderBid`, messages for that bid must come through the channel set up by its frame.

## Limitations

* The SafeFrame `$sf` API is not provided yet, so creatives that depend on `$sf.ext` (geometry, expansion) won't get it.
* The creative frame has an opaque origin: creatives can't use cookies or local storage in that frame. Frames the creative itself loads from a real origin can.
* Bids that would be rendered by a renderer running in the publisher's page (a top window `renderer` without a [Safe Renderer](/dev-docs/renderer.html)) are refused. Use a Safe Renderer instead.
* Your Content Security Policy must allow `data:` frames (`frame-src data:`, or `child-src` if `frame-src` isn't set). Otherwise the browser blocks the frame and nothing renders.

## Events

A render that can't start emits `adRenderFailed` with one of these reasons:

{: .table .table-bordered .table-striped }
| Reason | When |
| --- | --- |
| `missingDocOrAdid` | The bid has no `adId`. |
| `cannotFindAd` | No bid with that `adId` is known to Prebid.js. |
| `preventWritingOnMainDocument` | The bid uses a renderer that would run outside the ad frame. |
| `invalidElement` | The bid's element is missing, not attached to a window, or not in Prebid.js's page or a same-origin frame inside it. |
| `exception` | Setting up the frame threw an error. |

Once the frame is set up, rendering reports `adRenderSucceeded` or `adRenderFailed` as with other rendering methods.

## Further Reading

* [pbjs.renderBid](/dev-docs/publisher-api-reference/renderBid.html)
* [Prebid as Ad Server with Cross-Origin Rendering](/dev-docs/examples/no-adserver-safeframe.html)
* [Renderer](/dev-docs/renderer.html)
