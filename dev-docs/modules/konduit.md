---
layout: page_v2
page_type: module
title: Module - Konduit Accelerate
description: Applies Konduit video ad acceleration optimization to wining video bid.
module_code : konduitWrapper
display_name : Konduit Accelerate
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Konduit Accelerate Module

{:.no_toc}

The Konduit Accelerate module applies the [Konduit](https://konduitvideo.com/) video acceleration optimization to a publisher’s existing Prebid setup. This optimization provides publishers with tools to monetize previously lost revenue and drive higher fill rates on their video inventory.

To install the module, follow these instructions:

### Step 1: Prepare the base Prebid file

Build your Prebid.js package in one of two ways:

- Receive an email package from the Prebid [Download](/download.html) page.

- From the command line, run  
   `gulp build --modules=konduitWrapper,...`

### Step 2: Implement module code on page

- Add konduitId as config using `setConfig` prebid method (`pbjs.setConfig({ konduit: { konduitId: your_konduit_id } })`)

- Insert the Konduit module code in the source code of your page.  
  The module exposes the `pbjs.adServers.konduit.processBids` function.

- Provide input parameters to the function. (All parameters are shown in the following table.)

{: .table .table-bordered .table-striped }
  | Param | Type | Description | Default |
  |---+---+---+---+---|
  | bid | object | Prebid object with VAST URL that should be cached | If the bid parameter is not passed then first winning bid will be used |
  | bids | array | An array of Prebid objects with VAST URL that should be cached | If the bids parameter is not passed then all received bids will be used |
  | adUnitCode | string | adUnitCode where a winner bid can be found | - |
  | timeout | number | Max time to wait for Konduit response with cache key and kCpm data | 1000 |
  | callback | function | The callback function is called once Konduit caches data for the bid. Arguments of this function are `error` and `bids` (`error` should be `null` if Konduit request is successful). | - |

Konduit Accelerate module respects the Prebid `enableSendAllBids` flag and supports both ‘Send All Bids’ and ‘Use only the winning bid’ scenarios.

Prebid set the `enableSendAllBids` flag to true by default and it can be explicitly disabled in Prebid config if needed.

```javascript
pbjs.setConfig({
  enableSendAllBids: false
});  
```

Please refer to [Publisher API Reference (Send All Bids)](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Send-All-Bids) for more information on the Send All Bids settings.

### Step 3: Configure Google Ad Manager (GAM)

In order for Konduit’s module to be completely integrated, line item creatives need to be adjusted in GAM.
Please contact [support@konduit.me](mailto:support@konduit.me) for assistance.

In most cases it will be enough to update a creative VAST URL in related GAM line items.

Konduit platform supports the ‘Send all bids’ scenario, but the GAM configuration can differ slightly depending on whether or not this feature is enabled.

- If Send all bids is disabled (a single winning bid is used), update the GAM line item creative URL as follows:
`https://p.konduit.me/api/vastProxy?konduit_hb=1&konduit_hb_awarded=1&konduit_cache_key=%%PATTERN:k_cache_key%%&konduit_id=%%PATTERN:k_id%%`

- If Send all bids is enabled, update the GAM line item creative URL as shown here:
`https://p.konduit.me/api/vastProxy?konduit_hb=1&konduit_hb_awarded=1&konduit_cache_key=%%PATTERN:k_cache_key_BIDDERCODE%%&konduit_id=%%PATTERN:k_id%%`

`k_cache_key_BIDDERCODE` is a bidder-specific macro. Replace ‘BIDDERCODE’ with an actual bidder code, such as `k_cache_key_appnexus`.

Note that the creative URL contains a few custom macros that allow Konduit platform to combine different data for predictive insights functionality.

{: .table .table-bordered .table-striped }
  | Macro name | Example | Comment |
  |---+---+---+---|
  | k_id | %%PATTERN:k_id%% | The macro passes Konduit client id provided in a publisher call back to Konduit platform. Should be used as is. |
  | konduit_id | %%PATTERN:konduit_id%% | *This macro is deprecated and k_id should be used instead* |
  | k_cache_key | %%PATTERN:k_cache_key%% | The macro is passing a cache key so that Konduit platform is able to fetch current bid tag for processing. This macro is recommended for use in a ‘single bid’ mode. In ‘send all bids’ mode it always represents a winning bid. |
  | konduit_cache_key | %%PATTERN:konduit_cache_key%% | *This macro is deprecated and k_cache_key should be used instead* |
  | k_cache_key_BIDDERCODE | %%PATTERN:k_cache_key_rubicon%% | The macro is passing a cache key so that Konduit platform is able to fetch a bidder tag for processing. This macro should be used in a ‘send all bids’ mode. |

Refer to the following documentation for more information on Google Ad Manager setup:  
[Step By Step Guide to Google Ad Manager Setup](https://prebid.org/adops/step-by-step.html)  

### Sample Code

We recommended using the Konduit module function call in the `bidsBackHandler` callback function.

```javascript
pbjs.que.push(function() {
  pbjs.setConfig({
    konduit: {
      konduitId: your_konduit_id,
    }
  });
  pbjs.addAdUnits(videoAdUnits);
  pbjs.requestBids({
    bidsBackHandler: function(bids) {
      var winnerBid = pbjs.getHighestCpmBids('videoAd')[0];
​
      pbjs.adServers.konduit.processBids({
        bid: winnerBid,
        adUnitCode: videoAdUnit[0].code,
        timeout: 1500,
        callback: function (error, bids) {
          var videoUrl = pbjs.adServers.dfp.buildVideoUrl({
            ...
          });
​
          invokeVideoPlayer(videoUrl);
        }
      });
    }
  });
});
```

​

## Further Reading

​
[Getting Started Example]({{site.baseurl}}/dev-docs/getting-started.html)  
[Prebid.js for Video]({{site.baseurl}}/prebid-video/video-overview.html)
