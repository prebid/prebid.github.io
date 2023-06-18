---
layout: bidder
title: Video Reach
description: Video Reach Bidder Adapter for Prebid.js
pbjs: true
biddercode: videoreach
media_types: banner, video
gdpr_supported: false
sidebarType: 1
---

### Disclosure

Note: This bidder's user syncs appear to only consider gdprApplies if a consent string is available. This may result in some incorrect TCF2 processing, such as when the consent string is not yet available but the publisher has decided GDPR always applies. See <https://github.com/prebid/Prebid.js/issues/7775>

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                           | Example   | Type     |
|---------------|----------|-------------------------------------------------------|-----------|----------|
| `TagId`       | required | Video Reach Tag Id - provided by your account manager | `'ABCDE'`   | `string` |
