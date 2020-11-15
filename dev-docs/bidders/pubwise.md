---
layout: bidder
title: PubWise
description: PubWise Bidder Adaptor
pbjs: true
biddercode: pubwise
media_types: banner
gdpr_supported: true
---

### Note:
The PubWise bid adapter requires approval. Visit http://www.PubWise.io/ to get started.

### Bid params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                                                                                       | Example                  | Type      |
|--------------|----------|---------------------------------------------------------------------------------------------------|--------------------------|-----------|
| `siteId`     | required | The site ID provided by the PubWise systesm                                                       | `'XXXXXX'`               | `string`  |
| `spotId`     | required | The ID of the bid placement                                                                       | `'12345678'`             | `string`  |
| `isTest`     | required | A boolean to indicate 100% fill test placement request                                            | `false`                  | `boolean` |

### Example

```
var adUnits = [
    {
        code: "banner-div",
        mediaTypes: {
        banner: {
            sizes: [[300, 250]]
        }
        },
        bids: [{
            siteId: "XXXXXX",
            spotId: "12345678",
            isTest: false
        }]
    }
]
```
