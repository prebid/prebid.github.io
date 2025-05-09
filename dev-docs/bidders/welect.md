---
layout: bidder
title: Welect
description: Prebid Welect Bidder Adaptor
pbjs: true
biddercode: welect
media_types: no-display, video
userIds: false
tcfeu_supported: true
gvl_id: 282
gpp_sids: tcfeu
usp_supported: false
coppa_supported: false
schain_supported: false
dchain_supported: false
safeframes_ok: false
fpd_supported: false
floors_supported: false
ortb_blocking_supported: false
multiformat_supported: will-bid-on-one
privacy_sandbox: none
sidebarType: 1

---

### Note
The Welect bidder adapter requires setup and approval from the Welect team. Please reach out to [dev@welect.de](mailto:dev@welect.de) for more information.

### Bid params

{: .table .table-bordered .table-striped }
| Name | Description | Example | Type |
|---|---|---|---|
| `placementId` | an identifier for your placement, provided by Welect | `'exampleID'` | `string` |
| `domain` | The domain of your placement | `'www.example.com'` | `string` |

### Example Ad Unit Setup

```javascript
var adUnits = [
  {
    bidder: 'welect',
    params: {
      placementId: 'exampleId',
      domain: 'www.welect.de'
    },
    sizes: [[640, 360]],
    mediaTypes: {
      video: {
        context: 'instream'
      }
    },
  };
];
```
