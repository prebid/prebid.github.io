---
layout: bidder
title: Appnerve
description: Prebid Appnerve Bidder Adapter
biddercode: appnerve
media_types: banner, video, native, audio
pbjs: true
pbs: false
gvl_id: none
tcfeu_supported: false
dsa_supported: false
gpp_sids: usnat, usstate_all, usp
usp_supported: true
coppa_supported: true
schain_supported: true
userIds: all
floors_supported: true
fpd_supported: true
multiformat_supported: will-bid-on-any
deals_supported: true
safeframes_ok: true
ortb_blocking_supported: false
prebid_member: false
privacy_sandbox: no
sidebarType: 1
---

### Note

The Appnerve adapter sends each ad unit as its own OpenRTB 2.6 request to
`https://exchange.appnerve.net/openrtb2/auction`. Bids are gross CPM in USD.
The adapter does not do user syncs. For a publisher account and source IDs,
contact [prebid@appnerve.com](mailto:prebid@appnerve.com).

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope                                  | Description                 | Example                  | Type     |
|---------------|----------------------------------------|-----------------------------|--------------------------|----------|
| `sourceId`    | required (unless `placementId` is set) | Appnerve Exchange source ID | `'appnerve-test-banner'` | `string` |
| `placementId` | optional                               | Alias of `sourceId`         | `'appnerve-test-banner'` | `string` |

### Test Parameters

These source IDs always return a non-billable test bid:
`appnerve-test-banner`, `appnerve-test-video`, `appnerve-test-native` and
`appnerve-test-audio`.

```javascript
var adUnits = [{
  code: 'test-banner',
  mediaTypes: { banner: { sizes: [[300, 250]] } },
  bids: [{ bidder: 'appnerve', params: { sourceId: 'appnerve-test-banner' } }]
}, {
  code: 'test-video',
  mediaTypes: {
    video: { context: 'instream', playerSize: [[640, 360]], mimes: ['video/mp4'], protocols: [2, 3, 5, 6] }
  },
  bids: [{ bidder: 'appnerve', params: { sourceId: 'appnerve-test-video' } }]
}];
```
