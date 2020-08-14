---
biddercode      : sharethrough
description     : Prebid Sharethrough Adaptor
gdpr_supported  : true
hide            : true
layout          : bidder
media_types     : native
schain_supported: true
tcf2_supported  : true
title           : Sharethrough
userIds         : unifiedId
usp_supported   : true
pbjs            : true
pbs             : true
---

### Note:
The Sharethrough bidder adapter requires additional setup and approval from the Sharethrough Integrations team. Please reach out to your account manager for more information to start using it.

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                                                                                      | Example                      | Type        |
|-------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------|-------------|
| `bidfloor`  | optional | The floor price, or minimum amount, a publisher will accept for an impression, given in CPM in USD.                                                                              | `1.00`                       | `float`     |
| `iframe`    | optional | If `true`, the ad will render in an iframe. Defaults to `false`.                                                                                                                 | `true`                       | `boolean`   |
| `iframeSize`| optional | `[width, height]` If provided, use this size for the iframe size. Only applicable if `iframe` is `true`. If omitted, the largest size from the ad unit sizes array will be used. | `[300, 250]`                 | `[integer]` |
| `pkey`      | required | The placement key                                                                                                                                                                | `'DfFKxpkRGPMS7A9f71CquBgZ'` | `string`    |
