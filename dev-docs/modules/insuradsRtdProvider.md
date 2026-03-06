---
layout: page_v2
title: InsurAds RTD Module
display_name: InsurAds RTD Module
description: InsurAds Real Time Data Module
page_type: module
module_type: rtd
module_code : insuradsRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# InsurAds RTD Module
{:.no_toc}

* TOC
{:toc}

## Description

The [InsurAds](https://insurads.com) real-time data module enables publishers to leverage contextual targeting and audience segmentation capabilities. This module fetches real-time key-value targeting data from the InsurAds services and automatically enriches InsurAds bid requests enhancing your advertising strategies without requiring additional code changes.

## Integration

1. Compile the InsurAds RTD Module along with the InsurAds bid adapter and other modules into your Prebid build:

    ```bash
    gulp build --modules="rtdModule,insuradsRtdProvider,insuradsBidAdapter,..."
    ```

2. Use `setConfig` to instruct Prebid.js to initialize the InsurAds RTD module, as specified below.

## Configuration

This module is configured as part of the `realTimeData.dataProviders`

```javascript
pbjs.setConfig({
    realTimeData: {
        auctionDelay: 2000,
        dataProviders: [{
            name: 'insuradsRtd',
            waitForIt: true,
            params: {
                publicId: 'YOUR_PUBLIC_ID'
            }
        }]
    }
});
```

## Parameters

{: .table .table-bordered .table-striped }

| Name              | Type    | Description                                                       | Default        |
| :---------------- | :------ | :---------------------------------------------------------------- |:-------------- |
| name              | String  | Real time data module name                                        | Always 'insuradsRtd' |
| waitForIt         | Boolean | Should be `true` if there's an `auctionDelay` defined (optional)  | `false`        |
| params            | Object  |                                                                   |                |
| params.publicId   | String  | Your InsurAds public ID (required)                                |                |

