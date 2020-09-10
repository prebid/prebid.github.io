---
layout: bidder
title: pubGENIUS
description: Prebid pubGENIUS Bidder Adaptor
pbjs: true
biddercode: pubgenius
media_types: banner
gdpr_supported: true
usp_supported: true
schain_supported: true
coppa_supported: true
userIds: unifiedId
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                                                                                                     | Example  | Type      |
|------------|----------|-----------------------------------------------------------------------------------------------------------------|----------|-----------|
| `adUnitId` | required | pubGENIUS ad unit ID.                                                                                           | `'1234'` | `string`  |
| `bidFloor` | optional | Bid floor                                                                                                       | `0.01`   | `number`  |
| `position` | optional | Ad position on the page. Supported values: `0` - unknown (default), `1` - above the fold, `3` - below the fold. | `1`      | `integer` |
| `test`     | optional | Indicates bidding for testing purposes                                                                          | `true`   | `boolean` |
