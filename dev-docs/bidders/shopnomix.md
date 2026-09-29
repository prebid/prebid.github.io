---
layout: bidder
title: Shopnomix
description: Prebid Shopnomix bidder adapter
biddercode: shopnomix
tcfeu_supported: false
gvl_id: none
usp_supported: true
coppa_supported: false
schain_supported: true
dchain_supported: false
media_types: native
safeframes_ok: true
deals_supported: false
floors_supported: true
fpd_supported: true
pbjs: true
pbs: false
prebid_member: false
sidebarType: 1
---

### Registration

Contact prebid@shopnomix.com for a publisher ID and native placement IDs. The
bidding endpoint only answers requests from origins registered against the
publisher, so the origins a site serves from have to be registered before it can
bid.

### Note

Native only. The adapter does not bid on banner or video.

Bids are CPM in USD and reported net. A floor in another currency is refused, so
run Prebid's currency module to convert one.

Billing runs through Prebid's billing API, so the page needs no billing code.
Setting `deferBilling: true` bills on viewable impressions instead, released by
the publisher's own check or the `bidViewability` module.

### Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                   | Example                            | Type     |
|---------------|----------|-------------------------------|------------------------------------|----------|
| `publisherId` | required | Shopnomix publisher ID        | `'pub_01h2xcejqtf2nbrexx3vqjhp41'` | `string` |
| `placementId` | required | Shopnomix native placement ID | `'plc_01h2xcejqtf2nbrexx3vqjhp41'` | `string` |
