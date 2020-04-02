---
layout: bidder
title: GumGum
description: Prebid GumGum Bidder Adaptor
hide: true
biddercode: gumgum
media_types: banner, video
schain_supported: true
userIds: digitrust, unifiedId
gdpr_supported: true
usp_supported: true
---

### Note:

The GumGum Header Bidding adaptor requires setup and approval from the GumGum
team. Please reach out to your account manager or <support@gumgum.com> for more
information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description | Example      | Type      |
|----------------|----------|-------------|--------------|-----------|
| `inScreen`     | optional | Tracking ID | `'ggumtest'` | `string`  |
| `inScreenPubID`| optional | Publisher ID| `123`        | `integer` |
| `inSlot`       | optional | Slot ID     | `9`          | `integer` |
| `video`        | optional | Tracking ID | `'ggumtest'` | `string`  |
