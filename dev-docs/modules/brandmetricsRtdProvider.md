---
layout: page_v2
title: brandmetrics Real Time Data Provider Module
display_name: brandmetrics Real Time Data Provider Module
description: brandmetricsReal Time Data Provider Module
page_type: module
module_type: rtd
module_code : brandmetricsRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# brandmetrics Real Time Data Provider Module
{:.no_toc}

* TOC
{:toc}

This module is intended to be used by brandmetrics (https://brandmetrics.com) partners and sets targeting keywords to bids if the browser is eligeble to see a brandmetrics survey.
The module hooks in to brandmetrics events and requires a brandmetrics script to be running. The module can optionally load and initialize brandmetrics by providing the 'scriptId'- parameter.


## Publisher Usage

1) Build the brandmetricsRtd module into the Prebid.js package with:

```
gulp build --modules=brandmetricsRtdProvider,...
```

2) Use `setConfig` to instruct Prebid.js to initilaize the brandmetricsRtdProvider module, as specified below.

### Configuration

```javascript
pbjs.setConfig({
  realTimeData: {
    auctionDelay: 500,
    dataProviders: [
      {
        name: "brandmetrics",
        waitForIt: true,
        params: {
          scriptId: '00000000-0000-0000-0000-000000000000',
          bidders: ['ozone']
        }
      }
    ]
  }
});
```

The scriptId- parameter is provided by brandmetrics or a brandmetrics partner.


## Supported bidders

The module currently supports the following bidders:

{: .table .table-bordered .table-striped }
| Bidder | Id    |
| :----- | :---- |
| Ozone  | ozone |


## Parameters

{: .table .table-bordered .table-striped }
| Name              | Type                 | Description        | Default        |
| :---------------- | :------------------- | :----------------- | :------------- |
| name              | String               | This should always be `brandmetrics` | - |
| waitForIt         | Boolean              | Should be `true` if there's an `auctionDelay` defined (recommended) | `false` |
| params            | Object               |                 | - |
| params.bidders    | String[]             | An array of bidders the module operates on. | `[]` |
| params.scriptId   | String               | A script- id GUID if the brandmetrics- script should be initialized. | `undefined` |
