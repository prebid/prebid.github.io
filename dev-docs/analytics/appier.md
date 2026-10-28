---
layout: analytics
title: Appier
description: Appier Analytics Adapter
modulecode: appier
---

## Registration

Please visit [www.appier.com](https://www.appier.com/) for more information. An affiliate ID and config ID provided by Appier are required.

## Configuration

The provider code is `appierAnalytics`. The [Currency module](/dev-docs/modules/currency.html) is required for bids not in USD.

```javascript
pbjs.enableAnalytics({
  provider: 'appierAnalytics',
  options: {
    affiliateId: 'YOUR_AFFILIATE_ID',
    configId: 'YOUR_CONFIG_ID'
  }
});
```

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description |
| --- | --- | --- | --- |
| `affiliateId` | required | `string` | Affiliate ID provided by Appier. If missing or empty, the adapter is not enabled. |
| `configId` | required | `string` | Config ID provided by Appier. If missing or empty, the adapter is not enabled. |
| `server` | optional | `string` | Collection base URL. Default: `https://prebid-analytics.c.appier.net/v1`. |
| `sampling` | optional | `number` | Probability (0 to 1) that a page load is tracked. Default: all page loads are tracked. |
| `adSampling` | optional | `number` | Probability (0 to 1) that bid creatives (ad markup) are also sent. Default: never sent. |
| `autoPick` | optional | any | Value passed through in every payload. Default: `null`. |
| `predictionId` | optional | any | Value passed through in every payload. Default: `null`. |

## Data Collected

The adapter listens to `bidTimeout`, `auctionEnd` and `bidWon`. Data is sent by ajax POST (JSON, with credentials) to these paths under `server`:

- `/bid`: at `auctionEnd`, per ad unit and bidder: bid/no-bid/timeout status, response time, CPM (original, converted and USD), currency and whether it was the highest-CPM bid. Includes auction elapsed time, timeout and page URL.
- `/imp`: at `bidWon`, the winning bid.
- `/cr`: at `auctionEnd`, ad markup of received bids, only when sampled by `adSampling`.
