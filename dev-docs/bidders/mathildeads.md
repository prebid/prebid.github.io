---
layout: bidder
title: MathildeAds
description: Prebid MathildeAds Bidder Adapter
biddercode: mathildeads
usp_supported: true
schain_supported: true
media_types: banner, video, native
gdpr_supported: false
pbjs: true
pbs: false
pbs_app_supported: false
sidebarType: 1
---

Note: This bidder appears to only consider gdprApplies if a consent string is available.. This may result in some incorrect TCF2 processing, such as when the consent string is not yet available but the publisher has decided GDPR always applies. See https://github.com/prebid/Prebid.js/issues/7775

### Prebid.JS Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                              | Example    | Type      |
|----------------|----------|----------------------------------------------------------|------------|-----------|
| `placementId` | required | Placement Id will be generated on MathildeAds Platform. | `'1234'`        | `string` |
