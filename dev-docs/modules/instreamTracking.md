---
layout: page_v2
page_type: module
title: Module - Instream Video Ads Tracking
description: Allow Analytics Adapters and Bid Adapters to track `BID_WON` events for instream video bids.
module_code : instreamTracking
display_name : Instream Tracking
enable_download : true
sidebarType : 1
---

# Instream Video Ads Tracking

{:.no_toc}

* TOC
{:toc}

## Overview

Instream tracking module allows Analytics Adapters and Bid Adapters to track `BID_WON` events for Instream video bids.

{: .alert.alert-warning :}
This module uses `window.performance.getEntriesByType('resource')` to check the presence of Video Cache URL.

## Configuration

{: .table .table-bordered .table-striped }
| Field    | Scope   | Type   | Description                                                                           |
|----------+---------+--------+---------------------------------------------------------------------------------------|
| `instreamTracking` | Required | Object | Configuration object for instream tracking |
| `instreamTracking.enabled` | Required | Boolean | Enable/disable the instream tracking feature. Default: `false`. |
| `instreamTracking.maxWindow` | Optional | Integer | The time in ms after which polling for instream delivery stops. Default: `60000` i.e. 60 seconds |
| `instreamTracking.pollingFreq` | Optional | Integer |The frequency of polling. Default: `500`ms |
| `instreamTracking.urlPattern` | Optional | RegExp | Regex for cache url patterns, to avoid false positives. |

#### Basic Example

```javascript
pbjs.setConfig({
        'instreamTracking': {
            enabled: true,
        }
});
```

#### Example with urlPattern

While checking for URLs having `videoCacheKey`, there are chances of false positives. To avoid those cases, we can set `instreamTracking.urlPattern: /REGEX_PATTERN/`.

```javascript
pbjs.setConfig({
        'instreamTracking': {
            enabled: true,
            urlPattern: /(prebid\.adnxs\.com\/pbc\/v1\/cache\.*)|(search\.spotxchange\.com\/ad\/vast\.html\?key=\.*)/
        }
});
```

## Intergation

To install the module, follow these instructions:

#### Step 1: Prepare the base Prebid file

* Option 1: Use Prebid [Download](/download.html) page to build the prebid package. Ensure that you do check *Instream Tracking* module

* Option 2: From the command line, run `gulp build --modules=instreamTracking,...`

#### Step 2: Set configuration

Enable `instreamTracking` using `pbjs.setConfig`

```javascript
pbjs.setConfig({
        'instreamTracking': {
            enabled: true,
        }
});
```

## Further Reading

​
[Prebid.js for Video]({{site.baseurl}}/prebid-video/video-overview.html)  
[Client-side Caching of VAST XML]({{site.baseurl}}/dev-docs/publisher-api-reference/setConfig.html#setConfig-vast-cache)
