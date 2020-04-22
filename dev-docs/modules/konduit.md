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

The Konduit Accelerate module applies the [Konduit](https://konduitvideo.com/) video acceleration optimization to a publisher’s existing Prebid setup. This optimization can reduce load times and increase ad starts.
Konduit Accelerate allows
- wrapping a bid response so that it is processed through Konduit platform
- obtaining a historical performance indicator for a bid

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
  | bid | object | prebid object with VAST url that should be cached | If the bid parameter is not passed then first winning bid will be used |
  | adUnitCode | string | adUnitCode where a winner bid can be found | - |
  | timeout | number | max time to wait for Konduit response with cache key and kCpm data | 2000 |
  | callback | function | callback function is called once Konduit cache data for the bid. Arguments of this function are - `error` and `bids` (error should be `null` if Konduit request is successful) | - |
  
### Step 3: GAM related configuration

It is important to configure your GAM line items. 
Please contact [support@konduit.me](mailto:support@konduit.me) for assistance.

In most cases it would require only Creative VAST URL update with the following URL:
```
https://p.konduit.me/api/vastProxy?konduit_hb=1&konduit_hb_awarded=1&konduit_cache_key=%%PATTERN:konduit_cache_key%%&konduit_id=%%PATTERN:konduit_id%%
```

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

      pbjs.adServers.konduit.processBids({
        bid: winnerBid,
        adUnitCode: videoAdUnit[0].code,
        timeout: 2000,
        callback: function (error, bids) {
          var videoUrl = pbjs.adServers.dfp.buildVideoUrl({
            ...
          });

          invokeVideoPlayer(videoUrl);
        }
      });
    }
  });
});
```


## Further Reading

[Getting Started Example]({{site.baseurl}}/dev-docs/getting-started.html)  
[Prebid.js for Video]({{site.baseurl}}/prebid-video/video-overview.html)  
