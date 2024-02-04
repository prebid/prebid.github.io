---
layout: bidder
title: RixEngine
description: Prebid RixEngine Bidder Adapter
biddercode: rixengine
tcfeu_supported: false
coppa_supported: true
schain_supported: false
media_types: banner
safeframes_ok: false
deals_supported: false
pbjs: false
pbs: false
pbs_app_supported: false
prebid_member: true
userIds: sharedId
sidebarType: 0
multiformat_supported: false
---

### Note

The RixEngine Bidding adapter requires setup before beginning. Please contact the RixEngine team.

**Media type support:**

RixEngine Prebid.js adapter supports `banner`, video and native is not supported yet.

### Bid Params
{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                           | Example     | Type     |
|---------------|----------|-------------------------------------------------------|-------------|----------|
| endpoint         | required |  The endpoint created on RixEngine platform, please get them from the platform or contact RixEngine team    | [http://demo.svr.rixengine.com/rtb](http://demo.svr.rixengine.com/rtb) | string   |
| sid         | optional | The sid created on RixEngine platform, please get them from the platform or contact RixEngine team | '36529'   | string   |
| token   | optional | The token created on RixEngine platform, please get them from the platform or contact RixEngine team | 'dddf27442edda20f7291c27e0fbafcbf' | string   |
| bidfloor          | optional | Minimum bid for this impression expressed in CPM.  |  0.01         | float   |

### Test Parameters

```javascript
var adUnits = [
{
    sizes: [
        [300, 250] // a display size
    ],     
    bids: [{
      bidder: 'rixengine',
      params: {
        endpoint: 'http://demo.svr.rixengine.com/rtb', // required
        token: '1e05a767930d7d96ef6ce16318b4ab99', // required
        sid: '36540', // required
        bidfloor: 0.5, // Optional
      }
    }]
}];
```
