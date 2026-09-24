---
layout: bidder
title: Pubstack
description: Prebid Pubstack Bidder Adapter
biddercode: pubstack
prebid_member: true
pbjs: true
pbs: true
gvl_id: 1408
media_types: banner, video, native
multiformat_supported: will-bid-on-any
tcfeu_supported: true
usp_supported: true
gpp_sids: tcfeu, tcfca, usnat, usstate_all, usp
coppa_supported: true
userId: all
schain_supported: true
dchain_supported: true
fpd_supported: true
floors_supported: true
deals_supported: true
safeframes_ok: true
privacy_sandbox: paapi, topics
ortb_blocking_supported: true
sidebarType: 1
---

### Integration Note

The Pubstack bidding adapter requires setup and approval before use. Contact your Pubstack account team to enable production traffic.

### Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `siteId` | required | Pubstack site identifier. | `'example-site-id'` | `string \| uuid` |
| `adUnitName` | required | Pubstack ad unit name associated with the placement. | `'homepage-top-banner'` | `string` |

### Test Parameters

```javascript
var adUnits = [
  {
    code: 'test-div-1',
    mediaTypes: {
      banner: {
        sizes: [[300, 250]]
      }
    },
    bids: [
      {
        bidder: 'pubstack',
        params: {
          siteId: 'example-site-id',
          adUnitName: 'homepage-top-banner'
        }
      }
    ]
  },
  {
    code: 'test-video-div',
    mediaTypes: {
      video: {
        playerSize: [[640, 360]],
        context: 'outstream'
      }
    },
    bids: [
      {
        bidder: 'pubstack',
        params: {
          siteId: 'example-site-id',
          adUnitName: 'article-video-slot'
        }
      }
    ]
  }
];
```
