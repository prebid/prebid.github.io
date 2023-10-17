---
layout: page_v2
title: GoldfishAds Real Time Data Provider
display_name: GoldfishAds Real Time Data Provider
description: GoldfishAds Real Time Data Provider 
page_type: module
module_type: rtd
module_code: goldfishAdsRtdProvider
enable_download: true
vendor_specific: true
sidebarType: 1
---

# GoldfishAds Real Time Data Provider

## Integration

1. Compile the Adnuntius RTD Module and Adnuntius Bid Adapter into your Prebid build:

```
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
| params.key | String | A key given by GoldfishAds to activated your endpoint | |
