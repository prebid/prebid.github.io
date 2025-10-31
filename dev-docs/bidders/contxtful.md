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
multiformat_supported: true
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

### Configuration - Prebid.js Adapter

n.b. It is strongly recommended that you use the bid adapter in conjunction with the contxtful RTD provider module.

see: <https://docs.prebid.org/dev-docs/modules/contxtfulRtdProvider.html>

```javascript
pbjs.setConfig({
   "contxtful":{
      "version":"v1",
      "customer":"<CUSTOMER_ID_HERE>"
   },
   "realTimeData":{
      "dataProviders":[
         {
            "name":"contxtful",
            "waitForIt":true,
            "params":{
               "version":"v1",
               "customer":"<CUSTOMER_ID_HERE>",
               "bidders":[
                  "contxtful",
                  "<ALL_BIDDER_CODES>"
               ],
               "adServerTargeting":true
            }
         }
      ]
   }
}
);
```

### Configuration - Prebid Server Adapter

n.b. It is strongly recommended that you use the bid adapter in conjunction with the contxtful RTD provider module.

see: <https://docs.prebid.org/dev-docs/modules/contxtfulRtdProvider.html>

```javascript
pbjs.setConfig({
   "s2sConfig":{
      "bidders": ["contxtful", "<ALL_S2S_BIDDERS>"],
      "<ALL_OTHER_STANDARD_KEY_VALUES>"
   },
   "realTimeData":{
      "dataProviders":[
         {
            "name":"contxtful",
            "waitForIt":true,
            "params":{
               "version":"v1",
               "customer":"<CUSTOMER_ID_HERE>",
               "bidders":[
                  "<ALL_PAGE_BIDDER_CODES_INCLUDING_S2S>"
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
    mediaTypes: { /* "<ENTER_FORMAT_HERE> */ },
    bids: [{
      bidder: 'contxtful',
      params: {
        placementId: "<PLACEMENT_ID_HERE>",
        customerId: "<CUSTOMER_ID_HERE>"
      }
    }],
    ortb2Imp: {
      ext: {
        data: {
          divId: "<EACH_AD_UNIT_DIV_ID>"
        }
      }
    }
  }
]
```

### User Sync

Contxtful recommends enabling [User Syncing](https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig#setConfig-Configure-User-Syncing) to optimize match rate and monetization.

{% include dev-docs/storageAllowed.md %}

```javascript
// Enable iframe usersync 
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: '*',   // '*' means all bidders
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

Note - the `userSync.filterSettings.all` field is mutually exclusive and cannot be combined with the `userSync.filterSettings.iframe`/`userSync.filterSettings.image` fields in the `userSync` config. If the fields are used together, this will be considered an invalid config and only image pixels will be permitted.
