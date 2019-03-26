---
layout: bidder
title: vi
description: vi bid adapter
hide: true
biddercode: vi
biddercode_longer_than_12: false
---

### bid params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                                      | Example     | Type     |
|------------|----------|------------------------------------------------------------------|-------------|----------|
| `pubId`    | required | Publisher ID, provided by vi                                     | `'sb_test'` | `string` |
| `lang`     | required | Ad language, in ISO 639-1 language code format                   | `'en-US'`   | `string` |
| `cat`      | required | Ad IAB category (top-level or subcategory), single one supported | `'IAB1'`    | `string` |
| `bidFloor` | optional | Lowest value of expected bid price                               | `0.001`     | `float`  |
