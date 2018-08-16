---
layout: bidder
title: RealVu
description: Prebid RealVu Bidder Adaptor

top_nav_section: dev_docs
nav_section: reference

hide: true

biddercode: realvu

biddercode_longer_than_12: false

---


### bid params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                   | Example     | Type     |
|---------------|----------|-------------------------------|-------------|----------|
| `placementId` | required | The placement ID from RealVu. | `'9339508'` | `string` |
| `partnerId`   | required | The member ID  from RealVu.   | `'1Y'`      | `string` |

(Sizes set in `adUnit` object will also apply to the RealVu bid requests.)
