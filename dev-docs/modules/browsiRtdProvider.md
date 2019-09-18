---
layout: page_v2
title: Provider - Browsi
description: Browsi provider for real time data module
module_code : browsi
display_name : Browsi
enable_download : true
sidebarType : 1
---

# Browsi provider for real time module
{:.no_toc}

* TOC
{:toc}

## Overview

Browsi module acts as a provider for real time data module and responsible to provide viewability predictions for ads placements on the page.


## Input

{: .table .table-bordered .table-striped }
| Name  |Type | Description   | Notes  |
| :------------ | :------------ | :------------ |:------------ |
| name  |String|real time data module name - `browsi`   |   | 
| params  |Object   |Use the following params:|   |
| params.siteKey  |String   |site key|   |
| params.pubKey  |String   |publisher key|   |
| params.url  |String   |server URL|   |
| params.keyName  |String   |key value name|Optional  |

JSON example:
```
    pbjs.setConfig({
        "realTimeData": {
            "auctionDelay": 1000,
            dataProviders:[{          
                "name": "browsi",
                "params": {
                    "url": "testUrl.com",
                    "siteKey": "testKey",
                    "pubKey": "testPub",
                    "keyName":"bv"
                }
            }]
        }
    });
```    


## Output

For each ad placement ID, return expected viewability prediction

JSON example:
```
{
  "slotPlacementId":{
      "p":0.56,
  },
  "slotBPlacementId":{
      "p":0.824,
  }
}
```    


## Further Reading

* [Real Time Data Module](/dev-docs/modules/realTimeData.html)
