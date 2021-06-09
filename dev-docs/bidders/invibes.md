---
layout: bidder
title: Invibes
description: Prebid Invibes Bidder Adaptor
pbjs: true
biddercode: invibes
gdpr_supported: true
tcf2_supported: true
userIds: pubCommonId, pubProvidedId, uid2, zeotapIdPlus, id5id
pbs: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name            | Scope    | Description                          | Example                                         | Type     |
|-----------------|----------|--------------------------------------|-------------------------------------------------|----------|
| `placementId`   | required | The Invibes placement ID             | `'1234567'`                                     | `string` |
| `domainId`      | optional | Id of domain (only prebid server)    | `1001`                                          | `integer`|
| `debug`         | optional | Debug paramentes (only prebid server)| `{ "testBvid": "1234", "testLog": true }`       | `object` |

