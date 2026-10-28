---
redirect_from:
  - /dev-docs/modules/fledgeForGpt.html
layout: page_v2
page_type: module
title: Module - paapiForGpt
description: how to use PAAPI with GPT
module_code : paapiForGpt
display_name : Fledge (PAAPI) for GPT
enable_download : false
pbjs_version_notes: removed in 11.0
sidebarType : 1
---

# Protected Audience API (PAAPI) for GPT Module

{: .alert.alert-warning :}
The paapiForGpt module was removed in Prebid.js 11.0. Prebid.js no longer supports the Protected Audience API.

This module allows Prebid.js to support PAAPI (formerly FLEDGE) by integrating with GPT's support for [component auctions](https://developers.google.com/publisher-tag/reference#googletag.config.componentauctionconfig).

To learn more about PAAPI in general, see the [FLEDGE explainer](https://github.com/WICG/turtledove/blob/main/FLEDGE.md).

Note that Prebid can't help anyone with which fields to include in auctionconfig, but you can start by looking in [this section](https://github.com/WICG/turtledove/blob/main/FLEDGE.md#21-initiating-an-on-device-auction) of the PAAPI documentation.

## Publisher Integration

To use PAAPI with GPT:

- include this module with your Prebid.js bundle; this also automatically includes the [PAAPI module](/dev-docs/modules/paapi.html)

    ```bash
   gulp build --modules=paapiForGpt,...     
    ```

- [configure PAAPI](/dev-docs/modules/paapi.html#config)
- (optional) invoke [setPAAPIConfigForGPT](/dev-docs/publisher-api-reference/setPAAPIConfigForGPT.html) at end of auction.

## Explicit configuration

By default, Prebid.js attempts to configure GPT slots for PAAPI together with their targeting (that is, when [setTargetingForGPTAsync](/dev-docs/publisher-api-reference/setTargetingForGPTAsync.html) is called).

For more control how GPT slots are configured, you can set `configWithTargeting: false` and explicitly call [setPAAPIConfigForGPT](/dev-docs/publisher-api-reference/setPAAPIConfigForGPT.html). For example:  

```js
pbjs.setConfig({
    paapi: {
        enabled: true,
        defaultForSlots: 1,
        gpt: {
            configWithTargeting: false
        }
    }
})
pbjs.requestBids({
  // ...
  bidsBackHandler: function(bids, timedOut, auctionId) {
    pbjs.setPAAPIConfigForGPT();
    // ...
  }
})
```

## Refreshing Ads

It's important to invoke the `pbjs.setPAAPIConfigForGPT()` function within the `bidsBackHandler` whenever new bids are requested, such as when refreshing ad slots. This ensures that the auctionConfig is manually applied to a GPT slot when autoconfig is disabled. Without this manual configuration, GPT slots will not be properly set up to handle new bids, potentially resulting in duplicate impression calls.

See the [API reference](/dev-docs/publisher-api-reference/setPAAPIConfigForGPT.html) for more options.

## Related Reading

- [PAAPI module](/dev-docs/modules/paapi.html)
- [FLEDGE](https://github.com/WICG/turtledove/blob/main/FLEDGE.md)
