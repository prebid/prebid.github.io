---
layout: bidder
title: Adelerate
description: Adelerate's Prebid Bidder Adapter for banner, video, and native demand
biddercode: adelerate
media_types: video, native
usp_supported: true
gpp_supported: true
coppa_supported: true
schain_supported: true
bidder_supports_deals: true
userId: all
pbjs: true
pbs: true
pbs_app_supported: true
safeframes_ok: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name            | Scope    | Description                                          | Example     | Type     |
|-----------------|----------|------------------------------------------------------|-------------|----------|
| `placementId`   | required | The placement ID provided by Adelerate.              | `'abc123'`  | `string` |
| `publisherId`   | required | The publisher ID provided by Adelerate.              | `'pub-456'` | `string` |
| `floor`         | optional | Minimum CPM in USD. Floors module is preferred.      | `0.50`      | `number` |
| `floorCurrency` | optional | Currency for the floor param. Defaults to `USD`.     | `'EUR'`     | `string` |

### Note

Adelerate is not currently registered on the IAB Europe Global Vendor List, so this adapter does not declare a `gvlid`.
Under GDPR, Prebid core will withhold bid requests and user syncs to this bidder unless the publisher's CMP setup explicitly permits.
A `gvlid` will be added once IAB Europe registration is finalized.
