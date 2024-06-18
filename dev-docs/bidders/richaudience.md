---
layout: bidder
title: Rich Audience
description: Prebid Rich Audience Bidder Adapter
biddercode: richaudience
userIds: criteo, id5Id, identityLink, liveIntentId, pubCommonId, unifiedId
media_types: banner, video
tcfeu_supported: true
gvl_id: 108
safeframes_ok: false
prebid_member: true
pbjs: true
pbs: true
schain_supported: true
floors_supported: true
pbjs_version_notes: removed in 9.0
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope           | Description                                                                                              | Example                                                                                                 | Type       |
|-------------|-----------------|----------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|------------|
| `pid`       | required        | The placement ID from Rich Audience.                                                                     | `'ADb1f40rmi'`                                                                                          | `string`   |
| `supplyType`| required        | Define if site or app.                                                                                   | `'site / app'`                                                                                          | `string`   |
| `ifa`       | optional        | Identifier For Advertisers                                                                               | `'AAAAAAAAA-BBBB-CCCC-1111-222222220000234234234234234'`                                                | `string`   |
| `bidfloor`  | optional        | Bid Floor                                                                                                | `0.80`                                                                                                  | `float`    |
| `keywords`  | optional        | A key-value applied only to the configured bid. This value is optional. Strings separated by semicolon.  | `car=mercedes;car=audi;`                                                                                | `string`   |
| `player`    | optional        | Object containing video targeting parameters. See [Video Object](#ra-video-object) for details.          | `player: {init: 'open', end: 'close', skin: 'dark'}`                                                    | `object`   |

<a name="ra-video-object"></a>

### Video Object

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                            | Example                       | Type      |
|-------------|----------|----------------------------------------|-------------------------------|-----------|
| `init`      | optional | Start mode of the player open or close | `'open / close'`              | `string`  |
| `end`       | optional | End mode of the player open or close   | `'open / close'`              | `string`  |
| `skin`      | optional | Choose the background color            | `'dark / light'`              | `string`  |
