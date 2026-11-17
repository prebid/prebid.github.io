---
layout: bidder
title: AppStockSSP
description: Prebid AppStockSSP Bidder Adapter
biddercode: appStockSSP
gpp_sids: usstate_all
tcfeu_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
deals_supported: false
floors_supported: true
fpd_supported: false
ortb_blocking_supported: false
media_types: banner, video, native
multiformat_supported: will-not-bid
userIds: all
pbjs: true
pbs: true
pbs_app_supported: true
safeframes_ok: true
gvl_id: 1223
sidebarType: 1
---

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description             | Example                                     | Type       |
|---------------|----------|-------------------------|---------------------------------------------|------------|
| `placementId` | optional | Placement Id            | `'0'`                                       | `'string'` |
| `endpointId`  | optional | Endpoint Id             | `'0'`                                       | `'string'` |
| `region`      | optional | Region (Prebid.js only) | `'us-east'` (default) or `'eu'` or `'apac'` | `'string'` |

In Prebid Server, the region isn't a bid parameter: the Prebid Server host sets the endpoint in each datacenter (`lb` for US East, `ortb-eu` for the EU, `ortb-apac` for APAC).

## Note

For the prebid server and prebid.js you only need to use one parameter: either placementId or endpointId.
