---
layout: bidder
title: Realry
description: Prebid Realry Bidder Adapter
biddercode: realry
media_types: banner, native
tcfeu_supported: false
gdpr_supported: false
usp_supported: false
coppa_supported: false
schain_supported: false
floors_supported: false
pbjs: false
pbs: true
pbs_app_supported: true
prebid_member: false
multiformat_supported: will-bid-on-one
safeframes_ok: true
deals_supported: false
fpd_supported: false
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                         | Example          | Type     |
|---------------|----------|-----------------------------------------------------|------------------|----------|
| `placementId` | required | Publisher-side identifier for the slot.             | `"slot-pdp-1"`   | `string` |
| `sellerId`    | optional | Realry-assigned advertiser id (partnerships team).  | `"seller-acme"`  | `string` |

### Description

Realry is a commerce DSP focused on luxury fashion product listings. The adapter
forwards the entire OpenRTB BidRequest to `https://bid.realry.com/bid/openrtb`
and returns standard OpenRTB 2.6 BidResponses:

- **Banner** imps receive an `adm` with HTML markup (anchor + image).
- **Native** imps receive an `adm` containing a Native 1.2 admObject with assets
  filled per the requested asset ids (title, main image, sponsored, price, CTA).

The adapter infers bid type from the matching imp's media types — Realry's
endpoint does not stamp `ext.prebid.type` on returned bids.

### Maintainer

`steve@realry.com`
