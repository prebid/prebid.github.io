---
layout: page_v2
title: 1plusX RTD Module
display_name: 1plusX RTD Module
description: 1plusX Real Time Data Module
page_type: module
module_type: rtd
module_code : 1plusXRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# 1plusX RTD Module
{:.no_toc}

* TOC
{:toc}

## Description

The 1plusX RTD module appends User and Contextual segments to the bidding object.

## Integration

1) Compile the 1plusX RTD Module along with your bid adapter and other modules into your Prebid build:  


```
gulp build --modules="rtdModule,1plusXRtdProvider,appnexusBidAdapter,..."  
```

2) Use `setConfig` to instruct Prebid.js to initilize the 1plusX RTD module, as specified below. 

## Configuration

This module is configured as part of the `realTimeData.dataProviders`  

```javascript
var TIMEOUT = 1000;
pbjs.setConfig({
    realTimeData: {
        auctionDelay: TIMEOUT,
        dataProviders: [{
            name: '1plusX',
            waitForIt: true,
            params: {
                customerId: 'acme',
                bidders: ['appnexus', 'rubicon'],
                timeout: TIMEOUT
            }
        }]
    }
});
```

## Parameters

{: .table .table-bordered .table-striped }
| Name              | Type          | Description                                                      | Default           |
| :---------------- | :------------ | :--------------------------------------------------------------- |:----------------- |
| name              | String        | Real time data module name                                       | Always '1plusX'   |
| waitForIt         | Boolean       | Should be `true` if there's an `auctionDelay` defined (optional) | `false`           |
| params            | Object        |                                                                  |                   |
| params.customerId | String        | Your 1plusX customer id                                          |                   |
| params.bidders    | Array<string> | List of bidders for which you would like data to be set          |                   |
| params.timeout    | Integer       | timeout (ms)                                                     | 1000ms            |
