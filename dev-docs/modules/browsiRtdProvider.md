---
layout: page_v2
title: Browsi RTD Module
display_name: Browsi RTD Module
description: Browsi Real Time Module
page_type: module
module_type: rtd
module_code: browsiRtdProvider
enable_download: true
vendor_specific: true
sidebarType : 1
---

# Browsi RTD Module
{:.no_toc}

* TOC
{:toc}

## Overview

Browsi’s RTD module for Prebid.js provides real-time insights and predictive signals to optimize bid requests and ad delivery.
This module leverages Browsi's AI models to give publishers access to:

* **Real-time predictions for GAM**: Enhance ad placements and maximize revenue by leveraging viewability and revenue predictions as key values in GAM ad requests.
* **Enhanced bid request signals**: Augment bid requests with additional contextual, behavioral, and engagement signals to improve demand partner performance.
* **Dynamic ad serving optimization**: Enable smarter ad delivery strategies based on predicted user behavior and page context.

## Integration

Implementation works like this:

1. Build the Browsi modules into the Prebid.js package with:

    ```bash
    gulp build --modules=browsiRtdProvider,browsiAnalyticsAdapter
    ```

2. Use `setConfig` to instruct the browser to obtain Browsi’s predictive signals in parallel with the header bidding auction

## Configuration

This module is configured as part of the `realTimeData.dataProviders` object:

```javascript
pbjs.setConfig({
   realTimeData: {
       auctionDelay : 3000,
       dataProviders: [{
           name: "browsi",
           params: {
               url: "domain.com",
               siteKey: "SITE",
               pubKey: "PUB",
               waitForIt: true
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
| params.keyName  |String   |GAM key value name for the viewability prediction| Optional. Defaults to ‘browsiViewability’. |
| params.waitForIt  |boolean   |Allow waiting for data| true |

## Output

For each ad slot, the module generates predictive signals in JSON format, assigns key-value pairs for viewability and revenue predictions via `pbjs.setTargetingForGPT`, and embeds the full JSON in the bid request under `<bidder>.ortb2Imp.ext.data.browsi`.
