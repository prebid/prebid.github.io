---
layout: bidder
title: Alkimi
description: Prebid Alkimi Bidder Adapter
biddercode: alkimi
media_types: banner, video
pbjs: true
pbs: true
schain_supported: true
gvl_id: 1169
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
| `bidFloor`  | required | Minimum bid for this impression expressed in CPM.                                                                                                                    | `0`                                      | `float`   |
| `pos`       | optional | Specify the position of the ad as a relative measure of visibility or prominence. Allowed values: Above the fold: `1`; Below the fold: `3`; Middle of the fold: `7`; | `0`                                      | `integer` |
