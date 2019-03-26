---
layout: bidder
title: ReadPeak
description: ReadPeak Bidder Adaptor
hide: true
biddercode: readpeak
biddercode_longer_than_12: false
media_types: native
---

### bid params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                       | Example                                  | Type     |
|---------------|----------|-----------------------------------|------------------------------------------|----------|
| `publisherId` | required | Publisher ID provided by ReadPeak | `'11bc5dd5-7421-4dd8-c926-40fa653bec76'` | `string` |
| `bidfloor`    | optional | CPM Bid Floor                     | `0.5`                                    | `float`  |
