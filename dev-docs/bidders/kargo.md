---
layout: bidder
title: Kargo
description: Prebid Kargo Bidder Adaptor
pbjs: true
biddercode: kargo
media_types: banner, video
gdpr_supported: true
userIds: unifiedId
usp_supported: true
gvl_id: 972
---

### Disclosure:
This adapter is known to use an HTTP 1 endpoint. Header bidding often generates multiple requests to the same host and bidders are encouraged to change to HTTP 2 or above to help improve publisher page performance via multiplexing.

### Note:
Kargo is an invitation-only marketplace.  Please reach out to your Kargo account manager to get setup.  Also, you *must* test on a mobile device, or emulate a mobile device by manipulating the user agent string sent to the server.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description | Example | Type     |
|---------------|----------|-------------|---------|----------|
| `placementId` | required |             |         | `string` |
