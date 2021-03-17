---
layout: bidder
title: WaardeX
description: Prebid WaardeX Bidder Adaptor

biddercode: waardex_ak
aliasCode: adkernel
media_types: display, video
gdpr_supported: true
---

### Note:

The WaardeX Bidding adaptor requires setup and approval before beginning. Please reach out to <welcome@waardex.com> for more details

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description           | Example                   | Type     |
|----------|----------|-----------------------|---------------------------|----------|
| `host`   | required | Ad network's RTB host | `'cpm.webtradingspot.com'` | `string` |
| `zoneId` | required | RTB zone id           | `'30164'`                 | `string` |
