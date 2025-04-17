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
| Name          | Scope    | Description                                                                             | Example      | Type      |
|---------------|----------|-----------------------------------------------------------------------------------------|--------------|-----------|
| `tagId`       | required if no other ID is provided | Publication tag ID is the primary value associated with placement ID value in the Nativo Platform |  `placement_tagid_example`  | `string` |
| `placementId` | required if no other ID is provided | Publication placement ID value from the Nativo Platform |  `13144370`  | `integer` |
| `gpId`        | required if no other ID is provided | Publication gp ID value associated with placement ID value in the Nativo Platform |  `/22888152279/publication/placement/gpid_example`  | `string` |
| `url`         | optional | Publication url value associated with placement ID value in the Nativo Platform  |  `https://publication.com/prebid_adpater.html`  | `string` |

### Prebid JS
{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                                       | Example      | Type      |
|---------------|----------|-----------------------------------------------------------------------------------|--------------|-----------|
| `url`         | required | Publication url value associated with placement ID value in the Nativo Platform   |  `https://publication.com/prebid_adpater.html`  | `string` |
