---
layout: bidder
title: AdGrid
description: Prebid AdGrid Bidder Adaptor
biddercode: adgrid
media_types: banner
pbjs: true
sidebarType: 1
---

### Note

The AdGrid Bidding Adapter requires setup and approval before beginning. Please reach out to <support@adgrid.io> for more details.

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description  | Example | Type      |
|------------|----------|--------------|---------|-----------|
| `domainId` | required | Publisher Id | `30164` | `integer` |


### Test Parameters

``` javascript
    var adUnits = [

      // Banner adUnit
      {
        code: 'test-div-1',
        mediaTypes:{
            banner:{
                sizes: [[300, 250]]
            }
        }
        bids: [{
          bidder: 'adgrid',
          params: {
            domainId: 12345
          }
        }]
      },
      {
        code: 'test-div-2',
        mediaTypes:{
            banner:{
                sizes: [[728, 90], [320, 50]]
            }
        }
        bids: [{
          bidder: 'adgrid',
          params: {
            domainId: 67890 
          }
        }]
      }
    ];
```