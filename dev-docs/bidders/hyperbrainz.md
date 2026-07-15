---
layout: bidder
title: HyperBrainz
description: Prebid.js HyperBrainz Bid Adapter
biddercode: hyperbrainz
tcfeu_supported: false
gvl_id: none
dsa_supported: false
usp_supported: true
coppa_supported: true
gpp_sids: usnat, usstate_all, usp
schain_supported: true
dchain_supported: false
userIds: all
media_types: banner, video, native
safeframes_ok: true
deals_supported: false
floors_supported: true
fpd_supported: true
pbjs: true
pbs: false
pbs_app_supported: false
prebid_member: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: false
privacy_sandbox: no
maintainer_email: it@hyperbrainz.com
sidebarType: 1
---

## Note

The HyperBrainz bid adapter requires setup and approval before
implementation.
Please reach out to <it@hyperbrainz.com> for more details.

## Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                    | Example            | Type     |
|---------------|----------|------------------------------------------------|--------------------|----------|
| `placementId` | required | Unique placement identifier                    | `'hb_test_banner'` | `string` |
| `publisherId` | optional | Publisher identifier                           | `'pub-1'`          | `string` |
| `bidFloor`    | optional | Minimum CPM floor override (USD)               | `0.30`             | `number` |
| `ext`         | optional | Custom extension fields passed to the exchange | `{}`               | `object` |
