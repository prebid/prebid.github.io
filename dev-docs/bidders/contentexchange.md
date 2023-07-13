---
layout: bidder
title: ContentExchange
description: Prebid Contentexchange Bidder Adapter
biddercode: contentexchange
usp_supported: true
schain_supported: true
media_types: banner, video, native
gdpr_supported: false
pbjs: true
pbs: false
pbs_app_supported: false
sidebarType: 1
---

### Prebid.JS Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                              | Example    | Type      |
|----------------|----------|----------------------------------------------------------|------------|-----------|
| `placementId` | required | Placement Id will be generated on ContentExchange Platform. | `'1234'`        | `string` |
| `adFormat` | required | `[banner, video, native]` | `'banner'`        | `string` |
