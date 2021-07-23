---
layout: bidder
title: :tappx
pbs: true
pbjs: true
media_types: banner, video
biddercode: tappx
gdpr_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
pbs_app_supported: true
gvl_id: 628
userIds: all
---

### Registration

Please contact tappx@tappx.com to get set up.

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description            | Example | Type     |
|------------|----------|------------------------|---------|----------|
| host | required | Tappx host | 'host1' | string |
| tappxkey | required | An ID which identifies the adunit | 'key1' | string |
| endpoint | required | Endpoint provided to publisher | 'endpoint1' | string |
| bidfloor | optional | Minimum bid for this impression expressed in CPM (USD) | 1.2 | number |
| mktag | optional | An ID which identifies a gropu of adunits | 'key1' | string |
| bcid | optional | Block list of CID | ["1234"] | array |
| bcrid | optional | Block list of CRID | ["1234"] | array |

### Test Parameters

Use the official test parameter specified in the oRTB standard (https://github.com/InteractiveAdvertisingBureau/openrtb/blob/master/OpenRTB%20v3.0%20FINAL.md#object_request)
