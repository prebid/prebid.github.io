---
layout: bidder
title: Alkimi
description: Prebid Alkimi Bidder Adapter
biddercode: alkimi
media_types: banner, video
pbjs: true
pbs: true
schain_supported: true
gdpr_supported: true
usp_supported: true
coppa_supported: true
userIds: all
floors_supported: true
multiformat_supported: will-bid-on-any
sidebarType: 1
---



### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                                                                          | Example                                  | Type      |
|-------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------|-----------|
| `token`     | required | The ID issued by Alkimi to the publisher                                                                                                                             | `'8a80d8e9-0cf9-4329-8486-6f5bbcd8a61a'` | `string`  |
| `bidFloor`  | optional | Minimum bid for this impression expressed in CPM.                                                                                                                    | `0`                                      | `float`   |
| `instl`     | optional | Set to 1 if using interstitial (default: 0)                                                                                                                          | `1`                                      | `integer` |
| `exp`       | optional | Advisory as to the number of seconds that may elapse between the auction and the actual impression.                                                                  | `10`                                     | `integer` |
