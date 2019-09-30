---
layout: bidder
title: Vidazoo
description: Prebid Vidazoo Bidder Adaptor
biddercode: vidazoo
hide: true
gdpr_supported: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                                                              | Example                      | Type     |
|------------|----------|------------------------------------------------------------------------------------------|------------------------------|----------|
| `cId`      | required | The connection ID from Vidazoo.                                                          | `'5a3a543645ea6b0004869360'` | `string` |
| `pId`      | required | The publisher ID from Vidazoo.                                                           | `'59ac17c192832d0011283fe3'` | `string` |
| `bidFloor` | required | The minimum bid value desired. Vidazoo will not respond with bids lower than this value. | `0.90`                       | `float`  |
