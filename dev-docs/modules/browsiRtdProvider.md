---
layout: page_v2
title: Browsi Viewability Module
display_name: Browsi Viewability
description: Browsi Real Time Viewability
page_type: module
module_type: rtd
module_code : browsiRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Browsi Viewability Module
{:.no_toc}

* TOC
{:toc}

## Overview

The Browsi Viewability module provides viewability predictions for ad slots on the page.
To use this module, you'll need to work with [Browsi](https://gobrowsi.com) to get
an account and receive instructions on how to set up your pages and ad server.

Implementation works like this:

 1) Build the Browsi module into the Prebid.js package with:

```
gulp build --modules=browsiRtdProvider&...
```

2) Use `setConfig` to instruct the browser to obtain the viewability data in parallel with the header bidding auction

## Configuration

This module is configured as part of the `realTimeData.dataProviders` object:

```
    pbjs.setConfig({
        "realTimeData": {
            dataProviders:[{          
                "name": "browsi",
                "params": {
                    "url": "testUrl.com",   // get params values
                    "siteKey": "testKey",   // from Browsi
                    "pubKey": "testPub",    //
                    "keyName":"bv"          //
                }
            }]
        }
    });
```    

Syntax details:

{: .table .table-bordered .table-striped }
| Name  |Type | Description   | Notes  |
| :------------ | :------------ | :------------ |:------------ |
| name  | String | Real time data module name | Always 'browsi' |
| params  | Object   | |   |
| params.siteKey  |String   |Site key|   |
| params.pubKey  |String   |Publisher key|   |
| params.url  |String   |Server URL|   |
| params.keyName  |String   |Key value name| Optional. Defaults to 'bv'. |




## Output

For each ad slot, the module returns expected viewability prediction in a JSON format.
When the data is received, it calls `pbjs.setTargetingForGPT` to set the defined `keyName` for each adunit.

Example:
```
{
  "slotA":{
      "p":0.56,   // ad server targeting variable (e.g. bv) for slotA is 0.56
  },
  "slotB":{
      "p":0.824,  // ad server targeting variable (e.g. bv) for slotB is 0.824
  }
}
```

