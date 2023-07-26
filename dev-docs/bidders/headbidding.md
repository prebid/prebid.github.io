---
layout: bidder
title: Head Bidding
description: Prebid Head Bidding Bidder Adaptor

top_nav_section: dev_docs
nav_section: reference

pbjs: true
pbs: false
biddercode: headbidding
media_types: banner, native, video
gvl_id: 14
tcfeu_supported: true
usp_supported: true
coppa_supported: true
pbs_app_supported: true
schain_supported: true
userIds: all
fpd_supported: true
prebid_member: false
ortb_blocking_supported: true
multiformat_supported: will-bid-on-one
floors_supported: true
aliasCode : adkernel
sidebarType: 1

---

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description | Example | Type     |
|----------|----------|-------------|---------|----------|
| `zoneId` | required |             |         | `integer` |
| `host`   | required |             |         | `string` |

Head Bidding is an aliased bidder for AdKernel
