---
layout: bidder
title: BidDigi
description: Prebid BidDigi Bidder Adapter
pbjs: true
pbs: false
biddercode: biddigi
media_types: banner, video, native
sidebarType: 1
---

### Note

BidDigi is a programmatic SSP with 380+ verified publishers across news, sports, entertainment,
OTT and CTV. This adapter connects to BidDigi's own OpenRTB 2.5+ auction endpoint, letting any
Prebid.js publisher (not just BidDigi's own network) request bids from BidDigi's demand.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|------|-------|--------------|---------|------|
| `placementId` | required | BidDigi placement identifier, from your BidDigi dashboard | `'placement-123'` | `string` |
| `publisherId` | required | BidDigi publisher/account identifier | `'publisher-abc'` | `string` |
| `region` | optional | Routes the bid request to a regional BidDigi endpoint. Defaults to `'in'`. | `'in'`, `'us'` | `string` |
| `bidfloor` | optional | Per-imp floor override, in `bidfloorcur` (defaults to INR) | `12.5` | `float` |
| `bidfloorcur` | optional | Currency of `bidfloor` | `'INR'` | `string` |

### Test Parameters

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
