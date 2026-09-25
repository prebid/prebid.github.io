---
layout: analytics
title: Nexx360
description: Nexx360 Analytics Adapter
modulecode: nexx360Analytics
prebid_member: false
tcfeu_supported: false
usp_supported: false
coppa_supported: false
---

## About

The Nexx360 Analytics Adapter reports Prebid.js auction activity to the Nexx360
monitoring platform for reporting and troubleshooting. It tracks the auction
lifecycle — auction init, bid requests, bid responses, and bid timeouts (batched
per auction) — and sends bid wins and ad-render outcomes as they happen. For
Nexx360 server-side demand, it also reports a per-auction server-auction summary.

Sampling is applied server-side by the Nexx360 collector, so the adapter sends
all events and exposes no client-side sampling option. The adapter does not read
or write browser storage.

## Analytics Options

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| ------ | ------- | ------------- | --------- | ------ |
| publisherId | required | Your Nexx360 publisher identifier | `'1067'` | string |
| endpoint | optional | Collector endpoint URL. Defaults to `https://monitoring.nexx360.io`. | `'https://monitoring.nexx360.io'` | string |
| abTestLabel | optional | A/B test variant label, attached to every event so analytics can be sliced by test arm | `'variantA'` | string |

## Example Configuration

```javascript
pbjs.enableAnalytics({
    provider: 'nexx360Analytics',
    options: {
        publisherId: 'your-publisher-id'
    }
});
```

## Registration

Please contact [tech@nexx360.io](mailto:tech@nexx360.io) to obtain your Nexx360 publisher credentials.
