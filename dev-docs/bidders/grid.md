---
layout: bidder
title: TheMediaGrid
description: Prebid TheMediaGrid Bidder Adaptor
pbjs: true
pbs: true
biddercode: grid
media_types: banner, video
gdpr_supported: true
usp_supported: true
schain_supported: true
getFloor: true
userIds: all
tcf2_supported: true
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                                                                                 | Example                                   | Type      |
|----------------|----------|-------------------------------------------------------------------------------------------------------------|-------------------------------------------|-----------|
| `uid`          | required | Represents the MediaGrid bidder system Ad Slot ID associated with the respective div id from the site page. | `1`                                       | `integer` |
| `keywords`     | optional | A set of key-value pairs applied to all ad slots on the page. Values can be empty.                          | `keywords: { topic: ['stress', 'fear'] }` | `object`  |
| `bidFloor`     | optional | Floor of the impression opportunity. If present in the request overrides XML info.                          | `0.8`                                     | `float`   |
