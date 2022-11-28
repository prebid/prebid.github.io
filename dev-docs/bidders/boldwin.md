---
layout: bidder
title: Boldwin
description: Prebid Boldwin Bidder Adapter
pbjs: true
pbs: true
biddercode: boldwin
gdpr_supported: true
media_types: banner, video, native
---

### Note

The Boldwin Bidding adapter requires setup before beginning. Please contact us at wls_team@smartyads.com

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `placementId` | optional | Placement Id | `'0'`        | `string` |
| `endpointId` | optional | Endpoint Id | `'0'`        | `string` |

For the prebid server and prebid.js you only need to use one parameter: either placementId or endpointId
