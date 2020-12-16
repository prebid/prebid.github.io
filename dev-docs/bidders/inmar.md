---
layout: bidder
title: Inmar
description: Prebid Inmar Bidder Adaptor

biddercode: inmar
usp_supported: true
userIds: inmarId, identityLink, liveIntentId, unifiedId, pubProvidedId
media_types: banner, video
safeframes_ok: false
bidder_supports_deals: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                    | Example | Type      |
|-------------|----------|----------------------------------------------------------------------------------------------------------------|---------|-----------|
| `partnerId` | required | The partner ID from Inmar.                                                                                     | `12345` | `integer` |
| `position`  | optional | Ad position on screen.  Supported values: `0` - Unknown (default), `1` - Above the fold, `3` - Below the fold. | `1`     | `integer` |
