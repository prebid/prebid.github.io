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

Module Name: Oxxion Rtd Provider
Module Type: Rtd Provider
Maintainer: <tech@oxxion.io>

## Oxxion Real-Time-Data submodule

Oxxion helps you to understand how your prebid stack performs.
This Rtd module purpose is to filter bidders requested.

## Integration

Make sure to have the following modules listed while building prebid : `rtdModule,oxxionRtdProvider`
`rtdModule` is required to activate real-time-data submodules.
For example :

```bash
gulp build --modules=schain,priceFloors,currency,consentManagement,appnexusBidAdapter,rubiconBidAdapter,rtdModule,oxxionRtdProvider
```

Then add the oxxion Rtd module to your prebid configuration :

```javascript
pbjs.setConfig(
  ...
  realTimeData: {
    auctionDelay: 300,
    dataProviders: [
      {
          name: "oxxionRtd",
          waitForIt: true,
          params: {
            domain: "test.endpoint",
            threshold: false,
            samplingRate: 10,
          }
       }
    ]
  }
  ...
)
```

## setConfig Parameters General

| Name                             | Type     | Description                                                                                                 |
|:---------------------------------|:---------|:------------------------------------------------------------------------------------------------------------|
| domain                           | String   | This string identifies yourself in Oxxion's systems and is provided to you by your Oxxion representative.   |

## setConfig Parameters for bidder filtering

{: .table .table-bordered .table-striped }
| Name                             | Type       | Description                                                                                                 |
|:---------------------------------|:-----------|:------------------------------------------------------------------------------------------------------------|
| threshold                        | Float/Bool | False or minimum expected bid rate to call a bidder (ex: 1.0 for 1% bid rate).                              |
| samplingRate                     | Integer    | Percentage of request not meeting the criterias to run anyway in order to check for any change.             |
| bidders                          | Array      | Optional: If set, filtering will only be applied to bidders listed.
