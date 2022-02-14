---
layout: bidder
title: Taboola
description: Prebid Taboola Bidder Adapter
pbjs: true
biddercode: taboola
gdpr_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
media_types: banner
gvl_id: 42
prebid_member: true
floors_supported: true
safeframes_ok: true
---

### Note:

The Taboola Bidding adapter requires setup before beginning. Please contact us on prebid@taboola.com

### Bid Params


| Name           | Scope    | Description                                         | Example                  | Type         |
|----------------|----------|-----------------------------------------------------|--------------------------|--------------|
| `tagId`        | required | Tag Id / Placement name                             | `below the article`      | `String`     |
| `publisherId`  | required | Publisher id                                        | `Publisher name`         | `String`     |
| `bcat`         | optional | list of blocked advertiser categories (IAB)         | `['IAB1-1']`             | `Array`      |
| `badv`         | optional | Blocked Advertiser Domains                          | `example.com`            | `Array` |
| `bidfloor`     | optional | CPM bid floor                                       | `0.25`                   | `Integer`    |


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
      tagId: 'placement name',
      publisherId: 'your publisher Id',
      bidfloor: 0.25, // optional default is null
      bcat: ['IAB1-1'], // optional default is []
      badv: ['example.com']  // optional default is []
    }
  }]
}];
```
