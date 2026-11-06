---
layout: bidder
title: BoldwinX
description: Prebid BoldwinX Bidder Adapter
biddercode: boldwinx
gvl_id: 1151
tcfeu_supported: true
usp_supported: true
gpp_sids: tcfeu, usnat, usstate_all, usp
coppa_supported: true
schain_supported: true
dchain_supported: false
userIds: all
media_types: banner, video, native
multiformat_supported: will-bid-on-any
deals_supported: true
floors_supported: true
fpd_supported: true
endpoint_compression: false
pbjs: true
pbs: false
pbs_app_supported: false
privacy_sandbox: 'no'
sidebarType: 1
---

### Note

The BoldwinX adapter needs an `epid` (endpoint ID) before it can bid. Please contact us at [info@bold-win.com](mailto:info@bold-win.com).

### Bid Params

{: .table .table-bordered .table-striped }
| Name   | Scope    | Description                   | Example   | Type                 |
|--------|----------|-------------------------------|-----------|----------------------|
| `epid` | required | Endpoint ID issued by Boldwin | `'12345'` | `string` or `number` |

- Floors: set with the [Price Floors module](/dev-docs/modules/floors.html). Bids and floors are in USD; a floor in another currency is left out of the request, and Prebid still enforces it on the bids.
- User sync: an image pixel that carries the GDPR, US Privacy and GPP signals. No sync is made when COPPA applies.
