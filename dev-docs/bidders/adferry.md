---
layout: bidder
title: Adferry
description: Adferry Bidder Adapter
biddercode: adferry
gvl_id: none
usp_supported: true
coppa_supported: true
gpp_sids: usnat
schain_supported: true
fpd_supported: true
userIds: all
media_types: banner, video, audio
floors_supported: true
deals_supported: true
multiformat_supported: will-bid-on-any
safeframes_ok: true
pbjs: true
pbs: false
sidebarType: 1
---

## Registration

The Adferry bid adapter requires setup and approval. The `placementId` is the
tag id issued in the Adferry portal under Integrations &rarr; Prebid. Please
reach out to <admin@adferry.co> for an account.

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                         | Example                | Type     |
|---------------|----------|-----------------------------------------------------|------------------------|----------|
| `placementId` | required | Tag ID from the Adferry portal                      | `'adferryprebidtest1'` | `string` |
| `bidFloor`    | optional | Floor CPM; ignored when the Floors Module is in use | `2.50`                 | `number` |
| `currency`    | optional | Floor currency, defaults to `USD`                   | `'USD'`                | `string` |

## First Party Data

The adapter forwards the full `ortb2` object (site, user, regs) to the
Adferry exchange as-is, and `ortb2Imp` is merged into each impression.

## Notes

Video parameters are read from `AdUnit.mediaTypes.video`. The adapter sends
one request per placement. User syncs are not used.
