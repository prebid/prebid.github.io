---
layout: page_v2
page_type: module
title: Module - topLevelPaapi
description: Run top level PAAPI auctions
module_code : topLevelPaapi
display_name : Run top level PAAPI auctions
enable_download : true
sidebarType : 1
---

# Top level PAAPI module

This module allows Prebid.js to support PAAPI by running on-device auctions as the top level seller.

### Comparison with paapiForGpt

Both this module and [paapiForGpt](/dev-docs/modules/paapiForGpt.html) allow bid adapters to participate in PAAPI auctions as component sellers.

With paapiForGpt, bidders' intent to participate in PAAPI is submitted to GPT, which can then decide how to run the on-device auction. 
With topLevelPaapi, Prebid.js directly manages the on-device auction, trading ease of use for more control.

## Publisher Integration

To use topLevelPaapi:

- you'll need a [decision logic URL](https://github.com/WICG/turtledove/blob/main/FLEDGE.md#23-scoring-bids) that has been [attested](https://github.com/privacysandbox/attestation) with Google. How to write decision logic and how to attest it are both out of scope for this document.
- include this module with your Prebid.js bundle; this also automatically includes the [PAAPI module](/dev-docs/modules/paapi.html)

    ```bash
   gulp build --modules=topLevelPaapi,...     
    ```

- [configure this module](#config)
- render PAAPI bids (see [examples](#examples)) 

## Module Configuration

This module exposes the following settings:

{: .table .table-bordered .table-striped }
|Name |Type |Description |Notes |
| ------------ | ------------ | ------------ |------------ |
|paapi.topLevelSeller | Object | | |
|paapi.topLevelSeller.auctionConfig | Object | Base [AuctionConfig](https://github.com/WICG/turtledove/blob/main/FLEDGE.md#2-sellers-run-on-device-auctions) to use in `runAdAuction` | Only `seller` and `decisionLogicURL` are required |
|paapi.topLevelSeller.autorun | Boolean | If `true` (the default) , automatically start PAAPI auctions as soon as possible | |
|paapi.topLevelSeller.overrideWinner | Boolean | If `true`, replace contextual winners with PAAPI winners as they are rendered. Default is `false`. | see [example](#overrideWinner) |  

<a id="examples"></a>
## Examples

### Basic Example using renderAd

```javascript
pbjs.setConfig({
  paapi: {
      enabled: true,
      defaultForSlots: 1,
      topLevelSeller: {
        auctionConfig: {
          seller: 'https://www.publisher.com',
          decisionLogicURL: 'https://www.publisher.com/decisionLogic.js',
        },
      }
  }
})
```

With the above, `navigator.runAdAuction` is invoked once per ad unit, and the result is made available through [`getPAAPIBids`](/dev-docs/publisher-api-reference/getPAAPIBids.html):

```javascript
pbjs.requestBids({
  bidsBackHandler: function(contextualBids) {
    pbjs.getPAAPIBids().then(paapiBids => {
        Object.entries(contextualBids).forEach(([adUnitCode, {bids}]) => {
            const paapiWinner = paapiBids[adUnitCode];
            const contextualWinner = bids?.[0];
            const targetDoc = document.getElementById(adUnitCode).contentDocument // assumes there's an iframe with id = adUnitCode 
            // PAAPI bids can be rendered as if they were "normal" Prebid bids
            if (paapiWinner) {
                pbjs.renderAd(targetDoc, paapiWinner.adId)
            } else {
                pbjs.renderAd(targetDoc, contextualWinner.adId)
            }
        }) 
    })
  }
})
```

<a id="overrideWinner"></a>
### Automatically render PAAPI winners instead of contextual bids

When `overrideWinner` is enabled, rendering a "normal" Prebid bid will instead render a PAAPI bid, if the PAAPI auction for the slot yielded a winner. This is an easy way include the result of PAAPI auctions without having to change the rendering logic. For example: 

```javascript
pbjs.setConfig({
  paapi: {
      enabled: true,
      defaultForSlots: 1,
      topLevelSeller: {
        auctionConfig: {
          seller: 'https://www.publisher.com',
          decisionLogicURL: 'https://www.publisher.com/decisionLogic.js',
        },
        overrideWinner: true
      }
  }
});

pbjs.requestBids({
  bidsBackHandler: function() {
      // if Prebid wins the GAM auction (and renders a Prebid creative), the following will render PAAPI winners over the Prebid winners
      pbjs.setTargetingForGPTAsync();
  }
})
```

## Related Reading

- [PAAPI module](/dev-docs/modules/paapi.html)
- [FLEDGE](https://github.com/WICG/turtledove/blob/main/FLEDGE.md)
- [getPAAPIBids](/dev-docs/publisher-api-reference/getPAAPIBids.html)
