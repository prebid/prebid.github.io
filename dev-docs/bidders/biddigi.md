---
layout: bidder
title: BidDigi
description: Prebid BidDigi Bidder Adapter
biddercode: biddigi
sidebarType: 1
pbjs: true
pbs: true
pbs_app_supported: true
prebid_member: false
media_types: banner, video, native
multiformat_supported: will-bid-on-one
safeframes_ok: true
gvl_id: none
gdpr_supported: true
usp_supported: true
coppa_supported: true
dsa_supported: false
gpp_sids: tcfeu, tcfca, usnat, usstate_all, usp
schain_supported: true
dchain_supported: false
deals_supported: false
floors_supported: true
fpd_supported: true
userId: all
---

## Note

BidDigi is a programmatic SSP. This adapter connects to BidDigi's own OpenRTB 2.5+ auction
endpoint, letting any Prebid.js publisher request bids from BidDigi's demand.

The adapter is built on `ortbConverter`, so first-party data, EIDs, SupplyChain, GDPR/TCF,
US Privacy, GPP and COPPA signals are forwarded from `ortb2` unmodified, and price floors are
read through the Price Floors module's `getFloor()`. A `bidfloor` supplied in `params` is used
only when the Price Floors module has not already set one.

## Bid Params

These are the **Prebid.js** parameters. The Prebid Server integration takes a different set -- see below.

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| ------ | ----- | ----------- | ------- | ---- |
| `placementId` | required | BidDigi placement identifier, from your BidDigi dashboard | `'placement-123'` | `string` |
| `publisherId` | required | BidDigi publisher/account identifier | `'publisher-abc'` | `string` |
| `region` | optional | Routes the bid request to a regional BidDigi endpoint. Defaults to `'in'`. | `'in'`, `'us'` | `string` |
| `bidfloor` | optional | Per-imp floor override, in `bidfloorcur` (defaults to INR). Ignored when the Price Floors module supplies a floor. | `12.5` | `float` |
| `bidfloorcur` | optional | Currency of `bidfloor` | `'INR'` | `string` |

## Prebid Server Bid Params

Prebid Server calls BidDigi's authenticated server-to-server endpoint, which resolves the
publisher from the authenticated seat together with `site.domain` / `app.bundle`. There is
therefore no `publisherId` parameter on this integration, and the credential is issued per
integration rather than per ad unit.

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| ------ | ----- | ----------- | ------- | ---- |
| `seatKey` | required | Seat API key issued by BidDigi when your integration is onboarded. Sent as an `Authorization` header; never included in the bid request body. | `'bds_xxxxxxxx'` | `string` |
| `placementId` | optional | BidDigi placement identifier for this ad unit | `'placement-123'` | `string` |

Impressions carrying different `seatKey` values are split into separate calls, since one HTTP
request carries one `Authorization` header.

BidDigi does not yet hold an IAB Europe GVL vendor ID, so the Prebid Server adapter ships with
`geoscope: "!EEA"` and should not be enabled for EEA traffic until that registration completes.

## Test Parameters

```js
const adUnits = [
  {
    code: 'banner-div',
    mediaTypes: {
      banner: {
        sizes: [[300, 250], [300, 600]],
      },
    },
    bids: [
      {
        bidder: 'biddigi',
        params: {
          placementId: 'placement-123',
          publisherId: 'publisher-abc',
        },
      },
    ],
  },
  {
    code: 'video-div',
    mediaTypes: {
      video: {
        context: 'instream',
        playerSize: [640, 480],
        mimes: ['video/mp4'],
        protocols: [2, 5],
        minduration: 5,
        maxduration: 30,
      },
    },
    bids: [
      {
        bidder: 'biddigi',
        params: {
          placementId: 'placement-video-1',
          publisherId: 'publisher-abc',
          region: 'us',
        },
      },
    ],
  },
  {
    code: 'native-div',
    mediaTypes: {
      native: {
        title: { required: true, len: 80 },
        image: { required: true },
        sponsoredBy: { required: true },
        clickUrl: { required: true },
        body: { required: false },
      },
    },
    bids: [
      {
        bidder: 'biddigi',
        params: {
          placementId: 'placement-native-1',
          publisherId: 'publisher-abc',
        },
      },
    ],
  },
];
```
