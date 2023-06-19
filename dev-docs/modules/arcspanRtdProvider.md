---
layout: page_v2
title: ArcSpan RTD Module
display_name: ArcSpan RTD Module
description: ArcSpan is a real-time audience monetization platform focused on the needs of the world’s finest publishers and retailers. Unlock the true value of your first-party audience data while providing advertisers the targeting performance they need.
page_type: module
module_type: rtd
module_code : arcspanRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# ArcSpan RTD Module

{:.no_toc}

* TOC
{:toc}

## Prebid Config for ArcSpan RTD Module

ArcSpan is a real-time audience monetization platform focused on the needs of the world’s finest publishers and retailers. Unlock the true value of your first-party audience data while providing advertisers the targeting performance they need.

{: .alert.alert-warning :}
Disclosure: This module loads external code that is not open source and has not been reviewed by Prebid.org.

### Usage

Compile the ArcSpan RTD Module into your Prebid build:

```
gulp build --modules=rtdModule,arcspanRtdProvider
```

{: .alert.alert-warning :}
Note that the global RTD module, `rtdModule`, is a prerequisite of the ArcSpan RTD Module.

You then need to enable the ArcSpan RTD Module in your Prebid configuration, using the format below.

{: .alert.alert-warning :}
Please replace the `silo` parameter value with the one provided by your ArcSpan representative. This will load the latest version of ArcSpan's JavaScript tag that is specific to your ArcSpan seat.

```javascript
pbjs.setConfig({
  ...,
  realTimeData: {
    auctionDelay: 50, // optional auction delay
    dataProviders: [{
      name: 'arcspan',
      waitForIt: true, // should be true if there's an `auctionDelay`
      params: {
        silo: 1
      }
    }]
  },
  ...
})
```

{: .alert.alert-info :}
For best results, we recommend that you also deploy ArcSpan's JavaScript tag in your tag management solution, as instructed in the implementation overview you received from your ArcSpan representative. This will ensure that more of your auctions contain ArcSpan's contextual signals. Please reach out to your ArcSpan representative if you have any questions.
