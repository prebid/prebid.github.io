---
layout: page_v2
title: Nodals Real-Time Data Module
display_name: Nodals Real-Time Data Module
description: Nodals Real-Time Data Module, providing a mechanism to utilize and optimize first-party signals for targeting.
page_type: module
module_type: rtd
module_code : nodalsRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Nodals Real-Time Data Module

## Overview
Nodals provides a real-time data prebid module that will analyse the first-party signals present on page load and determine the value of them to Nodals’ advertisers. When the signals present on the page match the advertiser’s targeting and/or outcome desires, Nodals will add a key-value to the ad server call to indicate that this is a valuable opportunity for the advertiser.

In order to be able to utilise this module, please contact [support@nodals.ai](mailto:support@nodals.ai) for account setup and detailed GAM setup instructions.

## Build

First, ensure that you include the generic Prebid RTD Module _and_ the Nodals RTD module into your Prebid build:

```bash
gulp build --modules=rtdModule,nodalsRtdProvider
```

## Configuration

Update your Prebid configuration to enable the Nodals RTD module, as illustrated in the example below:

```javascript
pbjs.setConfig({
  ...,
  realTimeData: {
    auctionDelay: 100, // optional auction delay
    dataProviders: [{
      name: 'nodals',
      waitForIt: true, // should be true only if there's an `auctionDelay`
      params: {
        propertyId: '76346cf3'
      }
    }]
  },
  ...
})
```

Configuration parameters:

{: .table .table-bordered .table-striped }

| Name                     | Scope    | Description                                   | Example     | Type     |
|--------------------------|----------|-----------------------------------------------|-------------|----------|
| `name`                   | required | Real time data module name: Always `'nodals'` | `'nodals'`  | `string` |
| `waitForIt`              | optional | Set to `true` if there's an `auctionDelay` defined (defaults to `false`) | `false` | `Boolean` |
| `params`                 | required | Submodule configuration parameters            | `{}`        | `Object` |
| `params.propertyId`      | required | Publisher specific identifier, provided by Nodals            | `76346cf3`        | `string` |
