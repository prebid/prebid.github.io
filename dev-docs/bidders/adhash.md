---
layout: bidder
title: AdHash
description: Prebid AdHash Bidder Adapter
pbjs: true
biddercode: adhash
safeframes_ok: false
gdpr_supported: true
sidebarType: 1
---

### Note

Here is what you need for Prebid integration with AdHash:
1. Register with AdHash.
2. Once registered and approved, you will receive a Publisher ID and Platform URL.
3. Use the Publisher ID and Platform URL as parameters in params.

Please note that a number of AdHash functionalities are not supported in the Prebid.js integration:
* Cookie-less frequency and recency capping;
* Audience segments;
* Price floors and passback tags, as they are not needed in the Preebid.js setup;
* Reservation for direct deals only, as bids are evaluated based on their price.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  | Example                                        | Type     |
|---------------|----------|--------------|------------------------------------------------|----------|
| `publisherId` | required | Publisher ID | `'0x1234567890123456789012345678901234567890'` | `string` |
| `platformURL` | required | Platform URL | `'https://adhash.org/p/example/'`              | `string` |
