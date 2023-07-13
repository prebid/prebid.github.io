---
layout: bidder
title: ADman Media
description: Prebid Adman Bidder Adapter
pbjs: true
pbs: true
biddercode: adman
gvl_id: 149
gdpr_supported: true
usp_supported: true
schain_supported: true
media_types: banner, video, native
userIds: uid2, lotamePanoramaId, idx
sidebarType: 1
---

### Note

The Adman Bidding adapter requires setup before beginning. Please contact us at <prebid@admanmedia.com>
Due to different integration API prebid.js and prebid-server api params are different

### Prebid.JS Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `placementId`      | required | Adman placement id         | `'1234asdf'`    | `'string'` |

### Prebid server Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `TagID`      | required | Adman placement id         | `'1234asdf'`    | `'string'` |
