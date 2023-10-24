---
layout: bidder
title: Bluesea
description: Prebid Bluesea Bidder Adapter
biddercode: bluesea
tcfeu_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
media_types: banner, video, native
floors_supported: true
pbjs: false
pbs: true
pbs_app_supported: true
fpd_supported: true
prebid_member: false
ortb_blocking_supported: true

### Registration

If you have any question regarding the set up, please reach out to your account manager or <prebid@blueseasx.com> for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  | Example   | Type     |
|---------------|----------|--------------|-----------|----------|
| `pubid` | required | Unique partner account id | `'254673'` | `string` |
| `token` | required | Token for certification | `'3l2l2mbl2knw2ggc'` | `string` |

### First Party Data
Publishers can use the ortb2 configuration to provide First Party Data. The following fields are supported:
- ortb2.site.*
- ortb2.user.*

