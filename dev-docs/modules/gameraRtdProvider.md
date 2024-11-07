---
layout: page_v2
title: Gamera Rtd Provider
display_name: Gamera Rtd Provider
description: Gamera Rtd Provider works in conjunction with the on-page Gamera script to enrich bid requests by adding First Party Data attributes.
page_type: module
module_type: rtd
module_code : gameraRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Gamera Real Time Data Provider

## Overview

RTD provider for Gamera.ai that enriches bid requests with real-time data, by populating the [First Party Data](/features/firstPartyData.html) attributes.
The module integrates with Gamera's AI-powered contextual targeting system to provide enhanced bidding capabilities.

The Gamera RTD Provider works in conjunction with the Gamera script, which must be available on the page for the module to enrich bid requests. To learn more about the Gamera script, please visit the [Gamera website](https://gamera.ai/), or contact [Gamera](mailto:gareth@gamera.ai).

## Build

Include the Gamera RTD module in your Prebid.js build:

```bash
gulp build --modules=rtdModule,gameraRtdProvider,...
```

## Configuration

Configure the module in your Prebid.js configuration:

```javascript
pbjs.setConfig({
    realTimeData: {
        dataProviders: [{
            name: 'gamera',
            params: {
                // Optional configuration parameters
            }
        }]
    }
});
```

Syntax details:

{: .table .table-bordered .table-striped }
| Name                     | Scope    | Description                                   | Example     | Type     |
|--------------------------|----------|-----------------------------------------------|-------------|----------|
| `name`                   | required | Real time data module name: Always `'gamera'` | `'gamera'`  | `string` |
| `params`                 | optional | Submodule configuration parameters (none at the moment) | `{}`        | `Object` |
| `waitForIt`              | optional | Should be `true` if there's an `auctionDelay` defined (defaults to `false`) | `false` | `Boolean` |
