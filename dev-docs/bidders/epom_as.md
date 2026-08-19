---
layout: bidder
title: Epom Ad Server
description: Prebid Epom Ad Server Bid Adapter
pbjs: true
pbs: false
pbs_app_supported: false
biddercode: epom_as
media_types: banner
multiformat_supported: will-bid-on-one
gvl_id: 849
tcfeu_supported: true
usp_supported: true
coppa_supported: true
gpp_sids: none
dsa_supported: false
schain_supported: true
dchain_supported: false
userId: none
userIds:
floors_supported: true
fpd_supported: true
deals_supported: true
ortb_blocking_supported: false
safeframes_ok: true
prebid_member: false
privacy_sandbox: no
sidebarType: 1
---

## Overview

The **Epom Ad Server** bid adapter lets a publisher put their own direct-sold campaigns — booked in Epom Ad Server — into the header auction alongside programmatic demand.

This is a different product from the [Epom DSP](/dev-docs/bidders/epomDspBidAdapter.html) adapter. The DSP **buys** impressions on the open market; this adapter **sells** a publisher's own inventory.

Epom Ad Server is white-label: each network runs its own deployment on its own domain, so the serving host is supplied per ad unit through `params.host`. Only the host is configurable — the request path is fixed by the adapter — and a page may mix several deployments, in which case the adapter groups impressions by host and sends one request to each.

All ad units on the page are auctioned in a **single request**, one `imp` per ad unit. Epom Ad Server resolves a page as a unit, so its roadblock and one-campaign-per-page rules require every slot to be decided in the same auction.

## Bid Parameters

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                                                                                     | Example             | Type     |
|----------------|----------|-----------------------------------------------------------------------------------------------------------------|---------------------|----------|
| `host`         | required | Serving host of the publisher's Epom Ad Server deployment, as a bare hostname.                                   | `'ads.example.com'` | `string` |
| `placementKey` | required | Placement identifier, copied from the placement's invocation-code tab in the Epom UI. Sent as `imp.tagid`.        | `'a4f21c9e7b'`      | `string` |
| `channel`      | optional | Epom channel — a publisher traffic-slice label used for channel targeting and reporting. Sent as `imp.ext.epom_as.channel`. | `"sports-uk"` | `string` |
| `customParams` | optional | Epom custom parameters, for custom targeting and creative macros. Merged into `imp.ext.data`. Scalar values only; at most 32 keys, keys up to 128 and values up to 512 characters. | `{section: 'sport'}` | `object` |
| `bidFloor`     | optional | CPM floor for this impression. Applied only when the Price Floors module has not already resolved `imp.bidfloor`. | `0.50`              | `number` |
| `bidFloorCur`  | optional | Currency of `bidFloor`. Defaults to `USD`.                                                                       | `'EUR'`             | `string` |

## Example Ad Unit Configuration

```javascript
var adUnits = [{
  code: 'leaderboard',
  mediaTypes: {
    banner: { sizes: [[728, 90], [970, 250]] }
  },
  bids: [{
    bidder: 'epom_as',
    params: {
      host: 'ads.example.com',
      placementKey: 'a4f21c9e7b'
    }
  }]
}];
```

## Multiple Deployments

Inventory sold by two Epom networks can run in the same auction. Each host receives its own request, containing only the impressions addressed to it.

```javascript
pbjs.addAdUnits([
  {
    code: 'slot-a',
    mediaTypes: { banner: { sizes: [[300, 250]] } },
    bids: [{
      bidder: 'epom_as',
      params: { host: 'ads.network-one.com', placementKey: 'a4f21c9e7b' }
    }]
  },
  {
    code: 'slot-b',
    mediaTypes: { banner: { sizes: [[728, 90]] } },
    bids: [{
      bidder: 'epom_as',
      params: { host: 'ads.network-two.com', placementKey: '6d0e83b415' }
    }]
  }
]);
```

## Deals

Every bid from Epom Ad Server carries a deal id, surfaced by Prebid as `bid.dealId` and as the `hb_deal_epom_as` targeting key. Publishers who want their own direct campaigns to take precedence over programmatic demand rather than compete with it on price can target an ad server line item on that key.

## Privacy

The adapter registers IAB TCF Global Vendor List ID **849** and forwards the standard OpenRTB privacy signals unchanged: `regs.ext.gdpr` and `user.ext.consent` for TCF, `regs.ext.us_privacy` for US Privacy, `regs.gpp` / `regs.gpp_sid` for GPP, and `regs.coppa`.

The adapter sets `withCredentials: true`, so an existing Epom identity on the ad-server domain reaches the auction; the ad server answers with the request origin rather than a wildcard. The adapter performs no user syncs.

## Support

📩 [support@epom.com](mailto:support@epom.com)
