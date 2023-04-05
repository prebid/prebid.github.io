---
layout: bidder
title: KultureMedia
description: Prebid KultureMedia Bidder Adaptor
pbjs: true
biddercode: kulturemedia
media_types: banner, video
gdpr_supported: true
usp_supported: true
schain_supported: true
sidebarType: 1

---

### Integration Note:

The KultureMedia Header Bidding adapter requires approval from the KultureMedia team. Please reach out to  <devops@kulture.media> for more information.


### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope    | Description        | Example     | Type      |
|------|----------|--------------------|-------------|-----------|
| `placementId` | required | Placement Id | `'1234abcd'` | `string`  |
| `networkId` | optional | Network Id       | `'123456'`     | `string` |
| `publisherId` | required | Publisher Id       | `'12345'`     | `string` |
