---
layout: bidder
title: Tappx
pbs: true
media_types: banner
biddercode: tappx
gdpr_supported: true
---

### Registration

Please contact tappx@tappx.com to get set up.

**Note:** The Tappx prebid bidder only supports in app traffic at the moment

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description            | Example | Type     |
|------------|----------|------------------------|---------|----------|
| host | required | Tappx host | 'host1' | string |
| tappxkey | required | An ID which identifies the adunit | 'key1' | string |
| endpoint | required | Endpoint provided to publisher | 'endpoint1' | string |
| bidfloor | optional | Minimum bid for this impression expressed in CPM (USD) | 1.2 | number |

### Test Parameters

Use the official test parameter specified in the oRTB standard (https://github.com/InteractiveAdvertisingBureau/openrtb/blob/master/OpenRTB%20v3.0%20FINAL.md#object_request)
