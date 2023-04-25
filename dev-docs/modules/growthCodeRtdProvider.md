---
layout: page_v2
title: GrowthCode Real-time Data Submodule
display_name: GrowthCode Real-time Data Submodule
description: GrowthCode Real-time Data Submodule
page_type: module
module_type: rtd
module_code : growthCodeRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# GrowthCode Real-time Data Submodule
{:.no_toc}

* TOC
{:toc}

The <a href="https://growthcode.io">GrowthCode</a> real-time data module in Prebid enables publishers to fully 
leverage the potential of their first-party audiences and contextual data. 
With an integrated cookieless GrowthCode identity, this module offers real-time 
contextual and audience segmentation capabilities that can seamlessly 
integrate into your existing Prebid deployment, making it easy to maximize 
your advertising strategies.

## Building Prebid with GrowthCode Support

Compile the GrowthCode RTD module into your Prebid build:

`gulp build --modules=userId,rtdModule,growthCodeRtdProvider,appnexusBidAdapter`

Please visit <a href="https://growthcode.io">https://growthcode.io/</a> for more information.

```
pbjs.setConfig(
    ...
    realTimeData: {
         auctionDelay: 1000,
          dataProviders: [
          {
            name: 'growthCodeRtd',
            waitForIt: true,
            params: {
              pid: 'TEST01',
            }
          }
       ]
    }
    ...
}
```


### Parameter Descriptions for the GrowthCode Configuration Section

{: .table .table-bordered .table-striped }
| Name                             | Type    | Description                                                               | Notes                       |
|:---------------------------------|:--------|:--------------------------------------------------------------------------|:----------------------------|
| name                             | String  | Real time data module name                                                | Always 'growthCodeRtd'             |
| waitForIt                        | Boolean | Required to ensure that the auction is delayed until prefetch is complete | Optional. Defaults to false |
| params                           | Object  |                                                                           |                             |
| params.pid                       | String  | This is the Parter ID value obtained from GrowthCode                      | `TEST01`                    |
| params.url                       | String  | Custom URL for server                                                     | Optional                    |
