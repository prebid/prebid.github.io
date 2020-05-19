---
layout: bidder
title: Sharethrough
description: Prebid Sharethrough Adaptor
hide: true
biddercode: sharethrough
media_types: native
gdpr_supported: true
usp_supported: true
userIds: unifiedId
schain_supported: true
---

### Note:
The Sharethrough bidder adapter requires additional setup and approval from the Sharethrough Integrations team. Please reach out to your account manager for more information to start using it.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type
| ---- | ----- | ----------- | ------- | ----
| `pkey` | required | The placement key | `'DfFKxpkRGPMS7A9f71CquBgZ'` | `string`
| `iframe` | optional | If `true`, the ad will render in an iframe. Defaults to `false`. | `true` | `boolean`
| `iframeSize` | optional | `[width, height]` If provided, use this size for the iframe size. Only applicable if `iframe` is `true`. If omitted, the largest size from the ad unit sizes array will be used. | `[300, 250]` | `[integer]`
| `bidfloor` | optional | The floor price, or minimum amount, a publisher will accept for an impression, given in CPM in USD. | `1.00` | `float`
