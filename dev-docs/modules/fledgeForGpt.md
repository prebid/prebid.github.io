---
layout: page_v2
page_type: module
title: Module - fledgeForGpt
description: how to use PAAPI with GPT
module_code : fledgeForGpt
display_name : Fledge (PAAPI) for GPT
enable_download : true
sidebarType : 1
---

# Protected Audience API (PAAPI) for GPT Module

This module allows Prebid.js to support PAAPI (formerly FLEDGE) by integrating with GPT's support for [component auctions](https://developers.google.com/publisher-tag/reference#googletag.config.componentauctionconfig).

To learn more about PAAPI in general, go [here](https://github.com/WICG/turtledove/blob/main/FLEDGE.md).

Note that Prebid can't help anyone with which fields to include in auctionconfig, but you can start by looking in [this section](https://github.com/WICG/turtledove/blob/main/FLEDGE.md#21-initiating-an-on-device-auction) of the PAAPI documentation.

## Publisher Integration

To use PAAPI with GPT:

- include this module with your Prebid.js bundle; this also automatically includes the [PAAPI module](/dev-docs/modules/paapi.html)

    ```bash
   gulp build --modules=fledgeForGpt,...     
    ```

- [configure PAAPI](/dev-docs/modules/paapi.html#config)
- (optional) invoke [setPAAPIConfigForGPT](/dev-docs/publisher-api-reference/setPAAPIConfigForGPT.html) at end of auction.

By default, Prebid.js attempts to configure GPT slots for PAAPI at the end of each auction. This requires GPT to be loaded before the first Prebid auction is started; to avoid this requirement, or for more control in general over GPT slot configuration, you can use [`setPAAPIConfigForGPT`](/dev-docs/publisher-api-reference/setPAAPIConfigForGPT.html).

## Explicit configuration

First, disable automatic configuration of GPT slots:

```js
pbjs.setConfig({
    paapi: {
        gpt: {
            autoconfig: false
        }
    }
})
```

You may then use `setPAAPIConfigForGPT`, typically from a `bidsBackHandler`:

```js
pbjs.requestBids({
  // ...
  bidsBackHandler: function(bids, timedOut, auctionId) {  
     pbjs.setPAAPIConfigForGPT();
     // ...
  }
})
```

See the [API reference](/dev-docs/publisher-api-reference/setPAAPIConfigForGpt.html) for more options.

## Related Reading

- [PAAPI module](/dev-docs/modules/paapi.html)
- [FLEDGE](https://github.com/WICG/turtledove/blob/main/FLEDGE.md)
