---
layout: page_v2
title: Integral Ad Science(IAS) Real Time Data Module
display_name: Integral Ad Science(IAS) RTD
description: RTD provider for Integral Ad Science(IAS)
page_type: module
module_type: rtd
module_code : iasRtdProvider
enable_download : true
sidebarType : 1
---

# Integral Ad Science(IAS) Real Time Data Module

# Overview

Integral Ad Science(IAS) Real Time Data Module. Please contact [Integral Ad Science(IAS)](https://integralads.com/) for information.

## Integration

1) Compile Integral Ad Science(IAS) RTD Provider into your Prebid build:

```
`gulp build --modules=iasBidAdapter,iasRtdProvider`...
```

2) Use `setConfig` to instruct Prebid.js to initialize the IAS module, as specified below.

## Configuration

This module is configured as part of the `realTimeData.dataProviders` object.

Configuration example for using RTD module with the `ias` provider:

```javascript
  pbjs.setConfig({
    realTimeData: {
      dataProviders: [
        {
          name: 'ias',
          waitForIt: true,
          params: {
            pubId: '1234',
          }
        }
      ]
    }
``` 

Parameters details:

{: .table .table-bordered .table-striped }
| Name | Type  | Scope | Description |
| :------------ | :------------ | :------- | :------- |
| pubId  | string  | required | IAS publisher ID |
