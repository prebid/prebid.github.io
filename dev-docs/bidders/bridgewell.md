---
layout: bidder
title: Bridgewell
description: Prebid Bridgewell Bidder Adaptor
pbjs: true
biddercode: bridgewell
media_types: display, native
userIds: all
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                             | Example                                    | Type      |
|-------------|----------|-----------------------------------------|--------------------------------------------|-----------|
| `ChannelID` | required | (deprecated) Should be replaced by cid. | `'CgUxMjMzOBIBNiIFcGVubnkqCQisAhD6ARoBOQ'` | `string`  |
| `cid`       | required | The channel ID from Bridgewell.         | `12345`                                    | `integer` |
