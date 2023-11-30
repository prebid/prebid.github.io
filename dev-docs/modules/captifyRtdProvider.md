---
layout: page_v2
title: Captify RTD Module
display_name: Captify RTD Module
description: Captify Real Time Data Module
page_type: module
module_type: rtd
module_code : captifyRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Captify RTD Module

{:.no_toc}

* TOC
{:toc}

## Description

Captify uses publisher first-party on-site search data to power machine learning algorithms to create a suite of
contextual based targeting solutions that activate in a cookieless environment.

The RTD submodule allows bid requests to be classified by our live-classification service,
maximising value for publishers by increasing scale for advertisers.

Segments will be attached to bid request objects sent to different SSPs in order to optimize targeting.

Contact <prebid@captify.tech> for more information.

## Integration

1. Compile the Captify RTD Module along with your bid adapter and other modules into your Prebid build:  

    ```bash
    gulp build --modules="rtdModule,captifyRtdProvider,appnexusBidAdapter,..."  
    ```

2. Use `setConfig` to instruct Prebid.js to initialize the Captify RTD module, as specified below.

## Configuration

This module is configured as part of the `realTimeData.dataProviders`  

```javascript
var TIMEOUT = 100; // in milliseconds
pbjs.setConfig({
    realTimeData: {
        auctionDelay: TIMEOUT,
        dataProviders: [
            {
                name: "CaptifyRTDModule",
                waitForIt: true,
                params: {
                    pubId: 123456,
                    bidders: ['appnexus'],
                }
            }
        ]
    }
});
```

## Parameters

{: .table .table-bordered .table-striped }
| Name             |Type           | Description                                                         |Mandatory | Notes  |
| :--------------- | :------------ | :------------------------------------------------------------------ |:---------|:------------ |
| `name`           | String        | Real time data module name                                          | yes     | Always 'CaptifyRTDModule' |
| `waitForIt`      | Boolean       | Should be `true` if there's an `auctionDelay` defined (recommended) | no      | Default `false` |
| `params`         | Object        | |  | |
| `params.pubId`   | Integer       | Partner ID, required to get results and provided by Captify         | yes      | Use `123456` for tests, speak to your Captify account manager to receive your pubId |
| `params.bidders` | String[]      | List of bidders for which you would like data to be set             | yes      | Currently only 'appnexus' supported |
| `params.url`     | String        | Captify live-classification service url                             | no       | Defaults to `https://live-classification.cpx.to/prebid-segments`
