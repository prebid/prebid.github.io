---
layout: bidder
title: SuperEdge
description: SuperEdge Prebid Bidder Adapter
biddercode: superedge
media_types: banner,native
userIds: all (with commercial activation)
tcfeu_supported: true
coppa_supported: true
gvl_id: 1554
usp_supported: true
pbjs: true
pbs: true
floors_supported: true
sidebarType: 1
---

## Table of Contents

* [Modules](#modules)
* [Note](#note)
* [Bid Params](#bid-params)
  * [Prebid.js Bid Params](#prebidjs-bid-params)
  * [Prebid Server Bid Params](#prebid-server-bid-params)
* [Banner](#banner)
* [Native](#native)
* [Prebid Server Test Request](#prebid-server-test-request)

## Modules

SharedID: We need you to include SharedID module, which is used to get prebid user commonid. It can better differentiating users to bid on ads.

## Note

The SuperEdge Bidding adapter requires setup before beginning. Please contact us at <op@superedge.co.jp>

## Bid Params

### Prebid.js Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope       | Description                                                                                                       | Example      | Type      |
|------------|-------------|-------------------------------------------------------------------------------------------------------------------|--------------|-----------|
| `sk`       | required    | Publisher token, communicated by SuperEdge.                                                                       | `'12341235'` | `string`  |
| `publisher`| required    | Publisher ID, communicated by SuperEdge.                                                                          | `'abcdefg'`  | `string`  |
| `region`   | recommended | Server region: `US` for US, `EU` for Europe, `APAC` for Asia-Pacific. Default is `US`.                            | `'US'`       | `string`  |
| `test`     | recommended | 0 (default): production env mode.<br>1: dev env mode and no charge. We will bid at higher frequency to make debug easier. | `1` / `0`    | `integer` |
| `bidfloor` | recommended | Sets a floor price for the bid.                                                                                   | `0.05`        | `float`   |

### Prebid Server Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope       | Description                                                                        | Example      | Type     |
|----------|-------------|------------------------------------------------------------------------------------|--------------|----------|
| `sk`     | required    | Publisher token, communicated by SuperEdge.                                        | `'12341235'` | `string` |
| `region` | recommended | Server region: `US` for US, `EU` for Europe, `APAC` for Asia-Pacific. Default is `US`. | `'US'`       | `string` |

## Banner

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
        bidder: 'superedge',
        params: {
            sk: '12341235',           // required
            publisher: 'abcdefg',     // required
            region: 'US',             // recommended - US, EU, or APAC
            test: 0,                  // recommended - 0: production, 1: dev
            bidfloor: 0.05            // recommended
        }
    }]
}];
```

## Native

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
        bidder: 'superedge',
        params: {
            sk: '12341235',           // required
            publisher: 'abcdefg',     // required
            region: 'US',             // recommended - US, EU, or APAC
            test: 0,                  // recommended - 0: production, 1: dev
            bidfloor: 0.05            // recommended
        }
    }]
}];
```

## Prebid Server Test Request

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
            "bidder": {
                "sk": "12341235",
                "region": "US"
            }
        }
    }]
}
```
