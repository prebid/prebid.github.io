---
layout: api_prebidjs
title: pbjs.getPAAPIBids(options)
description: getPAAPIBids API
sidebarType: 1
---

Returns a promise of the latest PAAPI bid for each ad unit, optionally filtered by auction or ad unit.

**Kind**: static method of pbjs API. Only available when the [topLevelPaapi module](/dev-docs/modules/topLevelPaapi.html) is installed.

**Returns**: `Promise<Object>` - Promise to a map from ad unit code to the PAAPI winner for that ad unit, if available.

**Parameters**:

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| options | Optional | `Object` |  |
| options.adUnitCode | Optional | `String` | Ad unit filter; if provided, only return the PAAPI winner for this ad unit |
| options.auctionId | Optional | `String` | Auction filter; if provided, only return PAAPI winners for this auction  |

**Result**:

The return value is a map where each value is either `null` (when there is no PAAPI winner), or an object with this format:

{: .table .table-bordered .table-stripped :}
| Param         | Type    | Description                                                                    |
| ---           | ---     | ---                                                                            |
| adId          | String  | Ad ID. can be used with [renderAd](/dev-docs/publisher-api-reference/renderAd.html) |
| auctionId     | String  | Auction ID tied to this bid                                                      |
| adUnitCode    | String  | Ad unit code tied to this bid |
| source        | String  | Always `"paapi"` |
| urn           | String  | Creative URN (only set if `paapi.topLevelSeller.auctionConfig.resolveToConfig` is `false`|
| frameConfig   | Object  | Creative fenced frame config (only set if `paapi.topLevelSeller.auctionConfig.resolveToConfig` is `true`|
| auctionConfig | Object  | The auction config object that was passed to `navigator.runAdAuction` and generated this bid |
| width         | Number  | Creative width |
| height        | Number  | Creative height |

**Example**:

```js
pbjs.getPAAPIBids({adUnitCode: 'test-slot'})
```

```json
{
  "test-slot": {
    "source": "paapi",
    "adId": "paapi:/0c00694d-958d-4250-98b3-5fe15cb019ab/:/test-slot",
    "width": 300,
    "height": 250,
    "adUnitCode": "test-slot",
    "auctionId": "0c00694d-958d-4250-98b3-5fe15cb019ab",
    "urn": "urn:uuid:81005931-5726-4fb4-8bec-9ae74248e1ef",
    "auctionConfig": {
      "auctionSignals": {
        "prebid": {
          "bidfloor": 1,
          "bidfloorcur": "USD"
        }
      },
      "requestedSize": {
        "width": 300,
        "height": 250
      },
      "componentAuctions": [
        {
          "requestedSize": {
            "width": "300px",
            "height": "250px"
          },
          "seller": "https://ads.optable.co",
          "decisionLogicURL": "https://ads.optable.co/ca/paapi/v1/ssp/decision-logic.js?origin=daa30ba1-5613-4a2c-b7f0-34e2c033202a",
          "interestGroupBuyers": [
            "https://ads.optable.co"
          ],
          "sellerCurrency": "USD",
          "perBuyerCurrencies": {
            "https://ads.optable.co": "USD"
          },
          "perBuyerMultiBidLimits": {
            "https://ads.optable.co": 100
          }
        }
      ],
      "resolveToConfig": false,
      "seller": "https://publisher.com",
      "decisionLogicURL": "https://publisher.com/decisionLogic.js"
    }
  }
}
```
