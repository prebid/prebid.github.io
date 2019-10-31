---
layout: page_v2
title: Browsi Viewability Module
description: Browsi Real Time Viewability
module_code : browsi
display_name : Browsi
enable_download : true
sidebarType : 1
---

# Browsi Viewability Module
{:.no_toc}

* TOC
{:toc}

## Overview

The Browsi Viewability module provides viewability predictions for ad slots on the page.
To use it, you'll need to work with [Browsi](https://gobrowsi.com) to get
an account and receive instructions on how to set up your pages and ad server.

Here's how implementation works:

1. Build the Browsi module into the Prebid.js package with `gulp build --modules=browsiRtdProvider&...`
1. Use `setConfig` to instruct the browser to obtain the viewability data in parallel to the header bidding auction

## Configuration

Config for this module is done as part of the `realTimeData.dataProviders` object:

```
    pbjs.setConfig({
        "realTimeData": {
            dataProviders:[{          
                "name": "browsi",
                "params": {
                    "url": "testUrl.com",   // get these values
                    "siteKey": "testKey",   // from Browsi
                    "pubKey": "testPub",    //
                    "keyName":"bv"          //
                }
            }]
        }
    });
```    

{: .alert.alert-info :}
This module is the first use of the 'real time data' core module.
Stay-tuned for more real time applications.

Syntax details:

{: .table .table-bordered .table-striped }
| Name  |Type | Description   | Notes  |
| :------------ | :------------ | :------------ |:------------ |
| name  |String|real time data module name - `browsi`   |   | 
| params  |Object   | |   |
| params.siteKey  |String   |site key|   |
| params.pubKey  |String   |publisher key|   |
| params.url  |String   |server URL|   |
| params.keyName  |String   |key value name| Optional. Defaults to 'bv'. |



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

