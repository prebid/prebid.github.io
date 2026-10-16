---
layout: bidder
title: Publink
description: Publink Bidder Adapter
biddercode: publink
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
pbjs: true
pbs: true
sidebarType: 1
---

## Registration

Contact <hello@publink.io> to obtain a Publink placement ID.

## Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `placementId` | optional* | Overrides the standard impression tag ID with the placement issued by Publink. | `'publink-prebid-banner'` | `string` |
| `bidFloor` | optional | Nonnegative fallback floor CPM. Standard impression/floors-module values take precedence. | `2.50` | `number` |
| `currency` | optional | Fallback floor currency; only `USD` is supported. | `'USD'` | `string` |

*Provide either `placementId` or a nonblank standard tag ID: `ortb2Imp.tagid`
for Prebid.js, `imp.tagid` for Prebid Server. Parameters are identical in both
integrations. The exchange prices bids in USD.

## First Party Data

Publisher-provided site/app, user, privacy and supply-chain data from `ortb2`,
and impression data from `ortb2Imp`, are forwarded through Prebid's OpenRTB
conversion. Publisher-approved EIDs are forwarded when supplied by Prebid.

## Video and Audio

Video parameters come from `mediaTypes.video`; audio parameters come from
`mediaTypes.audio`. Inline VAST responses require a publisher-configured Prebid
cache or supported local caching (`cache: { useLocal: true }`). The adapter
does not load a player or renderer. Native and adapter-provided outstream
rendering are not supported.

## Privacy and User Syncs

US privacy, GPP and COPPA signals are forwarded. No GVL ID or TCF-EU support is
claimed. No user syncs, cookies or local-storage access are performed.
