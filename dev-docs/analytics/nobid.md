---
layout: analytics
title: NoBid
description: NoBid Analytics Adaptor
modulecode: nobidAnalytics
gvl_id: 816
enable_download: false
---

#### Registration

The NoBid Analytics Adapter is free to use during our Beta period, but requires a simple registration with NoBid. Please visit [www.nobid.io](https://www.nobid.io/contact-1/) to sign up and request your Publisher ID Number to get started. If you're already using the NoBid Bid Adapter, you may use your existing Site ID Number with the analytics adapter.

The NoBid privacy policy is at [nobid.io/privacy-policy](https://www.nobid.io/privacy-policy/).

#### Analytics Options

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| provider | Required | String | The name of this module: `nobidAnalytics` | `nobidAnalytics` |
| options.siteId | Required | Number | This is the NoBid Site ID Number obtained from registering with NoBid. | `1234` |

### Example Configuration

```javascript
pbjs.enableAnalytics({
    provider: 'nobidAnalytics',
    options: {
        siteId: 123 // change to the Site ID you received from NoBid
    }
});
```
