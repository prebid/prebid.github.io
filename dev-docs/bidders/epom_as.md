---
layout: bidder
title: Epom Ad Server
description: Prebid Epom Ad Server Bidder Adapter
pbjs: true
pbs: true
pbs_app_supported: true
biddercode: epom_as
media_types: banner
multiformat_supported: will-bid-on-one
gvl_id: 849
tcfeu_supported: true
usp_supported: true
coppa_supported: true
gpp_sids: tcfeu, usp
dsa_supported: false
schain_supported: true
dchain_supported: false
userIds: all
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
| Name           | Scope    | Description                                                                                                                                                                             | Example              | Type     |
|----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------|----------|
| `host`         | required | Serving host of the publisher's Epom Ad Server deployment, as a bare hostname with an optional port — no scheme, path or query. The adapter POSTs to `https://{host}/hb/bid`.           | `'ads.example.com'`  | `string` |
| `placementKey` | required | Placement identifier, copied from the placement's invocation-code tab in the Epom UI. Must not be empty. Sent as `imp.tagid`.                                                           | `'a4f21c9e7b'`       | `string` |
| `channel`      | optional | Epom channel — a publisher traffic-slice label used for channel targeting and reporting. Sent as `imp.ext.epom_as.channel`. An empty value is ignored.                                  | `'sports-uk'`        | `string` |
| `customParams` | optional | Epom custom parameters, for custom targeting and creative macros. Values must be strings, numbers or booleans; they are stringified and merged into `imp.ext.data`.                     | `{section: 'sport'}` | `object` |
| `bidFloor`     | optional | CPM floor for this impression, applied only when no floor has already been resolved — a value from the Price Floors module always wins. `0` means no floor, and it may not be negative. | `0.50`               | `number` |
| `bidFloorCur`  | optional | Currency of `bidFloor`, as an ISO-4217 code. Defaults to `USD`.                                                                                                                         | `'EUR'`              | `string` |

Two details the table cannot hold comfortably:

- `host` accepts a single-label hostname such as `'ads-eu'` as well as a dotted one, because an Epom deployment may be reached over an internal name. It never accepts a scheme, a path, a query, a fragment or userinfo, on either transport.
- `customParams` carries no key-count or length limit at the adapter. Epom Ad Server applies its own ingest limits on top — at most 32 keys, keys to 128 and values to 512 characters — and ignores anything beyond them. When a key in `customParams` collides with one already on the impression, the impression's value wins; see [First Party Data](#first-party-data).

## Prebid.js and Prebid Server

The parameters above are the same on both transports, and the OpenRTB payload Epom Ad Server reads is the same, so an ad unit needs no change when it moves between them.

The endpoint is reached differently. In Prebid.js the adapter builds the URL itself from `params.host`. In Prebid Server it is host-templated as `https://{% raw %}{{.Host}}{% endraw %}/hb/bid`, resolved per impression from the same `host` parameter — a Prebid Server host operator does not configure a per-publisher endpoint.

Two differences are worth knowing rather than discovering. A browser request carries the reader's cookies; a server-side one carries none, so any frequency capping Epom applies per user needs `user.buyeruid` from a cookie sync. And the reader's address reaches Epom in the header the adapter forwards from `device.ip`, since on a server-to-server call the connection itself comes from the Prebid Server host rather than from the reader.


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

## Test Parameters

A live placement on an Epom-operated demo deployment, which always fills, for checking the integration end to end:

```javascript
var adUnits = [{
  code: 'test-div',
  mediaTypes: {
    banner: { sizes: [[300, 250]] }
  },
  bids: [{
    bidder: 'epom_as',
    params: {
      host: 'aj2494.online',
      placementKey: '63bad7a99f270394e7b4b370952cbff2'
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

## First Party Data

The adapter forwards first party data unchanged; it neither filters nor reshapes it.

Global and bidder-scoped data set through `pbjs.setConfig({ortb2: ...})` or `pbjs.setBidderConfig({bidder: 'epom_as', config: {ortb2: ...}})` is merged into the OpenRTB request as supplied, so `site.*` (including `site.content` and `site.keywords`), `user.*` (including `user.data`) and `app.*` all reach Epom Ad Server. Ad-unit data set as `ortb2Imp` — most usefully `ortb2Imp.ext.data` and `ortb2Imp.ext.gpid` — is merged into that ad unit's `imp` object.

`params.customParams` lands in the same place as ad-unit first party data: `imp.ext.data`. The two are merged, and **first party data wins** — a key already present on the impression, whether it came from `ortb2Imp.ext.data`, from a Real-Time Data module or from `gptPreAuction`, is not overwritten by an entry of the same name in `customParams`. Use `customParams` for values that belong to Epom's own targeting and macros, and `ortb2Imp.ext.data` for values every bidder should see.

User IDs are forwarded the same way. Any ID module enabled on the page writes its EIDs into `user.ext.eids`, which the adapter passes through untouched; the adapter itself resolves no identifiers.

## Deals

Every bid from Epom Ad Server carries a deal id, surfaced by Prebid as `bid.dealId` and as the `hb_deal_epom_as` targeting key. Publishers who want their own direct campaigns to take precedence over programmatic demand rather than compete with it on price can target an ad server line item on that key.

## Notes

Epom Ad Server does not currently populate `seatbid.bid[].adomain` on its bid responses, so `bid.meta.advertiserDomains` arrives empty. Brand-safety or blocking line items keyed on advertiser domain will not match a bid from this adapter.

## Privacy

The adapter registers IAB TCF Global Vendor List ID **849**.

It forwards the standard OpenRTB privacy signals to Epom Ad Server unchanged, and enforces none of them itself — enforcement is the ad server's: `regs.ext.gdpr` and `user.ext.consent` for TCF EU, `regs.ext.us_privacy` for US Privacy, `regs.gpp` with `regs.gpp_sid` for GPP, and `regs.coppa`. The GPP sections the ad server acts on are the TCF EU and US Privacy ones.

The adapter sets `withCredentials: true`, so an existing Epom identity cookie — set by the ad server on its own domain, never by the adapter — reaches the auction; the ad server answers with the request origin rather than a wildcard. The adapter itself uses no storage manager and writes nothing to cookies or local storage.

The Prebid.js adapter performs no user syncs. Server-side, the sync endpoint lives on each publisher's own Epom deployment, so a Prebid Server host must configure it; contact Epom to have it enabled.

## Support

📩 [support@epom.com](mailto:support@epom.com)
