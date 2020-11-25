---
layout: bidder
title: PubWise
description: PubWise Bidder Adaptor
pbjs: true
biddercode: pubwise
media_types: banner, native
gdpr_supported: true
---

### Note:
The PubWise bid adapter requires approval. Visit http://www.PubWise.io/ to get started.

### Bid params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                                                                                       | Example                  | Type      |
|--------------|----------|---------------------------------------------------------------------------------------------------|--------------------------|-----------|
| `siteId`     | required | The site ID provided by the PubWise systesm                                                       | `'XXXXXX'`               | `string`  |
| `bidFloor`   | optional | Value to pass as the bidfloor for this bid                                                        | `2.50`                   | `currency` |
| `isTest`     | optional | A boolean to indicate 100% fill test placement request                                            | `false`                  | `boolean` |

### Example

```
var adUnits = [
    {
        code: "div-gpt-ad-1460505748561-0",
        mediaTypes: {
        banner: {
            sizes: [[300, 250]]
        }
        },
        bids: [{
            bidder: 'pubwise',
            params: {
                siteId: "xxxxxx",
                isTest: true
            }
        }]
    }
]
```
