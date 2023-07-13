---
layout: bidder
title: LKQD
description: Prebid LKQD Bidder Adaptor
pbjs: true
biddercode: lkqd 
media_types: video
gdpr_supported: false
schain_supported: true
enable_download : false
sidebarType: 1
---

### Note

For more information about [LKQD Ad Serving and Management](https://www.nexstardigital.com/), please contact <info@lkqd.com>.

### Bid Params

{: .table .table-bordered .table-striped }
| Name             | Scope    | Description      | Example        | Type |
|------------------|----------|------------------|----------------|------|
| `siteId`         | required |                  | `'662921'`     | `string` |
| `placementId`    | required |                  | `'263'`        | `string` |

### Ad Unit Setup for Instream Video

```javascript
const adUnits = [{
  code: 'video1', // ad slot HTML element ID  
  mediaTypes: {
    video: {                  // We recommend setting the following video params
                              // in Ad Unit rather than bidder params as per Prebid 4.0 recommendation. 
      playerSize: [640, 480], // required
      context: 'instream'     // required
    }   
  }, 
  bids: [{
    bidder: 'lkqd',
    params: {
        siteId: '662921',    // required    
        placementId: '263'       // required     
    }
  }],
  // ...
}];
```
