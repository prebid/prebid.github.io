---
layout: page_v2
title: Geolocation Module
display_name: Geolocation
description: Real Time Geolocation
page_type: module
module_type: rtd
module_code: geolocationRtdProvider
enable_download: true
sidebarType: 1
---

# Geolocation Module

## Overview

The Geolocation module lets publishers get user's precise location with their permissions. The first permission that is needed is directly asked from site's navigator alert. Then if site has installed a CMP (Consent Management Platform), this module checks the geolocation permission from consent data. The module provides Geolocation coords using the [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API).

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
    }
});
```

Parameter details:

{: .table .table-bordered .table-striped }
|Name |Type |Description |Notes |
| :------------ | :------------ | :------------ |:------------ |
|name | String | Real time data module name |Required, always 'geolocation' |
|waitForIt | Boolean | |Required, always true |
|params | Object | | |
|params.requestPermission | Boolean | Customer permission |Required, always true  |

The Geolocation is set in ortb2Fragments.global.device.geo in requestBidsObject and looks like this:

```javascript
{
    lat: 1,     // geolocation.coords.latitude
    lon: 1,     // geolocation.coords.longitude
    lastfix: 1, // geolocation.timestamp
    type: 1
}
```

This data can be accessed from a bid adapter in one of several ways:

1. Read reqBidsConfigObj.ortb2Fragments.global.device.geo directly
2. Just merge everything in ortb2Fragments
3. Start utilizing the [ortbConverter library](https://github.com/prebid/Prebid.js/blob/master/libraries/ortbConverter/README.md)
