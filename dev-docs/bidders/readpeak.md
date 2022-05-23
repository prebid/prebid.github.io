---
layout: bidder
title: Readpeak
description: Readpeak Bidder Adaptor
pbjs: true
biddercode: readpeak
media_types: native, banner
gdpr_supported: true
tcf2_supported: true
gvl_id: 290
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope       | Description                        | Example              | Type     |
|---------------|-------------|------------------------------------|----------------------|----------|
| `publisherId` | required    | Publisher ID provided by Readpeak  | `'c2aca92893d1b989'` | `string` |
| `siteId`      | recommended | Site/Media ID provided by Readpeak | `'5d1aef6a9088ced0'` | `string` |
| `bidfloor`    | optional    | CPM Bid Floor                      | `0.5`                | `float`  |
| `tagId`       | optional    | Ad placement identifier            | `'placement-1'`      | `string` |
