---
layout: page_v2
title: Panxo RTD Provider Module
display_name: Panxo RTD Module
description: Real-time AI traffic classification for enriched OpenRTB bid requests.
page_type: module
module_type: rtd
module_code : panxoRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Panxo RTD Provider Module
{:.no_toc}

* TOC
{:toc}

## Overview

The Panxo RTD module enriches OpenRTB bid requests with real-time AI traffic classification signals. It detects visits originating from AI assistants and provides contextual data through `device.ext.panxo` and `site.ext.data.panxo`, enabling the Panxo Bid Adapter and other demand partners to apply differentiated bidding on AI-referred inventory.

To use this module, contact [publishers@panxo.ai](mailto:publishers@panxo.ai) or sign up at [app.panxo.com](https://app.panxo.com) to receive your property identifier.

{% include dev-docs/loads-external-javascript.md %}

## Configuration

This module is configured as part of the `realTimeData.dataProviders` object.

{: .table .table-bordered .table-striped }
| Name             | Scope    | Description                                            | Example              | Type      |
|------------------|----------|--------------------------------------------------------|----------------------|-----------|
| `name`           | required | Real time data module name                             | `'panxo'`            | `string`  |
| `params`         | required |                                                        |                      | `Object`  |
| `params.siteId`  | required | 16-character hex property identifier provided by Panxo | `'a1b2c3d4e5f67890'` | `string`  |
| `params.verbose` | optional | Enable verbose logging for troubleshooting             | `true`               | `boolean` |

### Basic Example

```javascript
pbjs.setConfig({
    realTimeData: {
        auctionDelay: 300,
        dataProviders: [{
            name: 'panxo',
            waitForIt: true,
            params: {
                siteId: 'a1b2c3d4e5f67890'
            }
        }]
    }
});
```

## ORTB2 Data

The module adds the following fields to the OpenRTB bid request:

{: .table .table-bordered .table-striped }
| Path                     | Description                              |
|--------------------------|------------------------------------------|
| `device.ext.panxo`      | Session signal token for traffic verification |
| `site.ext.data.panxo`   | Contextual AI traffic classification data     |

## Integration

To install the module, follow these instructions:

### Step 1: Build Prebid.js with the module

* Option 1: Use the Prebid [Download](/download.html) page to build the prebid package. Ensure that you check *Panxo RTD Module* under Vendor-Specific Modules.

* Option 2: From the command line, run `gulp build --modules=rtdModule,panxoRtdProvider,...`

> Note that the Panxo RTD module requires the global real-time data module, `rtdModule`.

### Step 2: Set configuration

Enable the Panxo RTD module using `pbjs.setConfig` as shown in the example above.
