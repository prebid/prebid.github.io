---
layout: bidder
title: Admaru
description: Admaru Bidder Adapter
pbjs: true
biddercode: admaru
media_types: banner
tcfeu_supported: false
schain_supported: false
usp_supported: false
sidebarType: 1
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name             | Scope    | Description      | Example                      | Type     |
|------------------|----------|------------------|------------------------------|----------|
| `pub_id` | required | Publisher id  | `'ap4m2b6m8'` | `string` |
| `adspace_id`   | required | Adspace id       | `'a3j5n6b1'` | `string` |

### Test Parameters

```
var adUnits = [
    {
        code: 'test-div',
        mediaTypes: {
            banner: {
                sizes: [[300, 250]],  // a display size
            }
        },
        bids: [
           {
               bidder: "admaru",
               params: {
                    pub_id: '1234', // string - required
                    adspace_id: '1234' // string - required
                }
           }
       ]
    }
];
```
