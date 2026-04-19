---
layout: page_v2
title: Bidboost Real-time Data Submodule
display_name: Bidboost Real-time Data Submodule
description: Privacy-first traffic shaping RTD module for fast-changing AI-driven buyer strategies
page_type: module
module_type: rtd
module_code: bidboostRtdProvider
enable_download: true
vendor_specific: true
sidebarType: 1
---

# Bidboost Real-time Data Submodule
{:.no_toc}

* TOC
{:toc}

## Overview

The Bidboost RTD module helps publishers adapt auction traffic shaping as buyers increasingly use AI
to test and change bidding behavior faster than manual workflows can track.
It integrates into Prebid.js and applies real-time auction inputs to support stable monetization outcomes
with privacy-first operation.

Access is currently provided through an evaluation pilot.
Publishers can request access at [bidboost.net](https://www.bidboost.net).

## Build Prebid.js with Bidboost RTD

Compile the RTD module into your Prebid.js build:

```bash
gulp build --modules=rtdModule,bidboostRtdProvider,bidboostAnalyticsAdapter
```

Include and configure the Bidboost analytics adapter so predictor-driven shaping decisions can be evaluated against auction outcomes in Bidboost reporting.

## Configuration

Configure Bidboost under `realTimeData.dataProviders`:

```javascript
pbjs.setConfig({
  realTimeData: {
    auctionDelay: 300,
    dataProviders: [{
      name: 'bidboost',
      waitForIt: true,
      params: {
        client: '11111111-2222-3333-4444-555555555555',
        site: 'example-site',
        predictorUrl: 'https://predict.bidboost.net',
        ignoredBidders: ['sampleBidder'],
        bidderMapper: (bidderCode) => bidderCode,
        reverseBidderMapper: (mappedBidderCode) => mappedBidderCode,
        placementMapper: (adUnit) => adUnit.code,
        additionalBidders: [
          {
            code: 'top-slot',
            bids: [{ bidder: 'sampleBidder' }]
          }
        ]
      }
    }]
  }
});
```

## Parameters

{: .table .table-bordered .table-striped }
|Name|Type|Description|
|---|---|---|
|`name`|`string`|RTD provider name. Must be `bidboost`.|
|`waitForIt`|`boolean`|Set to `true` so Prebid can wait for this RTD module within your configured `auctionDelay`.|
|`params`|`object`|Bidboost RTD configuration object.|
|`params.client`|`string`|Bidboost client code provided during onboarding.|
|`params.site`|`string`|Site or entity key configured for your account.|
|`params.predictorUrl`|`string`|Predictor base URL. Defaults to `https://predict.bidboost.net`.|
|`params.ignoredBidders`|`string[]`|Bidder codes excluded from Bidboost traffic shaping.|
|`params.bidderMapper`|`function`|Maps Prebid bidder codes to Bidboost bidder codes before predictor requests.|
|`params.reverseBidderMapper`|`function`|Maps Bidboost bidder codes back to Prebid bidder codes when applying predictor results.|
|`params.placementMapper`|`function`|Maps ad units to Bidboost placement codes.|
|`params.additionalBidders`|`object[]`|Optional bidder definitions merged by ad unit code for shaping coverage and fallback behavior.|
|`params.additionalBidders[].code`|`string`|Ad unit code for the additional bidder definition.|
|`params.additionalBidders[].bids`|`object[]`|Bid array using standard ad unit bid objects.|
|`params.additionalBidders[].bids[].bidder`|`string`|Bidder code in each additional bid object.|

## Notes

For complete Bidboost results, enable the Bidboost analytics adapter alongside this RTD submodule.
