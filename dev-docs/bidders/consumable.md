---
layout: bidder
title: Consumable
description: Prebid Consumable Bidder Adaptor
hide: true
biddercode: consumable
biddercode_longer_than_12: false
---

### Note:
The Consumable adaptor requires setup and approval from your Consumable account manager, even for existing Consumable publishers. Please reach out to your account manager to enable Prebid.js for your account.

### bid params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                    | Example | Type      |
|-------------|----------|--------------------------------|---------|-----------|
| `siteId`    | required | The site ID from Consumable.    | `12345` | `integer` |
| `networkId` | required | The network ID from Consumable. | `9969`  | `integer` |
| `unitId` | required | The unit ID from Consumable. | `987654`  | `integer` |
| `unitName` | required | The unit name from Consumable. | `cnsmbl-unit`  | `string` |
