---
layout: bidder
title: Optidigital
description: Prebid Optidigital Bidder Adapter
biddercode: optidigital
pbjs: true
floors_supported: true
gdpr_supported: true
tcf2_supported: true
usp_supported: true
schain_supported: true
ortb_blocking_supported: true
safeframes_ok: true
media_types: banner
gvl_id: 915
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                    | Example                  | Type               |
|----------------|----------|------------------------------------------------|--------------------------|--------------------|
| `publisherId`  | required | Unique id of the publisher                     | `'p1234'`                | `string`           |
| `placementId`  | required | Identifier for specific ad placement or ad tag | `'Billboard_Top'`        | `string`           |
| `divId`        | optional | Id of the div containing the ad slot           | `'Billboard_Top_3c5425'` | `string`           |
| `pageTemplate` | optional | Page template name of the current page         | `'home'`                 | `string`           |
| `badv`         | optional | Blocked advertiser domains                     | `['example.com']`        | `array of strings` |
| `bcat`         | optional | Blocked advertiser categories                  | `['IAB1-1', 'IAB1-2']`   | `array of strings` |
| `bapp`         | optional | Blocked advertiser mobile app bundles          | `['com.blocked']`        | `array of strings` |
| `battr`        | optional | Blocked creative attributes                    | `[1, 2]`                 | `array of integers`|

### Note

The Optidigital Bidding adapter requires setup before beginning. Please contact us at <prebid@optidigital.com>.
The following test parameters can be used to verify that the Optidigital adapter is working properly. This example includes an test publisherId and placementId that would return the test creative.

### AdUnits configuration example

```
    var adUnits = [{
      code: 'your-slot_1-div', // use exactly the same code as your slot div id.
      mediaTypes: {
        banner: {
            sizes: [[300,600]]
        }
      },
      bids: [{
          bidder: 'optidigital',
          params: {
            publisherId: 'test',
            placementId: 'Billboard_Top',
            divId: 'Billboard_Top_3c5425', // optional parameter
            pageTemplate: 'home', // optional parameter
            badv: ['example.com'], // optional parameter
            bcat: ['IAB1-1', 'IAB1-2'], // optional parameter
            bapp: ['com.blocked'], // optional parameter 
            battr: [1, 2] // optional parameter 
          }
      }]
    }];
```

### UserSync example

```
pbjs.setConfig({
  userSync: {
    iframeEnabled: true,
    syncEnabled: true,
    syncDelay: 3000
  }
});
```
