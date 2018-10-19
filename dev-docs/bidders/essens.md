---
layout: bidder
title: Essens
description: Prebid Essens Bidder Adaptor

top_nav_section: dev_docs
nav_section: reference

hide: true

biddercode: essens

biddercode_longer_than_12: false


---

### bid params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                           | Example     | Type     |
|---------------|----------|-------------------------------------------------------|-------------|----------|
| `placementID` | required | (String) The placement ID from Essens.                | `'abc-123'` | `string` |
| `dealId`      | optional | (String) ID of deal.                                  | `'deal1'`   | `string` |
| `floorPrice`  | optional | (Float) Floor price corresponding the deal. In float. | `7.5`       | `float`  |
| `currency`    | optional | ISO currency string                                   | `'NOK'`     | `string` |
