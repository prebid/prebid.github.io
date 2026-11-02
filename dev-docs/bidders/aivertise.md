---
layout: bidder
title: Aivertise
description: Aivertise Bidder Adapter
biddercode: aivertise
tcfeu_supported: true
dsa_supported: false
gvl_id: 1654
usp_supported: true
coppa_supported: true
schain_supported: true
dchain_supported: false
userId: all
media_types: banner
safeframes_ok: false
deals_supported: false
floors_supported: true
fpd_supported: true
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: false
privacy_sandbox: no
sidebarType: 1
---

## Registration

The Aivertise bidding adapter requires setup before beginning. Please contact us at [bidder@aivertise.com](mailto:bidder@aivertise.com) to get a publisher ID.

## Description

The Aivertise adapter sends a single OpenRTB 2.6 bid request per auction to Aivertise's auction endpoint. Along with Prebid's standard first-party data, the request carries:

- TCF consent (`regs.gdpr`, `user.consent`), US Privacy (`regs.us_privacy`), GPP (`regs.gpp`, `regs.gpp_sid`) and COPPA (`regs.coppa`) signals,
- the supply chain object (`source.schain`),
- user IDs from any configured User ID module (`user.eids`),
- the page section from `ortb2.site.ext.data.section` or an `article:section` meta tag, and keywords from `article:tag` meta tags when none are configured,
- `device.devicetype` and, where the browser exposes it, `device.connectiontype`.

Bids are returned in EUR, net revenue. Aivertise creatives are not compatible with SafeFrames; render them in a friendly iframe.

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                         | Example         | Type     |
|---------------|----------|---------------------------------------------------------------------|-----------------|----------|
| `publisherId` | required | Publisher ID assigned by Aivertise                                  | `'11111'`       | `string` |
| `siteDomain`  | optional | Site domain. Only needed if different from the current page domain  | `'example.com'` | `string` |
| `placementId` | optional | Placement ID. Only needed if a placement differs from the others    | `'11111'`       | `string` |

## Example

```javascript
var adUnits = [
  {
    code: 'aivertise-banner-ad',
    mediaTypes: {
      banner: {
        sizes: [[300, 250]]
      }
    },
    bids: [
      {
        bidder: 'aivertise',
        params: {
          publisherId: 'test'
        }
      }
    ]
  }
];
```

## Floors

Aivertise supports the Price Floors module: it only bids at or above `imp.bidfloor`. Aivertise compares floors in EUR and skips floors set in another currency, so configure the Currency module if your floors aren't in EUR.

## User Sync

Aivertise syncs with an iframe, or with an image where iframe syncs aren't allowed for `aivertise`. The iframe sync is preferred: if you only allow iframe syncs for listed bidders, add Aivertise to the list:

```javascript
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: ['aivertise'], // plus your other iframe bidders
        filter: 'include'
      }
    }
  }
});
```

## Testing

The `prebid-test` publisher's `prebid-test-display` placement always bids a CPM of 2.50 EUR (unless a floor is above it) with an Aivertise banner, in sizes 300x250, 300x600, 320x50, 320x100, 320x480, 728x90, 970x250 and 1024x728 (desktop interstitial):

```javascript
bids: [
  {
    bidder: 'aivertise',
    params: {
      publisherId: 'prebid-test',
      placementId: 'prebid-test-display'
    }
  }
]
```

Where GDPR applies, it needs TCF consent for Aivertise like any other placement. A request that doesn't say whether GDPR applies is treated as if it does, so on a test page without a CMP set `pbjs.setConfig({ ortb2: { regs: { ext: { gdpr: 0 } } } })`.

Add `aivertiseTest=1` to the page URL to mark the auction as a test: Aivertise then bids its banner at a CPM of 20 EUR for any publisher. Test bids carry the ad server targeting key `aivertiseBidderTest=1`.

## GDPR / TCF

Aivertise is registered in the IAB Europe TCF as Dorvan Srl. Where GDPR applies, Aivertise only bids with consent for vendor 1654 and for purposes 1 and 2, and only syncs users with consent for purpose 1.
