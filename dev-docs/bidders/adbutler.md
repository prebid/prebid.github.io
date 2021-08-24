---
layout: bidder
title: AdButler
description: Prebid AdButler Bidder Adaptor
pbjs: true
biddercode: adbutler
pbjs_version_notes: not in 5.x
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                          | Example          | Type     |
|-------------|----------|------------------------------------------------------|------------------|----------|
| `accountID` | required | Account ID                                           | `'167283'`       | `string` |
| `zoneID`    | required | Zone ID                                              | `'210093'`       | `string` |
| `keyword`   | optional | Keyword(s) used for custom targeting                 | `'green,orange'` | `string` |
| `minCPM`    | optional | Minimum CPM value to accept                          | `'1.00'`         | `string` |
| `maxCPM`    | optional | Maximum CPM value to accept                          | `'5.00'`         | `string` |
| `extra`     | optional | Pass other AdButler parameters like 'tuid' or 'kw'   | `{kw: "green"}`  | `object` |
