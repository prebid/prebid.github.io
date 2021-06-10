---
layout: api_prebidjs
title: pbjs.getEvents()
description: 
---


The methods `onEvent` and `offEvent` are provided for you to register
a callback to handle a Prebid.js event.

The `getEvents` method returns a copy of all emitted events.

The optional `id` parameter provides more finely-grained event
callback registration.  This makes it possible to register callback
events for a specific item in the event context.

For example, `bidWon` events will accept an `id` for ad unit code.
`bidWon` callbacks registered with an ad unit code id will be called
when a bid for that ad unit code wins the auction. Without an `id`
this method registers the callback for every `bidWon` event.

{: .alert.alert-info :}
Currently, `bidWon` is the only event that accepts the `id` parameter.

The available events are:

{: .table .table-bordered .table-striped }
| Event         | Description                             | Callback Arguments |
|---------------+-----------------------------------------|--------------------|
| auctionInit   | The auction has started                 | Object containing auction details |
| auctionEnd    | The auction has ended                   | Object containing auction details |
| beforeRequestBids | Bids are about to be requested from adapters (added in 3.x) | Array of adunits in the auction |
| bidRequested  | A bid was requested from a specific bidder | Bid request object |
| bidResponse   | A bid response has arrived              | Bid response object |
| bidAdjustment | A bid was adjusted                      | Bid response object |
| bidWon        | A bid has won                           | Bid response object |
| bidTimeout    | A bid timed out                         | Array of objects with timed out bids |
| setTargeting  | Targeting has been set                  | Hash of targeting values |
| requestBids   | Bids have been requested from adapters (i.e. pbjs.requestBids() was called) | None |
| addAdUnits    | Ad units have been added to the auction | None |
| adRenderFailed| Ad rendering failed | Object containing 'reason' and 'message' |
| auctionDebug  | An error was logged to the console | Object containing 'type' and 'arguments' |
| bidderDone    | A bidder has signaled they are done responding | Bid request object |
| tcf2Enforcement | There was a TCF2 enforcement action taken | `{ storageBlocked: ['moduleA', 'moduleB'], biddersBlocked: ['moduleB'], analyticsBlocked: ['moduleC'] }` |

The examples below show how these events can be used.

Events example 1
{% highlight js %}

        /* Log when ad units are added to Prebid */
        pbjs.onEvent('addAdUnits', function() {
          console.log('Ad units were added to Prebid.')
          console.log(pbjs.adUnits);
        });

        /* Log when Prebid wins the ad server auction */
        pbjs.onEvent('bidWon', function(data) {
          console.log(data.bidderCode+ ' won the ad server auction for ad unit ' +data.adUnitCode+ ' at ' +data.cpm+ ' CPM');
        });

{% endhighlight %}

Events example 2: Use the optional 3rd parameter for the `bidWon` event
{% highlight js %}
        /* This handler will be called only for rightAdUnit */
        /* Uses the `pbjs.offEvent` method to remove the handler once it has been called */
        var bidWonHandler = function bidWonHandler() {
            console.log('bidWonHandler: ', arguments);
            pbjs.offEvent('bidWon', bidWonHandler, rightAdUnit);
        };

        var rightAdUnit="/111111/right";
        pbjs.que.push(function () {
            var adUnits = [{
                code: rightAdUnit,
		...
	    },{
		...
	    }];

	    pbjs.addAdUnits(adUnits);
            pbjs.requestBids({
		...
            });

            /* Register a callback for just the rightSlot `bidWon` event */
            /* Note that defining an event that uses the 3rd parameter must come after initiating the auction */
            pbjs.onEvent('bidWon', bidWonHandler, rightAdUnit);

            ...
{% endhighlight %}

Events example 3: Dynamically modify the auction
{% highlight js %}
	var bidderFilter = function bidderFilter(adunits) {
	    // pub-specific logic to optimize bidders
            // e.g. "remove any that haven't bid in the last 4 refreshes"
	};
	pbjs.onEvent('beforeRequestBids', bidderFilter);
{% endhighlight %}

Events example 4: Log errors and render fails to your own endpoint
{% highlight js %}
        pbjs.onEvent('adRenderFailed', function () {
              // pub-specific logic to call their own endpoint
            });
	pbjs.onEvent('auctionDebug', function () {
              // pub-specific logic to call their own endpoint
            });
{% endhighlight %}

<hr class="full-rule" />