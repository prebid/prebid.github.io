---
layout: bidder
title: Logicad for Publishers
description: Prebid Logicad for Publishers Bidder Adaptor
hide: true
biddercode: logicad
bidder_supports_deals: false
media_types: banner
gdpr_supported: false
prebid_member: false
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name   | Scope    | Description                                              | Example  | Type      |
|--------|----------|----------------------------------------------------------|----------|-----------|
| `tid`  | required | Logicad for Publishers placement ID                      | `'PJ2P'` | `string`  |
| `page` | optional | Url of the webpage where the request is originating from | `'url'`  | `string`  |
| `cur`  | optional | Currency of request and response (Default: `JPY` )       | `'JPY'`  | `string`  |
| `test` | optional | Indicates bidding for testing purposes                   | `true`   | `boolean` |
