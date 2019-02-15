---
layout: bidder
title: A4G
description: Prebid A4G Bidder Adaptor
hide: true
biddercode: a4g
biddercode_longer_than_12: false
gdpr_supported: true
---

### bid params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                | Example                             | Type     |
|---------------|----------|--------------------------------------------|-------------------------------------|----------|
| `zoneId`      | required | The A4G zone ID                            | `'59304'`                           | `string` |
| `deliveryUrl` | optional | The bid endpoint (might be used for debug) | `'http://dev01.ad4game.com/v1/bid'` | `string` |
