---
layout: bidder
title: Adyoulike
description: Prebid Adyoulike Bidder Adaptor
hide: true
biddercode: adyoulike
biddercode_longer_than_12: false
gdpr_supported: true
---

### Note:
The Adyoulike Header Bidding adaptor requires setup and approval from the Adyoulike team. Please reach out to your account manager or prebid@adyoulike.com for more information.

### bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                      | Example                              | Type     |
|-------------|----------|----------------------------------|--------------------------------------|----------|
| `placement` | required | The placement ID from Adyoulike. | `'194f787b85c829fb8822cdaf1ae64435'` | `string` |
| `DC`        | optional | The data center name             | `'usa01'`                            | `string` |
