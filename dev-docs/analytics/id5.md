---
layout: analytics
title: ID5
description: ID5 Analytics Adapter
modulecode: id5Analytics
gdpr_supported: true
usp_supported: true
prebid_member: true
gvl_id: 131
enable_download: false
---

#### Registration

The ID5 Analytics Adapter is free to use during our Beta period, but requires a simple registration with ID5. Please visit [id5.io/solutions](https://id5.io/solutions#publishers) to sign up and request your ID5 Partner Number to get started. If you're already using the ID5 Universal ID, you may use your existing Partner Number with the analytics adapter.

The ID5 privacy policy is at [id5.io/platform-privacy-policy](https://id5.io/platform-privacy-policy).

#### Analytics Options

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| provider | Required | String | The name of this module: `id5Analytics` | `id5Analytics` |
| options.partnerId | Required | Number | This is the ID5 Partner Number obtained from registering with ID5. | `1234` |
| options.eventsToTrack | Optional | Array of strings | Overrides the set of tracked events | `['auctionEnd','bidWon']` |

### Example Configuration

```javascript
pbjs.enableAnalytics({
    provider: 'id5Analytics',
    options: {
        partnerId: 173    // change to the Partner Number you received from ID5
    }
});
```
