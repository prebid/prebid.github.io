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

## About Publink

Publink is an independent ad-server company and platform. It is not affiliated
with Epsilon or Epsilon's Publisher Link product.

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

## Optional Campaign Priority

The priority extension requires both the companion Publink adapter update and a
Publink gateway that supports campaign priority metadata. Confirm availability
with Publink before enabling it; the initial bidder registration alone does
not enable this extension.

For client-to-server bidding, the publisher explicitly trusts this bidder:

```javascript
pbjs.bidderSettings = pbjs.bidderSettings || {};
pbjs.bidderSettings.publinkio = Object.assign({}, pbjs.bidderSettings.publinkio, {
  allowPriorityBids: true
});
```

A winning direct campaign with a configured positive integer priority can then
supply deal metadata. Lower numbers take precedence; ordinary bids use Prebid's
default priority of 12. The bid CPM remains the transaction price. This does not
enable zero-CPM house bids or bypass publisher floors.

Priority through Prebid Server additionally requires the host to preserve the
request permission and response deal metadata. The current PBS bidder
submission supports ordinary bids; `s2sConfig.allowPriorityBids` alone does not
enable Publink campaign priorities through PBS.
