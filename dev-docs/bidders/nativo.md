---
layout: bidder
title: Nativo
description: Prebid Nativo Bidder Adapter
pbjs: true
pbs: true
media_types: banner, native, video
multiformat_supported: will-bid-on-one
floors_supported: true
gvl_id: 263
tcfeu_supported: true
usp_supported: true
userIds: all 
biddercode: nativo
sidebarType: 1
privacy_sandbox: topics
---

### Note

The Nativo Bidder adapter requires setup before beginning. Please contact us at <prebiddev@nativo.com> beforehand.

### Bid Params

### Prebid Server
{: .table .table-bordered .table-striped }
| Name                         | Scope                               | Description                                                                                                                | Example                                             | Type      |
|------------------------------|-------------------------------------|----------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------|-----------|
| `imp.tagId`                  | required - preferred                | Represents the Ad Slot Tag ID, which is the primary identifier linked to a specific placement ID within the Nativo platform. |  `placement_tagid_example`                          | `string`  |
| `imp.ext.nativo.placementId` | required if no tagID                | Refers to the unique Placement ID assigned by the Nativo platform.                                                         |  `12345678`                                         | `integer` |
| `imp.ext.gpId`               | required if no other ID is provided | Represents the Ad Slot GP ID. It is another layer of identification tied to a placement ID within the Nativo platform.      |  `/22888152279/publication/placement/gpid_example`  | `string`  |

### Prebid JS
{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                                          | Example                                         | Type      |
|---------------|----------|--------------------------------------------------------------------------------------|-------------------------------------------------|-----------|
| `ntv_url`     | required | Publication url value associated with placement ID value within the Nativo platform. |  `https://publication.com/prebid_adpater.html`  | `string`  |
