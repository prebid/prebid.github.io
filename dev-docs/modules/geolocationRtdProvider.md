---
layout: page_v2
title: Geolocation Module
display_name: Geolocation
description: Geolocation module helps to get user`s precise position
page_type: module
module_type: rtd
module_code : geoedgeRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Geolocation Module

{:.no_toc}

* TOC
{:toc}

## Overview

The Geolocation module lets publishers get user's precise location with their permissions. The first permission that is needed is directly asked from site's navigator alert. Then if site has installed CMP(Consent Management Platform) module checks the geolocation permission from consent data. 

## Integration

1. Build the geolocation RTD module into the Prebid.js package with:

    ```bash
    gulp build --modules=geolocationRtdProvider.js,...
    ```

2. Use `setConfig` to instruct Prebid.js to initilize the geolocation module, as specified below.

## Configuration

This module is configured as part of the `realTimeData.dataProviders` object:

```javascript
    pbjs.setConfig({
        realTimeData: {
          dataProviders: [{
            "name": "geolocation",
            "waitForIt": true,
            "params": {
              "requestPermission": true
            }
          }]
        },
      });
```

Parameters details:

{: .table .table-bordered .table-striped }
|Name |Type |Description |Notes |
| :------------ | :------------ | :------------ |:------------ |
|name | String | Real time data module name |Required, always 'geolocation' |
|waitForIt | Boolean |  |Required, always true |
|params | Object | | |
|params.requestPermission | Boolean | Customer permission |Required, always true  |

Geolocation is set in ortb2Fragments.global.device.geo in requestBidsObject and looks like this:
```javascript
{
    lat: 1, //geolocation.coords.latitude
    lon: 1, //geolocation.coords.longitude
    lastfix: 1, // geolocation.timestamp
    type: 1 
}
```