---
layout: bidder
title: SuperEdge
description: SuperEdge Prebid Bidder Adapter
biddercode: superEdge
media_types: banner,native
userIds: all (with commercial activation)
coppa_supported: true
usp_supported: true
pbjs: true
pbs: true
floors_supported: true
sidebarType: 1
---

### Table of Contents

* [Note](#note)
* [Bid Params](#bid-params)
* [Banner](#banner)
* [Native](#native)
* [Prebid Server Test Request](#prebid-server-test-request)

### Note

The SuperEdge Bidding adapter requires setup before beginning. Please contact us at op@superedge.co.jp

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `sk`      | required | publisher token        | `'12341235'`    | `string` |
| `test` | recommended | 0(default): production env mode. <br> 1: dev env mode and no charge.we will bid Higher frequency to make debug easier. This parameter is available for PBJS only.  | `1/0` | `integer` |
| `bidfloor` | recommended | Sets a floor price for the bid. This parameter is available for PBJS only. | `0.05` | `float` |
| `publisher`      | required | publisher id         | `'abcdefg'`    | `string` |

### Banner

```javascript
var adUnits = [{
    code: 'test-div',
    mediaTypes: {
        banner: {
            sizes: [
                [300, 250],
                [300, 600]
            ]
        }
    },
    bids: [{
        bidder: 'superEdge',
        params: {
            sk: '12341235',           // required
            publisher: 'abcdefg',     // required
            test: 0,                  // recommended - 0: production, 1: dev
            bidfloor: 0.05            // recommended
        }
    }]
}];
```

### Native

```javascript
var adUnits = [{
    code: 'test-div-native',
    mediaTypes: {
        native: {
            ortb: {
                assets: [{
                    id: 1,
                    required: 1,
                    img: {
                        type: 3,
                        w: 150,
                        h: 50
                    }
                },
                {
                    id: 2,
                    required: 1,
                    title: {
                        len: 80
                    }
                },
                {
                    id: 3,
                    required: 1,
                    data: {
                        type: 1
                    }
                },
                {
                    id: 4,
                    required: 1,
                    data: {
                        type: 2
                    }
                }]
            }
        }
    },
    bids: [{
        bidder: 'superEdge',
        params: {
            sk: '12341235',           // required
            publisher: 'abcdefg',     // required
            test: 0,                  // recommended - 0: production, 1: dev
            bidfloor: 0.05            // recommended
        }
    }]
}];
```

### Prebid Server Test Request

The following test parameters can be used to verify that Prebid Server is working properly with the
server-side SuperEdge adapter.

```json
{
    "imp": [{
        "id": "some-impression-id",
        "banner": {
            "format": [{
                "w": 300,
                "h": 250
            }, {
                "w": 300,
                "h": 600
            }]
        },
        "ext": {
            "superEdge": {
                "sk": "12341235",
                "publisher": "abcdefg"
            }
        }
    }]
}
```
