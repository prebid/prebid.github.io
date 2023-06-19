---
layout: page_v2
page_type: module
title: Module - MultiBid
description: Allows bidders to send multiple bids to the ad server.
module_code : multibid
display_name : MultiBid
enable_download : true
sidebarType : 1
---

# MultiBid Module

{:.no_toc}

* TOC
{:toc}

## Overview

This module allows configured bidders to pass more than one bid per AdUnit
through to the ad server.

Without this module, bidders can place multiple bids on the bid cache, but only the
highest bid will be considered for sending to the ad server.

## Use Cases

* Allows a bidder to provide bids on both outstream and banner.
* Supports the ability of one bidder to provide multiple video bids for the fallback scenario.
* Allows some bids to be blocked in ad server targeting logic while allowing other bids from the same bidder to be considered.

There are two specific actions enabled by this module:

1. It tells bidders how many bids will be considered. If [useBidCache](https://docs.prebid.org/dev-docs/publisher-api-reference.html#setConfig-Use-Bid-Cache) is on, more than one bid response per adapter can be registered. (Note that this is the case even without this module, but bid adapters might not know they can supply extra bids without the `multibid` config.)

2. It expands the number of ad server targeting values that can go to the ad server.

Here's an example configuration:

```javascript
pbjs.setConfig({
    multibid: [{
        bidder: "bidderA",
        // bidderA can supply up to two bids
        maxBids: 2,
    // the second bid will go to the ad server as hb_pb_bidA2
        targetBiddercodePrefix: "bidA"  
    },{
        bidder: "bidderB",
        // bidderB can supply up to three bids
        maxBids: 3,
    // additional bids will be passed as hb_pb_bidB2 and hb_pb_bidB3
        targetBiddercodePrefix: "bidB"
    },{
        bidders: ["bidderC","bidderD"]
        maxBids: 3
        // don't send extra bids to ad server, just cache good ones
    }]
});
```

## Parameters

MultiBid configuration takes these parameters:

{: .table .table-bordered .table-striped }
| Param | Required? | Type | Description | Example |
| --- | --- | --- | --- | --- |
| bidder | Yes, unless bidders is specified | string | A biddercode | `'bidderA'` |
| bidders | Yes, unless bidder is specified | array of strings | Multiple biddercodes | `['bidderB','bidderC']` |
| maxBids | Yes | integer | The number of bids the named bidder(s) can supply. Max of 9. | `2` |
| targetBiddercodePrefix | No | string | An alternate (short) bidder code to send to the ad server. A number will be appended, starting from 2, e.g. hb_pb_PREFIX2. If not provided, the extra bids will not go to the ad server. | `'bidA'` |

Note: Some bid adapters normally return more than one bid response per AdUnit. These
bids are available to the `useBidCache` scenario even without this module.
If those bidders are mentioned in the `multibid` config, the additional bids will
become subject to the `maxBids` limit.

## Building Prebid.js with the MultiBid Module

The MultiBid module is not included with Prebid.js by default. To get this behavior, you must include the module in the build:

```bash
gulp build --modules=multibid,exampleBidAdapter
```

## Setting Up New Line Items

Publishers don't need to set up more line items in the ad server unless they
want to optimize a scenario where the primary bid might not match special targeting. Example scenarios include:

* The publisher has set up special blocking on header bidding line items. For example: hb_adomin_bidderA not in "advA, advB, advC". In this case, the primary bid may be skipped over, so creating line items for the secondary bids could make sense.
* There's ad targeting logic that could exclude outstream bids on certain ad units for certain bidders. For example: AdUnit="abc" and hb_format_bidderA not in "video". In this case, the bidder can return a banner bid as well as video.
* The ad server supports video fallbacks, in which case multiple video bids from the same bidder can be part of the fallback list.

## Bid Adapter Interface

Bid adapters can check the bidRequest.bidLimit value to see if they're going to
be allowed to provide more than one bid response.

When they are allowed to do so, just add another bid response object to the
array returned from the `interpretResponse` function.

## Related Topics

* [MultiBid in the Prebid Server /openrtb2/auction endpoint](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#multibid)
