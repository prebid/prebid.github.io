---
layout: page_v2
title: Prebid.js Event Reference
description: Every Prebid.js event, when it fires, and the fields of its payload
sidebarType: 1
---

# Prebid.js Event Reference
{: .no_toc }

Prebid.js emits events as an auction runs and as its ads render. Publishers listen for them with [`pbjs.onEvent`](/dev-docs/publisher-api-reference/onEvent.html), read the history with [`pbjs.getEvents`](/dev-docs/publisher-api-reference/getEvents.html), and [analytics adapters](/dev-docs/integrate-with-the-prebid-analytics-api.html) receive them through their `track` function. This page lists every event: when it fires, in what order, and the fields of its payload.

The field lists come from the TypeScript types in the Prebid.js source (the `Events` interface in `src/events.ts`, which is extended next to the code that emits each event). Where an event has no type, the fields come from the code that emits it, and the section says so.

* TOC
{: toc }

## Listening for events

```javascript
pbjs.onEvent('bidWon', function (bid) {
  console.log(bid.bidder, 'won', bid.adUnitCode, 'at', bid.cpm);
});
```

* A handler receives the event's payload as its argument. `beforeBidderHttp` is the one event with a second argument.
* Payloads are the objects Prebid.js itself uses, not copies. Don't modify them unless the event is meant for it (`beforeRequestBids`, `requestBids`, `bidAdjustment`, `beforeBidderHttp` and `beforePBSHttp`); a change made in a handler can change the auction.
* Handlers run synchronously, in the order they were registered (for `bidWon`, handlers registered for the bid's ad unit run first). An exception in a handler is logged and doesn't stop the others.
* `pbjs.getEvents()` returns every event since the page loaded, or for the last [`eventHistoryTTL`](/dev-docs/publisher-api-reference/setConfig.html#setConfig-eventHistoryTTL) seconds. Each record has these fields:

{: .table .table-bordered .table-striped }
| Field | Type | Description |
| --- | --- | --- |
| `eventType` | string | The event name. |
| `args` | object or array | The payload: what an `onEvent` handler receives as its first argument. |
| `id` | string or undefined | For `bidWon`, the bid's `adUnitCode`; `undefined` for other events. `bidWon` is the only event that takes an `id` in `onEvent`. |
| `elapsedTime` | number | `performance.now()` when the event was emitted: milliseconds since the page started loading. |
| `sequence` | number | Position of the event in the order of emission, starting at 0. Since 11.18. |

### Events that analytics adapters receive

Adapters built on the base `AnalyticsAdapter` class receive every event in Prebid.js's `EVENTS` list except `auctionDebug`, which they must request with `includeEvents`. Events emitted before `enableAnalytics` is called are replayed to the adapter. The [video module events](#video-module-events) are not in `EVENTS`, so adapters don't receive them unless they listen with `onEvent`. See [How to Add an Analytics Adapter](/dev-docs/integrate-with-the-prebid-analytics-api.html), and the [`reportAnalytics` activity](/dev-docs/activity-controls.html#activities), which can disable an adapter.

## Order of events

For one auction, events fire in this order. Steps 3 to 9 happen for each bidder, and the bidders run in parallel.

1. `requestBids`: `pbjs.requestBids()` was called.
2. `beforeRequestBids`: bid requests are about to be built.
3. `auctionInit`: the auction has started; bid requests have been built.
4. `bidRequested`: once per bidder (once per bidder per Prebid Server instance for server-side bidders).
5. `beforeBidderHttp` (client-side bidders) or `beforePBSHttp` (Prebid Server): just before each HTTP request.
6. `bidderError`, if a request fails.
7. For each bid that comes back: `bidRejected`, or `bidAdjustment`, `bidAccepted` and `bidResponse`.
8. `bidderDone`: the bidder has finished; for Prebid Server, `pbsAnalytics` follows.
9. `noBid`: once for each of the bidder's bid requests that got no bid.
10. If the auction timed out: `auctionTimeout`, then `bidTimeout`.
11. `auctionEnd`, then `tcf2Enforcement` if the TCF control module is in use. The `bidsBackHandler` passed to `requestBids` runs after `auctionEnd`.
12. `setTargeting`: when the page sets ad server targeting, usually from `bidsBackHandler`.
13. When a bid is rendered: `staleRender` or `expiredRender` if they apply, then `adRenderSucceeded` or `adRenderFailed`, and `bidWon`. `browserIntervention` can follow.
14. Later: `bidViewable` and `bidClick` or `bidClickInferred`, if the modules or settings that emit them are in use.

`auctionDebug` can fire at any point. Bidders that time out can still produce `bidResponse`, `bidRejected`, `bidderError`, `bidderDone` and `noBid` events after `auctionEnd`.

## Event index

{: .table .table-bordered .table-striped }
| Event | When it fires | Payload | Requires |
| --- | --- | --- | --- |
| [`requestBids`](#requestbids) | `pbjs.requestBids()` was called | the `requestBids` options | |
| [`beforeRequestBids`](#beforerequestbids) | bid requests are about to be built | `AdUnit[]` | |
| [`auctionInit`](#auctioninit) | the auction has started | [auction](#auction-object) | |
| [`bidRequested`](#bidrequested) | a bidder is about to be called | [bidder request](#bidder-request-object) | |
| [`beforeBidderHttp`](#beforebidderhttp) | a bid adapter is about to send an HTTP request | bidder request, HTTP request | |
| [`bidderError`](#biddererror) | a bidder's HTTP request failed | `{ error, bidderRequest }` | |
| [`bidAdjustment`](#bidadjustment) | a bid is about to be adjusted | [bid](#bid-object) | |
| [`bidAccepted`](#bidaccepted) | a bid passed validation and is about to be added | bid | |
| [`bidRejected`](#bidrejected) | a bid was rejected | bid, with `rejectionReason` | |
| [`bidResponse`](#bidresponse) | a bid was added to the auction | bid | |
| [`bidderDone`](#bidderdone) | a bidder has finished | bidder request | |
| [`noBid`](#nobid) | a bid request got no bid | [bid request](#bid-request-object) | |
| [`auctionTimeout`](#auctiontimeout) | the auction timed out | auction | |
| [`bidTimeout`](#bidtimeout) | bidders didn't respond in time | `BidRequest[]` | |
| [`auctionEnd`](#auctionend) | the auction has ended | auction | |
| [`setTargeting`](#settargeting) | ad server targeting was set | targeting by ad unit | |
| [`bidWon`](#bidwon) | a bid was chosen to render | bid | |
| [`staleRender`](#stalerender) | a bid that was already rendered is rendered again | bid | |
| [`expiredRender`](#expiredrender) | an expired bid is rendered | bid | |
| [`adRenderSucceeded`](#adrendersucceeded) | a bid was rendered | `{ doc, bid, adId }` | |
| [`adRenderFailed`](#adrenderfailed) | a bid failed to render | `{ reason, message, bid, adId }` | |
| [`browserIntervention`](#browserintervention) | the browser intervened on a rendered creative | `{ bid, adId, intervention }` | |
| [`bidClick`](#bidclick) | a click on a rendered creative was observed | `{ bid, adId, adUnitCode, bidder, method }` | `bidClickTracking` config |
| [`auctionDebug`](#auctiondebug) | a warning or error was logged | `{ type, arguments, bidder }` | |
| [`beforePBSHttp`](#beforepbshttp) | a request to Prebid Server is about to be sent | `{ endpointUrl, requestJson, customHeaders }` | Prebid Server adapter |
| [`pbsAnalytics`](#pbsanalytics) | Prebid Server returned analytics data | `{ seatnonbid, atag, auctionId, ... }` | Prebid Server adapter |
| [`tcf2Enforcement`](#tcf2enforcement) | after each auction, TCF enforcement results | lists of blocked modules | TCF control module |
| [`bidViewable`](#bidviewable) | a rendered bid became viewable | bid | a bid viewability module |
| [`bidClickInferred`](#bidclickinferred) | a click was inferred from focus moving into a creative | `{ bid, adId, adUnitCode, bidder, method }` | `bidClickTracking` module |
| [`billableEvent`](#billableevent) | a module recorded something it bills for | `{ vendor, type, billingId, ... }` | some RTD modules |
| [`browsiInit`, `browsiData`](#browsiinit-and-browsidata) | one RTD module's own events | module-specific | that RTD module |
| [`video*`](#video-module-events) | player, ad and media events | `{ divId, type, ... }` | video module |

## Common objects

Several events share these objects. The tables list their main fields; modules add more.

### Auction object

The payload of `auctionInit`, `auctionTimeout` and `auctionEnd` (type `AuctionProperties` in `src/auction.ts`). Every field is always present, but some are empty or `undefined` until later in the auction.

{: .table .table-bordered .table-striped }
| Field | Type | Description |
| --- | --- | --- |
| `auctionId` | string | The auction's ID: generated, or the `auctionId` passed to `requestBids`. |
| `timestamp` | number | When the auction started (`Date.now()`). |
| `auctionEnd` | number or undefined | When the auction ended (`Date.now()`). `undefined` in `auctionInit` and `auctionTimeout`. |
| `auctionStatus` | string | `'inProgress'` in `auctionInit`, `'completed'` in `auctionEnd`. |
| `adUnits` | `AdUnit[]` | The ad units in the auction, as Prebid.js processed them: with `transactionId`, `adUnitId` and their `bids`. |
| `adUnitCodes` | `string[]` | The codes of the ad units in the auction. |
| `labels` | `string[]` or undefined | The `labels` passed to `requestBids`. |
| `bidderRequests` | [`BidderRequest[]`](#bidder-request-object) | One per bidder (and per Prebid Server instance). |
| `noBids` | [`BidRequest[]`](#bid-request-object) | Bid requests that got no bid. |
| `bidsReceived` | [`Bid[]`](#bid-object) | Bids added to the auction (see `bidResponse`). By default bids stay in this list until the page unloads, even after they expire; with [`minBidCacheTTL`](/dev-docs/publisher-api-reference/setConfig.html#setConfig-minBidCacheTTL) they are dropped after their TTL or `minBidCacheTTL`, whichever is longer. Being in the list doesn't mean a bid is still valid. |
| `bidsRejected` | `Bid[]` | Rejected bids (see `bidRejected`). |
| `winningBids` | `Bid[]` | Bids that have won (see `bidWon`). Usually empty in `auctionEnd`, since bids win after the auction. |
| `timeout` | number | The auction's timeout in milliseconds. |
| `metrics` | object | Performance metrics; call `metrics.getMetrics()`. Only collected when `performanceMetrics` is set in `setConfig`. |
| `seatNonBids` | array | Seat non-bids from Prebid Server (see `pbsAnalytics`). Empty if there are none. |
| `timedOutRequests` | `BidRequest[]` | The bid requests whose bidders didn't respond before the timeout: the same requests as `bidTimeout`. Empty if the auction didn't time out. Since 11.48. |

### Bidder request object

One per bidder per auction: the payload of `bidRequested` and `bidderDone`, and in the auction's `bidderRequests` (type `BidderRequest` in `src/adapterManager.ts`).

{: .table .table-bordered .table-striped }
| Field | Type | Always present | Description |
| --- | --- | --- | --- |
| `bidderCode` | string or null | yes | The bidder. `null` for Prebid Server stored impressions that have no bidder. |
| `bidderRequestId` | string | yes | This request's ID. |
| `auctionId` | string | yes | The auction's ID. |
| `pageViewId` | string | yes | The page view ID. Each bidder sees a different one. |
| `bids` | [`BidRequest[]`](#bid-request-object) | yes | One bid request per ad unit. |
| `ortb2` | object | yes | First party data (an OpenRTB request) for this bidder, after [privacy redaction](#privacy-redaction). |
| `auctionStart` | number | yes | When the auction started (`Date.now()`). |
| `timeout` | number | yes | Timeout in milliseconds (`s2sConfig.timeout` for Prebid Server). |
| `src` | string | yes | `'client'`, or `'s2s'` for bidders called through Prebid Server. |
| `refererInfo` | object | yes | Page and referrer information. |
| `metrics` | object | yes | Performance metrics. |
| `start` | number | from `bidRequested` | When the bidder was called (milliseconds). Not in the type. |
| `gdprConsent`, `uspConsent`, `gppConsent` | object or string | no | Consent data, when the consent management modules provide it. |
| `uniquePbsTid`, `adUnitsS2SCopy` | string, array | Prebid Server only | Internal fields used to route requests to a Prebid Server instance. |
| `alwaysHasCapacity` | boolean | no | Set when the bidder (or `s2sConfig`) is exempt from the requests-per-origin limit. |
| `allowPriorityBids` | boolean | no | Whether the publisher trusts this bidder's deal metadata (`bid.meta.deal`). |

### Bid request object

One per bidder per ad unit: in a bidder request's `bids`, and the payload of `noBid` and `bidTimeout` (type `BidRequest` in `src/adapterManager.ts`).

{: .table .table-bordered .table-striped }
| Field | Type | Always present | Description |
| --- | --- | --- | --- |
| `bidder` | string or null | yes | The bidder. `null` for Prebid Server stored impressions. |
| `params` | object | for bidders | The bidder's parameters from the ad unit. |
| `bidId` | string | yes | This request's ID. A bid answers it with `requestId`. |
| `bidderRequestId` | string | yes | The ID of the bidder request that contains it. |
| `auctionId`, `transactionId`, `adUnitId`, `pageViewId` | string | yes | Context IDs. `transactionId` is shared by every bidder's request for the same ad unit and auction; `adUnitId` differs between twin ad units. |
| `adUnitCode` | string | yes | The ad unit's code. |
| `mediaTypes` | object | yes | The ad unit's media types. |
| `ortb2Imp` | object | yes | Ad unit first party data (an OpenRTB `imp`), with `ext.tid` and `ext.tidSource` unless `transmitTid` is denied. |
| `ortb2` | object | yes | The same object as the bidder request's `ortb2`. |
| `src` | string | yes | `'client'` or `'s2s'`. |
| `auctionsCount`, `bidRequestsCount`, `bidderRequestsCount`, `bidderWinsCount` | number | yes | How many auctions this ad unit was in, how many times it was requested, how many client-side requests went to this bidder for it, and how many times this bidder won it. |
| `deferBilling` | boolean | yes | The ad unit's `deferBilling`. |
| `sizes` | array | yes | Deprecated: use the sizes in `mediaTypes`. |
| `userIdAsEids` | array | with the User ID module | The bidder's extended IDs: an alias of `ortb2.user.ext.eids`. Empty when the `transmitEids` activity is denied. |
| `renderer`, `safeRenderer`, `nativeParams`, `nativeOrtbRequest`, `element` | | no | Copied from the ad unit when it has them. |
| `metrics` | object | yes | Performance metrics. |

### Bid object

A bid: the payload of `bidAdjustment`, `bidAccepted`, `bidRejected`, `bidResponse`, `bidWon`, `staleRender`, `expiredRender` and `bidViewable`, and in `bidsReceived` (type `Bid` in `src/bidfactory.ts`, extended in `src/auction.ts` and by modules). Which fields are set depends on how far the bid got: see the event sections.

{: .table .table-bordered .table-striped }
| Field | Type | Always present | Description |
| --- | --- | --- | --- |
| `adId` | string | yes | Prebid.js's ID for this bid; used to render it. |
| `requestId` | string | yes | The `bidId` of the bid request it answers. Can be `null` for bids from unknown bidder codes. |
| `bidder`, `bidderCode` | string | yes | The bidder that made the bid. |
| `adapterCode` | string | no | The bid adapter that returned it; differs from `bidderCode` for alternate bidder codes. |
| `auctionId`, `transactionId`, `adUnitId`, `adUnitCode` | string | yes | Context IDs and the ad unit's code. |
| `mediaType` | string | yes | `'banner'`, `'video'`, `'native'` or `'audio'`. |
| `cpm` | number | yes | The price, after currency conversion and, from `bidAccepted` on, after adjustment. |
| `currency` | string | yes | The currency of `cpm`. |
| `originalCpm`, `originalCurrency` | number, string | no | The price and currency the bidder returned. |
| `width`, `height` | number | yes | Creative size. `size` is the same as a string, e.g. `'300x250'`. |
| `creativeId` | string | yes | The bidder's creative ID. |
| `netRevenue` | boolean | yes | Whether `cpm` is net of fees. |
| `ttl` | number | yes | How long the bid is valid, in seconds. |
| `dealId` | string | no | The deal ID, for deal bids. |
| `meta` | object | yes | Bid metadata: `advertiserDomains`, `networkId`, `dchain`, `dsa`, `deal` and others. |
| `source` | string | yes | `'client'` or `'s2s'`. |
| `ad`, `adUrl` | string | banner | Creative markup, or a URL to it. |
| `vastXml`, `vastUrl`, `videoCacheKey` | string | video and audio | VAST markup, or a URL to it, and the Prebid Cache key. |
| `native` | object | native | Native assets. |
| `requestTimestamp`, `responseTimestamp`, `timeToRespond` | number | yes | When the request was made and the response received (`Date.now()`), and the difference in milliseconds. |
| `pbLg`, `pbMg`, `pbHg`, `pbAg`, `pbDg`, `pbCg` | string | from `bidAccepted` | Price buckets at each granularity. |
| `adserverTargeting` | object | from `bidResponse` | The targeting key-values for this bid. |
| `status` | string | no | `'targetingSet'` once targeting has been set for it, `'rendered'` once rendered. |
| `rejectionReason` | string | `bidRejected` | Why the bid was rejected. Not in the type. |
| `floorData` | object | with the Price Floors module | The floor that applied to the bid. |
| `deferBilling`, `deferRendering` | boolean | yes | Whether billing (or rendering) waits for `pbjs.triggerBilling()`. |
| `desirability`, `priority`, `houseBid` | number, number, boolean | from `bidAccepted` | How Prebid.js ranks the bid against others. |
| `renderer` | object | no | The renderer used for outstream bids. |
| `metrics` | object | yes | Performance metrics. |

### Privacy redaction

The [activity controls](/dev-docs/activity-controls.html) redact what each bidder receives, and events carry the same redacted objects. In bidder requests and bid requests (`bidRequested`, `beforeBidderHttp`, `bidderDone`, `bidderError`, `noBid`, `bidTimeout`, and the auction's `bidderRequests`, `noBids` and `timedOutRequests`), when an activity is denied for that bidder:

* `transmitEids`: `ortb2.user.eids` and `ortb2.user.ext.eids` are removed, and `userIdAsEids` is empty.
* `transmitUfpd`: `ortb2.user.data`, `ext.data`, `yob`, `gender`, `keywords`, `kwarray`, `id`, `buyeruid`, `customdata` and `ortb2.device.ifa` are removed.
* `transmitPreciseGeo`: latitude and longitude in `ortb2.user.geo` and `ortb2.device.geo` are rounded to two decimals, and `ortb2.device.ip` and `ipv6` are truncated.
* `transmitTid`: `ortb2Imp.ext.tid` and `ortb2.source.tid` are removed.

Two things are not redacted per bidder:

* the auction's `adUnits` (in `auctionInit` and `auctionEnd`): with the User ID module, each `adUnits[].bids[]` entry has `userIdAsEids`, the EIDs for that bidder, regardless of activity controls.
* `beforePBSHttp`'s `requestJson`: the request to Prebid Server, redacted according to the activities for the Prebid Server adapter rather than for each bidder.

Analytics adapters are not redacted separately: an adapter that's allowed to run sees the same payloads as any other listener.

## Core events

These are emitted by Prebid.js core and are in every build.

### requestBids

**When:** `pbjs.requestBids()` was called, before anything else in the auction.

**Payload:** the options passed to [`requestBids`](/dev-docs/publisher-api-reference/requestBids.html) (type `RequestBidsOptions`), with `adUnits` and `adUnitCodes` always set to the ad units in the auction. Handlers may change the ad units, but not `adUnitCodes`.

{: .table .table-bordered .table-striped }
| Field | Type | Always present | Description |
| --- | --- | --- | --- |
| `adUnits` | `AdUnit[]` | yes | The ad units in the auction. |
| `adUnitCodes` | `string[]` | yes | Their codes. |
| `bidsBackHandler` | function | no | The callback for when the auction ends. |
| `timeout` | number | no | The timeout for this auction, in milliseconds. |
| `labels` | `string[]` | no | Labels for conditional ad units. |
| `auctionId` | string | no | An auction ID chosen by the page. |
| `ortb2` | object | no | First party data for this auction only. |
| `ttlBuffer` | number | no | TTL buffer for this auction. |

```javascript
{ adUnits: [ /* ... */ ], adUnitCodes: ['div-top'], timeout: 1000, bidsBackHandler: function () {} }
```

### beforeRequestBids

**When:** once per auction, just before the bid requests are built. Handlers can change the ad units, for example to remove bidders.

**Payload:** `AdUnit[]`, the ad units in the auction (with `transactionId` and `adUnitId`).

```javascript
[{ code: 'div-top', mediaTypes: { banner: { sizes: [[300, 250]] } }, bids: [{ bidder: 'exampleBidder', params: { placementId: 1 } }], transactionId: 'c4f0...', adUnitId: '8a1e...' }]
```

### auctionInit

**When:** the auction has started: bid requests have been built, and bidders are about to be called. If the auction is queued because of `maxRequestsPerOrigin`, this waits until it runs.

**Payload:** the [auction object](#auction-object), with `auctionStatus: 'inProgress'` and `bidderRequests` filled in.

```javascript
{
  auctionId: '1d8c...', timestamp: 1763300000000, auctionEnd: undefined, auctionStatus: 'inProgress',
  adUnits: [ /* ... */ ], adUnitCodes: ['div-top'], labels: undefined,
  bidderRequests: [ /* one per bidder */ ], noBids: [], bidsReceived: [], bidsRejected: [],
  winningBids: [], timeout: 1000, metrics: { /* ... */ }, seatNonBids: [], timedOutRequests: []
}
```

### bidRequested

**When:** a bidder is about to be called: once per bidder per auction, or once per bidder per Prebid Server instance for server-side bidders. A bidder configured for both client and server is reported twice.

**Payload:** the [bidder request](#bidder-request-object). For server-side bidders it is a copy with one more field, `tid`, which is set to the `auctionId`.

```javascript
{
  bidderCode: 'exampleBidder', bidderRequestId: '2b7f...', auctionId: '1d8c...', pageViewId: '5e2a...',
  bids: [{ bidder: 'exampleBidder', params: { placementId: 1 }, bidId: '3f9a...', adUnitCode: 'div-top', /* ... */ }],
  ortb2: { site: { page: 'https://example.com/' } }, auctionStart: 1763300000000, timeout: 1000,
  src: 'client', refererInfo: { /* ... */ }, start: 1763300000012
}
```

### beforeBidderHttp

**When:** just before a client-side bid adapter sends an HTTP request: once for each request the adapter builds. Handlers run before the request is sent, and some modules change the request here.

**Payload:** two arguments (type `[BidderRequest, AdapterRequest]`).

1. The [bidder request](#bidder-request-object).
2. The HTTP request the adapter built:

{: .table .table-bordered .table-striped }
| Field | Type | Always present | Description |
| --- | --- | --- | --- |
| `url` | string | yes | The endpoint. |
| `data` | any | yes | The request body (POST) or the query parameters (GET). |
| `method` | string | no | `'GET'` or `'POST'`. |
| `options` | object | no | Request options, such as `endpointCompression` and `withCredentials`. |

```javascript
pbjs.onEvent('beforeBidderHttp', function (bidderRequest, request) {
  console.log(bidderRequest.bidderCode, request.method, request.url);
});
```

### bidderError

**When:** a bid adapter's HTTP request ended in something other than a 2xx or 304 response, including network errors and timeouts. For Prebid Server, it is emitted once for each bidder in the failed request.

**Payload:** (type `BidderError`)

{: .table .table-bordered .table-striped }
| Field | Type | Description |
| --- | --- | --- |
| `error` | object | An object shaped like an `XMLHttpRequest`: `status` (0 for network errors), `statusText`, `responseText`, `responseURL`, `getResponseHeader()`, and `timedOut` (true if the request was aborted by the timeout). For network errors, `reason` holds the exception. |
| `bidderRequest` | object | The [bidder request](#bidder-request-object). |

```javascript
{ error: { status: 500, statusText: 'Internal Server Error', responseText: '', timedOut: false }, bidderRequest: { bidderCode: 'exampleBidder', /* ... */ } }
```

### bidAdjustment

**When:** once for each bid that passed validation, before it is added to the auction. Prebid.js applies `bidCpmAdjustment` and computes `desirability` and `priority` in a handler of its own, which runs before the page's handlers; page handlers can change the bid further.

**Payload:** the [bid](#bid-object) (type `Partial<Bid>`). Currency conversion has already happened, but price buckets and targeting have not been set yet. Bids rejected by validation, price floors, currency conversion or DSA checks never get this event.

### bidAccepted

**When:** after `bidAdjustment`, once the bid has been prepared for the auction: before targeting is computed and, for video and audio bids, before the VAST is cached. Removed in 11.0 and restored in 11.7.

**Payload:** the [bid](#bid-object) (type `Partial<Bid>`), with price buckets (`pbLg` to `pbCg`) set. A video or audio bid whose caching fails gets `bidAccepted` but no `bidResponse` and no `bidRejected`.

### bidRejected

**When:** a bid was rejected before being added to the auction.

**Payload:** the [bid](#bid-object) (type `Partial<Bid>`) with `rejectionReason`, one of:

{: .table .table-bordered .table-striped }
| `rejectionReason` | Rejected by |
| --- | --- |
| `'Bid has missing or invalid properties'` | core validation, including `auctionOptions.rejectUnknownMediaTypes` and `rejectInvalidMediaTypes` |
| `'Invalid request ID'` | core: the bid's `requestId` doesn't match any of the bidder's bid requests (`adUnitCode` is `null`) |
| `'Bidder code is not allowed by allowedAlternateBidderCodes / allowUnknownBidderCodes'` | alternate bidder code checks, or the `addBidResponse` activity |
| `'Bid does not meet price floor'` | the Price Floors module |
| `'Unable to convert currency'` | the Currency module |
| `'Bid does not provide required DSA transparency info'`, `'Bid indicates inappropriate DSA rendering method'` | the DSA control module |
| `'Bid price exceeds maximum value'` | core: the price is above the maximum allowed |

The reasons are the values of `REJECTION_REASON` in `src/constants.ts`. Rejected bids have timing fields, `cpm` and `adUnitCode` set, but no price buckets or targeting.

```javascript
{ bidder: 'exampleBidder', adUnitCode: 'div-top', cpm: 0.12, currency: 'USD', rejectionReason: 'Bid does not meet price floor', /* ... */ }
```

### bidResponse

**When:** a bid was added to the auction, after `bidAccepted` and, for video and audio bids, after the VAST was cached.

**Payload:** the [bid](#bid-object) (type `Bid`), with `adserverTargeting` set.

```javascript
{
  bidder: 'exampleBidder', bidderCode: 'exampleBidder', adId: '6a2c...', requestId: '3f9a...',
  auctionId: '1d8c...', adUnitCode: 'div-top', mediaType: 'banner', cpm: 1.25, currency: 'USD',
  width: 300, height: 250, creativeId: 'cr-1', netRevenue: true, ttl: 300,
  meta: { advertiserDomains: ['advertiser.example'] }, ad: '<div>...</div>',
  timeToRespond: 182, pbMg: '1.20', adserverTargeting: { hb_bidder: 'exampleBidder', hb_pb: '1.20' /* ... */ }
}
```

### bidderDone

**When:** a bidder's responses have come back and been passed to the auction: once per bidder (once per bidder per Prebid Server instance). It fires before the bidder's `noBid` events. Bids that wait on asynchronous processing, such as currency rates or video caching, can produce their `bidResponse` after it. For Prebid Server bidders it is only fired when the response is valid: an HTTP failure produces `bidderError` instead, and a response that isn't valid JSON produces neither.

**Payload:** the [bidder request](#bidder-request-object).

### noBid

**When:** after a bidder has finished, once for each of its bid requests (one per ad unit) that got no bid. A bidder that times out gets its `noBid` events when its response finally arrives or fails, which can be after `auctionEnd`.

**Payload:** the [bid request](#bid-request-object) (type `BidRequest`).

```javascript
{ bidder: 'exampleBidder', params: { placementId: 1 }, adUnitCode: 'div-top', bidId: '3f9a...', bidderRequestId: '2b7f...', auctionId: '1d8c...', /* ... */ }
```

### auctionTimeout

**When:** the auction's timeout expired before every bidder finished. It is followed by `bidTimeout` and then `auctionEnd`.

**Payload:** the [auction object](#auction-object), as it is when the timeout fires: `auctionEnd` is `undefined` and `timedOutRequests` is empty.

### bidTimeout

**When:** right after `auctionTimeout`, if any bidder hadn't responded. Not fired if every bidder responded in time.

**Payload:** an array of the [bid requests](#bid-request-object) (type `BidRequest[]`) of the bidders that didn't respond: every bid request of those bidders. The same array is in `auctionEnd`'s `timedOutRequests`.

```javascript
[{ bidder: 'slowBidder', adUnitCode: 'div-top', bidId: '7c1d...', auctionId: '1d8c...', timeout: 1000, /* ... */ }]
```

### auctionEnd

**When:** the auction has ended: every bidder has finished, or the timeout expired. Fired before the `bidsBackHandler` runs.

**Payload:** the [auction object](#auction-object), with `auctionStatus: 'completed'`, `auctionEnd` set and, since 11.48, `timedOutRequests`.

### setTargeting

**When:** Prebid.js set ad server targeting: after [`setTargetingForGPTAsync`](/dev-docs/publisher-api-reference/setTargetingForGPTAsync.html), `setTargetingForAst`, or when the GAM video module builds a video ad tag URL.

**Payload:** targeting key-values by ad unit code (type `ByAdUnit<TargetingMap<string | string[]>>`). From `setTargetingForAst`, it is the targeting for every ad unit.

```javascript
{ 'div-top': { hb_bidder: 'exampleBidder', hb_adid: '6a2c...', hb_pb: '1.20', hb_size: '300x250', hb_format: 'banner' } }
```

### bidWon

**When:** a bid was chosen to render: when `pbjs.renderAd` is called for it (or the creative asks Prebid.js for it), whether or not it then renders successfully. It fires once per bid. `markWinningBidAsUsed` with `events: true` and `getBidResponseByAdId` with `markAsUsed: true` also fire it, and so does the [instream tracking](#instream-tracking-module) module. Win trackers are fired just before.

**Payload:** the [bid](#bid-object). `onEvent('bidWon', handler, adUnitCode)` registers a handler for one ad unit only.

```javascript
{ bidder: 'exampleBidder', adId: '6a2c...', adUnitCode: 'div-top', cpm: 1.25, currency: 'USD', status: 'targetingSet', /* ... */ }
```

### staleRender

**When:** a bid that has already been rendered is rendered again. It is still rendered, unless `auctionOptions.suppressStaleRender` is set.

**Payload:** the [bid](#bid-object), with `status: 'rendered'`.

### expiredRender

**When:** a bid is rendered after its TTL has expired. It is still rendered, unless `auctionOptions.suppressExpiredRender` is set.

**Payload:** the [bid](#bid-object).

### adRenderSucceeded

**When:** the render function finished without an error. This doesn't mean the creative's own tracking has fired. For bids rendered in a cross-origin iframe, it fires when the creative reports success. For bids with a renderer (such as outstream video), it fires once the renderer has loaded and run (since 11.48).

**Payload:** (type `AdRenderSucceededData`)

{: .table .table-bordered .table-striped }
| Field | Type | Description |
| --- | --- | --- |
| `doc` | Document or null | The document the ad was rendered into; `null` when it isn't accessible, for example in a cross-origin iframe. |
| `bid` | object | The [bid](#bid-object). |
| `adId` | string | The bid's `adId`. |

### adRenderFailed

**When:** a bid could not be rendered.

**Payload:** (type `AdRenderFailedData`)

{: .table .table-bordered .table-striped }
| Field | Type | Always present | Description |
| --- | --- | --- | --- |
| `reason` | string | yes | One of the values below. |
| `message` | string | yes | A description of the failure. |
| `bid` | object | no | The [bid](#bid-object), if it was found. |
| `adId` | string | no | The `adId` that was asked for. |

{: .table .table-bordered .table-striped }
| `reason` | Meaning |
| --- | --- |
| `'preventWritingOnMainDocument'` | `renderAd` was asked to write into the page's own document, or to render a video bid without a renderer. |
| `'noAd'` | The bid has neither `ad` nor `adUrl`. |
| `'exception'` | Rendering threw an error, or (since 11.48) a renderer's script failed to load or its `render` threw. |
| `'cannotFindAd'` | No bid has the `adId` that was asked for. |
| `'missingDocOrAdid'` | `renderAd` was called without a document or an `adId`. |

```javascript
{ reason: 'cannotFindAd', message: "Cannot find ad '6a2c...'", adId: '6a2c...' }
```

### browserIntervention

**When:** the browser reported an intervention on a creative rendered by Prebid.js, such as unloading a heavy ad. Prebid.js's display renderer reports it, so it's only available for creatives rendered by that renderer (through `pbjs.renderAd` or the dynamic creative). Since 10.11.

**Payload:** (type `BrowserInterventionData`)

{: .table .table-bordered .table-striped }
| Field | Type | Description |
| --- | --- | --- |
| `bid` | object | The [bid](#bid-object). |
| `adId` | string | The bid's `adId`. |
| `intervention` | any | The report from the browser: Prebid.js's display renderer listens for `intervention` reports with a `ReportingObserver` and passes them on. The type is `any` in the code. |

### bidClick

**When:** a click on a creative rendered by Prebid.js was observed: a click on a link in a banner creative rendered by the display renderer (`method: 'creativeClick'`), or a click reported by a native creative (`method: 'nativeClick'`). It fires at most once per bid (native clicks can be reported every time with `bidClickTracking.dedupeNativeClicks: false`). Banner clicks are ignored until the user has interacted with the page. Experimental, since 11.50.

**Requires:** `bidClickTracking: { enabled: true }` in `setConfig`. Prebid.js core emits this event; the `bidClickTracking` module is only needed for `bidClickInferred`.

**Payload:**

{: .table .table-bordered .table-striped }
| Field | Type | Always present | Description |
| --- | --- | --- | --- |
| `bid` | object | yes | The [bid](#bid-object). |
| `adId` | string | yes | The bid's `adId`. |
| `adUnitCode` | string | yes | The ad unit's code. |
| `bidder` | string | yes | The bidder. |
| `method` | string | yes | `'creativeClick'` or `'nativeClick'`. |
| `assetId` | number or string | no | For native clicks, the ID of the clicked asset, if the creative reports it. |

```javascript
{ bid: { /* ... */ }, adId: '6a2c...', adUnitCode: 'div-top', bidder: 'exampleBidder', method: 'creativeClick' }
```

### auctionDebug

**When:** Prebid.js logged a warning or an error (`logWarn` or `logError`), whether or not debug mode is on. There can be many. Analytics adapters don't receive it unless they list it in `includeEvents`.

**Payload:** (type `DebugEvent`)

{: .table .table-bordered .table-striped }
| Field | Type | Description |
| --- | --- | --- |
| `type` | string | `'WARNING'` or `'ERROR'`. |
| `arguments` | array | The arguments that were logged: strings, objects and errors. |
| `bidder` | string or null | The bidder whose adapter was running when the message was logged, or `null`. Since 11.47. |

```javascript
{ type: 'WARNING', arguments: ['Bid from exampleBidder was rejected: Bid does not meet price floor', { /* bid */ }], bidder: null }
```

## Module events

These events are only emitted when the module that emits them is in the Prebid.js build (and, for most, enabled in its configuration).

### Prebid Server adapter

Requires the [Prebid Server adapter](/dev-docs/modules/prebidServer.html) (`prebidServerBidAdapter`) and an `s2sConfig`. Server-side bidders also produce the core events (`bidRequested`, `bidResponse`, `bidderDone`, `noBid` and so on).

#### beforePBSHttp

**When:** just before a request is sent to Prebid Server. Handlers can change the request: the fields are read again after the event. Since 9.37.

**Payload:** (type `PbsRequestData`)

{: .table .table-bordered .table-striped }
| Field | Type | Description |
| --- | --- | --- |
| `endpointUrl` | string | The Prebid Server endpoint. |
| `requestJson` | string | The OpenRTB request, as JSON. |
| `customHeaders` | object | Extra HTTP headers, from `s2sConfig.customHeaders`. |

```javascript
{ endpointUrl: 'https://pbs.example.com/openrtb2/auction', requestJson: '{"id":"...","imp":[...]}', customHeaders: {} }
```

#### pbsAnalytics

**When:** a valid Prebid Server response contains [seat non-bids](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#seat-non-bid) or [analytics tags](/prebid-server/developers/module-atags.html). Fired after `bidderDone` for the request's bidders. Seat non-bids are only returned when `s2sConfig.extPrebid.returnallbidstatus` is true; they are also added to the auction's `seatNonBids`. Since 9.13; it replaced `seatNonBid`.

**Payload:** (type `PbsAnalytics`)

{: .table .table-bordered .table-striped }
| Field | Type | Description |
| --- | --- | --- |
| `seatnonbid` | array or undefined | The response's `ext.seatnonbid`. |
| `atag` | any | The response's `ext.prebid.analytics.tags`. |
| `auctionId` | string | The auction's ID. |
| `requestedBidders` | `string[]` | The bidders in the request. |
| `response` | object | The whole Prebid Server response. |
| `adapterMetrics` | object | Performance metrics for the request. |

```javascript
{ seatnonbid: [{ seat: 'exampleBidder', nonbid: [{ impid: 'div-top', statuscode: 301 }] }], atag: undefined, auctionId: '1d8c...', requestedBidders: ['exampleBidder'], response: { /* ... */ } }
```

### TCF control module

#### tcf2Enforcement

**Requires:** the [TCF control module](/dev-docs/modules/tcfControl.html) (`tcfControl`).

**When:** after every `auctionEnd`. It lists what the module blocked since the previous `tcf2Enforcement` event, then clears the lists.

**Payload:** (untyped; fields from `modules/tcfControl.ts`) each field is an array of module names (bidder codes, analytics provider names, user ID and RTD module names), with no duplicates.

{: .table .table-bordered .table-striped }
| Field | Type | Description |
| --- | --- | --- |
| `storageBlocked` | `string[]` | Modules denied device access, user syncs or ID enrichment (purpose 1). |
| `biddersBlocked` | `string[]` | Bidders denied bid requests (purpose 2). |
| `analyticsBlocked` | `string[]` | Analytics adapters denied (purpose 7). |
| `ufpdBlocked` | `string[]` | Modules denied user first party data (purpose 4). |
| `eidsBlocked` | `string[]` | Modules denied user IDs. |
| `geoBlocked` | `string[]` | Modules denied precise geolocation (special feature 1). |

```javascript
{ storageBlocked: ['exampleIdSystem'], biddersBlocked: ['exampleBidder'], analyticsBlocked: [], ufpdBlocked: [], eidsBlocked: ['exampleBidder'], geoBlocked: [] }
```

### Bid viewability modules

#### bidViewable

**Requires:** [`bidViewability`](/dev-docs/modules/bidViewable.html) (uses GPT's `impressionViewable` event) or [`bidViewabilityIO`](/dev-docs/modules/bidViewableIO.html) (uses an `IntersectionObserver`), enabled in its configuration.

**When:** a rendered bid became viewable. Prebid.js fires the bid's viewable trackers and calls the bidder's `onBidViewable` first, and triggers billing if the bid has `deferBilling`.

**Payload:** the [bid](#bid-object). (The event is not in the `Events` type; the payload comes from `libraries/bidViewabilityPixels`.)

### Bid click tracking module

#### bidClickInferred

**Requires:** the `bidClickTracking` module, with `bidClickTracking: { enabled: true, desktopFallback: true }`. Experimental, since 11.50.

**When:** on a desktop device (fine pointer with hover), focus moved from the page into a banner creative's iframe, other than with the keyboard, after the user has interacted with the page. It is a best-effort guess for creatives whose clicks Prebid.js can't observe. It doesn't fire if a `bidClick` was already reported for the bid.

**Payload:** the same fields as [`bidClick`](#bidclick), with `method: 'iframeFocus'` and no `assetId`.

### Instream tracking module

The [instream tracking module](/dev-docs/modules/instreamTracking.html) (`instreamTracking`) emits [`bidWon`](#bidwon) for instream video bids, when it sees the bid's cached VAST being loaded by the page. Its payload is the [bid](#bid-object).

### RTD and other vendor modules

#### billableEvent

**Requires:** one of the modules that emit it, mostly Real-Time Data modules.

**When:** the module recorded something it bills for: an impression, a page view, an auction, an in-view creative, and so on.

**Payload:** untyped; each module sets its own fields. Common ones:

{: .table .table-bordered .table-striped }
| Field | Type | Always present | Description |
| --- | --- | --- | --- |
| `vendor` | string | yes | The module that emitted it. |
| `type` | string | yes | What was billed, for example `'impression'`, `'pageview'` or `'auction'`. |
| `billingId` | string | most modules | A unique ID for this event. |
| `auctionId`, `transactionId`, `bidId` | string | some modules | The auction, ad unit and bid it relates to. |

```javascript
{ vendor: 'exampleRtd', type: 'impression', billingId: '0b5e...', auctionId: '1d8c...', transactionId: 'c4f0...' }
```

#### browsiInit and browsiData

Emitted only by `browsiRtdProvider`, and read by its own analytics adapter. Their payloads are specific to that module (`moduleName`, page view ID, site and publisher keys, and the module's data) and are untyped.

### Video module events

The [video module](/prebid-video/video-module.html) (`videoModule`) adds player, ad and media events, such as `videoSetupComplete`, `videoAdImpression`, `videoBidImpression` and `videoAuctionAdLoadAbort`: 42 in all. Each event's name is `video` plus the capitalized internal name, and its payload always has `divId` (the player's div) and `type`. See [the video module's event list](/prebid-video/video-module.html#events) for every event and its fields. These events are not in `EVENTS`, so analytics adapters only receive them if they listen with `onEvent`. `videoBidImpression` and `videoBidError` mark the bid as used without firing `bidWon`.

## Removed events

{: .table .table-bordered .table-striped }
| Event | Removed in | Use instead |
| --- | --- | --- |
| `addAdUnits` | 11.0 | `auctionInit` or `beforeRequestBids` |
| `seatNonBid` | 11.0 | `pbsAnalytics` |
| `paapiRunAuction`, `paapiBid`, `paapiNoBid`, `paapiError` | 11.0, with PAAPI support | none |
| `bidAccepted` | 11.0, restored in 11.7 | |

## Related pages

* [pbjs.onEvent](/dev-docs/publisher-api-reference/onEvent.html), [pbjs.offEvent](/dev-docs/publisher-api-reference/offEvent.html) and [pbjs.getEvents](/dev-docs/publisher-api-reference/getEvents.html)
* [How to Add an Analytics Adapter](/dev-docs/integrate-with-the-prebid-analytics-api.html)
* [Generic analytics adapter](/dev-docs/modules/genericAnalyticsAdapter.html)
* [Activity Controls](/dev-docs/activity-controls.html)
