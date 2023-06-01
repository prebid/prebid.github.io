---
layout: api_prebidjs
title: pbjs.offEvent(eventType, handler, id)
description: offEvent API
sidebarType: 1
---

Turns off an event callback defined with [onEvent](/dev-docs/publisher-api-reference/onEvent.html)

**Kind**: static method of `pbjs`

**Args**: eventType, callbackFunction, id

**Returns**: none

See the [getEvents](/dev-docs/publisher-api-reference/getEvents.html) function for the full list of eventTypes supported.

Causes PBJS to search through registered event callbacks and remove the
supplied callbackFunction for the specifc eventType.

The optional `id` parameter provides more finely-grained event
callback de-registration.  This makes it possible to de-register callback
events for a specific item in the event context.

Example

```javascript
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
```

## See Also
- [getEvents](/dev-docs/publisher-api-reference/getEvents.html)
- [onEvent](/dev-docs/publisher-api-reference/onEvent.html)
