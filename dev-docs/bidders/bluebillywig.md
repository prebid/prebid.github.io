---
layout: bidder 
title: Blue Billywig
description: Prebid Blue Billywig Bidder Adaptor
biddercode: bluebillywig
pbjs: true
media_types: video
gdpr_supported: true
schain_supported: true
coppa_supported: true
usp_supported: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
sidebarType: 1
---

#### Bid Params

{: .table .table-bordered .table-striped }

| Name      | Scope    | Description               | Example    | Type     |
|-----------|----------|---------------------------|------------|----------|
| `publicationName`    | required | The name of your Blue Billywig publication  | `"bbprebid"` | `string` |
| `accountId`    | required | Your publication ID at Blue Billywig  | `642` | `integer` |
| `rendererCode`    | required | The name of the renderer to use in your Blue Billywig publication  | `"renderer"` | `string` |
| `connections`     | required | Back-ends to connect with. For every value in this a param matching the back-end should exist too. | `["bluebillywig"]` | `array` |
| `video`     | optional | Any OpenRTB 2.5 video params to additionally send along to the SSPs. | `{"maxduration": 30}` | `object` |
| `rendererSettings`     | optional | Any playout property for the renderer you wish to override. | `{"autoPlay": "false", "interactivity_inView":"Play"}` | `object` |
