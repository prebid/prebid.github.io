---
layout: bidder
title: Contxtful
description: Prebid Contxtful Bidder Adapter
biddercode: contxtful
tcfeu_supported: false
usp_supported: true
coppa_supported: true
schain_supported: true
userId: all
media_types: banner, video, audio
safeframes_ok: true
floors_supported: true
fpd_supported: true 
pbjs: true
pbs: true
pbs_app_supported: false
prebid_member: true
multiformar_supported: will-bid-on-any
ortb_blocking_supported: true
---

### Note

The Contxtful bidder adapter requires some setup. Contact us at [contact@contxtful.com](mailto:contact@contxtful.com)

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                | Example                      | Type                 |
|-------------|----------|------------------------------------------------------------|------------------------------|----------------------|
| `placementId`      | required | The placement identifier                                          | `'p12345678'` | `string`             |
| `customerId`      | required | The customer identifier              | `'DEMO123456'`       | `string`           |

### Configuration

```javascript
pbjs.setConfig({
   "contxtful":{
      "version":"v1",
      "customer":"<<CUSTOMER_ID_HERE>>"
   },
   "realTimeData":{
      "dataProviders":[
         {
            "name":"contxtful",
            "waitForIt":true,
            "params":{
               "version":"v1",
               "customer":"<<CUSTOMER_ID_HERE>>",
               "bidders":[
                  "contxtful"
               ],
               "adServerTargeting":true
            }
         }
      ]
   }
}
);
```

### First Party Data

Publishers should use the `ortb2` method of setting First Party Data. The following fields are supported:
- `ortb2.site.*`
- `ortb2.user.*`
- `ortb2.device.*`

AdUnit-specific data is supported using `AdUnit.ortb2Imp.ext.*`

### AdUnit Format client side

```javascript
 var adUnitList = [
  {
    code: 'AD_UNIT_NAME_HERE',
    mediaTypes: { /* "<< ENTER_FORMAT_HERE >> */ },
    bids: [{
      bidder: 'contxtful',
      params: {
        placementId: "<<PLACEMENT_ID_HERE>>",
        customerId: "<<CUSTOMER_ID_HERE>>"
      }
    }],
    ortb2Imp: {
      ext: {
        data: {
          divId: "<<EACH_AD_UNIT_DIV_ID>>"
        }
      }
    }
  }
]
```

### User Sync
Contxtful recommends enabling [User Syncing](https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html#setConfig-Configure-User-Syncing) to optimize match rate and monetization.

{% include dev-docs/storageAllowed.md %}

```javascript
// Enable iframe usersync 
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: ['contxtful'],
        filter: 'include'
      }
    }
  }
});

// Allow local storage usage
pbjs.bidderSettings = {
  contxtful: {
    storageAllowed: true
  }
}
```
