---
layout: bidder
title: Monetize.site
description: Prebid Monetize.site Bidder Adapter
biddercode: monetsite
tcfeu_supported: false
dsa_supported: false
gvl_id: none
usp_supported: true
coppa_supported: true
gpp_sids: usnat, usp
schain_supported: true
dchain_supported: false
userIds: all
media_types: banner, video, native
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: true
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: true
privacy_sandbox: no
sidebarType: 1
---

## Note

The Monetize.site bidding adapter requires setup before beginning. Please contact us at [support@monetize.site](mailto:support@monetize.site).

## GDPR

Monetize.site is not on the IAB Global Vendor List. With the `tcfControl` module's default rules, requests and user syncs for `monetsite` are blocked when GDPR applies. Add `monetsite` to `softVendorExceptions` (or `vendorExceptions`) of the `basicAds` rule to allow bid requests, and of the `storage` rule to allow user syncs.

## Bid Params

{: .table .table-bordered .table-striped }

| Name       | Scope    | Description                                                                                                                           | Example             | Type                         |
|------------|----------|---------------------------------------------------------------------------------------------------------------------------------------|---------------------|------------------------------|
| `zoneID`   | required | Zone ID provided by Monetize.site. Non-empty string or positive number                                                                | `'922800027'`       | `string`/`number`            |
| `bidfloor` | optional | Impression floor, `>= 0`, used when the Price Floors module sets none. Default `0`                                                    | `0.5`               | `number` (or numeric string) |
| `cur`      | optional | 3-letter ISO 4217 currency of `bidfloor`. Default `'USD'`                                                                             | `'EUR'`             | `string`                     |
| `mirror`   | optional | Bare hostname (no scheme, port or path) to send the request to over https instead of `rtb.monetize.site`. Overrides `endpoint` config | `'rtb.example.com'` | `string`                     |

## Bid Floors

The floor sent on each impression comes from the Price Floors module when a rule matches, otherwise from `bidfloor`/`cur`, otherwise `0` USD. No floor is sent when the Price Floors module suppresses it for this bidder (`noFloorSignalBidders`, a skipped auction, or a rule with a `null` value).

## First Party Data

All `ortb2` and `ortb2Imp` fields are forwarded in an OpenRTB 2.6 request, including `site`, `app`, `device`, `user` (with `user.eids` and `user.consent`), `regs` (`gdpr`, `us_privacy`, `gpp`, `gpp_sid`, `coppa`), `source.schain` and `imp.ext`. Impression format objects (`imp.banner`, `imp.video`, `imp.native`, `imp.audio`) not declared in the ad unit's `mediaTypes` are removed.

## Adapter Configuration

{: .table .table-bordered .table-striped }

| Name       | Description                                          | Example                              | Type     |
|------------|------------------------------------------------------|--------------------------------------|----------|
| `endpoint` | Endpoint override; the zone ID is appended           | `'https://rtb.monetize.site/ssp?z='` | `string` |
| `ttl`      | Bid TTL in seconds, `0 < ttl <= 5000`. Default `500` | `360`                                | `number` |

```javascript
pbjs.setConfig({
  monetsite: { ttl: 360 }
});
```

## User Sync

Image and iframe syncs are returned by the server and fired according to the publisher's `userSync` settings. Only `https://` URLs are used; `gdpr`, `gdpr_consent`, `us_privacy`, `gpp` and `gpp_sid` are appended when available. No syncs are fired when COPPA applies.

```javascript
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: { bidders: ['monetsite'], filter: 'include' }
    }
  }
});
```

## Win and Billing Notices

`nurl` is fired on `bidWon` for native bids and for video bids with VAST in `adm`; for video without `adm`, `nurl` is used as the VAST URL. `burl` is fired when the bid becomes billable, which follows `deferBilling` and `pbjs.triggerBilling()` if used.

## Example Ad Units

```javascript
const adUnits = [
  {
    code: 'banner-div',
    mediaTypes: { banner: { sizes: [[300, 250]] } },
    bids: [{ bidder: 'monetsite', params: { zoneID: '922800027', bidfloor: 0.5, cur: 'USD' } }]
  },
  {
    code: 'video-div',
    mediaTypes: {
      video: {
        context: 'instream',
        playerSize: [[640, 360]],
        mimes: ['video/mp4', 'video/webm'],
        protocols: [2, 3, 5, 6, 7, 8],
        maxduration: 60
      }
    },
    bids: [{ bidder: 'monetsite', params: { zoneID: '984341227' } }]
  },
  {
    code: 'native-div',
    mediaTypes: {
      native: {
        ortb: {
          ver: '1.2',
          assets: [
            { id: 1, required: 1, title: { len: 90 } },
            { id: 2, required: 1, img: { type: 3, w: 300, h: 300 } },
            { id: 3, required: 0, data: { type: 2, len: 140 } }
          ]
        }
      }
    },
    bids: [{ bidder: 'monetsite', params: { zoneID: '917767897' } }]
  }
];
```
