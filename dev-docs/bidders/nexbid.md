---
layout: bidder
title: NexBid
description: Prebid NexBid Bidder Adapter
biddercode: nexbid
tcfeu_supported: false
dsa_supported: false
gvl_id: none
usp_supported: true
coppa_supported: false
gpp_sids: usnat, usstate_all, usp
schain_supported: true
dchain_supported: false
userId: none
media_types: display
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: true
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-not-bid
ortb_blocking_supported: partial
privacy_sandbox: no
sidebarType: 1
---

## NexBid

### Registration

The NexBid adapter requires an approved publisher account and placement. Contact `prebid@nexbid.uk` for registration and test support.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `publisherId` | required | NexBid publisher account identifier | `'2606001'` | `string` |
| `placementId` | required | NexBid placement identifier | `'moneycontrol_300x250'` | `string` |
| `configId` | optional | NexBid demand configuration identifier | `'moneycontrol.com'` | `string` |
| `test` | optional | Enables the documented NexBid test placement only | `true` | `boolean` |

### Test Parameters

```javascript
{
  bidder: 'nexbid',
  params: {
    publisherId: 'nexbid-test',
    placementId: 'banner-300x250',
    configId: 'prebid-review',
    test: true
  }
}
```

### First-Party Data and Blocking

The adapter forwards Prebid `ortb2` and impression-level `ortb2Imp` data to the NexBid gateway. OpenRTB blocking information present in those objects is forwarded without adapter-side mutation. Support is therefore declared partial until each blocking field is enforced by all underlying demand sources.

### Privacy

The adapter forwards USP and applicable US GPP sections. NexBid does not claim TCF-EU support until it has a valid IAB Europe Global Vendor List ID and the production gateway enforces that consent.
