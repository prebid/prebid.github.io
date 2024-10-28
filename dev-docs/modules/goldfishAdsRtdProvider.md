---
layout: page_v2
title: Goldfish Ads Real Time Data Provider
display_name: Goldfish Ads Real Time Data Provider
description: Goldfish Ads Real Time Data Provider
page_type: module
module_type: rtd
module_code: goldfishAdsRtdProvider
enable_download: true
vendor_specific: true
sidebarType: 1
---

# Goldfish Ads Real Time Data Provider

This RTD module provides access to the Goldfish Ads Geograph, which leverages geographic and temporal data on a privcay-first platform. This module works without using cookies, PII, emails, or device IDs across all website traffic, including unauthenticated users, and adds audience data into bid requests to increase scale and yields.

Contact <prebid@goldfishads.com> for information.

## Integration

1. Compile the Goldfish Ads RTD Module into your Prebid build:

   ```bash
   gulp build --modules="goldfishAdsRtdProvider,..."
   ```

2. Use `setConfig` to instruct Prebid.js to initilize the goldfishAds module, as specified below.

## Configuration

This module is configured as part of the `realTimeData.dataProviders`

```javascript
var pbjs = pbjs || { que: [] }
pbjs.que.push(function () {
    pbjs.setConfig({
        realTimeData: {
            auctionDelay: 100,
            dataProviders: [
                {
                    name: 'goldfishAds',
                    waitForIt: true,
                    params: {
                        key: 'testkey'
                    },
                },
            ],
        },
    })
})
```

Syntax details:

{: .table .table-bordered .table-striped }
| Name |Type | Description | Notes |
| :------------ | :------------ | :------------ |:------------ |
| name | String | Real time data module name | Always 'goldfishAds' |
| waitForIt | Boolean | Should be `true` if there's an `auctionDelay` defined (optional) | `false` |
| params | Object | | |
| params.key | String | A key given by Goldfish Ads to activate your endpoint | |
