---
layout: bidder
title: Inmar
description: Prebid Inmar Bidder Adapter
biddercode: inmar
usp_supported: true
userIds: identityLink, liveIntentId, unifiedId, pubCommonId, pubProvidedId, sharedId
media_types: banner, video
safeframes_ok: false
deals_supported: true
pbjs: true
---
### Note:

The Inmar Bidding adapter requires setup before beginning. Please contact us at prebid@inmar.com

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                    | Example        | Type      |
|-------------|----------|----------------------------------------------------------------------------------------------------------------|----------------|-----------|
| `partnerId` | required | The partner ID from Inmar.                                                                                     | `12345`        | `integer` |
| `position`  | optional | Ad position on screen.  Supported values: `0` - Unknown (default), `1` - Above the fold, `3` - Below the fold. | `1`            | `integer` |
