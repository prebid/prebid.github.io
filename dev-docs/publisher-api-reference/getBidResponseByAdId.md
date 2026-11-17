---
layout: api_prebidjs
title: pbjs.getBidResponseByAdId(adId, [options])
description: getBidResponseByAdId API
sidebarType: 1
---


Since Prebid.js 11.6, use this method to look up a bid response by its `adId`, and optionally mark it as used.

**Kind**: static method of `pbjs`

**Returns**: `Object` - the bid response with the given `adId`, or `null` if there is none.

**Parameters**:

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| adId | Required | `String` | The `adId` of the bid to look up |
| options | Optional | `Object` | |
| options.markAsUsed | Optional | `Boolean` | If true, mark the bid as used (see below). Default is false. |

The search covers bids received in completed auctions that are still held in memory. Bids are not filtered by status, so a bid that has already been rendered or marked as used is still returned.
If `adId` is missing, or no bid matches it, the method logs a message and returns `null`.

When `markAsUsed` is `true` and a bid is found, it is handled the same way as [`markWinningBidAsUsed({adId, events: true})`](/dev-docs/publisher-api-reference/markWinningBidAsUsed.html): its win trackers are fired, the `bidWon` event is emitted, and the bid is marked as rendered so that it is not used for targeting again.

**Example**:

```javascript
const bid = pbjs.getBidResponseByAdId(adId, {markAsUsed: true});
if (bid != null) {
    // use bid.vastUrl, bid.vastXml, bid.ad, etc
}
```

## See Also

* [markWinningBidAsUsed](/dev-docs/publisher-api-reference/markWinningBidAsUsed.html)
* [getBidResponses](/dev-docs/publisher-api-reference/getBidResponses.html)
