---
layout: bidder
title: AdButler
description: Prebid AdButler Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: adbutler
biddercode_longer_than_12: false
prebid_1_0_supported : true
---


### bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                          | Example          | Type     |
|-------------|----------|--------------------------------------|------------------|----------|
| `accountID` | required | Account ID                           | `'167283'`       | `string` |
| `zoneID`    | required | Zone ID                              | `'210093'`       | `string` |
| `keyword`   | optional | Keyword(s) used for custom targeting | `'green,orange'` | `string` |
| `minCPM`    | optional | Minimum CPM value to accept          | `'1.00'`         | `string` |
| `maxCPM`    | optional | Maximum CPM value to accept          | `'5.00'`         | `string` |
