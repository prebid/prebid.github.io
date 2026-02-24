---
layout: bidder
title: Audience Network
description: Prebid Audience Network Bidder Adaptor
pbs: true
biddercode: audienceNetwork
media_types: native, video
sidebarType: 1
---

### Registration

Audience Network will not bid on requests made from device simulators.
When testing for Mobile bids, you must make bid requests using a real device.

**Note:** Audience Network is disabled by default. Please enable it in the app config if you wish to use it. Make sure you provide the partnerID for the auctions to run correctly.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                     | Example                              | Type     |
|---------------|----------|-------------------------------------------------|--------------------------------------|----------|
| `placementId` | required | The Placement ID from Audience Network          | `'555555555555555\_555555555555555'` | `string` |
| `format`      | optional | Format, one of "native", "fullwidth" or "video" | `'native'`                           | `string` |
