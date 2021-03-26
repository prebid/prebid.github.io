---
layout: bidder
title: Kobler
description: Kobler Bidder Adapter
biddercode: kobler
pbjs: true
media_types: banner
getFloor: true
bidder_supports_deals: true
---

### Note:

The Kobler Bidder Adapter requires setup and approval from Kobler AS.
Please reach out to <bidding-support@kobler.no> for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                                                                                                                                                                                                    | Example                      | Type               |
|---------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------|--------------------|
| `placementId` | required | The identifier of the placement, it has to be issued by Kobler.                                                                                                                                                                                | `'xjer0ch8'`                 | `string`           |
| `zip`         | optional | Zip code of the user or the medium. When multiple ad units are submitted together, it is enough to set this parameter on the first one.                                                                                                        | `'102 22'`                   | `string`           |
| `test`        | optional | Whether the request is for testing only. When multiple ad units are submitted together, it is enough to set this parameter on the first one. Defaults to false.                                                                                | `true`                       | `boolean`          |
| `floorPrice`  | optional | Floor price in CPM and in the currency given in currency.adServerCurrency. Can be used as an alternative to the [Floors module](https://docs.prebid.org/dev-docs/modules/floors.html), which is also supported by this adapter. Defaults to 0. | `5.0`                        | `float`            |
| `position`    | optional | The position of the ad unit. Can be used to differentiate between ad units if the same placement ID is used across multiple ad units. Defaults to 0.                                                                                           | `1`                          | `string`           |
| `dealIds`     | optional | Array of deal IDs.                                                                                                                                                                                                                             | `['abc328745', 'mxw243253']` | `array of strings` |

### Example
```javascript
  const adUnits = [{
    code: 'div-gpt-ad-1460505748561-1',
    mediaTypes: {
        banner: {
            sizes: [[300, 250], [300, 600]],
        }
    },
    bids: [{
      bidder: 'kobler',
      params: {
        placementId: 'xjer0ch8'
      }
    }]
  }];
```

### Example With Optional Parameters
```javascript
  const adUnits = [{
    code: 'div-gpt-ad-1460505748561-1',
    mediaTypes: {
        banner: {
            sizes: [[300, 250], [300, 600]],
        }
    },
    bids: [{
      bidder: 'kobler',
      params: {
        placementId: 'xjer0ch8',
        zip: '102 22',
        test: true,
        floorPrice: 5.0,
        position: 1,
        dealIds: ['abc328745', 'mxw243253']
      }
    }]
  }];
```
