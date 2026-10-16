---
layout: bidder
title: Srchbid
description: Prebid Srchbid Bidder Adapter
biddercode: srchbid
media_types: banner
pbjs: true
pbs: false
multiformat_supported: will-bid-on-one
sidebarType: 1
---

## Onboarding

Contact <info@bidtags.com> to obtain your Srchbid zone ID. Srchbid supports web
banner inventory and returns publisher-net CPM in USD.

## Bid params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `zone` | required | Zone ID assigned by Srchbid. The example is a placeholder. | `'YOUR_ASSIGNED_ZONE'` | `string` or `number` |
| `lifecycleSignals` | optional | Enable Srchbid win/render diagnostics. Defaults to `true`. Set `false` to disable both callbacks without disabling bidding. | `false` | `boolean` |

```javascript
var adUnits = [{
  code: 'banner-slot',
  mediaTypes: { banner: { sizes: [[300, 250], [728, 90]] } },
  bids: [{
    bidder: 'srchbid',
    params: { zone: 'YOUR_ASSIGNED_ZONE', lifecycleSignals: false }
  }]
}];
```

## Requests and publisher data

The adapter sends one HTTPS POST per banner opportunity to
`https://prebid.searchplan.co/prebid/bid`. It uses Prebid's OpenRTB request and
impression context and preserves supplied transaction IDs, supply chain and
privacy fields. It requests USD floors from the floors module when available.
It does not read browser storage, add user syncs or load external adapter code.

The adapter forwards supplied TCF, USP and GPP signals. No GVL ID is declared;
forwarding a signal does not establish regulatory registration or consent.
Use the publisher's consent modules and activity controls as appropriate.

## Optional win/render diagnostics

With `lifecycleSignals: true` (the default), Srchbid may receive two additional
HTTPS GET callbacks for its own bid: one when Prebid reports a win, and one when
Prebid reports successful rendering. The callback host is `bid.searchplan.co`.
No results from other bidders are collected. These diagnostic callbacks do not
bill impressions and do not measure viewability. Set `lifecycleSignals: false`
to suppress them. Bidding and delivery tracking inside the winning creative
continue to operate.

For Content Security Policy, allow `https://prebid.searchplan.co` in
`connect-src`, and `https://bid.searchplan.co` when diagnostics are enabled.
Creative-specific CSP requirements should be agreed during onboarding.

## Review test zone

The live review zone is `200007`. It supports 300x250, 320x50, 728x90, 300x600
and 160x600 Base banners. Try the [review page](https://prebid.searchplan.co/srchbid-review).
For a local Prebid review build, use `params: {zone: '200007'}` on an authorized
HTTPS host. The hostnames `prebid.searchplan.co`, `docs.prebid.org`, `prebid.org`,
`www.prebid.org` and `prebid.github.io` are allowed; contact support for another
hostname. Normal impression accounting applies. Request a separate production
zone during onboarding.
