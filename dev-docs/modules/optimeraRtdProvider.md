---
layout: page_v2
title: Optimera Real Time Data Module
display_name: Optimera RTD
description: Optimera Optimization Targeting
page_type: module
module_type: rtd
module_code : optimeraRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Optimera Real Time Data Module

# Overview

Optimera Real Time Data Module. Provides targeting for ad requests from data collected by the Optimera Measurement script on your site. Please contact [Optimera](http://optimera.nyc/) for information. This is a port of the Optimera Bidder Adapter.

## Integration

1. Compile the Optimera RTD Provider into your Prebid build:

    ```bash
    gulp build --modules=rtdModule,optimeraRtdProvider
    ```

    Note: You must include `rtdModule` in the build list.

2. Use `setConfig` to instruct Prebid.js to initialize the optimera module, as specified below.

## Configuration

This module is configured as part of the `realTimeData.dataProviders` object.

Configuration example for using RTD module with the `optimeraRTD` provider:

```javascript
pbjs.setConfig({
  realTimeData: {
    dataProviders: [
      {
        name: 'optimeraRTD',
        waitForIt: true,
        params: {
          clientID: '9999',
          optimeraKeyName: 'optimera',
          device: 'de',
          apiVersion: 'v0',
        }
      }
    ]
  }
})
```

## Migration From the Optimera Bidder Adapter

The Optimera Bidder Adapter is no longer active with Prebid 5.0. Therefore, the bidder settings used for the Optimera Bidder Adapter for < Prebid 5.0 can be removed and replaced with this new Optimera RTD module configuration.

For the optimeraKeyName setting, the Optimera Bidder Adapter used 'hb_deal_optimera' as the key name, as this is the key that name used in GAM. There is no need to change this key name in GAM, as you can still use this key name with the Optimera RTD Module as indicated above.

Parameters details:

Contact Optimera to get assistance with the params.

{: .table .table-bordered .table-striped }

|  param name | type  |Scope | Description |
| :------------ | :------------ | :------- | :------- |
| clientID  | string  | required | Optimera Client ID |
| optimeraKeyName  | string  | optional |  GAM key name for Optimera. If migrating from the Optimera bidder adapter this will default to hb_deal_optimera and can be ommitted from the configuration. |
| device  | string  | optional | Device type code for mobile, tablet, or desktop. Either mo, tb, de |
| apiVersion  | string  | optional | Optimera API Versions. Either v0, or v1. ** Note: v1 wll need to be enabled specifically for your account, otherwise use v0.

## Example

To view an integration example:

1. in your cli run:

    ```bash
    gulp serve --modules=appnexusBidAdapter,optimeraRtdProvider`
    ```

2. in your browser, navigate to:

    ```text
    http://localhost:9999/integrationExamples/gpt/optimeraRtdProvider_example.html
    ```

You will be able to see targeting set for each ad request with the 'optimera' key name.
