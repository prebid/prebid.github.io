---
layout: bidder
title: Yieldlab
description: Prebid Yieldlab Bidder Adapter

top_nav_section: dev_docs
nav_section: reference
hide: true

biddercode: yieldlab
biddercode_longer_than_12: false

prebid_1_0_supported : true
media_types: video
gdpr_supported: true

---



### bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                           | Example                                  | Type     |
|-------------|----------|---------------------------------------------------------------------------------------|------------------------------------------|----------|
| `adslotId`  | required | Yieldlab Adslot ID                                                                    | `'12345'`                                | `string` |
| `supplyId`  | required | Yieldlab Supply ID. Please reach out to your account management for more information. | `'12345'`                                | `string` |
| `adSize`    | required | Override the default prebid size                                                      | `'970x250'`                              | `string` |
| `targeting` | optional | Key-Value Targeting                                                                   | `{ 'key1': 'value1', 'key2': 'value2' }` | `object` |
