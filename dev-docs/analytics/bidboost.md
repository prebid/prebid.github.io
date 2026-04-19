---
layout: analytics
title: Bidboost
description: Bidboost Analytics Adapter
modulecode: bidboost
prebid_member: false
enable_download: true
---

## Registration

The Bidboost analytics adapter requires onboarding and approval from the Bidboost team.
Publishers can request an evaluation pilot at [bidboost.net](https://www.bidboost.net).

For expected end-to-end behavior, enable this analytics adapter together with the Bidboost RTD module.

## Analytics Options

{: .table .table-bordered .table-striped }
|Name|Scope|Description|Type|
|---|---|---|---|
|`client`|required|Bidboost client code provided during onboarding.|`string`|
|`site`|required|Site or entity key configured for your account.|`string`|
|`collectorUrl`|optional|Data collector base URL. Defaults to `https://collect.bidboost.net`.|`string`|
|`analyticsBatchWindowMs`|optional|Milliseconds to batch analytics events from an auction before posting.|`number`|
|`ignoredBidders`|optional|Bidder codes excluded from Bidboost analytics processing.|`string[]`|
|`bidderMapper`|optional|Maps Prebid bidder codes to Bidboost bidder codes for analytics payloads.|`function`|
|`reverseBidderMapper`|optional|Reverse mapping helper for environments that use mapped bidder identifiers.|`function`|
|`placementMapper`|optional|Maps ad units to Bidboost placement codes in analytics payloads.|`function`|

## Example Configuration

```javascript
pbjs.enableAnalytics({
  provider: 'bidboost',
  options: {
    client: '11111111-2222-3333-4444-555555555555',
    site: 'example-site',
    collectorUrl: 'https://collect.bidboost.net',
    analyticsBatchWindowMs: 1000,
    ignoredBidders: ['sampleBidder'],
    bidderMapper: (bidderCode) => bidderCode,
    reverseBidderMapper: (mappedBidderCode) => mappedBidderCode,
    placementMapper: (adUnit) => adUnit.code
  }
});
```
