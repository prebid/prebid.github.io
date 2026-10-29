---
layout: bidder
title: Publink.io Bid Adapter
description: Publink.io Bid Adapter
biddercode: publinkio
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

Publink is an independent ad-server platform, unaffiliated with Epsilon's Publisher Link.

## Registration

Contact <hello@publink.io> to obtain a Publink placement ID.

## Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `placementId` | optional* | Overrides the standard impression tag ID with the placement issued by Publink. | `'publink-prebid-banner'` | `string` |
| `bidFloor` | optional | Nonnegative fallback floor CPM in USD. Standard impression/floors-module values take precedence. | `2.50` | `number` |

*Provide either `placementId` or a nonblank standard tag ID: `ortb2Imp.tagid`
for Prebid.js, `imp.tagid` for Prebid Server. Parameters are identical in both
integrations. The exchange prices bids in USD.

## Video and Audio

Video parameters come from `mediaTypes.video`; audio parameters come from
`mediaTypes.audio`. Inline VAST responses require a publisher-configured Prebid
cache or supported local caching (`cache: { useLocal: true }`). The adapter
does not load a player or renderer. Native and adapter-provided outstream
rendering are not supported.

## Privacy and User Syncs

US privacy, GPP and COPPA signals are forwarded. No GVL ID or TCF-EU support is
claimed. No user syncs, cookies or local-storage access are performed.
