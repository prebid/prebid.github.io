---
layout: page_v2
page_type: module
title: Module - Previous Auction Info
description: Allows publishers and bidders to collect and inject past auction data into future bid requests
module_code : previousAuctionInfo
display_name : Previous Auction Info
enable_download : true
sidebarType : 1

---

# Previous Auction Info

## Overview

The Previous Auction Info module enables functionality to collect prior auction data for participating bidders and publishers (This feature is `opt-in`, by default it is disabled).

## How to Enable the Module

A Publisher must do the following in order for the module to work:

* Include the Previous Auction Info module within your Prebid.js build: [https://docs.prebid.org/download.html](https://docs.prebid.org/download.html)

* Configure Prebid.js to enable the Previous Auction Info module:

```javascript
pbjs.setConfig({previousAuctionInfo: { enabled: true, bidders: ['bidderCode1', 'bidderCode2'], maxQueueLength: 10 }})
```

* Only valid bid requests submitted by bidders who have enabled the Previous Auction Info module will be permitted.

If the requirements above are met, the flow for how the module works is as follows:

1. A Prebid.js auction runs and completes.
1. At the end of an auction, details about the auction are collected from each bidder using the module.
1. If a Prebid bid wins, then the `rendered` field is updated to `1` to indicate this in the collected auction data for all bidders who bid on the same adunit within the same Prebid auction.
1. During the next Prebid.js auction, if a bidder is included in previousAuctionInfo.bidders AND is included in the auction, then previous auction info data will be injected into the bidder's bid request of the new auction within the following path: `ortb2.ext.prebid.previousauctioninfo`.

## Configuration Options

{: .table .table-bordered .table-striped }
| Field | Required? | Type | Description |
|---|---|---|---|
| previousAuctionInfo.enabled | yes | boolean | Enables/disables the module. |
| previousAuctionInfo.bidders | no | array of strings  | Array of bidder codes to determine which bidders are allowed to receive collected previous auction info. Omitting this field will enable all bidders. |
| previousAuctionInfo.maxQueueLength | no | integer  | The number of previous auction info payloads to store/collect per bidder before injecting these payloads into the bidstream. Any payloads collected for a bidder during one auction will be injected into the bidstream during the next auction that the same bidder participates in with valid bids. If this field is omitted, the value of this field is 10. |

## Example of Previous Auction Info Payload

`previousAuctionInfo` is an array of prior auction data catered to a specific bidder (if present, it will be added to a bidder's bid request). See below for an example of how the structure of the data looks (Note: Once collected previous auction data has been injected into the bid stream, then it is removed and no longer stored within the module):

```javascript
ortb2: {
  ext: {
    prebid: {
      previousauctioninfo: [
        {
          bidderRequestId: "123abc",
          bidId: "456def",
          rendered: 1, // default is 0
          source: "pbjs",
          adUnitCode: "div-gpt-ad-123-0",
          highestBidCpm: 0.052275935, // default is null
          highestBidCurrency: "USD", // default is null
          bidderCpm: 0.04, // default is null
          bidderOriginalCpm: 0.04, // default is null
          bidderCurrency: "USD", // default is null
          bidderOriginalCurrency: "USD", // default is null
          rejectionReason: "Invalid request ID", // default is null
          timestamp: 1739400860310
        }
      ]
    }
  }
}
```

## Description of Previous Auction Info Payload

{: .table .table-bordered .table-striped }
| Field | Type | Description | Default |
|---|---|---|---|
| ortb2.ext.prebid.previousauctioninfo | array |  |  |
| ortb2.ext.prebid.previousauctioninfo[].bidderRequestId | string | ID of a previous bidder request |  |
| ortb2.ext.prebid.previousauctioninfo[].bidId | string | ID of a previous bid request |  |
| ortb2.ext.prebid.previousauctioninfo[].rendered | integer | Signifies if the relevant adunit bid on was rendered or not | 0 |
| ortb2.ext.prebid.previousauctioninfo[].source | string | Where the previous auction info was collected |  |
| ortb2.ext.prebid.previousauctioninfo[].adUnitCode | string | Ad unit code of the ad slot that was bid on |  |
| ortb2.ext.prebid.previousauctioninfo[].highestBidCpm | float | The highest Prebid bid cpm observed for the relative ad slot of a previous auction | null |
| ortb2.ext.prebid.previousauctioninfo[].highestBidCurrency | string | The currency of the highest Prebid bid observed for an ad slot of a previous auction | null |
| ortb2.ext.prebid.previousauctioninfo[].bidderCpm | float | The bid cpm submitted by the bidder receiving the previous auction info payload | null |
| ortb2.ext.prebid.previousauctioninfo[].bidderOriginalCpm | float | The original bid cpm submitted by the bidder receiving the previous auction info payload | null |
| ortb2.ext.prebid.previousauctioninfo[].bidderCurrency | string | The bidder currency submitted by the bidder receiving the previous auction info payload | null |
| ortb2.ext.prebid.previousauctioninfo[].bidderOriginalCurrency | string | The original bidder currency submitted by the bidder receiving the previous auction info payload | null |
| ortb2.ext.prebid.previousauctioninfo[].rejectionReason | string | The error reason, if one was present | null |
| ortb2.ext.prebid.previousauctioninfo[].timestamp | integer | Time that the previous auction info payload was collected |  |
