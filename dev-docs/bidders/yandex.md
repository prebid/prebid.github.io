---
layout: bidder
title: Yandex
description: Prebid Yandex Bidder Adapter
pbjs: true
pbs: true
biddercode: yandex
media_types: banner, native
sidebarType: 1
---

### Prebid Client

#### Client Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope                                              | Description                                        | Example                           | Type      |
| ------------- | -------------------------------------------------- | -------------------------------------------------- | --------------------------------- | --------- |
| `placementId` | required                                           | Ad unit ID. Prebid versions > 7.30                 | `R-A-1234567-1`                   | `String`  |
| `cur`         | optional                                           | CPM currency to be received. Prebid versions > 8.4 | `CHF`, `GBP`, `USD`, `EUR`, `TRY` | `String`  |
| `pageId`      | optional, **deprecated** in favor of `placementId` | Page ID                                            | `123`                             | `Integer` |
| `impId`       | optional, **deprecated** in favor of `placementId` | Imp ID                                             | `1`                               | `Integer` |

#### Client Test Parameters

```js
// Simple banner
const adUnits = [{
  code: 'banner-1',
  mediaTypes: {
    banner: {
      sizes: [[240, 400]],
    }
  },
  bids: [{
    {
      bidder: 'yandex',
      params: {
        placementId: 'R-A-1234567-1',
        cur: 'USD',
      },
    }
  }]
}];

// Native
const adUnits = [{
  code: 'native-1',
  mediaTypes: {
    native: {
      sendTargetingKeys: false,
      ortb: {
        assets: [{
            id: 1,
            required: 1,
            img: {
              type: 3,
              w: 300,
              h: 300,
            }
          },
          {
            id: 2,
            required: 1,
            title: {
              len: 80
            }
          },
          {
            id: 3,
            required: 1,
            data: {
              type: 1
            }
          }
        ]
      }
    }
  },
  bids: [
    {
      bidder: 'yandex',
      params: {
        placementId: 'R-A-346580-140',  // native adunit ID
        cur: 'USD' // EUR, TRY, etc.
      },
    }
  ]
}];
```

### Prebid Server

{: .alert.alert-info :}
We maintain both **PBS Java** and **PBS Go** adapters, but **PBS Go** is recommended for integration and will receive updates first

#### Server Bid Params

These params are basically the same that you'd use for 

{: .table .table-bordered .table-striped }
| Name           | Scope                                               | Description                        | Example         | Type      | Supported in     |
| -------------- | --------------------------------------------------- | ---------------------------------- | --------------- | --------- | ---------------- |
| `placement_id` | required                                            | Ad unit ID. Prebid versions > 7.30 | `R-A-1234567-1` | `String`  | PBS Go           |
| `page_id`      | optional, **deprecated** in favor of `placement_id` | Page ID                            | `123`           | `Integer` | PBS Go, PBS Java |
| `imp_id`       | optional, **deprecated** in favor of `placement_id` | Imp ID                             | `1`             | `Integer` | PBS Go, PBS Java |

#### Prebid Server Test Request

The following test parameters can be used to verify that Prebid Server is working properly with the
server-side adapter.

```json
"imp": [{
  "id": "imp_id",
  "banner": {
    "w": 300,
    "h": 600
  },
  "ext": {
    "bidder": {
      "placement_id": "R-A-1234567-1"
    }
  }
}]
```