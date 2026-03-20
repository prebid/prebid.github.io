---
layout: bidder
title: blis
description: Prebid Blis Bidder Adapter
biddercode: blis
tcfeu_supported: true
gvl_id: 94
usp_supported: true
coppa_supported: true
gpp_sids: tcfeu, usnat, usp
schain_supported: true
dchain_supported: false
userId: adserver, liveramp, sharedid, pubcid, id5-sync, criteo
media_types: banner, video, native
safeframes_ok: false
deals_supported: true
floors_supported: true
fpd_supported: false
pbjs: false
pbs: true
pbs_app_supported: true
prebid_member: true
multiformat_supported: will-bid-on-one
ortb_blocking_supported: partial
privacy_sandbox: no
---

### Registration

Blis adapter requires setup before beginning. Please contact us at <supply@blis.com>.

### ORTB Blocking

Blis bidder supports bcat, badv and battr.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                               | Example   | Type     |
|---------------|----------|-------------------------------------------|-----------|----------|
| `spid`        | required | Unique supply partner ID provided by Blis | `'999'` | `string` |
