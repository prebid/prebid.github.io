---
layout: bidder
title: BizzClick
description: Prebid BizzClick Bidder Adaptor
biddercode: bizzclick
tcfeu_supported: false
usp_supported: true
coppa_supported: true
schain_supported: true
media_types: banner, video, native
safeframes_ok: true
deals_supported: true
pbjs: true
pbs: true
pbs_app_supported: true
sidebarType: 1
floors_supported: true
prebid_member: false
fpd_supported: false
gvl_id: none
multiformat_supported: will-bid-on-one
ortb_blocking_supported: true
userIds: all
---

### Note

The Example Bidding adapter requires setup before beginning. Please contact us at <support@bizzclick.com> .BizzClick will only respond to the first impression and that multiple ad formats of that single impression are not supported.

### Bid Params for Prebid Server and Prebid Mobile

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|---------------|----------|-----------------------|-----------|-----------|
| `sourceId` | required | Unique hash provided by bizzclick | `'6dllcEHSxYdSb6yLmCqE'` | `string` |
| `accountId` | required | Unique name provided by bizzclick | `'bizzclick-test'` | `string` |
| `host` | optional | Bizzclick server region. US East by default | `'us-e-node1'` | `string` |
| `placementId` | required | Deprecated parameter. Please use sourceId instead |`'6dllcEHSxYdSb6yLmCqE'`|`string` |

### Bid Params for Prebid.js

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|---------------|----------|-----------------------|-----------|-----------|
| `sourceId` | required | Unique hash provided by bizzclick | `'6dllcEHSxYdSb6yLmCqE'` | `string` |
| `accountId` | required | Unique name provided by bizzclick | `'bizzclick-test'` | `string` |
| `host` | optional | Bizzclick server region. US East by default | `'us-e-node1'` | `string` |
