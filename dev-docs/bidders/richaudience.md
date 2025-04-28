---
layout: bidder
title: Rich Audience
description: Prebid Rich Audience Bidder Adapter
biddercode: richaudience
userIds: criteo, id5Id, identityLink, liveIntentId, pubCommonId, unifiedId
media_types: banner, video
tcfeu_supported: true
gvl_id: 108
gpp_supported: true
safeframes_ok: false
prebid_member: true
pbjs: true
pbs: true
schain_supported: true
floors_supported: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope           | Description                                                                                              | Example                                                                                                 | Type       |
|-------------|-----------------|----------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|------------|
| `pid`       | required        | The placement ID from Rich Audience.                                                                     | `'ADb1f40rmi'`                                                                                          | `string`   |
| `supplyType`| required        | Define if site or app.                                                                                   | `'site / app'`                                                                                          | `string`   |
| `ifa`       | optional        | Identifier For Advertisers                                                                               | `'AAAAAAAAA-BBBB-CCCC-1111-222222220000234234234234234'`                                                | `string`   |
| `keywords`  | optional        | A key-value applied only to the configured bid. This value is optional. Strings separated by semicolon.  | `car=mercedes;car=audi;`                                                                                | `string`   |
