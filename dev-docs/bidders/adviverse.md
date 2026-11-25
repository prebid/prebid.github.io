---
layout: bidder
title: Adviverse
description: Prebid Adviverse Bidder Adapter
pbjs: true
pbs: false
biddercode: adviverse
media_types: banner, video
tcfeu_supported: false
usp_supported: true
userIds: sharedId
prebid_member: false
schain_supported: false
safeframes_ok: true
deals_supported: false
floors_supported: false
fpd_supported: false
ortb_blocking_supported: false
multiformat_supported: will-bid-on-one
sidebarType: 1
---

### Note

The Adviverse adapter requires a placement tag key from your Adviverse publisher account. Contact <partners@adviverse.com> for setup.

GDPR consent (`gdprApplies` and the consent string) and the US Privacy string are passed through to the bidder when present. Adviverse does not have a Global Vendor List ID and does not perform user syncs. The SharedID (`pubcid.org`) user ID is forwarded when the SharedID module is enabled.

Video bids return VAST in `vastXml`. Instream and outstream contexts are supported; outstream ad units need a renderer configured on the ad unit.

### Bid Params

{: .table .table-bordered .table-striped }

| Name     | Scope    | Description                                          | Example     | Type     |
|----------|----------|------------------------------------------------------|-------------|----------|
| `tagKey` | required | Placement tag key from your Adviverse publisher account. | `'tk_test'` | `string` |

### Test Parameters

The `tk_test` tag key returns test bids for banner and video.

```javascript
var adUnits = [
  {
    code: 'banner-div',
    mediaTypes: { banner: { sizes: [[300, 250]] } },
    bids: [{ bidder: 'adviverse', params: { tagKey: 'tk_test' } }]
  },
  {
    code: 'video-div',
    mediaTypes: { video: { context: 'instream', playerSize: [[640, 480]], mimes: ['video/mp4'] } },
    bids: [{ bidder: 'adviverse', params: { tagKey: 'tk_test' } }]
  }
];
```
