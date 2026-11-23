---
layout: bidder
title: Boldwin
description: Prebid Boldwin Bidder Adapter
pbjs: true
pbs: true
biddercode: boldwin
gvl_id: 1151
tcfeu_supported: true
usp_supported: true
coppa_supported: true
floors_supported: true
pbs_app_supported: true
gpp_supported: true
schain_supported: true
userIds: all
fpd_supported: true
media_types: banner, video, native
multiformat_supported: will-bid-on-one
safeframes_ok: true
sidebarType: 1
---

## Note

The Boldwin Bidding adapter requires setup before beginning. Please contact us at <info@bold-win.com> or <support@bold-win.com>

## Bid Params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                   | Example   | Type                                         |
|--------------|----------|-------------------------------|-----------|----------------------------------------------|
| `endpointId` | required | Endpoint ID issued by Boldwin | `'12345'` | `string` (Prebid.js also accepts a `number`) |

For both the Prebid Server and Prebid.js integrations, use only one parameter: `endpointId`.

## Prebid.js notes

- Floors: set with the [Price Floors module](/dev-docs/modules/floors.html). Bids and floors are in USD; a floor in another currency is left out of the request, and Prebid still enforces it on the bids.
- Video: instream video needs Prebid Cache (`cache.url` or `cache.useLocal`). Outstream video needs the publisher's own renderer.
- User sync: an image pixel that carries the GDPR, US Privacy and GPP signals. No sync is made when COPPA applies.
