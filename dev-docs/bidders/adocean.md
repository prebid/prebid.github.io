---
layout: bidder
title: AdOcean
description: Prebid AdOcean Bidder Adaptor
biddercode: adocean
tcfeu_supported: true
dsa_supported: false
gvl_id: 328
usp_supported: false
coppa_supported: false
gpp_sids: tcfeu
schain_supported: false
dchain_supported: false
userId: gemiusId
media_types: banner, video
safeframes_ok: false
deals_supported: false
floors_supported: false
fpd_supported: false
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: false
privacy_sandbox: no
sidebarType: 1
---

### Note

If you have any issues with setting up the AdOcean bidder, please contact with your local Technical Support team or by visiting [AdOcean website](https://adocean-global.com/en/contact/).

### Prebid.JS Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description       | Example                                            | Type     |
|----------|----------|-------------------|----------------------------------------------------|----------|
| slaveId  | required | slave ID          | `'adoceanmyaotcpiltmmnj'`                          | `string` |
| masterId | required | master ID         | `'ek1AWtSWh3BOa_x2P1vlMQ_uXXJpJcbhsHAY5PFQjWD.D7'` | `string` |
| emiter   | required | traffic source id | `'myao.adocean.pl'`                                | `string` |
