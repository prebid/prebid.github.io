---
layout: bidder
title: adWMG
description: Prebid adWMG Bidder Adapter
pbjs: true
biddercode: adWMG
media_types: banner
gdpr_supported: true
tcf2_supported: true
---

<<<<<<< HEAD
### BidParams
{: .table .table-bordered .table-striped }
| Name            | Scope    | Description                     | Example                      | Type               |
|-----------------|----------|---------------------------------|------------------------------|--------------------|
| `publisherId`   | required | Publisher ID from WMG Dashboard | `'5cebea3c9eea646c7b623d5e'` | `string`           |
| `IABCategories` | optional | IAB ad categories for adUnit    | `['IAB1', 'IAB5']`           | `array of strings` |
| `floorCPM`      | optional | Floor price for adUnit          | `0.5`                        | `float`            |

=======
##BidParams
{: .table .table-bordered .table-striped }
| Name       | Scope    | Description          | Example    | Type     |
|------------|----------|----------------------|------------|----------|
| `publisherId` | required | Publisher ID from WMG Dashboard | `'5cebea3c9eea646c7b623d5e'` | `string` |
| `IABCategories` | optional |IAB ad categories for adUnit | `['IAB1', 'IAB5']` | `array of strings` |
>>>>>>> 4cdb0c00b16534372333c9e5c09f09ef3ce6e9d2

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
<<<<<<< HEAD
        IABCategories: "['IAB1', 'IAB5']",
        floorCPM: 0.5
=======
        IABCategories: ['IAB1', 'IAB5']
>>>>>>> 4cdb0c00b16534372333c9e5c09f09ef3ce6e9d2
    }
  }]
 }
]
```
