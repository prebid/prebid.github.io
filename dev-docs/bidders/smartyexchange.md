---
layout: bidder
title: SmartyExchange
description: SmartyExchange Adaptor
aliasCode: adkernel
tcfeu_supported: true
dsa_supported: false
gvl_id: 14 (adkernel)
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

The SmartyExchange bidding adaptor requires setup and approval before beginning. Please reach out to <ops@buddhavibestechnologies.com> for more details

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description           | Example                   | Type     |
|----------|----------|-----------------------|---------------------------|----------|
| `host`   | required | RTB host | `'cpm.arteabee.com'` | `string` |
| `zoneId` | required | RTB zone id           | `30164`                 | `integer` |
