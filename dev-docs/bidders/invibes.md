---
layout: bidder
title: Invibes
description: Prebid Invibes Bidder Adaptor
biddercode: invibes
pbjs: true
pbs: true
tcfeu_supported: true
gvl_id: 436
userIds: pubCommonId, pubProvidedId, uid2, zeotapIdPlus, id5id
safeframes_ok: false
sidebarType: 1
---

### Disclosure

The bidder will use the Local Storage if allowed by the publisher and user gives consent on page with the following purposes:
    - set an internal Invibes ID
    - get the internal Invibes ID if it was set priorly for the user

The bidder will NOT set any cookies. The bidder will also try to read from Cookies if publisher gibes  the internal ID if this wasn't found in LocalStorage.

### Bid Params

{: .table .table-bordered .table-striped }
| Name            | Scope    | Description                          | Example                                         | Type     |
|-----------------|----------|--------------------------------------|-------------------------------------------------|----------|
| `placementId`   | required | The Invibes placement ID             | `'1234567'`                                     | `string` |
| `domainId`      | optional | Id of domain                         | `1001`                                          | `integer`|
| `customEndpoint`| optional | Custom test domain                   | `https://bid.videostep.com/Bid/VideoAdContent`  | `integer`|
| `debug`         | optional | Debug paramentes (only prebid server)| `{ "testBvid": "1234", "testLog": true }`       | `object` |
