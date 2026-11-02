---
layout: analytics
title: MediaNet
description: MediaNet Analytics Adapter
modulecode: medianet
prebid_member: true
---

## Registration

Please visit [www.media.net](https://www.media.net/) for more information. A Media.net customer ID (`cid`) is required.

## Configuration

```javascript
pbjs.enableAnalytics({
  provider: 'medianetAnalytics',
  options: {
    cid: '8CUX0H51C'
  }
});
```

{: .table .table-bordered .table-striped }

| Name | Scope | Type | Description |
| --- | --- | --- | --- |
| `cid` | required | string | Media.net customer ID. If missing, the adapter logs an error and is not enabled. |
| `enabledUids` | optional | array of strings | User ID keys (as returned by `pbjs.getUserIds()`) whose values are logged. Default: `[]`; only the names of available IDs are logged. |
| `loggingConfig` | optional | object | Inline logging configuration used instead of fetching it from Media.net. Supports `percentage` (number, auction log sampling percentage), `loggingDelay` (number, ms), and `domain` (object mapping a domain to its own `{ percentage }`). |
| `loggingDelay` | optional | number | Milliseconds to wait after `auctionEnd` for pending bidders before sending the auction log. Default: `500`. |
| `sampling` | optional | number | Not applied as Prebid sampling: the adapter always forces it to `1` and only reports the configured value to Media.net. |

## Data Collection

The adapter listens to `auctionInit`, `bidRequested`, `bidResponse`, `bidRejected` (floor not met), `noBid`, `bidTimeout`, `bidderDone`, `auctionEnd`, `bidWon`, `adRenderFailed`, `adRenderSucceeded`, and `staleRender`. It also listens to GPT `slotResponseReceived` events to capture the line item and creative IDs of winning slots.

- **Configuration:** unless `loggingConfig` is set, the adapter fetches its sampling percentage from `prebid.media.net`. Auction logs are sampled at 10% by default. On `localhost` or when the page URL contains `medianet_test`, all auctions are logged.
- **Auction logs:** for each ad unit, once all bidders have responded after `auctionEnd` (or after `loggingDelay`, or when the page is hidden), all bids are sent with status, CPM (converted to USD), price bucket, size, timing, floors, ad server targeting, page URL, referrer, and consent strings (GDPR, USP, GPP), and the COPPA flag.
- **Win logs:** every `bidWon` is logged, regardless of sampling.
- Auction and win logs are sent with `sendBeacon` to `navvy.media.net`, falling back to an ajax `POST`.
- Errors and render events are sent as image pixels to `qsearch-a.akamaihd.net`.
- For instream video, when Prebid Cache (`cache.url`) is configured, the adapter adds a VAST impression tracker pointing to `pb-logs.media.net`.
