---
layout: bidder
title: Geniee SSP
description: Geniee SSP Bidder Adapter
biddercode: ssp_geniee
userId: imuId
media_types: banner
safeframes_ok: false
sidebarType: 1
pbjs: true
---
### Note

This is [Geniee](https://geniee.co.jp) Bidder Adapter for Prebid.js.
(This is Geniee *SSP* Bidder Adapter. The another adapter named "Geniee Bid Adapter" is Geniee *DSP* Bidder Adapter.)

Please contact us before using the adapter.

### Bid Params

{: .table .table-bordered .table-striped }
|     Name     |  Scope   |      Description                                |  Example  |   Type    |
|--------------|----------|-------------------------------------------------|-----------|-----------|
|  `zoneId`    | required |    Zone ID                                      |  `123456` | `integer` |
|  `currency`  | Optional | Currency setting (`'JPY'`(Default) or `'USD'`)  | `'JPY'`   | `string`  |
