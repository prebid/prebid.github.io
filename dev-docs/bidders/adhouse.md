---
layout: bidder
title: Adhouse
description: Prebid Adhouse Bidder Adapter
biddercode: adhouse
media_types: banner, video
multiformat_supported: will-bid-on-one
tcfeu_supported: false
usp_supported: true
coppa_supported: true
schain_supported: true
deals_supported: true
floors_supported: true
safeframes_ok: true
pbjs: true
pbs: false
sidebarType: 1
---

## Note

The Adhouse bid adapter connects to Adhouse's own bidder at `https://bid.adhouse.pro/openrtb2/auction`.
`placementId` is the ad unit id. Bids are net CPM in **USD**. A line item entered in TRY is converted on the server; the OpenRTB response currency is always USD. Load the currency module when the ad server currency is not USD.

This adapter is not on the IAB Global Vendor List, so `tcfeu_supported` is false and no `gvl_id` is declared. TCF-enforced auctions in the EU will not call it. The US Privacy string, COPPA flag and supply chain are forwarded from `ortb2`.

Video responses are VAST. A hosted MP4 is an InLine document; a third-party VAST tag is wrapped so Adhouse can record the impression. Native is not supported. There is no user sync.

## Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|---------------|----------|------------------------------------------------------------------|--------------------|----------|
| `placementId` | required | Adhouse ad unit id | `'12345'` | `string` |
| `bidfloor` | optional | Static CPM floor, only if the floors module is not used | `0.50` | `number` |
| `currency` | optional | Currency of `bidfloor`. Defaults to USD | `'USD'` | `string` |
| `videoType` | optional | `standart_video` or `sticky_video`. Omit to allow either | `'standart_video'` | `string` |

## Test Parameters

Placement `999999` returns a test creative for both banner and instream video.

```js
var adUnits = [
  {
    code: 'test-banner',
    mediaTypes: { banner: { sizes: [[300, 250]] } },
    bids: [{ bidder: 'adhouse', params: { placementId: '999999' } }]
  },
  {
    code: 'test-video',
    mediaTypes: {
      video: {
        context: 'instream',
        playerSize: [[640, 360]],
        mimes: ['video/mp4'],
        protocols: [2, 3, 5, 6]
      }
    },
    bids: [{ bidder: 'adhouse', params: { placementId: '999999' } }]
  }
];
```
