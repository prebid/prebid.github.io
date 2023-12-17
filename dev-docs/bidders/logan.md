---
layout: bidder
title: Logan
description: Prebid Logan Bidder Adapter
biddercode: logan
usp_supported: true
schain_supported: true
media_types: banner, video, native
tcfeu_supported: false
pbjs: true
pbs: true
sidebarType: 1
---

### Disclosure

Note: This bidder appears to only consider gdprApplies if a consent string is available. This may result in some incorrect GDPR processing, such as when the consent string is not yet available but the publisher has decided GDPR always applies. See <https://github.com/prebid/Prebid.js/issues/7775>

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                              | Example    | Type      |
|----------------|----------|----------------------------------------------------------|------------|-----------|
| `placementId` | required | Placement Id will be generated on Logan Platform. | `'0'`        | `string` |
