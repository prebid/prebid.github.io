---
layout: page_v2
title: Qortex Realtime Data Module
display_name: Qortex RTD Module
description: Appends contextual segments to the bidding object based on the content of a page
page_type: module
module_type: rtd
module_code : qortexRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Qortex Real-time Data Submodule
{:.no_toc}

* TOC
{:toc}

## Overview

The Qortex RTD module appends contextual segments to the bidding object based on the content of a page using the Qortex API.

Upon load, if the `Qortex Group Id` and module parameters provided during configuration is active, the Qortex context API will attempt to generate and return a [Content object](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf#page=26) using indexed data from provided page content. The module will then merge that object into the appropriate bidders' `ortb2.site.content`, which can be used by prebid adapters that use `site.content` data.

## Build

```SH
gulp build --modules="rtdModule,qortexRtdProvider,..."  
```

> `rtdModule` is a required module to use Qortex RTD module.

## Configuration

Please refer to [Prebid Documentation](https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html#setConfig-realTimeData) on RTD module configuration for details on required and optional parameters of `realTimeData`

When configuring Qortex as a data provider, refer to the template below to add the necessary information to ensure the proper connection is made.  

### RTD Module Setup

```javascript
pbjs.setConfig({
    realTimeData: {
        auctionDelay: 1000,
        dataProviders: [{
            name: 'qortex',
            waitForIt: true,
            params: {
                groupId: 'ABC123', //required
                bidders: ['qortex', 'adapter2'], //optional (see below)
                enableBidEnrichment: true, //optional (see below)
                tagConfig: { } // optional, please reach out to your account manager for configuration reccommendation
            }
        }]
    }
});
```

### Parameter Details

{: .table .table-bordered .table-striped }
| Name             |Type           | Description                                                         |Required | Notes  |
| :--------------- | :------------ | :------------------------------------------------------------------ |:---------|:------------ |
| `groupId`  | String | The Qortex groupId linked to the publisher | Yes | Your account manager can provide this information for you if needed, it is required for any type integration and access to Qortex services |
| `bidders`  | Array of Strings | this is a list containing the bidder code of the prebid adapters you would like this module to impact | No | If this parameter is included, `ortb2.site.content` will be updated *only* for adapters in this array. If this parameter is omitted, the RTD module will default to updating  `ortb2.site.content` on *all* bid adapters being used on the page|
|`enableBidEnrichment`| Bool | Indicate whether to opt-in to the features of the RTD module that use our API to enrich bids with first party data for contextuality | No |  Enabling this feature will allow this module to interact with the Qortex AI contextuality server for indexing and analysis. Please use caution when adding this module to pages that may contain personal user data or proprietary information. By default, the adapter will disable these features if this is marked `null` or omitted from the configuration parameters.|
|`tagConfig` | Object | The config settings that could be used to initialize the Qortex integration on your page | No | A preconfigured object for this step will be provided to you by the Qortex team. The RTD module will only carry out this process if a valid tagConfig is provided. If this parameter is not present, the Qortex integration can still be configured and loaded manually on your page outside of prebid. The RTD module will continue to initialize and operate as normal.|
