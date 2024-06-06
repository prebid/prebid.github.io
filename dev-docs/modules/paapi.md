---
layout: page_v2
page_type: module
title: Module - PAAPI
description: Protected Audience API
module_code : paapi
display_name : PAAPI
enable_download : true
sidebarType : 1
---

# PAAPI module

This module allows Prebid.js to support PAAPI, formerly known as [FLEDGE](https://github.com/WICG/turtledove/blob/main/FLEDGE.md).

This document covers the steps necessary for publishers to enable PAAPI on their inventory. It also describes
the changes Bid Adapters need to implement in order to support PAAPI.

A related module, [paapiForGpt](/dev-docs/modules/paapiForGpt.html), adds support specifically for GPT's [component auctions](https://developers.google.com/publisher-tag/reference#googletag.config.componentauctionconfig).

## Publisher Integration

To use PAAPI, publishers must:

- include this module in their Prebid.js bundle

   ```bash
   gulp build --modules=paapi,...
   ```

- enable PAAPI, globally or by ad unit, through [configuration](#config)
- manage the PAAPI auctions. This can be delegated to GPT with the [paapiForGpt module](/dev-docs/modules/paapiForGpt.html); homegrown solutions are possible with [topLevelPaapi](/dev-docs/modules/topLevelPaapi.html).

<a id="config"></a>

### Module Configuration

This module exposes the following settings:

{: .table .table-bordered .table-striped }
|Name |Type |Description |Notes |
| ------------ | ------------ | ------------ |------------ |
|enabled | Boolean |Enable/disable the module |Defaults to `false` |
|bidders | Array[String] |Optional list of bidders |Defaults to all bidders |
|defaultForSlots | Number |Default value for `imp.ext.ae` in requests for specified bidders |Should be 1 |
|componentSeller | Object |Configuration for publishers acting as component sellers | See [note](#componentSeller) |


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

<a id="componentSeller"></a>
### Advanced usage: publisher-managed component auction

Bid adapters typically act as PAAPI sellers, each providing one or more [component auctions](https://github.com/WICG/turtledove/blob/main/FLEDGE.md#24-scoring-bids-in-component-auctions) in a multi-seller PAAPI auction.
Some adapters may act as PAAPI buyers: instead of a full component auction, they can reply directly with buyer information. By configuring `componentSeller`, these buyers are collected into one or more publisher-managed component auctions.

{: .table .table-bordered .table-striped }
|Name |Type |Description |
| ------------ | ------------ | ------------ |
|componentSeller.auctionConfig | Object | [AuctionConfig](https://github.com/WICG/turtledove/blob/main/FLEDGE.md#21-initiating-an-on-device-auction) object to use for the component auction(s) |
|componentSeller.separateAuctions | Boolean | If `true`, generate a component auction for each bid adapter. If `false` (the default), buyers are collected into as few component auctions as possible (typically one, but multiple are possible if multiple bidders reply with the same buyer) |


## Bid Adapter Integration

Chrome has enabled a two-tier auction in PAAPI. This allows multiple sellers (frequently SSPs) to act on behalf of the publisher with
a single entity serving as the final decision maker. In their [current approach](https://github.com/google/ads-privacy/tree/master/proposals/fledge-multiple-seller-testing),
GPT has opted to run the final auction layer while allowing other SSPs/sellers to participate as
[Component Auctions](https://github.com/WICG/turtledove/blob/main/FLEDGE.md#21-initiating-an-on-device-auction) which feed their
bids to the final layer. To learn more about Component Auctions, go [here](https://github.com/WICG/turtledove/blob/main/FLEDGE.md#24-scoring-bids-in-component-auctions).

The PAAPI auction, including Component Auctions, are configured via an `AuctionConfig` object that defines the parameters of the auction for a given
seller. This module enables PAAPI support by allowing bid adaptors to return `AuctionConfig` objects in addition to bids. If a bid adaptor returns an
`AuctionConfig` object, Prebid.js will make it available through [`getPAAPIConfig`](/dev-docs/publisher-api-reference/getPAAPIConfig.html), as well as other PAAPI modules such as [paapiForGpt](/dev-docs/modules/paapiForGpt.html).

{: .alert.alert-warning :}
If your adapter interfaces with an ORTB backend, you may take advantage of Prebid's [ORTB conversion library](https://github.com/prebid/Prebid.js/blob/master/libraries/ortbConverter/README.md), which implements the following using [protected audience community extensions](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/main/extensions/community_extensions/Protected%20Audience%20Support.md)

Modifying a bid adapter to support PAAPI is a straightforward process and consists of the following steps:

1. Detecting when a bid request is PAAPI eligible
2. Responding with AuctionConfig or InterestGroupBuyer in addition to (or instead of) bids

### Input parameters

When PAAPI is configured, the following fields are made available to adapters' [`buildRequests`](/dev-docs/bidder-adaptor.html#building-the-request):

{: .table .table-bordered .table-striped }
|Name |Type |Description |Notes |
| ------------ | ------------ | ------------ |
| `validBidRequests[].ortb2Imp.ext.ae` | Integer | `1` when the PAAPI is enabled for the request |
| `validBidRequests[].ortb2Imp.ext.igs` | Object | [InterestGroupSupport](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/main/extensions/community_extensions/Protected%20Audience%20Support.md#object-interestgroupauctionsupport) object|
| `validBidRequests[].ortb2Imp.ext.igs.ae` | Integer | duplicate of `ortb2Imp.ext.ae` |
| `validBidRequests[].ortb2Imp.ext.igs.biddable` | Integer | `1` when `ae` is `1` |
| `validBidRequests[].ortb2Imp.ext.paapi.requestedSize` | Object | Size (as an object `{width, height}`) that will be passed as `requestedSize` to [`runAdAuction`](https://github.com/WICG/turtledove/blob/main/FLEDGE.md#21-initiating-an-on-device-auction) | 
| `bidderRequest.paapi.enabled` | Boolean | `true` if the publisher has enabled PAAPI and the browser supports it |
| `bidderRequest.paapi.componentSeller` | Boolean | `true` if the publisher can act as a component seller and accept `igb` objects instead of auction configs |

### Output values

When a bid request is PAAPI enabled, a bid adapter can return a tuple consisting of bids and PAAPI objects rather than just a list of bids:

```js
function interpretResponse(resp, req) {
    // Load the bids from the response - this is adapter specific
    const bids = parseBids(resp);

    // Load auction configs or igb from the response - also adapter specific
    const paapi = parsePaapi(resp);
    return {bids, paapi};
}
```

`paapi` must be an array of objects containing:

{: .table .table-bordered .table-striped }
|Name |Type |Description |Notes |
| ------------ | ------------ | ------------ |
| `bidId` | String | one of the input requests' `bidId`. Used to identify the slot that this object refers to. |
| `igb` | Object | [InterestGroupBuyer](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/main/extensions/community_extensions/Protected%20Audience%20Support.md#object-interestgroupauctionsupport) object|
| `config` | Object | [AuctionConfig](https://github.com/WICG/turtledove/blob/main/FLEDGE.md#21-initiating-an-on-device-auction) object |

Each object must specify exactly one of `igb` or `config`.

An example of this can be seen in the OpenX bid adapter [here](https://github.com/prebid/Prebid.js/blob/master/modules/openxBidAdapter.js) or RTB House bid adapter [here](https://github.com/prebid/Prebid.js/blob/master/modules/rtbhouseBidAdapter.js).

## Related Reading

- [paapiForGpt module](/dev-docs/modules/paapiForGpt.html)
- [Protected Audience API (PAAPI)](https://github.com/WICG/turtledove/blob/main/FLEDGE.md), formerly FLEDGE
- [Component Auctions](https://github.com/WICG/turtledove/blob/main/FLEDGE.md#21-initiating-an-on-device-auction)
- [getPAAPIConfig](/dev-docs/publisher-api-reference/getPAAPIConfig.html)
