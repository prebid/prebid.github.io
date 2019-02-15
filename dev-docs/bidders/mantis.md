---
layout: bidder
title: MANTIS Ad Network
description: Prebid Mantis Bidder Adaptor
hide: true
biddercode: mantis
biddercode_longer_than_12: false
media_types: native, video

---

### bid params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                                   | Example                      | Type     |
|------------|----------|---------------------------------------------------------------|------------------------------|----------|
| `property` | required | The unique identifier provided for your entire account.       | `'5a5840d00000000000000000'` | `string` |
| `zone`     | required | The unique identifier for the placement defined in our admin. | `'sidebar-top-1'`            | `string` |
