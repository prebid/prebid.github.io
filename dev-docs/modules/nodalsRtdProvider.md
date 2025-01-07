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
| `name`                   | required | Real time data module name: Always `'nodals'` | `'nodals'`  | `String` |
| `waitForIt`              | optional | Set to `true` if there's an `auctionDelay` defined (defaults to `false`) | `false` | `Boolean` |
| `params`                 | required | Submodule configuration parameters            | `{}`        | `Object` |
| `params.propertyId`      | required | Publisher specific identifier, provided by Nodals            | `'76346cf3'`        | `String` |
| `params.storage`         | optional | Optional storage configiration            | `{}`        | `Object` |
| `params.storage.key`     | optional | Storage key used to store Nodals data in local storage             | `'yourKey'`        | `String` |
| `params.storage.ttl`     | optional | Time in seconds to retain Nodals data in storage until a refresh is required             | `900`        | `Integer` |
| `params.pts`    | optional | Optional configiration pertaining to integration partners             | `{}`        | `Object` |
| `params.pts.permutive`    | optional | Optional configiration for Permutive Audience Platform      | `{}`        | `Object` |
| `params.pts.permutive.enabled`    | optional | Flag to disable automatic fetching of detected Permutive cohort IDs      | `false`        | `Boolean` |
| `params.pts.permutive.cohorts`  | optional | A method for the publisher to explicitly supply Permutive Cohort IDs, disabling automatic fetching by this RTD module    | `['66711', '39032', '311']`     | `Array<String>` |
| `params.pts.permutive.storageKey`  | optional | Publisher specific Permutive storage key where cohort data is held.  | `'permitive-data'`     | `String` |
