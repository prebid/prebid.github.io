---
layout: api_prebidjs
title: pbjs.renderBid(bid, options)
description: renderBid API
sidebarType: 1
---


Render a bid in an isolated iframe inside its ad unit's element, without an ad server's on-page library (such as GPT) handling rendering. Requires the [Safe Rendering module](/dev-docs/modules/safeRendering.html).

**Kind**: static method of pbjs API

The contents of the bid's element are replaced with a single iframe, and the ad is rendered inside it. The frame has an opaque origin and the same `sandbox` attribute as Google Ad Manager's SafeFrames, so the creative can't reach the publisher's page. The element is the ad unit's [`element`](/dev-docs/adunit-reference.html#adunit), or `document.getElementById(adUnitCode)` by default.

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| bid | Required | `object` | The bid to render, for example one returned by [`getHighestCpmBids`](/dev-docs/publisher-api-reference/getHighestCpmBids.html). Only its `adId` is used. |
| options | Optional | `object` | The same options as [`renderAd`](/dev-docs/publisher-api-reference/renderAd.html) (listed below). |
| options.clickThrough | Optional | `string` | A URL used to resolve the `${CLICKTHROUGH}` macro in the ad markup. |
| options.viewUrl | Optional | `string` | The ad server's view-tracking URL. Prebid.js stores it on the rendered bid as `bid.viewUrl` but does not fire it. |

**Example**:

```javascript
pbjs.requestBids({
  bidsBackHandler: function () {
    pbjs.getHighestCpmBids().forEach(function (bid) {
      pbjs.renderBid(bid);
    });
  }
});
```

If the render can't start, `renderBid` emits `adRenderFailed`; see the [Safe Rendering module](/dev-docs/modules/safeRendering.html#events) for the reasons and other limitations.
