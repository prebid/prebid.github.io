---
layout: bidder
title: Seeding Alliance
description: Prebid Seeding Alliance Bidder Adapter
biddercode: seedingAlliance
tcfeu_supported: true
gvl_id: 371 
usp_supported: false
coppa_supported: false
schain_supported: false
dchain_supported: false
userId: none
media_types: banner, native
safeframes_ok: true
deals_supported: false
floors_supported: true
fpd_supported: false
pbjs: true
pbs: true
pbs_app_supported: false
prebid_member: false
sidebarType: 1
---

### Bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description          | Example            | Type      |
|-------------|----------|----------------------|--------------------|-----------|
| `adUnitId`  | required | ID of the Ad Unit    | `8ao`              | `string`  |
| `accountId` | optional | Your identifier for the account (Prebid Server only) | `12345` | `string`  |
| `url`       | optional | URL from the Page    | `example.tld`      | `string`  |
