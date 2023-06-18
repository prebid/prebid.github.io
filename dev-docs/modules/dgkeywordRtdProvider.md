---
layout: page_v2
title: Digital Garage Keyword Module
display_name: Digital Garage Keyword
description: Digital Garage Keyword
page_type: module
module_type: rtd
module_code : dgkeywordRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Digital Garage Keyword Module

{:.no_toc}

* TOC
{:toc}

## Integration

1) Compile the Digital Garage Keyword Module and Appnexus Bid Adapter into your Prebid build:  

```
gulp build --modules="dgkeywordRtdProvider,appnexusBidAdapter,..."  
```

2) Use `setConfig` to instruct Prebid.js to initilize the dgkeyword module, as specified below.

## Configuration

This module is configured as part of the `realTimeData.dataProviders`  

```javascript
var DGKEYWORD_TIMEOUT = 1000;
pbjs.setConfig({
    realTimeData: {
        auctionDelay: DGKEYWORD_TIMEOUT,
        dataProviders: [{
            name: 'dgkeyword',
            waitForIt: true,
            params: {
                timeout: DGKEYWORD_TIMEOUT
            }
        }]
    }
});
```

Syntax details:

{: .table .table-bordered .table-striped }
| Name  |Type | Description   | Notes  |
| :------------ | :------------ | :------------ |:------------ |
| name  | String | Real time data module name | Always 'dgkeyword' |
| waitForIt | Boolean | Should be `true` if there's an `auctionDelay` defined (optional) | `false` |
| params  | Object |   |   |
| params.timeout  | Integer |timeout (ms)| 1000 |
