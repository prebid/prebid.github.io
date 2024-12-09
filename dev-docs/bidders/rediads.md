---
layout: bidder
title: Rediads
description: Prebid Rediads Bidder Adapter
biddercode: rediads
tcfeu_supported: true
usp_supported: true
coppa_supported: false
gvl_id: none
schain_supported: false
dchain_supported: false
userId: []
media_types: banner, video, native
safeframes_ok: true
deals_supported: false
floors_supported: true
fpd_supported: true
ortb_blocking_supported: partial
privacy_sandbox: no
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-one
sidebarType: 1
---

### Note

The Rediads bidding adapter requires setup and approval before implementation. Please reach out to <support@rediads.com> for more details.

### Prebid.js Bid Params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                                                | Example        | Type      |
|--------------|----------|------------------------------------------------------------|----------------|-----------|
| `account_id` | required | Account ID generated on the Rediads Platform.              | `'12345'`      | `string`  |
| `site`       | optional | Site domain name.                                          | `'rediads.com'`| `string`  |
| `slot`       | optional | Unique identifier for the ad slot generated on the platform.| `'54321'`      | `string`  |

### Supported Features
- **Media Types:** `banner`, `video`, `native`
- **Floors Supported:** Yes
- **Deals Supported:** No
- **First Party Data (FPD):** Supports `site`, `publisher`, and `content` objects.
- **OpenRTB Blocking Parameters:** Partial (supports `bcat`).

For additional implementation or support, contact us at <support@rediads.com>.
