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

The Konduit Accelerate module applies the [Konduit](http://konduit.me/) video acceleration optimization to a publisher’s existing Prebid setup. This optimization can reduce load times and increase ad starts. To install the module, follow these instructions:


### Step 1: Prepare the base Prebid file

Build your Prebid.js package in one of two ways:

1. Receive an email package from the Prebid [Download](/download.html) page.
2. From the command line, run  
   `gulp build --modules=konduitWrapper,...`


### Step 2: Implement module code on page

- Insert the Konduit module code in the source code of your page.  
  The module exposes the `pbjs.adServers.konduit.buildVastUrl` function.
- Provide input parameters to the function, including a bid to be accelerated (usually a winning bid) and Konduit-specific parameters (as shown in the sample code below).


### Sample Code

We recommended using the Konduit module function call in the `bidsBackHandler` callback function.

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

[Getting Started Example]({{site.baseurl}}/dev-docs/getting-started.html)  
[Prebid.js for Video]({{site.baseurl}}/prebid-video/video-overview.html)  
