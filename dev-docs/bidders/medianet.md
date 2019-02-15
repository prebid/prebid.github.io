---
layout: bidder
title: Media.net
description: Prebid Media.net Bidder Adaptor
biddercode: medianet
biddercode_longer_than_12: false
hide: true
gdpr_supported: true
media_types: banner,native
---

### bid params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                            | Example       | Type     |
|------------|----------|----------------------------------------|---------------|----------|
| `cid`      | required | The customer id provided by Media.net. | `'8CUX0H51C'` | `string` |
| `crid`     | optional | The placement id provided by Media.net | `'1234567'`   | `string` |
| `bidfloor` | optional | `Bidfloor for the impression`          | `1.0`         | `float`  |
