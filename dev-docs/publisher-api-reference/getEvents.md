---
layout: api_prebidjs
title: pbjs.getEvents()
description: 
---

The `getEvents` method returns a copy of all emitted events since the page loaded.

**Kind**: static method of `pbjs`

**Args**: none

**Returns**: `array of objects`

**Returned Object Params**:
- eventType (see table below)
- args (varies for each event type)
- id (only for bidWon, set to adUnit.code)
- elapsedTime

The available events are:

{: .table .table-bordered .table-striped }
| Event         | Description                             | Callback Arguments |
|---------------+-----------------------------------------|--------------------|
| auctionInit   | The auction has started                 | Object containing auction details |
| auctionEnd    | The auction has ended                   | Object containing auction details |
| beforeRequestBids | Bids are about to be requested from adapters (added in 3.x) | Array of adunits in the auction |
| beforeBidderHttp | bidder network request is about be triggered | Array of Bid request objects |
| bidRequested  | A bid was requested from a specific bidder | Bid request object |
| bidResponse   | A bid response has arrived              | Bid response object |
| bidAdjustment | A bid was adjusted                      | Bid response object |
| bidWon        | A bid has won                           | Bid response object |
| bidTimeout    | A bid timed out                         | Array of objects with timed out bids |
| setTargeting  | Targeting has been set                  | Hash of targeting values |
| requestBids   | Bids have been requested from adapters (i.e. pbjs.requestBids() was called) | None |
| addAdUnits    | Ad units have been added to the auction | None |
| adRenderFailed| Ad rendering failed | Object containing 'reason' and 'message' |
| adRenderSucceeded | Ad rendering succeeded| Object containing 'doc', 'bid', and 'adId'. 'doc' is the DOM root containing the ad and may be `null` if it was rendered in a cross-origin iframe.|
| auctionDebug  | An error was logged to the console | Object containing 'type' and 'arguments' |
| bidderDone    | A bidder has signaled they are done responding | Bid request object |
| bidderError    | A bidder responded with an error | Object with the XMLHttpRequest error and the bid request object `{ error, bidderRequest }` |
| tcf2Enforcement | There was a TCF2 enforcement action taken | `{ storageBlocked: ['moduleA', 'moduleB'], biddersBlocked: ['moduleB'], analyticsBlocked: ['moduleC'] }` |

The example below shows how these events can be used.

{% highlight js %}
      pbjs.getEvents().forEach(event => {
        console.log("event: "+event.eventType)
      });
{% endhighlight %}


## See Also
- [onEvent](/dev-docs/publisher-api-reference/onEvent.html)
- [offEvent](/dev-docs/publisher-api-reference/offEvent.html)
