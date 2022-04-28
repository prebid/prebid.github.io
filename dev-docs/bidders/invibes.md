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
| `domainId`      | optional | Id of domain                         | `1001`                                          | `integer`|
| `customEndpoint`| optional | Custom test domain                   | `https://bid.videostep.com/Bid/VideoAdContent`  | `integer`|
| `debug`         | optional | Debug paramentes (only prebid server)| `{ "testBvid": "1234", "testLog": true }`       | `object` |

