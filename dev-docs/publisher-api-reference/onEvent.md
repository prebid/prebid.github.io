---
layout: api_prebidjs
title: pbjs.onEvent(eventType, handler, id)
description: onEvent API
sidebarType: 1
---

This routine allows the page (or module) to create a callback function that's invoked when heading bidding events are fired.

**Kind**: static method of `pbjs`

**Args**: eventType, callbackFunction, id

**Returns**: none

See the [getEvents](/dev-docs/publisher-api-reference/getEvents.html) function for the full list of eventTypes supported.

{: .alert.alert-info :}
The `adRenderSucceeded` event indicates that the render function did not generate an error, it does not guarantee that tracking for this event has occurred yet.

The optional `id` parameter provides more finely-grained event
callback registration.  This makes it possible to register callback
events for a specific item in the event context.

For example, `bidWon` events will accept an `id` for ad unit code.
`bidWon` callbacks registered with an ad unit code id will be called
when a bid for that ad unit code wins the auction. Without an `id`
this method registers the callback for every `bidWon` event.

{: .alert.alert-info :}
Currently, `bidWon` is the only event that accepts the `id` parameter.

Example 1: Basic event logging

```javascript
/* Log when ad units are added to Prebid */
pbjs.onEvent('addAdUnits', function() {
  console.log('Ad units were added to Prebid.')
  console.log(pbjs.adUnits);
});

/* Log when Prebid wins the ad server auction */
pbjs.onEvent('bidWon', function(data) {
  console.log(data.bidderCode+ ' won the ad server auction for ad unit ' +data.adUnitCode+ ' at ' +data.cpm+ ' CPM');
});
```

Example 2: Dynamically modify the auction

```javascript
var bidderFilter = function bidderFilter(adunits) {
    // pub-specific logic to optimize bidders
    // e.g. "remove any that haven't bid in the last 4 refreshes"
};
pbjs.onEvent('beforeRequestBids', bidderFilter);
```

Example 3: Log errors and render fails to your own endpoint

```javascript
pbjs.onEvent('adRenderFailed', function () {
      // pub-specific logic to call their own endpoint
    });
pbjs.onEvent('auctionDebug', function () {
      // pub-specific logic to call their own endpoint
    });
```

## See Also

* [getEvents](/dev-docs/publisher-api-reference/getEvents.html)
* [offEvent](/dev-docs/publisher-api-reference/offEvent.html)
