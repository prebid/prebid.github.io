---
layout: api_prebidjs
title: pbjs.triggerBilling
description:
sidebarType: 1
---


Allows a publisher the option to manually trigger billing for a winning bid when ready to do so.

{: .alert.alert-warning :}
Note: In order to use `pbjs.triggerBilling`, see the following bullet points below:

- Any bid adapters a publisher integrates with must include the onBidBillable(bid) method which will be invoked by Prebid.js when it deems a bid to be billable (When a bid wins, it is by default also billable. That is, by default, Prebid.js will invoke onBidWon and onBidBillable one after the other).
- A publisher must flag all adUnits as being separately billable via the deferBilling key: `pbjs.addAdUnits({deferBilling: true, ...})` (Setting deferBilling to true will trigger onBidWon but not onBidBillable).
- When appropriate (e.g. an interstitial is displayed), the publisher may call `pbjs.triggerBilling(winningBidObjectToBill)`, which would then trigger onBidBillable.

See below for an example of how triggerBilling can be used:

{% highlight js %}
...

var adUnits = [
  {
    code: "id-of-ad-to-defer",
    deferBilling: true, // decide which ad unit should be deferred
    ...
  },
];

pbjs.que.push(function () { // standard prebid configuration
  pbjs.addAdUnits(adUnits);
  pbjs.requestBids({
    bidsBackHandler: sendAdserverRequest,
    timeout: 1000,
  });
});

function sendAdserverRequest(bids, timedOut, auctionId) {
  let deferredWinningBid = false;

  if (bids["id-of-ad-to-defer"]) { // confirm deferred ad unit came back with the bid responses
    pbjs.onEvent('bidWon', function(bid) {
      if (bid.adUnitCode === "id-of-ad-to-defer") { // confirm bid for deferred ad unit has won
        deferredWinningBid = bid;
      }
    });
  }

  // run some custom logic to detect if a publisher is ready to trigger billing

  if (isReadyToTriggerBilling) {
    pbjs.triggerBilling(deferredWinningBid); // this will trigger the onBidBillable function inside of a bid adapter (if a bid adapter has configured onBidBillable to be utilized)
  }
}

...

{% endhighlight %}

<hr class="full-rule" />
