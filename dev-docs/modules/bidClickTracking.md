---
layout: page_v2
page_type: module
title: Module - Bid Click Tracking
description: Observes clicks on Prebid-rendered creatives, emits bidClick events, and can register them with the ad server
module_code : bidClickTracking
display_name : Bid Click Tracking
enable_download : true
sidebarType : 1
---

# Bid Click Tracking
{:.no_toc}

- TOC
{:toc}

## Overview

Since Prebid.js 11.45, Prebid can observe clicks on the banner and native creatives it renders, on mobile and desktop. Each observed click emits a `bidClick` event and can be reported to the ad server. This serves two setups:

- **GAM with the dynamic creative:** register Prebid clicks in Google Ad Manager. The [dynamic creative](/adops/js-dynamic-creative.html) (`creative.html`) passes GAM's `%%CLICK_URL_UNESC%%` click URL to Prebid. With `fireTrackers: true`, Prebid requests that URL when it observes a click on the winning creative, so GAM can count the click on the Prebid line item.
- **The ad server bids into Prebid:** when [Prebid chooses the winner and renders it](/adops/ad-server-integration.html#the-ad-server-bids-into-prebid), no ad server creative counts clicks. `bidClick` gives analytics adapters, including the ad server's own analytics, a click event for the winning bid. `pbjs.renderAd` can also take the ad server's click URL as `clickThrough`, which `fireTrackers` requests.

{: .alert.alert-warning :}
Click observation is for creatives rendered by Prebid.js itself: the dynamic creative and `pbjs.renderAd`. It is not intended to work with the [Prebid Universal Creative](/overview/prebid-universal-creative.html), which only receives minimal maintenance. Switch Prebid line items to the dynamic creative to use it.

## Configuration

Observed clicks are handled by Prebid.js core when `bidClickTracking.enabled` is set. Include the `bidClickTracking` module in your build only if you also want the desktop fallback.

```javascript
pbjs.setConfig({
  bidClickTracking: {
    enabled: true,
    fireTrackers: true // GAM: request the creative's click URL on each observed click
  }
});

pbjs.onEvent('bidClick', ({ adId, adUnitCode, bidder, method }) => {
  // method is 'creativeClick' (banner) or 'nativeClick'
});
```

{: .table .table-bordered .table-striped }

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | Boolean | `false` | Observe clicks and emit `bidClick` events. |
| `fireTrackers` | Boolean | `false` | Request the ad server click URL (`clickUrl` from the dynamic creative, or `clickThrough` passed to `pbjs.renderAd`) on an observed banner click. |
| `desktopFallback` | Boolean | `false` | Requires the `bidClickTracking` module. On desktop, infer clicks on creatives whose clicks can't be observed, and emit `bidClickInferred`. |
| `dedupeNativeClicks` | Boolean | `true` | Emit `bidClick` for native clicks once per bid. Set `false` to emit it for every native click. Bidder click trackers fire on every click either way. |

## How It Works

- **Banner:** for markup (`ad`) rendered by Prebid, Prebid listens inside the creative's iframe for trusted clicks on links (`<a href>`, `<area href>`) and emits `bidClick` with `method: 'creativeClick'`. It doesn't change navigation or add overlays. Clicks inside nested cross-origin iframes, `adUrl` creatives, and clicks that navigate with JavaScript can't be observed.
- **Native:** clicks reported by the native creative (links with the `pb-click` class) emit `bidClick` with `method: 'nativeClick'` and the clicked `assetId`, if any. The bidder's native click trackers fire on every click, as they do without this setting, with keepalive requests so they survive the navigation. GAM clicks still come from the native template's `%%CLICK_URL_UNESC%%` links, so enabling this doesn't change what bidders or GAM receive. Native landing URLs are never fired as trackers.
- **Desktop fallback:** with `desktopFallback: true` and the module included, on devices with a fine pointer, focus moving from the page into a creative's iframe (not with the Tab key) is treated as a click and emits `bidClickInferred`. It's a heuristic: some focus changes aren't clicks, and some clicks don't move focus.
- Each bid emits at most one banner click event (observed or inferred), and with `dedupeNativeClicks`, one native click event.

## Registering Clicks in GAM

Prebid line items using the [dynamic creative](/adops/js-dynamic-creative.html) already pass `clickUrl: "%%CLICK_URL_UNESC%%"`. Enable `fireTrackers` to have Prebid request it on each observed click.

- Prebid only requests resolved HTTPS URLs, and doesn't request the click URL when the bid's markup contains `${CLICKTHROUGH}`, since that creative already sends its clicks through the ad server.
- Requesting GAM's click URL as a background request, rather than navigating through it, hasn't been validated for GAM click counting or invalid-click treatment. Check the reported clicks against your expectations before relying on them.
- Click tracking inside the bidder's creative is independent, so clicks may also be counted elsewhere.

## Trust

`bidClick` and `bidClickInferred` are signals, not verified clicks. Banner clicks are reported to Prebid by messages from the creative frame, and any frame on the page that knows the bid's `adId`, including the creative's own scripts, can send one without a click.

- Prebid ignores these reports until the user has interacted with the page (`navigator.userActivation.hasBeenActive`), so no click can be reported for an impression nobody interacted with.
- Ad server click URLs are only requested when the browser supports that check. Browsers without `navigator.userActivation` still get the event.
- Once the user has interacted with the page, a frame can still report a click it didn't receive, at most once per bid.

## Analytics

Analytics adapters receive `bidClick` and `bidClickInferred` like other events. The event argument contains:

{: .table .table-bordered .table-striped }

| Field | Description |
| --- | --- |
| `bid` | The winning bid |
| `adId`, `adUnitCode`, `bidder` | Identify the bid |
| `method` | `creativeClick`, `nativeClick`, or `iframeFocus` (for `bidClickInferred`) |
| `assetId` | The clicked native asset, if any |

The [generic analytics adapter's](/dev-docs/analytics/generic.html) `skinny` preset includes both events, with bid identifiers but without the bid, creative markup or click URL.

## Further Reading

- [Prebid.js dynamic creatives](/adops/js-dynamic-creative.html)
- [Ad Server Integration](/adops/ad-server-integration.html)
- [pbjs.renderAd](/dev-docs/publisher-api-reference/renderAd.html)
