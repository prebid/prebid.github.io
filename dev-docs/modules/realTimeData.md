---
layout: page_v2
page_type: module
title: Module - Real Time Data
description: Add real time data to bidders and primary ad server
module_code : realTimeData
display_name : Real Time Data
enable_download : true
sidebarType : 1
---

# Real Time Data Module
{:.no_toc}

* TOC
{:toc}

## Overview

* Creating a generic pre-bid module that will call different service providers, retrieve real-time data and push it to the primary ad-server and / or different bidders.
* A light-weight and quick module that doesn’t delay the auction, or adds the minimum delay to the auction only when necessary.


## Flow

![Flow]({{site.baseurl}}/assets/images/dev-docs/realTimeData_flow.png){:class="pb-lg-img"}


## Input

{: .table .table-bordered .table-striped }
| Name  |Type | Description   | Notes  |
| :------------ | :------------ | :------------ |:------------ |
| auctionDelay |Number| If auctionDelay > 0 data will be sent to both bidders and primary ad server   |  The number represnet the maximum delay time of the auction (milliseconds) |
| dataProviders| Array| Array of real time data providers | Each provider is an object with the following keys: |
| name  |String|The name of the real-time data provider.   |   | 
| Params  |Object   |An object with the configuration that each provider requires.|  - |

JSON example:
```
    pbjs.setConfig({
        "realTimeData": {
            "auctionDelay": 1000,
            dataProviders[{
                "name": "browsi",
                "params": {
                    "url": "testUrl.com",
                } 
            }]
        }
    });
```    


## Output

- For each auction, the module will call the provider to fetch the real-time data per placement.
- The provider will respond with the real-time data object per the params and configurations.
- The module will take the real-time data and will (depending on the "auctionDelay").
	- Push it as a key to all (or some) of the bidders in the auction and push it as a key to GAM.
	- Push it only to GAM as a key.
- The provider will have the time set in the auctionDelay to fetch the real-time data.
- In case there is no response before the timeout, the module will ignore and will not push any value either to GAM or to any of the bidders.


## Further Reading

* [Browsi provider](/dev-docs/modules/browsiRtdProvider.html)
