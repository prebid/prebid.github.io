---
layout: page_v2
title: oxxion Real Time Data Provider
display_name: oxxion Rtd
description: oxxion Real-time Vast Impression Tracking
page_type: module
module_type: rtd
module_code : oxxionRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# oxxion Rtd

## Overview

Oxxion helps you to understand how your prebid stack performs.
This Rtd module is to use in order to improve video events tracking.

## Integration

Make sure to have the following modules listed while building prebid : `rtdModule,oxxionRtdProvider`
`rtbModule` is required to activate real-time-data submodules.
For example :
```
gulp build --modules=rtdModule,oxxionRtdProvider
```

Then add the oxxion Rtd module to your prebid configuration :
```
pbjs.setConfig(
  ...
  realTimeData: {
    auctionDelay: 200,
    dataProviders: [
      {
          name: "oxxionRtd",
          waitForIt: true,
          params: {
            domain: "test.endpoint",
            contexts: ["instream", "outstream"],
          }
       }
    ]
  }
  ...
)
```

## setConfig Parameters

| Name                             | Type     | Description                                                                                                 |
|:---------------------------------|:---------|:------------------------------------------------------------------------------------------------------------|
| domain                           | String   | This string identifies yourself in Oxxion's systems and is provided to you by your Oxxion representative.   |
| contexts                         | Array    | Array defining which video contexts to add tracking events into. Values can be instream and/or outstream.   |

