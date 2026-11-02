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
| requestObj | Optional | `Object` | |
| requestObj.adUnitCodes | Optional | `Array of strings` | adUnit codes to request. Use this or `requestObj.adUnits`. Default to all `adUnitCodes` if empty. |
| requestObj.adUnits | Optional | `Array of objects` | AdUnitObjects to request. Use this or `requestObj.adUnitCodes`. Default to all `adUnits` if empty. |
| requestObj.timeout | Optional | `Integer` | Timeout for requesting the bids specified in milliseconds |
| requestObj.bidsBackHandler | Optional | `function` | Callback to execute when all the bid responses are back or the timeout hits. Callback will be passed 3 arguments - `bids`, `timedOut`, and `auctionId` - [see below](#result) |
| requestObj.labels | Optional | `Array of strings` | Defines `labels` that may be matched on ad unit targeting conditions. |
| requestObj.auctionId | Optional | `String` | Defines an auction ID to be used rather than having the system generate one. This can be useful if there are multiple wrappers on a page and a single auction ID is desired to tie them together in analytics. |
| requestObj.ortb2 | Optional | `Object` | Additional [first-party data](/features/firstPartyData.html) to use for this auction only |
| requestObj.ttlBuffer | Optional | `Number` | TTL buffer override for this auction. See [setConfig({ttlBuffer})](/dev-docs/publisher-api-reference/setConfig.html#setConfig-ttlBuffer) |

<a id="result"></a>

**Result**:

{: .table .table-bordered .table-stripped :}
| Param | Type | Description |
| --- | --- | --- |
| bids | Object | Bids received; see [getBidResponses](getBidResponses.html) for details |
| timedOut | Boolean | true if any bidder timed out |
| auctionId | String | the auction's ID |

<a id="rejection"></a>

**Rejection**:

Since Prebid.js 11.41, the returned promise rejects if the auction is aborted before it starts - for example, when the [consent management](/dev-docs/modules/consentManagementTcf.html) module cancels the auction, or when first party data enrichment or another pre-auction step throws an error. In that case `bidsBackHandler` is still called, but with no arguments. In earlier versions the promise never settled in these situations.

If you `await` the result of `requestBids`, wrap it in `try`/`catch`:

```javascript
try {
    const {bids, timedOut, auctionId} = await pbjs.requestBids({timeout: 1000});
    // ...
} catch (e) {
    // the auction did not run
}
```

Example call:

```javascript
pbjs.requestBids({
    bidsBackHandler: sendAdserverRequest,
    timeout: 1000,
    labels: ["custom1"]
});
```

Example parameters sent to the bidsBackHandler:

```javascript
function sendAdserverRequest(bids, timedOut, auctionId) {
    // bids
    // {"test-div":{"bids":[{"bidderCode":"bidderA", ...}]}}
    // timedOut=false
    // auctionId="130aad5e-eb1a-4b7d-8939-0663ba251887"
    ...
}
```
