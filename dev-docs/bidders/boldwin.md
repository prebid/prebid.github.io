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

The Boldwin Bidding adapter requires setup before beginning. Please contact us at <support@bold-win.com>

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `endpointId`  | required | Endpoint Id | `'0'`        | `string` |

For both the Prebid Server and Prebid.js integrations it is required to use only one parameter: `endpointId`.  
`endpointId` - should be sent in the Prebid bid request to Boldwin in case you integrate with Boldwin bidder via an endpoint URL.
