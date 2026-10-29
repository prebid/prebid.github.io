---
layout: bidder
title: Türk Telekom
description: Türk Telekom Bidder Adaptor
biddercode: turktelekom
aliasCode: adkernel
tcfeu_supported: true
dsa_supported: false
gvl_id: 673
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

The Türk Telekom bidding adapter requires setup and approval before implementation. Please reach out to <ad-ops@turktelekom.com.tr> for more details.

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description           | Example                   | Type     |
|----------|----------|-----------------------|---------------------------|----------|
| `host`   | required | RTB host | `'cpm.programattik.com'` | `string` |
| `zoneId` | required | Zone Id           | 30164                 | `integer` |
