---
layout: bidder
title: Melvad
description: Prebid Melvad Bidder Adapter
biddercode: melvad
tcfeu_supported: false
usp_supported: false
coppa_supported: false
gpp_supported: false
schain_supported: false
dchain_supported: false
userId:
media_types: banner, video, native
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: true
pbjs: true
pbs: true
pbs_app_supported: true
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: true
sidebarType: 1
---

## Registration

The Melvad bidding adapter requires setup before beginning. Please contact us at <support@melvad.com> to get your placement IDs (Prebid.js) or your `sspId` (Prebid Server).

## Bid Params

Prebid.js and Prebid Server take different parameters.

{: .table .table-bordered .table-striped }
| Name          | Scope                       | Description                               | Example          | Type     |
|---------------|-----------------------------|-------------------------------------------|------------------|----------|
| `placementId` | required (Prebid.js)        | Placement ID issued by Melvad             | `'pl-a962d9cff'` | `string` |
| `sspId`       | required (Prebid Server)    | SSP identifier issued by Melvad           | `'prebid'`       | `string` |

## Prebid.js

The adapter sends one OpenRTB 2.5 request per auction as `text/plain` without cookies, so no preflight is made. Video bids are returned as `vastXml`; set `cache.allowVastXmlOnly` when the player takes the XML directly. The adapter calls the win and billing URLs of a bid on the `bidWon` and `billable` events and runs no user sync of its own.

Melvad bids in the currency of the placement. Set `currency.adServerCurrency` to that currency (RUB for the test placements below), or load the Prebid currency module so the bids can be converted.

The user is taken from first party data (`ortb2.user.buyeruid`); without it the request gets no bid.

### Configuration

```javascript
pbjs.setConfig({
  currency: { adServerCurrency: 'RUB' },
  cache: { allowVastXmlOnly: true },
  ortb2: { user: { buyeruid: 'prebid-test-user' } }
});
```

The endpoint can be overridden with `melvad.endpoint`, for example for a test environment:

```javascript
pbjs.setConfig({ melvad: { endpoint: 'https://pub.supplier.melvad.com/prebid' } });
```

### Test Parameters

```javascript
var adUnits = [
  {
    code: 'banner-div',
    mediaTypes: { banner: { sizes: [[300, 250]] } },
    bids: [{ bidder: 'melvad', params: { placementId: 'pl-a962d9cff' } }]
  },
  {
    code: 'native-div',
    mediaTypes: {
      native: {
        ortb: {
          assets: [
            { id: 1, required: 1, title: { len: 25 } },
            { id: 4, required: 1, img: { type: 3, wmin: 1200, hmin: 627 } },
            { id: 2, data: { type: 2, len: 90 } }
          ]
        }
      }
    },
    bids: [{ bidder: 'melvad', params: { placementId: 'pl-c4ead8e7b' } }]
  }
];
```
