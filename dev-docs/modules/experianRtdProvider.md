---
layout: page_v2
title: Experian Real-Time ID Module
display_name: Experian Real-Time ID Module
description: Experian Real-Time ID Module
page_type: module
module_type: rtd
module_code : experianRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Experian Real-Time ID Module
{:.no_toc}

* TOC
{:toc}

## Description

The Experian Real-Time ID Module appends digital identifiers to the bidding object. It's powered by the Experian graph.

## Integration

1). Compile the Experian Real-Time ID Module along with your bid adapter and other modules

```bash
gulp build --modules="rtdModule,experianRtdProvider,..."
```

{:start="2"}
2. Use `setConfig` to instruct Prebid.js to initialize the Experian Real-Time ID Module, as specified below.

## Configuration

This module is configured as part of the `realTimeData.dataProviders` object:

```javascript
pbjs.setConfig({
  realTimeData: {
    auctionDelay: 300,
    dataProviders: [{
      name: 'experian_rtid',
      waitForIt: true,
      params: {
        accountId: 'ZylatYg',
        bidders: ['sovrn', 'pubmatic'],
        ids: { maid: ['424', '2982'], hem: 'my-hem' }
      }
    }]
  }
})
```

## Parameters

{: .table .table-bordered .table-striped }
| Name             | Type                                    | Description                                                                  | Default            |
|:-----------------|:----------------------------------------|:-----------------------------------------------------------------------------|:-------------------|
| name             | String                                  | Real time data module name                                                   | Always 'experian_rtid' |
| waitForIt        | Boolean                                 | Set to true to maximize chance for bidder enrichment, used with auctionDelay | `false`            |
| params.accountId | String                                  | Your account id issued by Experian                                              |                    |
| params.bidders   | Array<string>                           | List of bidders for which you would like data to be set                      |                    |
| params.ids       | Record<string, Array<string> or string> | Additional identifiers to send to Experian RTID endpoint to aid with resolution                        |                    |

## Contact
Reach out to [realtime_identity@experian.com](mailto:realtime_identity@experian.com) for more information.
