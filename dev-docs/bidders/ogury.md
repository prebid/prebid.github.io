---
layout: bidder
title: ogury
description: Ogury Bidder Adapter
biddercode: ogury
gdpr_supported: true
gvl_id: 31
usp_supported: false
coppa_supported: false
schain_supported: false
dchain_supported: false
media_types: banner
safeframes_ok: false
bidder_supports_deals: false
pbjs: true
pbs: false
prebid_member: false
---
### Note:

The Ogury Bidding adapter requires setup before start of usage: some configuration & account creation needs to be done. Please contact us at web.inventory@ogury.co

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `assetKey`    | required | The asset key provided by Ogury   | `'OGY-CA41D116484F'` | `string`  |
| `adUnitId`    | required | Your ad unit id configured with Ogury | `'2c4d61d0-90aa-0139-0cda-0242ac120004'` | `string`  |
