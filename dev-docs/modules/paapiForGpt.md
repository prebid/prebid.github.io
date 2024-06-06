---
layout: page_v2
page_type: module
title: Module - paapiForGpt
description: how to use PAAPI with GPT
module_code : paapiForGpt
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
   gulp build --modules=paapiForGpt,...     
    ```

- [configure PAAPI](/dev-docs/modules/paapi.html#config)
- invoke [setPAAPIConfigForGPT](/dev-docs/publisher-api-reference/setPAAPIConfigForGPT.html) at end of auction.

### Example

```javascript
// enable PAAPI for all slots
pbjs.setConfig({
  paapi: {
      enabled: true,
      defaultForSlots: 1
  }
});
pbjs.requestBids({
  bidsBackHandler: function(bids, timedOut, auctionId) {
    // configure GPT slots for PAAPI
    pbjs.setPAAPIConfigForGPT();
  }
})

```
See the [API reference](/dev-docs/publisher-api-reference/setPAAPIConfigForGpt.html) for more options.


## Automatic PAAPI configuration with GPT targeting

The module can be configured to set up PAAPI as part of `setTargetingForGPTAsync`:

```js
pbjs.setConfig({
    paapi: {
        enabled: true,
        defaultForSlots: 1,
        gpt: {
            configWithTargeting: true
        }
    }
})
pbjs.requestBids({
  bidsBackHandler: function(bids, timedOut, auctionId) {
    // with configWithTargeting =true, the following will automatically run `setPAAPIConfigForGPT`: 
    pbjs.setTargetingForGPTAsync(); 
  }
})
```

## Related Reading

- [PAAPI module](/dev-docs/modules/paapi.html)
- [FLEDGE](https://github.com/WICG/turtledove/blob/main/FLEDGE.md)
