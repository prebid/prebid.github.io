---
layout: bidder
title: Nativo
description: Prebid Nativo Bidder Adapter
pbjs: true
gvl_id: 263
gdpr_supported: true
usp_supported: true
userIds: all 
biddercode: nativo
sidebarType: 1
---

### Note:

The Nativo Bidder adapter requires setup before beginning. Please contact us at prebiddev@nativo.com beforehand.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                                     | Example      | Type      |
|---------------|----------|---------------------------------------------------------------------------------|--------------|-----------|
| `placementId` | optional | Publication placement ID value from the Nativo Platform                         |  `13144370`  | `integer` |
| `url`         | optional | Publication url value associated with placement ID value in the Nativo Platform |  `https://test-sites.internal.nativo.net/testing/prebid_adpater.html`  | `string` |
