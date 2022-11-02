---
layout: bidder
title: ResetDigital
description: Reset Digital Bidder Module
pbjs: true
pbs: true
biddercode: resetdigital
gdpr_supported: false
usp_supported: false
coppa_supported: false
schain_supported: true
floors_supported: true
userIds: check with bidder
prebid_member: false
deals_supported: true
pbs_app_supported: true
multiformat_supported: will-bid-on-any
media_types: banner, video
---

### bid params

{: .table .table-bordered .table-striped }

| Name     | Scope    | Description | Example                            | Type     |
|----------|----------|-------------|------------------------------------|----------|
| `pubId` | required |    Publisher account id         | `'123pubid'` | `string` |
| `zoneId` | optional |   Ad zone specific id if provided          | `'456zoneId'` | `string` |
| `forceBid` | optional | Returns test bid | true | `boolean` |
