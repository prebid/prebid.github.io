---
layout: api_prebidjs
title: pbjs.getEvents()
description: getEvents API
sidebarType: 1
---

The `getEvents` method returns a copy of all emitted events since the page loaded (or for the last [`eventHistoryTTL`](/dev-docs/publisher-api-reference/setConfig.html#setConfig-eventHistoryTTL) seconds).

For when each event fires, in what order, and every field of its payload, see the [Prebid.js Event Reference](/dev-docs/prebid-events.html).

**Kind**: static method of `pbjs`

**Args**: none

**Returns**: `array of objects`

**Returned Object Params**:

* eventType (see table below)
* args (varies for each event type)
* id (only for bidWon, set to the bid's adUnitCode)
* elapsedTime (milliseconds since the page started loading)
* sequence (the position of the event in the order of emission; since 11.18)

The available events are:

{: .table .table-bordered .table-striped }
| Event | Description | Event argument |
| --- | --- | --- |
| auctionInit | The auction has started | Object containing auction details |
| auctionEnd | The auction has ended | Object containing auction details. Since 11.48, `timedOutRequests` lists the bid requests whose bidders did not respond before the auction timed out (the same requests as `bidTimeout`), so analytics adapters can read them from this one event. |
| auctionTimeout | The auction has timed out. In case of an auction timeout, you receive this event first, followed by `bidTimeout` and then `auctionEnd` | Object containing auction details |
| beforeRequestBids | Bids are about to be requested from adapters (added in 3.x) | Array of adunits in the auction |
| beforeBidderHttp | A bid adapter is about to send an HTTP request | Two arguments: the bidder request object, and the HTTP request `{ url, data, method, options }` |
| bidRequested | A bid was requested from a specific bidder | Bidder request object, with one bid request per ad unit in `bids` |
| bidResponse | A bid response has been added to an auction | Bid response object |
| noBid | A bid request got no bid from its bidder (once per bidder per ad unit) | Bid request object |
| pbsAnalytics | Prebid Server has returned extra information for analytics adapters. | { [seatnonbid](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#seat-non-bid), auctionId, [atag](/prebid-server/developers/module-atags.html) } |
| beforePBSHttp | A request to Prebid Server is about to be sent. Requires the Prebid Server adapter. | `{ endpointUrl, requestJson, customHeaders }` |
| seatNonBid | Removed in 11.0 - use `pbsAnalytics` instead. Prebid Server has returned nonbid information. Must be enabled in s2sConfig.extPrebid | None |
| bidRejected | A bid was rejected | Bid response object |
| bidAdjustment | A bid was adjusted | Bid response object |
| bidWon | A bid has won: it was chosen to render | Bid response object |
| staleRender | A bid that was already rendered is rendered again | Bid response object |
| expiredRender | A bid is rendered after its TTL expired | Bid response object |
| bidTimeout | A bid timed out | Array of objects with timed out bids |
| setTargeting | Targeting has been set | Hash of targeting values |
| bidViewable | A rendered bid became viewable. Requires the [bidViewability](/dev-docs/modules/bidViewable.html) or [bidViewabilityIO](/dev-docs/modules/bidViewableIO.html) module. | Bid response object |
| billableEvent | A module recorded something it bills for. Emitted by some RTD modules. | `{ vendor, type, billingId }`, plus module-specific fields |
| browsiInit, browsiData | Internal events of one RTD module | Module-specific |
| requestBids | Bids have been requested from adapters (i.e. pbjs.requestBids() was called) | The argument passed to [`requestBids`](https://docs.prebid.org/dev-docs/publisher-api-reference/requestBids.html), except that `adUnits` and `adUnitCodes` are always set and reflect the ad units involved in the auction. Event handlers may not modify `adUnitCodes`. |
| addAdUnits | Removed in 11.0 - use `auctionInit` instead. Ad units have been added to the auction. Removed in 11.0. | None |
| adRenderFailed | Ad rendering failed | Object containing 'reason' and 'message'. Since 11.48, this is also emitted for bids rendered by a [renderer](/dev-docs/show-outstream-video-ads.html) when the renderer script fails to load or its `render` function throws (reason `exception`). |
| adRenderSucceeded | Ad rendering succeeded | Object containing 'doc', 'bid', and 'adId'. 'doc' is the DOM root containing the ad and may be `null` if it was rendered in a cross-origin iframe. This event indicates that the render function did not generate an error, it does not guarantee that tracking for this event has occurred yet. For bids rendered by a renderer, since 11.48 it is emitted once the renderer has loaded and rendered, rather than when rendering starts. |
| auctionDebug | A warning or error was logged (whether or not debug mode is on) | Object containing 'type' ('WARNING' or 'ERROR') and 'arguments'. Since 11.47, also 'bidder': the code of the bidder whose adapter was running when the message was logged, or `null`. |
| bidderDone | A bidder has signaled they are done responding | Bidder request object |
| bidderError | A bidder responded with an error | Object with the XMLHttpRequest-like error and the bidder request object `{ error, bidderRequest }` |
| tcf2Enforcement | Emitted after every auction by the TCF control module, listing what it blocked | `{ storageBlocked: ['moduleA', 'moduleB'], biddersBlocked: ['moduleB'], analyticsBlocked: ['moduleC'], ufpdBlocked: [], eidsBlocked: [], geoBlocked: [] }` |
| bidAccepted | A bid was accepted and is about to be added to the auction. Fired once per accepted bid, after bid adjustment and before `bidResponse`; for video and audio bids, before VAST caching. Removed in 11.0 and restored in 11.7. | Bid response object |
| browserIntervention | The browser reported an intervention affecting a rendered creative (e.g., heavy-ad unload). | `{ bid, adId, intervention }` |

The example below shows how these events can be used.

```javascript
pbjs.getEvents().forEach(event => {
  console.log("event: "+event.eventType)
});
```

## See Also

* [onEvent](/dev-docs/publisher-api-reference/onEvent.html)
* [offEvent](/dev-docs/publisher-api-reference/offEvent.html)
* [Prebid.js Event Reference](/dev-docs/prebid-events.html)
