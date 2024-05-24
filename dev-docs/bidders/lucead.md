---
layout: bidder
title: Lucead
description: Prebid Lucead Bidder Adapter
biddercode: lucead
tcfeu_supported: false
gvl_id: none
usp_supported: false
coppa_supported: false
schain_supported: false
dchain_supported: false
media_types: banner
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: true
pbjs: true
pbs: false
prebid_member: true/false
ortb_blocking_supported: false
privacy_sandbox: paapi
sidebarType: 1
---
### Note

The Lucead Bidding adapter requires setup before beginning. Please contact us at [prebid@lucead.com](mailto:prebid@lucead.com).

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `placementId` | required | Placement id          | `'11111'` | `string`  |

### Test Parameters

```javascript
const adUnits = [
       {
           code: 'test-div',
           sizes: [[300, 250]],
           bids: [
               {
                   bidder: 'lucead',
                   params: {
                       placementId: '1',
                   }
               }
           ]
       }
   ];
```
