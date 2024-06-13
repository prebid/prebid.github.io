---
layout: bidder
title: Adlive Plus
description: Adlive Plus adapter
biddercode: adliveplus
aliasCode: lucead
tcfeu_supported: true
gvl_id: 1309
usp_supported: false
coppa_supported: false
schain_supported: true
dchain_supported: false
media_types: banner
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: true
pbjs: true
pbs: false
prebid_member: false
ortb_blocking_supported: false
privacy_sandbox: paapi
sidebarType: 1
---
### Note

This adapter requires setup before beginning. Please contact us at [support@adlive.io](mailto:support@adlive.io).

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                     | Example            | Type      |
|---------------|----------|---------------------------------|--------------------|-----------|
| `placementId` | required | Placement ID                    | `'1'`              | `string`  |
| `loader`      | required | Site specific async loader code | `new Promise(...)` | `Promise` |
| `region`      | optional | Endpoint region                 | `'ap'`             | `string`  |

### Params type definition

```typescript
type Params = {
    placementId: string;
    loader: Promise<any>;
    region?: 'eu' | 'us' | 'ap';
};
```

### Test Params

```javascript
const adUnits = [
    {
        code: 'test-div',
            sizes: [[300, 250]],
            bids: [
               {
                   bidder: 'adliveplus',
                   params: {
                       placementId: '1', // required
                       loader: new Promise(/* ... */), // required
                       region: 'ap', // optional 'eu', 'us', 'ap'
                   }
               }
           ]
       }
];
```
