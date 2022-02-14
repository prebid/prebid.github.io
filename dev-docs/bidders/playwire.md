---
layout: bidder
title: Playwire
description: Prebid Playwire Bidder Adapter
pbjs: true
biddercode: playwire
aliasCode: grid
media_types: banner, video
gdpr_supported: true
usp_supported: true
schain_supported: true
floors_supported: true
userIds: all
tcf2_supported: true
coppa_supported: true
fpd_supported: true
prebid_member: true
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                                                                                 | Example                                   | Type      |
|----------------|----------|-------------------------------------------------------------------------------------------------------------|-------------------------------------------|-----------|
| `uid`          | required | Represents the Playwire bidder system Ad Slot ID associated with the respective div id from the site page.  | `1`                                       | `integer` |
| `keywords`     | optional | A set of key-value pairs applied to all ad slots on the page. Values can be empty.                          | `keywords: { topic: ['stress', 'fear'] }` | `object`  |
| `bidFloor`     | optional | Floor of the impression opportunity. If present in the request overrides XML info.                          | `0.8`                                     | `float`   |
