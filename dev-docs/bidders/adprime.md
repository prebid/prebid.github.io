---
layout: bidder
title: Adprime
description: Prebid Adprime Bidder Adapter
biddercode: false
gdpr_supported: false
usp_supported: true
media_types: banner, video, native
tcf2_supported: true
pbjs: true
pbs: true
pbs_app_supported: true
sidebarType: 1
---

### Note

The Adprime Bidding adapter requires setup before beginning. Please contact us at <rafal@adprime.com>

### Prebid.js Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `placementId` | required | Adprime placement id  | `'1234asdf'`    | `string` |
| `keywords`    | optional | page context keywords | ['car','sport'] | `array` |
| `audiences`   | optional | publisher audiences   | ['aud1','aud2'] | `array` |

### Prebid Server Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `TagID`       | required | Adprime ad tag id     | `'1234asdf'`    | `string` |
| `keywords`    | optional | page context keywords | ['car','sport'] | `array` |
| `audiences`   | optional | publisher audiences   | ['aud1','aud2'] | `array` |
