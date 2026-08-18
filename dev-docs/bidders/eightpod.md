---
layout: bidder
title: 8pod
description: Prebid EightPod Bidder Adaptor
biddercode: eightpod
filename: eightpodBidAdapter
tcfeu_supported: true
gvl_id: 1497
usp_supported: true
coppa_supported: true
gpp_sids: tcfeu, tcfca, usnat, usstate_all, usp
schain_supported: false
dchain_supported: false
userIds: unifiedId, id5Id, identityLink, uid2
media_types: banner
deals_supported: true
floors_supported: false
fpd_supported: true
pbjs: true
pbs: false
prebid_member: false
sidebarType: 1
safeframes_ok: false
multiformat_supported: will-not-bid
privacy_sandbox: no
ortb_blocking_supported: false
---

## Registration

The EightPod adapter requires setup before beginning. Please contact us at <ewald@8pod.com>

## Privacy Regulation Support

The EightPod adapter passes through GDPR (TCF), US Privacy (CCPA/USP), GPP, and COPPA consent signals in OpenRTB bid requests:

| Regulation | OpenRTB fields |
| --- | --- |
| GDPR (TCF EU) | `user.ext.consent`, `regs.ext.gdpr` |
| US Privacy (CCPA/USP) | `regs.ext.us_privacy` |
| GPP | `regs.gpp`, `regs.gpp_sid`, `regs.ext.gpp`, `regs.ext.gpp_sid` |
| COPPA | `regs.coppa` |

The adapter is registered with IAB Global Vendor List ID **1497**.

Bid responses populate `meta.advertiserDomains` from OpenRTB `adomain` and set `meta.mediaType` to `banner`.

The adapter relies on Prebid's OpenRTB conversion for User ID module values and preserves identifiers in `user.ext.eids`. Publishers should use User ID modules or `ortb2.user.ext.eids` for identity signals.

The `userIds` metadata above indicates supported Prebid User ID modules, including UID2. Their identifiers are expected to flow through OpenRTB `user.ext.eids`; they are not copied into `user.id`.

## User Identifier Disclosure

The adapter does not create or persist any browser storage values. When available, it reads the Tealium `utag_main_v_id` cookie and sends it in the OpenRTB extended identifiers field as `user.ext.eids` with source `8podx.com`. For backward compatibility, the same value is also sent as `user.ext.eightPodVisitorId`; publishers may override this value with `params.eightPodVisitorId`. This identifier is used only as an EightPod/Tealium visitor reference for bidder-side matching and reporting. The adapter does not set the cookie, and its lifetime is controlled by the Tealium configuration.

Prebid User ID module values remain the preferred source for OpenRTB `user.ext.eids`.

## Bid Params

OpenRTB first-party data should be supplied through `ortb2` / `ortb2Imp`. The adapter preserves Prebid User ID module identifiers in `user.ext.eids`.

| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `placementId` | optional | The unique identifier of the ad placement. When provided, sent as OpenRTB `imp.tagid`; also sent as legacy `ext.adSlotPlacementId` for compatibility. Could be obtained from the 8pod UI or from your account manager. | "placementId-438753744289" | `string` |
| `publisherId` | optional, legacy override | Overrides OpenRTB `site.publisher.id` when provided. Prefer `ortb2.site.publisher.id`. | "publisherId-438753744289" | `string` |
| `dealId` | optional | PMP deal ID sent as `imp.pmp.deals[].id` when provided. | "deal-123" | `string` |
| `trace` | optional | Enables trace mode by adding `?trace=true` to the bidder endpoint for debugging. | true | `boolean` or `string` |
| `userId` | optional, legacy override | Overrides OpenRTB `user.id` when provided. Prefer User ID modules or `ortb2.user.ext.eids`. | "user-123" | `string` |
| `eightPodVisitorId` | optional | Publisher-provided EightPod/Tealium visitor reference sent as OpenRTB `user.ext.eids` and legacy `user.ext.eightPodVisitorId`. Overrides the `utag_main_v_id` cookie value when provided. | "visitor-123" | `string` |
| `country` | optional, legacy override | Overrides OpenRTB `device.geo.country` and `user.geo.country` when provided. Prefer `ortb2.device.geo.country` / `ortb2.user.geo.country`. | "AUS" | `string` |
| `language` | optional, legacy override | Overrides OpenRTB `device.language` when provided. Prefer `ortb2.device.language`. | "en" | `string` |
| `publishercat` | optional, legacy override | Comma-separated override for OpenRTB `site.publisher.cat`. Prefer `ortb2.site.publisher.cat`. | "IAB1,IAB2" | `string` |
| `sitecat` | optional, legacy override | Comma-separated override for OpenRTB `site.cat`. Prefer `ortb2.site.cat`. | "IAB3" | `string` |
| `pagecat` | optional, legacy override | Comma-separated override for OpenRTB `site.pagecat`. Prefer `ortb2.site.pagecat`. | "IAB4" | `string` |
| `sectioncat` | optional, legacy override | Comma-separated override for OpenRTB `site.sectioncat`. Prefer `ortb2.site.sectioncat`. | "IAB5" | `string` |
| `yob` | optional, legacy override | Overrides OpenRTB `user.yob` when provided. Prefer `ortb2.user.yob`. | 1990 | `number` or `string` |
| `gender` | optional, legacy override | Overrides OpenRTB `user.gender` when provided. Prefer `ortb2.user.gender`. | "M" | `string` |
| `city` | optional, legacy override | Overrides OpenRTB `user.geo.city` when provided. Prefer `ortb2.user.geo.city`. | "Sydney" | `string` |
| `region` | optional, legacy override | Overrides OpenRTB `user.geo.region` when provided. Prefer `ortb2.user.geo.region`. | "NSW" | `string` |
