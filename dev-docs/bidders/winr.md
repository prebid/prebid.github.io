---
layout: bidder
title: WINR
description: Prebid WINR Bidder Adaptor
biddercode: winr
media_types: banner
prebid_member: false
userIds: criteo, unifiedId, netId, identityLink, uid2
schain_supported: true
coppa_supported: true
usp_supported: true
floors_supported: true
pbjs: true
safeframes_ok: false
sidebarType: 1
---

### Note

The WINR adapter requires setup and approval from the WINR team, even for partners that already work with us. Please reach out to our team at <tech@winr.com.au>

*`domParent` and `child` position settings are usually determined and remotely controlled for each publisher site by the WINR team. If you would prefer to have control over these settings, please get in touch.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                                                       | Example      | Type      |
|---------------|----------|---------------------------------------------------------------------------------------------------|--------------|-----------|
| `placementId` | required | Placement ID can be a `string` or `integer`, however `integer` is preferred.               | `21764100`    | `integer` |
| `domParent`*   | optional | The DOM element where the ad unit will load into. The value is passed as a parameter to the JavaScript HTML DOM querySelector() method  | `.blog_post`  | `string`  |
| `child`*       | optional | The number of child nodes of `domParent` preceding the ad unit. | `4`           | `integer` |
