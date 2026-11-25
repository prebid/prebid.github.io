---
layout: bidder
title: Engerio
description: Prebid Engerio Bidder Adapter
biddercode: engerio
tcfeu_supported: false
dsa_supported: false
gvl_id: none
usp_supported: false
coppa_supported: false
gpp_sids: none
schain_supported: true
dchain_supported: false
media_types: banner
safeframes_ok: true
deals_supported: false
floors_supported: false
fpd_supported: true
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-not-bid
ortb_blocking_supported: false
privacy_sandbox: no
sidebarType: 1
---

## Note

The Engerio adapter requires an active publisher account. Please contact [info@thinkeasy.cz](mailto:info@thinkeasy.cz) to obtain an ad slot code (`adUnitCode`) for your placement.

## Supply chain

Engerio publishes [https://api.engerio.sk/sellers.json](https://api.engerio.sk/sellers.json). Your account's seller id from that file is what belongs in your `ads.txt`:

```text
api.engerio.sk, <seller id>, DIRECT
```

and in the supply chain node for this bidder:

```javascript
pbjs.setBidderConfig({
  bidders: ['engerio'],
  config: {
    ortb2: {
      source: {
        ext: {
          schain: {
            ver: '1.0',
            complete: 1,
            nodes: [{ asi: 'api.engerio.sk', sid: '<seller id>', hp: 1 }]
          }
        }
      }
    }
  }
});
```

## Viewability

Engerio records viewable impressions from the verdict your Prebid.js produces; it does not
measure viewability itself. Enable **either** module:

```javascript
pbjs.setConfig({ bidViewabilityIO: { enabled: true } });   // IntersectionObserver, no ad server needed
pbjs.setConfig({ bidViewability: { enabled: true } });     // GAM Active View, via GPT
```

With neither enabled, viewable impressions are reported as unavailable rather than as zero.
Bidding is unaffected either way.

## First-party data

First-party data set in `ortb2` (page and user level) and in each ad unit's `ortb2Imp` is
forwarded to Engerio. The adapter's own impression fields take precedence over `ortb2Imp` where
they collide.

## Bid Params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                                                                | Example              | Type     |
| ------------ | -------- | -------------------------------------------------------------------------- | -------------------- | -------- |
| `adUnitCode` | required | The ad slot identifier configured in the Engerio admin for this placement. | `'homepage-sidebar'` | `string` |
