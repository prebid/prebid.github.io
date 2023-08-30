---
layout: bidder
title: Widespace
description: Prebid Widespace Bidder Adaptor
pbjs: true
biddercode: widespace
tcfeu_supported: false
sidebarType: 1
---

### Bid params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description             | Example                                  | Type     |
|----------|----------|-------------------------|------------------------------------------|----------|
| sid      | required | Widespace Ad Space ID   | `'00000000-0000-0000-0000-000000000000'` | `string` |
| currency | Optional | Currency                | `'EUR'`                                  | `string` |
| bidFloor | Optional | Bid floor rate          | `'1.25'`                                 | `string` |
| demo     | Optional | User's demographic data | `{}`                                     | `object` |

#### Demo params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description             | Example       | Type     |
|--------------|----------|-------------------------|---------------|----------|
| demo.gender  | Optional | User's demographic data | `'M'`         | `string` |
| demo.country | Optional | Country name            | `'Sweden'`    | `string` |
| demo.region  | Optional | Region name             | `'Stockholm'` | `string` |
| demo.city    | Optional | City name               | `'Stockholm'` | `string` |
| demo.postal  | Optional | Postal code             | `'11153'`     | `string` |
| demo.yob     | Optional | Year of birth           | `'1984'`      | `string` |
