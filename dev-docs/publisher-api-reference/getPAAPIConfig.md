---
layout: api_prebidjs
title: pbjs.getPAAPIConfig(options)
description: getPAAPIConfig API
sidebarType: 1
---

Return the latest available PAAPI auction configuration for each ad unit, optionally filtered by auction or ad unit.

**Kind**: static method of pbjs API. Only available when the [PAAPI module](/dev-docs/modules/paapi.html) is installed.

**Returns**: `object` - Map from ad unit code to a (partial)  [PAAPI auction configuration](https://github.com/WICG/turtledove/blob/main/FLEDGE.md#21-initiating-an-on-device-auction) object for that ad unit. Only the `componentAuctions` field is guaranteed to be present; future PAAPI modules may provide more. 

**Parameters**:

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| options | Optional | `Object` |  |
| options.adUnitCode | Optional | `String` | Ad unit filter; if provided, only return configuration for this ad unit |
| options.auctionId | Optional | `String` | Auction filter; if provided, only return configuration from this auction  |

**Example**:

```js
pbjs.getPAAPIConfig({adUnitCode: 'test-slot'})
```

```json
{
    "test-slot": {
        "componentAuctions": [
            {
                "auctionSignals": {
                    "prebid": {
                        "bidfloor": 8.463,
                        "bidfloorcur": "USD"
                    }
                },
                "trustedScoringSignalsUrl": "https://pa.openx.net/tss",
                "sellerCurrency": "USD",
                "perBuyerSignals": {
                    "https://explorefledge.com": {
                        "ortb2Imp": {
                            "secure": 1,
                            "exp": 900,
                            "ext": {
                                "ae": 1
                            },
                            "id": "1",
                            "banner": {
                                "format": [
                                    {
                                        "h": 250,
                                        "w": 300
                                    }
                                ],
                                "w": 300,
                                "h": 250,
                                "battr": [
                                    17
                                ],
                                "topframe": 1
                            },
                            "tagid": "538703464",
                            "bidfloor": 0.02,
                            "bidfloorcur": "USD"
                        }
                    }
                },
                "perBuyerExperimentGroupIds": {
                    "https://privacysandbox.openx.net": 1
                },
                "seller": "https://pa.openx.net",
                "decisionLogicUrl": "https://pa.openx.net/s/537291777.js",
                "interestGroupBuyers": [
                    "https://explorefledge.com"
                ],
                "sellerSignals": {
                    "igDomainToSeat": {
                        "https://privacysandbox.openx.net": "openx"
                    },
                    "bcat": {
                        "IABv1": [
                            "IAB7-44",
                            "IAB26",
                            "IAB25"
                        ],
                        "IABv2": [
                            "231"
                        ]
                    },
                    "adUnitId": "538703464",
                    "currency": "USD",
                    "advertiserId": "537113485",
                    "auctionId": "b49d3b43-1094-4686-a67c-f5abb695db2d",
                    "igDomainToDsp": {
                        "https://explorefledge.com": "560434471",
                    },
                    "reportingUrl": "https://privacysandbox-reporting.openx.net/fledgeReporting",
                    "publisherId": "537143056",
                    "floor": 8.463,
                    "auctionTimestamp": 1707259930
                }
            }
        ]
    }
}
```
