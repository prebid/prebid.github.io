---
layout: page_v2
title: Geolocation Module
display_name: Geolocation
description: Real Time Geolocation
page_type: module
module_type: rtd
module_code : geolocationRtdProvider
enable_download : true
sidebarType : 1
---

# Geolocation Module
{:.no_toc}

* TOC
{:toc}

## Overview

The Geolocation module provides Geolocation coords using
[Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API).

Implementation works like this:

 1) Build the Geolocation module into the Prebid.js package with:

```
gulp build --modules=geolocationRtdProvider&...
```

2) Use `setConfig` to instruct the browser to obtain the geolocation data

## Configuration

This module is configured as part of the `realTimeData.dataProviders` object:

```
    pbjs.setConfig({
        "realTimeData": {
            auctionDelay: 100,
            dataProviders:[{          
                "name": "geolocation",
                "waitForIt": true,
                "params": {
                    "requestPermission": true
                }
            }]
        }
    });
```
#### Params
|        Name        |   Type    |  Example  | Description                           |
|:------------------:|:---------:|:---------:|---------------------------------------|
| requestPermission  |  Boolean  |   true    | Request Geo permission if not granted |

## Output

For each bidder, the module adds geolocation in a JSON format.
Example:
```
{
  "geolocation":{
    'boundingClientRect': {
      'accuracy': 1,
      'altitude': 10,
      'altitudeAccuracy': 1,
      'heading': 1,
      'latitude': 1,
      'longitude': 10,
      'speed': 10,
    },
  }
}
```

