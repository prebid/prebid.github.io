---
layout: bidder
title: Adrino
description: Prebid Adrino Bidder Adapter
pbjs: true
pbs: true
biddercode: adrino
media_types: no-display, native
gdpr_supported: true
gvl_id: 1072
---

### Note

The Adrino bidder adapter requires setup and approval from the Adrino team. Please reach out to [wydawcy@adrino.pl](mailto:wydawcy@adrino.pl) for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name   | Scope    | Description                          | Example          | Type     |
|--------|----------|--------------------------------------|------------------|----------|
| `hash` | required | Identifier for specific ad placement | `'abcdef123456'` | `string` |

### Native example

```
var adUnits = [
    code: '/12345678/prebid_native_example_1',
    mediaTypes: {
        native: {
            image: {
                required: true,
                sizes: [[300, 210],[300,150],[140,100]]
            },
            title: {
                required: true
            },
            sponsoredBy: {
                required: false
            },
            body: {
                required: false
            },
            icon: {
                required: false
            }
        }
    },
    bids: [{
        bidder: 'adrino',
        params: {
            hash: 'abcdef123456'
        }
    }]
];
```
