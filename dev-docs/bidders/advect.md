---
layout: bidder
title: Advect
description: Prebid Advect Bidder Adapter
pbjs: true
pbs: false
biddercode: advect
media_types: banner
sidebarType: 1
privacy_sandbox: topics
---

### Prebid Client

This Adapter integrates with Advect's ad services.

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
  bids: [
    {
      bidder: 'advect',
      params: {
        placementId: 'R-A-1234567-1',
        cur: 'USD',
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
