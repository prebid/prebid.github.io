---
layout: bidder
title: Rtbdemand bidder
description: Prebid Rtbdemand Media Bidder Adapter
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: rtbdemand
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description                         | Example                   | Type     |
|----------|----------|-------------------------------------|---------------------------|----------|
| `zoneid` | required | The ad zone or tag specific ID      | `'9999'`                  | `string` |
| `floor`  | optional | The floor CPM price for the request | `0.1234`                  | `float`  |
| `server` | optional | Bidder domain                       | `'bidding.rtbdemand.com'` | `string` |
