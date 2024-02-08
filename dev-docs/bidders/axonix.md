---
layout: bidder
title: Axonix
description: Axonix Prebid Adaptor
biddercode: axonix
media_types: banner, video
pbjs: true
pbs: true
gvl_id: 678
sidebarType: 1
---

### Prebid Server Note

The Axonix Bidding adapter requires setup before beginning. Please contact us at <support.axonix@emodoinc.com>.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                     | Example                    | Type |
|------------|-------|----------------------------------------------|-------------------------------------|------|
| `supplyId`    | required | Supply UUID                                     | `'2c426f78-bb18-4a16-abf4-62c6cd0ee8de'` | string |
| `region`      | optional | Cloud region                                    | `'us-east-1'`                            | string |
| `endpoint`    | optional | Supply custom endpoint                          | `'https://open-rtb.axonix.com/custom'`   | string |
| `instl`       | optional | Set to 1 if using interstitial (default: 0)     | `1`   | integer |
