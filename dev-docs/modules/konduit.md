---
layout: page_v2
page_type: module
title: Module - Konduit Accelerate
description: Applies Konduit video ad acceleration optimization to a provided bid.
module_code : konduitAccelerate
display_name : Konduit Accelerate
enable_download : true
sidebarType : 1
---

# Konduit Accelerate Module
{:.no_toc}

This module is required to apply [Konduit](http://konduit.me/)’s video acceleration optimization to a publisher’s existing Prebid setup. For instructions detailing how to add this module, please see below.


### Step 1: Prepare the base Prebid file

Receive an email package from the Prebid [Download]({{site.baseurl}}/download.html) page.
In addition to the email package, a Konduit 'Client ID' needs to be used as a function parameter, see Sample code below.


### Step 2: Implement module code on page

Insert the Konduit module code in your source code of the page.  
The module exposes the `pbjs.adServers.konduit.buildVastUrl` function to use.
The function should be provided a couple of input parameters including a bid to be accelerated (usually a winner bid) and Konduit parameters, see Sample code below.


### Sample code

It usually makes sense to use the Konduit Module function call in the `bidsBackHandler` callback function.

```javascript
pbjs.que.push(function() {
  pbjs.addAdUnits(videoAdUnits);
  pbjs.requestBids({
    bidsBackHandler: function(bids) {
      var winnerBid = pbjs.getHighestCpmBids('videoAd')[0];
      
      var vastTagUrl = pbjs.adServers.konduit.buildVastUrl({
        bid: winnerBid,
        params: {
          konduit_id: '{konduit_client_id}',
        }
      });

      invokeVideoPlayer(vastTagUrl);
    }
  });
});
```


## Further Reading

[Prebid.js](http://prebid.org/dev-docs/getting-started.html)  
[Prebid Video](http://prebid.org/prebid-video/video-overview.html)  
