---
layout: bidder
title: Synapse HX
biddercode: synapseHX
description: Prebid Synapse HX Adapter
tcfeu_supported: false
coppa_supported: true
gpp_supported: false
floors_supported: true
media_types: banner, video
multiformat_supported: will-bid-on-any
safeframes_ok: false
schain_supported: false
usp_supported: true
pbjs: false
pbs: true
prebid_member: false
fpd_supported: false
privacy_sandbox: no
ortb_blocking_supported: true
sidebarType: 1
---

## Before You Begin

The Synapse HX bidder adapter requires additional setup and approval from the Compas team. For additional information, please reach out to <prebid@compas-inc.com>.

## Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `tenantId` | required | Synapse HX tenant identifier | `'deadbeef-cafe-4bad-8000-feedfacecafe'` | `string` |
| `adUnitId` | optional | Synapse HX ad unit identifier | `'cafebabe-feed-4f00-9000-deadbeefbabe'` | `string` |

## Additional Notes

### Request Attributes

- Bids are returned in **net** - that is, the bids returned reflect the bid amount with revenue sharing already taken into account. No adjustment is necessary.
- Ensure that the `tenantId` parameter is set correctly for your integration.
- If the `adUnitId` parameter is omitted, the integration falls back to the default ad unit configured for the specified `tenantId`.
