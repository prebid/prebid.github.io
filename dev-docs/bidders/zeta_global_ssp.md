---
layout: bidder
title: Zeta Global SSP
description: Zeta Global SSP Prebid Bidder Adapter
pbjs: true
pbs: true
biddercode: zeta_global_ssp
deals_supported: false
media_types: banner, video
tcfeu_supported: true
usp_supported: true
coppa_supported: true
userIds: all
prebid_member: true
gvl_id: 833
sidebarType: 1
---

### Registration

All references to the OpenRTB spec refer to OpenRtb v2.5 (<https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf>)

The Zeta Global SSP adapter requires setup and approval from the Zeta Global SSP team. Please reach out to your account team or <rcomolli@zetaglobal.com> for more information.

### Bid Params

#### Prebid.js Bid Params

{: .table .table-bordered .table-striped }
| Name                 | Scope    | Description                                                                                                         | Example      | Type      |
|----------------------|----------|---------------------------------------------------------------------------------------------------------------------|--------------|-----------|
| `sid`                | required | Seller ID. The identifier associated with the seller or reseller account within the advertising system              | `"123"`      | `integer` |
| `tagid`              | optional | Identifier for specific ad placement or ad tag that was used to initiate the auction                                | `"footer"`   | `string`  |
| `tags`               | optional | The object containing set of  Zeta's custom tags witch publisher have to supply                                     | `tags: {}`   | `object`  |
| `site`               | optional | The object containing site data (See OpenRTB spec)                                                                  | `site: {}`   | `object`  |
| `app`                | optional | The object containing app data (See OpenRTB spec)                                                                   | `app: {}`    | `object`  |
| `bidfloor`           | optional | The minimum bid value desired                                                                                       | `0.2`        | `float`   |
| `test`               | optional | Flag which will induce a sample bid response when true; only set to true for testing purposes (1 = true, 0 = false) | `1`          | `integer` |

#### Prebid Server Bid Params

Prebid Server Adapter does not support any parameters.
You must get `sid` value from Zeta Global and use it instead of the placeholder in the URL.
