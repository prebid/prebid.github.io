---
layout: bidder
title: adWMG
description: Prebid adWMG Bidder Adapter
pbjs: true
biddercode: adWMG
media_types: banner
gvl_id: 959
gdpr_supported: true
sidebarType: 1
---

### BidParams

{: .table .table-bordered .table-striped }
| Name            | Scope    | Description                     | Example                      | Type               |
|-----------------|----------|---------------------------------|------------------------------|--------------------|
| `publisherId`   | required | Publisher ID from WMG Dashboard | `'5cebea3c9eea646c7b623d5e'` | `string`           |
| `IABCategories` | optional | IAB ad categories for adUnit    | `['IAB1', 'IAB5']`           | `array of strings` |
| `floorCPM`      | optional | Floor price for adUnit          | `0.5`                        | `float`            |

### Ad Unit Setup for Banner

```javascript
var adUnits = [
{
  code: 'test-hb-ad-11111-1',
  mediaTypes: {
    banner: {  
      sizes: [
          [300, 250]
      ]
    }   
  }, 
  bids: [{
    bidder: 'adWMG',
    params: {
        publisherId: '5cebea3c9eea646c7b623d5e',
        IABCategories: "['IAB1', 'IAB5']",
        floorCPM: 0.5
    }
  }]
 }
]
```
