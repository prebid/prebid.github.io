---
layout: bidder
title: Boldwin
description: Prebid Boldwin Bidder Adapter
pbjs: true
pbs: true
biddercode: boldwin
gvl_id: 1151
tcfeu_supported: true
gpp_supported: true
media_types: banner, video, native
sidebarType: 1
---

### Note

The Boldwin Bidding adapter requires setup before beginning. Please contact us at <wls_team@smartyads.com>

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `placementId` | optional | Placement Id | `'0'`        | `string` |
| `endpointId` | optional | Endpoint Id | `'0'`        | `string` |

For both the Prebid Server and Prebid.js integrations you are not required to use both parameters.
It is required to use only one of the two parameters depending on the integration with Boldwin: `placementId` or `endpointId`.  
`placementId` - should be sent in the Prebid bid request to Boldwin in case you integrate with Boldwin bidder directly via placement.  
`endpointId` - should be sent in the Prebid bid request to Boldwin in case you integrate with Boldwin bidder via an endpoint URL.
