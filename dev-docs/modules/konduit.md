---
layout: page_v2
page_type: module
title: Module - Konduit Accelerate
description: Applies Konduit video ad acceleration optimization to a provided bid.
module_code : konduitWrapper
display_name : Konduit Accelerate
enable_download : true
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
   
- Provide input parameters to the function (all parameters are shown in the table below).

{: .table .table-bordered .table-striped }
  | Param | Type | Description | Default |
  |---+---+---+---+---|
  | bid | object | prebid object with VAST url that should be cached | if the bid parameter is not passed then first winning bid will be used |
  | bids | array | an array with prebid objects with VAST url that should be cached | if the bids parameter is not passed then all received bids will be used |
  | adUnitCode | string | adUnitCode where a winner bid can be found | - |
  | timeout | number | max time to wait for Konduit response with cache key and kCpm data | 1000 |
  | callback | function | callback function is called once Konduit caches data for the bid. Arguments of this function are - `error` and `bids` (error should be `null` if Konduit request is successful). | - |
  
Konduit Accelerate module respects the Prebid `enableSendAllBids` flag and supports both ‘Send All Bids’ and ‘Use only a winner bid’ scenarios.

Prebid has the `enableSendAllBids` flag enabled by default and it can be explicitly disabled in Prebid config if needed.
```javascript
pbjs.setConfig({
  enableSendAllBids: false
});  
```
Please refer to the Prebid documentation as to the Send All Bids settings:  
[Publisher API Reference (Send All Bids)](https://prebid.org/dev-docs/publisher-api-reference.html#setConfig-Send-All-Bids)

### Step 3: GAM related configuration

In order for Konduit’s module to be completely integrated, line item Creatives need to be adjusted in GAM.
Please contact [support@konduit.me](mailto:support@konduit.me) for assistance.

n most cases it would be enough to update a  Creative VAST URL in related GAM line items.

Konduit platform supports ‘Send all bids’ scenario and depending on whether this feature is used or not GAM configuration could be slightly different.

- Send all bids is off (a single winner bid is used)
GAM line item creative URL should be updated as:
`https://p.konduit.me/api/vastProxy?konduit_hb=1&konduit_hb_awarded=1&konduit_cache_key=%%PATTERN:k_cache_key%%&konduit_id=%%PATTERN:k_id%%`

- Send all bids is on
GAM line item creative URL should be updated as:
`https://p.konduit.me/api/vastProxy?konduit_hb=1&konduit_hb_awarded=1&konduit_cache_key=%%PATTERN:k_cache_key_BIDDERCODE%%&konduit_id=%%PATTERN:k_id%%`

`k_cache_key_BIDDERCODE` is a bidder specific macro and ‘BIDDERCODE’ should be replaced with a bidder code. For instance, `k_cache_key_appnexus`

Note the creative URL contains a few custom macros that allow Konduit platform to combine different data for predictive insights functionality.

{: .table .table-bordered .table-striped }
  | Macro name | Example | Comment |
  |---+---+---+---|
  | k_id | %%PATTERN:k_id%% | The macro passes Konduit client id provided in a publisher call back to Konduit platform. Should be used as is. |
  | konduit_id | %%PATTERN:konduit_id%% | *This macro is deprecated and k_id should be used instead* |
  | k_cache_key | %%PATTERN:k_cache_key%% | The macro is passing a cache key so that Konduit platform is able to fetch current bid tag for processing. This macro is recommended to use in a ‘single bid’ mode. In ‘send all bids’ mode it always represents a winner bid. |
  | konduit_cache_key | %%PATTERN:konduit_cache_key%% | *This macro is deprecated and k_cache_key should be used instead* |
  | k_cache_key_BIDDERCODE | %%PATTERN:k_cache_key_rubicon%% | The macro is passing a cache key so that Konduit platform is able to fetch a bidder tag for processing. This macro should be used in a ‘send all bids’ mode. |
  
Please refer to the Prebid documentation as to the Google Ad Manager setup:  
[Step By Step Guide to Google Ad Manager Setup](https://prebid.org/adops/step-by-step.html)  
[Send all bids to the ad server - Ad Ops setup](https://prebid.org/adops/send-all-bids-adops.html)

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
