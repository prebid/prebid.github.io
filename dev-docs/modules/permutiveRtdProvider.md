---
layout: page_v2
title: Permutive Real Time Data Provider
display_name: Permutive Real Time Data Module
description: Permutive Real Time Data Module
page_type: module
module_type: rtd
module_code : permutiveRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Permutive RTD Provider
{:.no_toc}

* TOC
{:toc}

## Overview
This module reads cohorts from Permutive and attaches them as targeting keys to bid requests.

## Usage
Compile the Permutive RTD module into your Prebid build:
```
gulp build --modules=rtdModule,permutiveRtdProvider
```

> Note that the global RTD module, `rtdModule`, is a prerequisite of the Permutive RTD module.

You then need to enable the Permutive RTD in your Prebid configuration, using the below format:

```javascript
pbjs.setConfig({
  ...,
  realTimeData: {
    auctionDelay: 50, // optional auction delay
    dataProviders: [{
      name: 'permutive',
      waitForIt: true, // should be true if there's an `auctionDelay`
      params: {
        acBidders: ['appnexus']
      }
    }]
  },
  ...
})
```

## Supported Bidders
The Permutive RTD module sets Audience Connector cohorts as bidder-specific `ortb2.user.data` first-party data, following the Prebid `ortb2` convention, for any bidder included in `acBidders`. The module also supports bidder-specific data locations per ad unit (custom parameters) for the below bidders:

{: .table .table-bordered .table-striped }
| Bidder      | ID         | Custom Cohorts       | Audience Connector |
| ----------- | ---------- | -------------------- | ------------------ |
| Xandr       | `appnexus` | Yes                  | Yes                |
| Magnite     | `rubicon`  | Yes                  | No                 |
| Ozone       | `ozone`    | No                   | Yes                |

Key-values details for custom parameters:
* **Custom Cohorts:** The module configuration will automatically reflect the SSP integrations (_Activations_) you have enabled in your Permutive dashboard. Any additional bidders you want to pass data to will need to be configured. Permutive cohorts will be sent in the permutive key-value.

* **Audience Connector:** You'll need to define which bidders should receive Audience Connector cohorts. You need to include the `ID` of any bidder in the `acBidders` array. Audience Connector cohorts will be sent in the `p_standard` key-value.


## Parameters

{: .table .table-bordered .table-striped }
| Name              | Type                 | Description        | Default        |
| ----------------- | -------------------- | ------------------ | ------------------ |
| name              | String               | This should always be `permutive` | - |
| waitForIt         | Boolean              | Should be `true` if there's an `auctionDelay` defined (optional) | `false` |
| params            | Object               |                 | - |
| params.acBidders  | String[]             | An array of bidders which should receive Audience Connector cohorts. | `[]` |
| params.maxSegs    | Integer              | Maximum number of cohorts to be included in either the `permutive` or `p_standard` key-value. | `500` |

