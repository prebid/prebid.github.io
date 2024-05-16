---
layout: bidder
title: Adlive Plus
description: Adlive Plus adapter
biddercode: adliveplus
aliasCode: lucead
tcfeu_supported: false
gvl_id: none
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

In order to use this adapter, you also need to include the `Lucead RTD Provider` module into your Prebid build.

### Adapter configuration

Here is the configuration you need to add to your Prebid integration, in order to use this adapter:

```javascript
pbjs.setConfig({
    realTimeData: {
        dataProviders: [
            {name: 'lucead', waitForIt: true},
        ]
    }
});
```

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `placementId` | required | Placement id          | `'1'`     | `string`  |
| `region`      | optional | Endpoint region       | `'us'`    | `string`  |

### Params type definition

```typescript
type Params = {
    placementId: string;
    region?: 'eu' | 'us' | 'ap';
};
```

### Test Parameters

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
                    region: 'ap', // optional 'eu', 'us', 'ap'
                }
            }
        ]
    }
];
```
