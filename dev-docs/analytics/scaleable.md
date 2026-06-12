---
layout: analytics
title: Scaleable
description: Scaleable Analytics Adapter
modulecode: scaleable
tcfeu_supported: false
usp_supported: true
gpp_supported: true
coppa_supported: true
prebid_member: false
---

## Analytics Options

{: .table .table-bordered .table-striped }
| Name              | Scope    | Description                                                          | Example          | Type     |
|-------------------|----------|---------------------------------------------------------------------|------------------|----------|
| `siteId`          | required | Identifies your site to Scaleable. Contact Scaleable to receive it. | `'YOUR_SITE_ID'` | `string` |
| `auctionEndDelay` | optional | Milliseconds to wait after `AUCTION_END` before reporting (default 1500). | `1000`     | `int`    |
| `sampling`        | optional | 0–1; the fraction of sessions to collect data on (default 1.0).     | `0.5`            | `float`  |

## Example Configuration

```javascript
pbjs.enableAnalytics({
    provider: 'scaleable',
    options: {
        siteId: 'YOUR_SITE_ID' // contact Scaleable to receive your siteId
    }
});
```

## Registration

Contact team@scaleable.ai for more information or to sign up for analytics. See [Scaleable Advertising](https://scaleable.ai/services/advertising).
