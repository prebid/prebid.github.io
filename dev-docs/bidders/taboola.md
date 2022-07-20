---
layout: bidder
title: Taboola
description: Prebid Taboola Bidder Adapter
pbjs: true
biddercode: taboola
gdpr_supported: true
usp_supported: true
coppa_supported: true
schain_supported: false
media_types: banner
gvl_id: 42
prebid_member: true
floors_supported: true
safeframes_ok: true
---

### Note
- Supports `display` format.
- Uses `OpenRTB` standard.

### Registration

The Taboola Adapter requires setup before beginning. Please contact us at prebid@taboola.com.

### Bid Params

{: .table .table-bordered .table-striped }

| Name           | Scope    | Description                                             | Example                    | Type         |
|----------------|----------|---------------------------------------------------------|----------------------------|--------------|
| `tagId`        | required | Tag ID / Placement Name <br>                            | `'Below The Article'`      | `String`     |
| `publisherId`  | required | Numeric Publisher ID <br>(as provided by Taboola)       | `'1234567'`                | `String`     |
| `bcat`         | optional | List of blocked advertiser categories (IAB)             | `['IAB1-1']`               | `Array`      |
| `badv`         | optional | Blocked Advertiser Domains                              | `'example.com'`            | `String Url` |
| `bidfloor`     | optional | CPM bid floor                                           | `0.25`                     | `Float`      |


### Example Ad Unit
```javascript
 var adUnits = [{
  code: 'your-unit-container-id',
  mediaTypes: {
    banner: {
      sizes: [[300, 250], [300,600]]
    }
  },
  bids: [{
    bidder: 'taboola',
    params: {
      tagId: 'Placement Name',
      publisherId: 'your-publisher-id',
      bidfloor: 0.25, // Optional - default is null
      bcat: ['IAB1-1'], // Optional - default is []
      badv: ['example.com']  // Optional - default is []
    }
  }]
}];
```
