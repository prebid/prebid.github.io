---
layout: analytics
title: Hadron
description: Hadron Analytics Adapter
modulecode: hadronAnalytics
gdpr_supported: true
usp_supported: true
prebid_member: true
gvl_id: 561
enable_download: false
---

#### Use

The Hadron Analytics Adapter can be used by Audigent's clients. You can get more info [https://audigent.com/hadron-id](here).

The ID5 privacy policy is at [https://audigent.com/privacypolicy/](https://audigent.com/privacypolicy/).

#### Analytics Options

{: .table .table-bordered .table-striped }
| Parameter | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| provider | Required | String | The name of this module: `hadronAnalytics` | `hadronAnalytics` |
| options.partnerId | Required | Number | This is the Audigent's Partner ID received when signed the contract. | `1234` |
| options.eventsToTrack | Required | Array of strings | Filters the set of tracked events | `['auctionEnd','bidWon']` |


### Example Configuration

```javascript
pbjs.enableAnalytics({
    provider: 'hadronAnalytics',
    options: {
        partnerId: 1234,    // change to the Partner Number you received from Audigent
        eventsToTrack: ['auctionEnd', 'auctionInit']
    }
});
```
