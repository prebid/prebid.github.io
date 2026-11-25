---
layout: bidder
title: Railu
description: Prebid Railu Bidder Adapter
biddercode: railu
tcfeu_supported: true
dsa_supported: false
gvl_id: none
usp_supported: true
coppa_supported: true
gpp_sids: tcfeu, usnat, usstate_all, usp
schain_supported: true
dchain_supported: false
userId: none
media_types: banner, video, native
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: true
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: partial
privacy_sandbox: no
sidebarType: 1
---

## Note

Railu runs an auction for the seller over OpenRTB 2.6: one request per Prebid auction to
`https://api.railu.ai/v1/ortb/bid`. The bid carries the served creative (VAST for video, HTML for banner, OpenRTB
Native 1.2 for native) with Railu's signed impression trackers inside, so delivery is confirmed the same way as a
trafficked Railu tag. The adapter sets no cookies and asks for no user syncs. Sellers get their tag ID in the Railu
console (Connect your supply); see [docs.railu.dev](https://docs.railu.dev) or contact [dev@railu.ai](mailto:dev@railu.ai).

An ad unit with several formats sends them all; Railu answers in the first one it can fill, in the order the ad unit
declares them (or `params.format` first). The publisher's `badv` and `bcat` are honoured; `battr` and `bapp` are
forwarded.

## Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `tid` | recommended | The seller's public Railu tag ID. Bids count as the seller's on its own verified domains | `'t_k3m9p2x7q4w8z6'` | `string` |
| `source` | optional | The seller's registered Railu source key | `'src_7f3a'` | `string` |
| `placement` | optional | Where the slot sits on the page: `topscroll`, `midscroll`, `interscroller`, `skin`, `outstream`, `instream`, `infeed` or `display`. Also read from `ortb2Imp.ext.data.placement` | `'topscroll'` | `string` |
| `format` | optional | The format Railu answers in first when the ad unit declares several; by default the order the ad unit declares them in | `'video'` | `string` |
| `domain` | optional | The property, when `refererInfo` cannot see it | `'news.example.com'` | `string` |
| `segments` | optional | The seller's declared first-party segments for this impression | `['sports', 'auto']` | `Array<string>` |
| `signals` | optional | The seller's declared signal ids | `['sig_42']` | `Array<string>` |
| `test` | optional | `true`: Railu answers every slot with a fixed sample bid ($0.50), never billed; for integration testing | `true` | `boolean` |
| `endpoint` | optional | Override the bid endpoint | `'https://api.railu.ai/v1/ortb/bid'` | `string` |

## Test Parameters

```js
var adUnits = [
  {
    code: 'banner-1',
    mediaTypes: { banner: { sizes: [[300, 250]] } },
    bids: [{ bidder: 'railu', params: { test: true } }]
  },
  {
    code: 'video-1',
    mediaTypes: { video: { context: 'instream', playerSize: [[640, 360]], mimes: ['video/mp4'], protocols: [2, 3, 7, 8], maxduration: 30 } },
    bids: [{ bidder: 'railu', params: { test: true } }]
  },
  {
    code: 'native-1',
    mediaTypes: { native: { title: { required: true }, image: { required: true } } },
    bids: [{ bidder: 'railu', params: { test: true } }]
  }
];
```

## Deals

When a Railu deal wins, the bid carries `dealId`, so Prebid sets `hb_deal_railu` (and `hb_deal` when it is the
winning bid). A Google Ad Manager line item that targets the deal key serves it.
