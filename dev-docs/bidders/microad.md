---
layout: bidder
title: MicroAd
description: Prebid MicroAd SSP Bidder Adaptor
pbjs: true
biddercode: microad
media_types: banner
userIds: imuid, id5Id, tdid, novatiq, parrableId, dacId, identityLink, criteo, pubcid, uid2
sidebarType: 1
---

Note:
The MicroAd Bidding adapter requires setup and approval beforehand.
For more information, visit [MicroAd website](https://www.microad.co.jp/contact/compass.html).

### Bid parameters

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                                       | Example                              | Type            |
|------------|----------|-------------------------------------------------------------------|--------------------------------------|-----------------|
| `spot`     | required | Ad placement ID provided by MicroAd.                              | `'209e56872ae8b0442a60477ae0c58be9'` | `string`        |
| `url`      | optional | URL parameter. Effective only when provided by MicroAd.           | `'${COMPASS_EXT_URL}'`               | `string`        |
| `referrer` | optional | Referrer parameter. Effective only when provided by MicroAd.      | `'${COMPASS_EXT_REF}'`               | `string`        |
| `ifa`      | optional | IFA parameter. Effective only when provided by MicroAd.           | `'${COMPASS_EXT_IFA}'`               | `string`        |
| `appid`    | optional | App ID parameter. Effective only when provided by MicroAd.        | `'${COMPASS_EXT_APPID}'`             | `string`        |
| `geo`      | optional | Geo parameter. Effective only when provided by MicroAd.           | `'${COMPASS_EXT_GEO}'`               | `string`        |
| `aids`     | optional | User IDs parameter. `type` indicates User IDs type.               | `[{type: 6, id: '*******'}]`         | `Array<Object>` |
