---
layout: bidder
title: Consumable
description: Prebid Consumable Bidder Adaptor
userIds: all
usp_supported: true
pbjs: true
pbs: true
pbs_app_supported: true
biddercode: consumable
gdpr_supported: true
schain_supported: true
coppa_supported: true
media_types: banner, video
gvl_id: 591
floors_supported: true
---

### Note:
The Consumable adaptor requires setup and approval from your Consumable account manager, even for existing Consumable publishers. Please reach out to your account manager to enable Prebid.js for your account.

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                    | Example | Type      |
|-------------|----------|--------------------------------|---------|-----------|
| `siteId`    | required | The site ID from Consumable.    | `12345` | `integer` |
| `networkId` | required | The network ID from Consumable. | `9969`  | `integer` |
| `unitId` | required | The unit ID from Consumable. | `987654`  | `integer` |
| `unitName` | required | The unit name from Consumable. | `cnsmbl-unit`  | `string` |
