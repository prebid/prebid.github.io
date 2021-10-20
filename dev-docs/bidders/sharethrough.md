---
layout: bidder
title: Sharethrough
biddercode: sharethrough
description: Prebid Sharethrough Adaptor
gdpr_supported: true
coppa_supported: true
media_types: native
schain_supported: true
userIds: pubCommonId, unifiedId, identityLink, id5Id, sharedId, liveIntentId
usp_supported: true
fpd_supported: true
pbjs: true
pbs: true
---

### Note:
The Sharethrough bidder adapter requires additional setup and approval from the Sharethrough Integrations team. Please reach out to your account manager for more information to start using it.

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                                                                                                                                      | Example                      | Type                 |
|-------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------|----------------------|
| `bidfloor`  | optional | The floor price, or minimum amount, a publisher will accept for an impression, given in CPM in USD.                                                                              | `1.00`                       | `float`              |
| `iframe`    | optional | If `true`, the ad will render in an iframe. Defaults to `false`.                                                                                                                 | `true`                       | `boolean`            |
| `iframeSize`| optional | `[width, height]` If provided, use this size for the iframe size. Only applicable if `iframe` is `true`. If omitted, the largest size from the ad unit sizes array will be used. | `[300, 250]`                 | `[integer, integer]` |
| `bcat`      | optional | Array of blocked IAB Categories                                                                                                                                                  | `['IAB1-2', 'IAB1-3']`       | `string[]`           |
| `badv`      | optional | Array of blocked Advertisers by their domains                                                                                                                                    | `['ford.com', 'pepsi.com']`  | `string[]`           |
| `pkey`      | required | The placement key                                                                                                                                                                | `'DfFKxpkRGPMS7A9f71CquBgZ'` | `string`             |
