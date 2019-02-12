---
layout: bidder
title: TheAdx
description: Prebid TheAdx Bidder Adapter
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: theadx
biddercode_longer_than_12: false
prebid_1_0_supported : true
gdpr_supported: true
---


### bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                           | Example    | Type  |
|-------------|----------|-----------------------------------------------------------------------|------------|-------|
| `pid`     | required | Publisher  GUID from TheAdx.com                                         | `'1000'`   | `int` |
| `wid`     | required | Web Site ID from TheAdx.com                                             | `'2000'`   | `int` |
| `tagId`   | required | Tag ID from TheAdx.com                                                  | `'3000'`   | `int` |
