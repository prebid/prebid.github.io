---
layout: api_prebidjs
title: pbjs.requestBids(requestObj)
description: requestBids API
sidebarType: 1
---


Request bids. When `adUnits` or `adUnitCodes` are not specified, request bids for all ad units added.

**Kind**: static method of pbjs API

**Returns**: a promise to an object `{bids, timedOut, auctionId}` - [see below](#result)

**Parameters**:

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| requestObj | Optional | `Object` |  |
| requestObj.adUnitCodes | Optional | `Array of strings` | adUnit codes to request. Use this or `requestObj.adUnits`. Default to all `adUnitCodes` if empty. |
| requestObj.adUnits | Optional | `Array of objects` | AdUnitObjects to request. Use this or `requestObj.adUnitCodes`. Default to all `adUnits` if empty. |
| requestObj.timeout | Optional | `Integer` | Timeout for requesting the bids specified in milliseconds |
| requestObj.bidsBackHandler | Optional | `function` | Callback to execute when all the bid responses are back or the timeout hits. Callback will be passed 3 arguments - `bids`, `timedOut`, and `auctionId` - [see below](#result) |
| requestObj.labels | Optional | `Array of strings` | Defines [labels](#labels) that may be matched on ad unit targeting conditions. |
| requestObj.auctionId | Optional | `String` | Defines an auction ID to be used rather than having the system generate one. This can be useful if there are multiple wrappers on a page and a single auction ID is desired to tie them together in analytics. |
| requestObj.ortb2 | Optional | `Object` | Additional [first-party data](/features/firstPartyData.html) to use for this auction only |
| requestObj.ttlBuffer | Optional | `Number` |  TTL buffer override for this auction. See [setConfig({ttlBuffer})](/dev-docs/publisher-api-reference/setConfig.html#setConfig-ttlBuffer) |


<a id="result" />

**Result**:

{: .table .table-bordered .table-stripped :}
| Param     | Type    | Description                                                                    |
| ---       | ---     | ---                                                                            |
| bids      | Object  | Bids received; see [getBidResponses](getBidResponses.html) for details | 
| timedOut  | Boolean | true if any bidder timed out                                                   |
| auctionId | String  | the auction's ID                                                               |

Example call:

```
pbjs.requestBids({
    bidsBackHandler: sendAdserverRequest,
    timeout: 1000,
    labels: ["custom1"]
});
```

Example parameters sent to the bidsBackHandler:
```
function sendAdserverRequest(bids, timedOut, auctionId) {
    // bids
    // {"test-div":{"bids":[{"bidderCode":"bidderA", ...}]}}
    // timedOut=false
    // auctionId="130aad5e-eb1a-4b7d-8939-0663ba251887"
    ...
}
```
