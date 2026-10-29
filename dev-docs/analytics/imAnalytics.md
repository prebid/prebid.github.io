---
layout: analytics
title: IM Analytics
description: IM Analytics Adapter for Prebid.js
modulecode: imAnalytics
gdpr_supported: false
usp_supported: true
gpp_supported: true
coppa_supported: true
enable_download: true
---

## Description

Analytics Adapter for IM-DMP.

Please visit [intimatemerger.com/im-uid](https://intimatemerger.com/r/im-uid) and request your Customer ID to get started.

If you are an existing publisher and you already use [IM-UID](/dev-docs/modules/userid-submodules/imuid.html), you can use the same Customer ID for this analytics adapter.

By enabling this adapter, you agree to Intimate Merger's privacy policy at <https://corp.intimatemerger.com/privacypolicy/>.

## Configuration

To enable the IM Analytics adapter, configure it in your Prebid.js setup. Use `imAnalytics` as the provider and provide the appropriate `options`.

### Analytics Options

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Example | Description |
| --- | --- | --- | --- | --- |
| `cid` | optional | number | 5126 | The Customer ID provided by Intimate Merger. |
| `waitTimeout` | optional | number | 1500 | Wait time in milliseconds before sending batched requests. (Default: 1500) |

### Example Configuration

```javascript
pbjs.enableAnalytics({
    provider: 'imAnalytics',
    options: {
        /* Optional: Customer ID. Set the Customer ID assigned to you. */
        cid: 5126,
        /* Optional: Wait 2 seconds */
        waitTimeout: 2000
    }
});
```
