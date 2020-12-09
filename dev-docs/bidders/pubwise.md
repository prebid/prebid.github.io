---
layout: bidder
title: PubWise
description: PubWise Bidder Adaptor
pbjs: true
biddercode: pwbid
media_types: banner, native
gdpr_supported: true
gvl_id: 842
---

### Note:
The PubWise bid adapter requires approval. Visit http://www.PubWise.io/ to get started.

### Bid params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                                                                                       | Example                  | Type      |
|--------------|----------|---------------------------------------------------------------------------------------------------|--------------------------|-----------|
| `siteId`     | required | The site ID provided by the PubWise system                                                       | `'XXXXXX'`               | `string`  |
| `bidFloor`   | optional | Value to pass as the bidfloor for this bid                                                        | `2.50`                   | `currency` |
| `isTest`     | optional | A boolean to indicate 100% fill test placement request                                            | `false`                  | `boolean` |

### Example

#### Banner
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
            bidder: 'pwbid',
            params: {
                siteId: "xxxxxx",
                isTest: true
            }
        }]
    }
]
```
#### Native

```
var adUnits = [
    {
        code: 'div-gpt-ad-1460505748561-1',
        sizes: [[1, 1]],
        mediaTypes: {
            native: {
                title: {
                    required: true,
                    len: 80
                },
                body: {
                    required: true
                },
                image: {
                    required: true,
                    sizes: [150, 50]
                },
                sponsoredBy: {
                    required: true
                },
                icon: {
                    required: false
                }
            }
        },
        bids: [{
            bidder: 'pwbid',
            params: {
                siteId: "xxxxxx",
                isTest: true,
            },
        }]
    }
]
```
