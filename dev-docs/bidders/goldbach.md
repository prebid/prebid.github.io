---
layout: bidder
title: Goldbach
description: Goldbach Bidder Adapter
biddercode: goldbach
tcfeu_supported: true
dsa_supported: true
gvl_id: 580
usp_supported: false
coppa_supported: false
gpp_sids: some (check with bidder)
schain_supported: false
dchain_supported: false
userId: goldbach.com, oneid.live
media_types: banner, video, native
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: true
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: false
privacy_sandbox: no
sidebarType: 1
---
### Note

The Goldbach bidding adapter requires an individualized `'publisherId'` and approval from the Goldbach team. Please reach out to your account manager for more information.

### Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description              | Example                   | Type      |
|---------------|----------|--------------------------|---------------------------|-----------|
| `publisherId` | required | Publisher Environment ID | `example.com_de_ios`      | `string`  |
| `slotId`      | required | Slot Id                  | `1234/slot/id/news`       | `string`  |
