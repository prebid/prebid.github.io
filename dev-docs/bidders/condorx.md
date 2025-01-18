---
layout: bidder
title: CondorX
description: Prebid CondorX Bidder Adapter
biddercode: condorx
tcfeu_supported: true
dsa_supported: false
gvl_id: 1375
usp_supported: false
coppa_supported: false
schain_supported: false
dchain_supported: false
media_types: banner, native
safeframes_ok: false
deals_supported: false
floors_supported: true
fpd_supported: false
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-any
ortb_blocking_supported: false
privacy_sandbox: no
sidebarType: 1
---

### Note

The CondorX Bidding adapter requires setup before beginning. Please contact us at [CondorX](https://condorx.io).

### Bid params

| Name     | Scope    | Description                                                 | Example              |
|----------|----------|-------------------------------------------------------------|----------------------|
| `widget` | required | The widget ID, by CondorX                                  | `12345`              |
| `website`| required | The website ID, by Condorx                                  | `12345`              |
| `url`    | optional | Current url                                                 | `https://condorx.io` |

### Example Ad Unit

```javascript
var adUnits = [{
    code: 'condorx-container-id',
    mediaTypes: {
        banner: {
            sizes: [[300, 250]],  
        }
    },
    bids: [{
        bidder: "condorx",
        params: {
            widget: 'widget id by CondorX',
            website: 'website id by CondorX',
            url:'current url'
        }
    }]
}];
