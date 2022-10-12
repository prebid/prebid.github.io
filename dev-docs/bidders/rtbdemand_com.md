---
layout: bidder
title: RtbDemand.com
description: Prebid RtbDemand.com Bidder Adaptor
biddercode: rtbdemand_com
pbjs: true
pbs: false
media_types: banner, native, video
gdpr_supported: true
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
aliasCode: adkernel
---

### Note:

The RtbDemand.com bidding adaptor requires setup and approval before beginning. Please reach out to <shreyanschopra@rtbdemand.com> for more details

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description           | Example                   | Type     |
|----------|----------|-----------------------|---------------------------|----------|
| `host`   | required | Our Host | `' cpm.rtbdemand.com'` | `string` |
| `zoneId` | required | Example RTB zone id           | `'12345'`                 | `string` |
