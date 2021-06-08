---
layout: bidder
title: Inmar
description: Prebid Inmar Bidder Adapter

biddercode: inmar
usp_supported: true
userIds: identityLink, liveIntentId, unifiedId, pubProvidedId
media_types: banner, video
safeframes_ok: false
bidder_supports_deals: true
pbjs: true
---
### Note:

The Inmar Bidding adapter requires setup before beginning. Please contact us at prebid@inmar.com

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                    | Example        | Type      |
|-------------|----------|----------------------------------------------------------------------------------------------------------------|----------------|-----------|
| `partnerId` | required | The partner ID from Inmar.                                                                                     | `12345`        | `integer` |
| `inmarId`   | optional | The Inmar user ID.                                                                                             | `'ADb1f40rmi'` | `string`  |
| `position`  | optional | Ad position on screen.  Supported values: `0` - Unknown (default), `1` - Above the fold, `3` - Below the fold. | `1`            | `integer` |
