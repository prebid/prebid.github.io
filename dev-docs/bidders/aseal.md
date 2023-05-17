---
layout: bidder
title: Aseal
description: Prebid Aseal Bidder Adapter
pbjs: true
biddercode: aseal
media_types: banner
sidebarType: 1
---

### BidParams

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|-----------------|----------|---------------------------------|------------------------------------------|--------------------|
| `placeUid` | required | The Place UID from Aotter | `'f4a74f73-9a74-4a87-91c9-545c6316c23d'` | `string` |

### Configuration

Following configuration is required:

```js
pbjs.setConfig({
  aseal: {
    clientId: "YOUR_CLIENT_ID"
  }
});
```

### Ad Unit Example

```js
var adUnits = [
  {
    code: "banner-div",
    mediaTypes: {
      banner: {
        sizes: [
          [300, 250],
          [300, 600]
        ]
      }
    },
    bids: [
      {
        bidder: "aseal",
        params: {
          placeUid: "f4a74f73-9a74-4a87-91c9-545c6316c23d"
        }
      }
    ]
  }
];
```
