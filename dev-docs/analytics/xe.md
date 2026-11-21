---
layout: analytics
title: Xeworks
description: Xeworks Analytics Adapter
modulecode: xe
prebid_member: true
tcfeu_supported: true
usp_supported: false
coppa_supported: false
gvl_id: 1383
---

## About

The Xeworks Analytics Adapter (code `xe`) reports the Prebid.js auctions of ad units that carry an XE placement to
[xe.works](https://xe.works), for the auction reports XE publishers see: competition, win share, floors,
timeouts, rejected bids and render outcomes. Publishers that use the `xe` bidder (or its `xeworks` code) can
enable it without any account option.

Every bidder of such an ad unit is reported, but bidder params are not: only the XE placement id (`pid`) of the
XE family bidders (`xe`, `xeworks`, `adipolo`, `anyclip`, `anzuDSP`, `driftpixel`, `iqx`, `leagueM`, `lm_kiviads`, `kivi`, `matterfull`, `revealon` and `robustApps`), their aliases and the codes listed in the `bidders` option. Auctions and
ad units without an XE placement are not sent.

The adapter sends no user ids, IP addresses or consent strings: only flags (GDPR applies, GPP section ids, US
Privacy and COPPA present, schain present) and the names of the user id sources. It does not read or write browser
storage or cookies. Under GDPR, `tcfControl` lets it run only with consent for vendor 1383, or for the vendor set in the `gvlid`
option.

## Analytics Options

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| ------ | ------- | ------------- | --------- | ------ |
| bidders | optional | Other bidder codes whose params carry an XE placement id | `['myXeAlias']` | array of strings |
| sampling | optional | Share of page views to report, from 0 to 1. Defaults to 1. | `0.5` | number |
| gvlid | optional | GVL ID (or IDs) checked for consent instead of 1383, for an exchange that runs XE under its own vendor | `1234` | number or array of numbers |
| host | optional | Host name to send to instead of `pbjs.xe.works`, for an exchange that runs XE on its own domain. Only the Prebid Direct domains of the XE family are accepted: `prebid.adipolo.live`, `prebid-eu.adipolo.live`, `prebid.anyclip.com`, `pbjs.anzu-rtb.live`, `pbjs.driftpixel.live`, `pbjs.iqzonertb.live`, `pbjs.league-m.media`, `pbjs.kiviads.live`, `pbjs.bematterfull.com`, `pbjs.revealonmedia.live`, `pbjs.rbstsystems.live` | `'prebid.adipolo.live'` | string |

## Events

- `auctionInit` and `bidRequested`: ad units (media types, sizes, gpid), timeout, page and referrer domain, device
  type, user id source names, privacy flags and price floor data (location, fetch status, provider, model version,
  skipped).
- `bidResponse` and `bidRejected`: cpm, original cpm and currency, size, media type, deal, response time, floor
  value and rule, first advertiser domain, DSP name from the bid `meta`, and the rejection reason.
- `noBid`, `bidTimeout`, `bidderError` (HTTP status) and `auctionEnd` (duration).
- `bidWon`, `adRenderSucceeded`, `adRenderFailed`, `bidViewable` (with the `bidViewability` module), `staleRender`,
  `expiredRender`, `browserIntervention`, and `billableEvent` with the `adId` of a won bid.

An auction is sent 3 seconds after `auctionEnd`, together with the wins and renders of that window. Later events are
sent in batches once a second. When the page is hidden or unloaded, the events still in the analytics queue are
processed and everything pending is sent with `sendBeacon`. Requests are `text/plain` POSTs to
`https://pbjs.xe.works/analytics` (or the `host` option), in bodies under 60 KB: a large auction is split by ad unit, then by bidder.

## Example Configuration

```javascript
pbjs.enableAnalytics({
    provider: 'xe',
    options: {
        bidders: ['myXeAlias']
    }
});
```

An exchange that runs XE on its own domain and lists its own vendor in the CMP:

```javascript
pbjs.enableAnalytics({
    provider: 'xe',
    options: {
        gvlid: 1456,
        host: 'prebid.adipolo.live'
    }
});
```

## Contact

[dima@xe.works](mailto:dima@xe.works)
