---
layout: bidder
title: The Moneytizer
description: Prebid The Moneytizer Bid Adapter
biddercode: themoneytizer
media_types: display
gvl_id: 1265
pbjs: true
tcfeu_supported: true
safeframes_ok: false
schain_supported: true
sidebarType: 1
---

### Note

The Moneytizer Bidding adapter requires setup before beginning. Please contact us at <tech@themoneytizer.com>

### Bid params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                             | Example                                      | Type     |
|------------|----------|-----------------------------------------|----------------------------------------------|----------|
| `pid`      | required | The Moneytizer's publisher token        | `1234`                                       | `integer`|
| `test`     | optional | Set to 1 to receive a test bid response | `1`                                          | `integer`|
| `baseUrl`  | optional | Call on custom endpoint                 | `'https://custom-endpoint.biddertmz.com/m/'` | `string` |
