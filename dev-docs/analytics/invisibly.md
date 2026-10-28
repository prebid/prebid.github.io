---
layout: analytics
title: Invisibly
description: Invisibly Analytics Adapter
modulecode: invisibly
---

## Registration

Please visit [invisibly.com](https://invisibly.com/) for more information.

## Configuration

The analytics provider code is `invisiblyAnalytics`.

```javascript
pbjs.enableAnalytics({
  provider: 'invisiblyAnalytics',
  options: {
    account: 'your-account'
  }
});
```

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description |
| --- | --- | --- | --- |
| `account` | required | `string` | Invisibly account. If missing, the adapter is not enabled. It is not sent in the payload. |
| `bundleId` | optional | `string` | Identifier sent with every event as `bundleId`. |
| `url` | optional | `string` | Collection endpoint. Defaults to `https://api.pymx5.com/v1/sites/events`. |

## Collected Data

The adapter is hard-coded to enable on about 1% of page loads (randomly chosen); on the rest no events are sent.

It listens to `auctionInit`, `auctionEnd`, `bidRequested`, `bidResponse`, `bidAdjustment`, `noBid`, `bidTimeout`, `bidWon`, `bidderDone`, `setTargeting`, `requestBids` and `adRenderFailed`, plus a page view record (user agent, language, timezone offset, viewport size). Events are queued and flushed every second until the first `auctionEnd`, then on each `auctionEnd`. Each event is sent as its own ajax `POST` (`application/json`, with credentials) to the `url`, with `event_type` set to `PREBID_<eventType>` and the full event arguments in `event_data`.
