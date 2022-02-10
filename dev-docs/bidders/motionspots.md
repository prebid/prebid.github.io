---
layout: bidder
title: Motionspots
description: Motionspots Bidder Adaptor
pbjs: true
pbs: true
biddercode: motionspots
aliasCode : adkernel
media_types: banner, native, video
gdpr_supported: true
usp_supported: true
coppa_supported: true
pbs_app_supported: true
schain_supported: true
userIds: all
floors_supported: true
fpd_supported: true
---

### Note:

The Motionspots bidding adapter requires setup and approval before implementation. Please reach out to <kiran@collectcent.com> for more details.

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description           | Example                   | Type     |
|----------|----------|-----------------------|---------------------------|----------|
| `host`   | required | RTB host | `'cpm.motionspots.com'` | `string` |
| `zoneId` | required | Zone Id           | 30164                 | `integer` |
