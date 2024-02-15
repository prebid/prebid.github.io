---
layout: page_v2
page_type: module
title: Module - PAAPI
description: Protected audience API
module_code : paapi
display_name : PAAPI
enable_download : true
sidebarType : 1
---

# PAAPI module

This module allows Prebid.js to support PAAPI, formerly known as [FLEDGE](https://github.com/WICG/turtledove/blob/main/FLEDGE.md).

This document covers the steps necessary for publishers to enable PAAPI on their inventory. It also describes
the changes Bid Adapters need to implement in order to support PAAPI.

A related module, [fledgeForGpt](/dev-docs/modules/fledgeForGpt.html), adds support specifically for GPT's [component auctions](https://developers.google.com/publisher-tag/reference#googletag.config.componentauctionconfig).

## Publisher Integration

To use PAAPI, publishers must:

- include this module in their Prebid.js bundle

   ```bash
   gulp build --modules=paapi,...
   ```

- enable PAAPI, globally or by ad unit, through [configuration](#config)
- manage the PAAPI auctions. This can be delegated to GPT with the [fledgeForGpt module](/dev-docs/modules/fledgeForGpt.html); homegrown solutions are possible with [getPAAPIConfig](/dev-docs/publisher-api-reference/getPAAPIConfig.html), but out of scope for this document.

<a id="config"></a>

### Module Configuration

This module exposes the following settings:

{: .table .table-bordered .table-striped }
|Name |Type |Description |Notes |
| ------------ | ------------ | ------------ |------------ |
|enabled | Boolean |Enable/disable the module |Defaults to `false` |
|bidders | Array[String] |Optional list of bidders |Defaults to all bidders |
|defaultForSlots | Number |Default value for `imp.ext.ae` in requests for specified bidders |Should be 1 |

As noted above, PAAPI support is disabled by default. To enable it, set the `enabled` value to `true` for this module and configure `defaultForSlots` to be `1` (meaning _Client-side auction_).
using the `setConfig` method of Prebid.js:

```js
pbjs.que.push(function() {
  pbjs.setConfig({
    paapi: {
      enabled: true,
      defaultForSlots: 1
    }
  });
});
```

Optionally, PAAPI support can be limited to specific bidders:

```js
pbjs.que.push(function() {
  pbjs.setConfig({
    paapi: {
      enabled: true,
      defaultForSlots: 1,
      bidders: ['bidderA', 'bidderB']
    }
  });
});
```

### Bidder Configuration

This module adds the following setting for bidders:

{: .table .table-bordered .table-striped }
|Name |Type |Description |Notes |
| ------------ | ------------ | ------------ |------------ |
| fledgeEnabled | Boolean | Enable/disable a bidder to participate in FLEDGE | Defaults to `false` |
|defaultForSlots | Number |Default value for `imp.ext.ae` in requests for specified bidders |Should be 1|

In addition to enabling PAAPI at the module level, individual can must also be enabled. This allows publishers to
selectively test with one or more bidders as they desire. To enable one or more bidders, use the `setBidderConfig` method
of Prebid.js:

```js
pbjs.setBidderConfig({
    bidders: ["bidderA"],
    config: {
        fledgeEnabled: true,
        defaultForSlots: 1
    }
});
```

### AdUnit Configuration

All adunits can be opted-in to PAAPI in the global config via the `defaultForSlots` parameter.
If needed, adunits can be configured individually by setting an attribute of the `ortb2Imp` object for that
adunit. This attribute will take precedence over `defaultForSlots` setting.

{: .table .table-bordered .table-striped }
|Name |Type |Description |Notes |
| ------------ | ------------ | ------------ |------------ |
| ortb2Imp.ext.ae | Integer | Auction Environment: 1 indicates PAAPI eligible, 0 indicates it is not | Absence indicates this is not PAAPI eligible |

The `ae` field stands for Auction Environment and was chosen to be consistent with the field that GAM passes to bidders
in their Open Bidding and Exchange Bidding APIs. More details on that can be found
[here](https://github.com/google/ads-privacy/tree/master/proposals/fledge-rtb#bid-request-changes-indicating-interest-group-auction-support)
In practice, this looks as follows:

```js
pbjs.addAdUnits({
    code: "my-adunit-div",
    // other config here
    ortb2Imp: {
        ext: {
            ae: 1
        }
    }
});
```

## Bid Adapter Integration

Chrome has enabled a two-tier auction in PAAPI. This allows multiple sellers (frequently SSPs) to act on behalf of the publisher with
a single entity serving as the final decision maker. In their [current approach](https://github.com/google/ads-privacy/tree/master/proposals/fledge-multiple-seller-testing),
GPT has opted to run the final auction layer while allowing other SSPs/sellers to participate as
[Component Auctions](https://github.com/WICG/turtledove/blob/main/FLEDGE.md#21-initiating-an-on-device-auction) which feed their
bids to the final layer. To learn more about Component Auctions, go [here](https://github.com/WICG/turtledove/blob/main/FLEDGE.md#24-scoring-bids-in-component-auctions).

The PAAPI auction, including Component Auctions, are configured via an `AuctionConfig` object that defines the parameters of the auction for a given
seller. This module enables PAAPI support by allowing bid adaptors to return `AuctionConfig` objects in addition to bids. If a bid adaptor returns an
`AuctionConfig` object, Prebid.js will make it available through [`getPAAPIConfig`](/dev-docs/publisher-api-reference/getPAAPIConfig.html), as well as other PAAPI modules such as [fledgeForGpt](/dev-docs/modules/fledgeForGpt.html).

Modifying a bid adapter to support PAAPI is a straightforward process and consists of the following steps:

1. Detecting when a bid request is PAAPI eligible
2. Responding with AuctionConfig

PAAPI eligibility is made available to bid adapters' [`buildRequests`](/dev-docs/bidder-adaptor.html#building-the-request) method through the `ortb2Imp.ext.ae` property of bid requests; it is set to `1` when the browser supports PAAPI and publisher configuration has enabled it as described above. Bid adapters
who wish to participate should read this flag and pass it to their server. 

When a bid request is PAAPI enabled, a bid adapter can return a tuple consisting of bids and AuctionConfig objects rather than just a list of bids:

```js
function interpretResponse(resp, req) {
    // Load the bids from the response - this is adapter specific
    const bids = parseBids(resp);

    // Load the auctionConfigs from the response - also adapter specific
    const fledgeAuctionConfigs = parseAuctionConfigs(resp);

    if (fledgeAuctionConfigs) {
        // Return a tuple of bids and auctionConfigs. It is possible that bids could be null.
        return {bids, fledgeAuctionConfigs};
    } else {
        return bids;
    }
}
```

An AuctionConfig must be associated with an adunit and auction, and this is accomplished using the value in the `bidId` field from the objects in the
`validBidRequests` array passed to the `buildRequests` function - see [here](/dev-docs/bidder-adaptor.html#ad-unit-params-in-the-validbidrequests-array)
for more details. This means that the AuctionConfig objects returned from `interpretResponse` must contain a `bidId` field whose value corresponds to
the request it should be associated with. This may raise the question: why isn't the AuctionConfig object returned as part of the bid? The
answer is that it's possible to participate in the PAAPI auction without returning a contextual bid.

An example of this can be seen in the OpenX bid adapter [here](https://github.com/prebid/Prebid.js/blob/master/modules/openxBidAdapter.js) or RTB House bid adapter [here](https://github.com/prebid/Prebid.js/blob/master/modules/rtbhouseBidAdapter.js).

Other than the addition of the `bidId` field, the `AuctionConfig` object should adhere to the requirements set forth in PAAPI. The details of creating an
`AuctionConfig` object are beyond the scope of this document.

## Related Reading

- [fledgeForGpt module](/dev-docs/modules/fledgeForGpt.html)
- [FLEDGE](https://github.com/WICG/turtledove/blob/main/FLEDGE.md)
- [Component Auctions](https://github.com/WICG/turtledove/blob/main/FLEDGE.md#21-initiating-an-on-device-auction)
- [getPAAPIConfig](/dev-docs/publisher-api-reference/getPAAPIConfig.html)
