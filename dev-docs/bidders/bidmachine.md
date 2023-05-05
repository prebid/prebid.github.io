---
layout: bidder
title: Bidmachine
description: Prebid Bidmachine Bidder Adapter
biddercode: bidmachine
gdpr_supported: true
gvl_id: 736
usp_supported: true
coppa_supported: true
schain_supported: true
dchain_supported: false
media_types: banner, video
safeframes_ok: true
deals_supported: false
pbjs: false
pbs: true
pbs_app_supported: true
prebid_member: false
sidebarType: 1
---

### Prebid Server Note:
The Bidmachine Bidding adapter requires setup before beginning. Please contact us at hi@bidmachine.io .

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                     | Example                                | Type     |
| :------------ | :------- | :---------------------------------------------- | :------------------------------------- |----------|
| `host`        | required | DC region                                       | `"api-eu"`                             | `string` |
| `path`        | required | URL path, will be provided by manager           | `"auction/rtb/v2"`                     | `string` |
| `seller_id`   | required | Your ID in Bidmachine system                    | `"1"`                                  | `string` |
