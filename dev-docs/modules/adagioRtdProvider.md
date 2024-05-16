---
layout: page_v2
title: Adagio Rtd Module
display_name: Adagio Rtd Module
description: The Adagio Rtd module computes and collects data required to leverage Adagio viewability and attention prediction engine.
page_type: module
module_type: rtd
module_code : adagioRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Adagio Realtime Module

{:.no_toc}

* TOC
{:toc}

## Overview

This module can be used in combination with [Adagio Bid Adapter](/dev-docs/bidders/adagioBidAdapter.md) (SSP) and/or with Adagio prebid server endpoint.
It computes and collects data required to leverage Adagio viewability and attention prediction engine.

Please contact [contact@adagio.io](contact@adagio.io) for more information.

{% include dev-docs/loads-external-javascript.md %}

## Configuration

This module is configured as part of the `realTimeData.dataProviders` object.

```javascript
pbjs.setConfig({
  realTimeData: {
    dataProviders:[{
      name: 'adagio',
      params: {
        organizationId: '1000', // Required. Provided by Adagio
        site: "my-site" // Required. Provided by Adagio
      }
    }]
  }
});
```

Syntax details:

{: .table .table-bordered .table-striped }
| Name                    | Scope    | Description                                   | Example     | Type     |
|-------------------------|----------|-----------------------------------------------|-------------|----------|
| `name`                  | required | Real time data module name: Always `'adagio'` | `'adagio'`  | `string` |
| `params`                | required |                                               |             | `Object` |
| `params.organizationId` | required | Account id provided by Adagio.                | `'1000'`    | `string` |
| `params.site`           | required | Account site name provided by Adagio.         | `'my-site'` | `string` |

## Installation

To install the module, follow these instructions:

* Contact Adagio to get an account

* Build the prebid.js file

  * Option 1: Use Prebid [Download](/download.html) page to build the prebid package. Ensure that you do check *Adagio* in Bidder Adapters and *Adagio Rtd Module* in Vendor-Specific Modules

  * Option 2: From the command line, run `gulp build --modules=adagioBidAdapter,rtdModule,adagioRtdProvider,...`

* Enable Adagio Real Time Module using `pbjs.setConfig`. Example is provided in Configuration section.
