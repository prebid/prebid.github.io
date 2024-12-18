---
layout: bidder
title: Pixelpluses
description: Pixelpluses Bidder Adaptor
biddercode: pixelpluses
pbjs: true
pbs: false
media_types: banner, native, video
gvl_id: 1209
tcfeu_supported: true
usp_supported: true
coppa_supported: true
gpp_supported: true
pbs_app_supported: true
schain_supported: true
userIds: all
fpd_supported: true
prebid_member: false
ortb_blocking_supported: true
multiformat_supported: will-bid-on-one
floors_supported: true
aliasCode: adkernel
sidebarType: 1
---

### Note

The Pixelpluses bidding adapter requires setup and approval before implementation. Please reach out to <supply@memob.com> for more details.

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description           | Example                   | Type     |
|----------|----------|-----------------------|---------------------------|----------|
| `host`   | required | Host | `'cpm.pixelpluses.com'` | `string` |
| `zoneId` | required | Zone Id           | `30164`                 | `integer` |
