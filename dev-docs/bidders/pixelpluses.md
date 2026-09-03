---
layout: bidder
title: Pixelpluses
description: Pixelpluses Bidder Adaptor
biddercode: pixelpluses
aliasCode: adkernel
tcfeu_supported: true
dsa_supported: false
gvl_id: 1209
usp_supported: true
coppa_supported: true
gpp_sids: tcfeu, usp
schain_supported: true
dchain_supported: false
userId: all
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
ortb_blocking_supported: true
privacy_sandbox: no
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
