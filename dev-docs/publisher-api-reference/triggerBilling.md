---
layout: api_prebidjs
title: pbjs.triggerBilling
description:
sidebarType: 1
---


Allows a publisher the option to manually trigger billing for a winning bid or bids when ready to do so.

{: .alert.alert-warning :}
Note: In order to use `pbjs.triggerBilling`, see the following bullet points below:

- Any bid adapters a publisher integrates with must include the onBidBillable(bid) method which will be invoked by Prebid.js when it deems a bid to be billable (When a bid wins, it is by default also billable. That is, by default, Prebid.js will invoke onBidWon and onBidBillable one after the other).
- A publisher must flag all adUnits as being separately billable via the deferBilling key: `pbjs.addAdUnits({deferBilling: true, ...})` (Setting deferBilling to true will trigger onBidWon but not onBidBillable).
- When appropriate (e.g. an interstitial is displayed), the publisher may call `pbjs.triggerBilling(winningBidObjectToBill)`, which would then trigger onBidBillable.

See below for an example of how triggerBilling can be used:

{: .alert.alert-warning :}
Note: The logic to decide when to invoke `pbjs.triggerBilling` is open-ended. One common use case could be to listen for an "on view" event emitted from your ad server.<br><br>For instance, the example below listens for GPT's "impressionViewable" event to determine if a deferred ad unit has become visible and is therefore ready for billing.  The utilized approach to determine when to invoke `pbjs.triggerBilling` should be customized to your specific needs (For more on GPT's "impressionViewable" event, see: [https://developers.google.com/publisher-tag/reference#googletag.events.impressionviewableevent](https://developers.google.com/publisher-tag/reference#googletag.events.impressionviewableevent)).<br><br>Additionally, the example below takes into account the possibility of multiple deferred ad units being present on a page that could potentially invoke the triggerBilling function (see the "deferredAdUnitIds" variable in the snippet below).  The amount of deferred ad units needed on a page are dependent on your needs and could vary.

{% highlight js %}
...

var adUnits = [
  {
    code: "deferred-ad-element-id-1",
    deferBilling: true, // decide whether an ad unit should be deferred
    ...
  },
  {
    code: "deferred-ad-element-id-2",
    deferBilling: true, // decide whether an ad unit should be deferred
    ...
  }
];

pbjs.que.push(function () { // standard prebid configuration
  pbjs.addAdUnits(adUnits);
  pbjs.requestBids({
    bidsBackHandler: sendAdserverRequest,
    timeout: 1000,
  });
});

function sendAdserverRequest(bids, timedOut, auctionId) {
  let winningBidsWithDeferredAdUnits = []; // bids associated with deferred ad units that win the Prebid auction will be added to this array (there could be one or many winning bids)
  let deferredAdUnitIds = ['deferred-ad-element-id-1', 'deferred-ad-element-id-2']; // enter the ad unit ids you would like to defer billing for (there could be one or many deferred ad unit ids)

  deferredAdUnitIds.forEach(deferredAdUnitId => {
    if (bids[deferredAdUnitId]) {
      // confirm each deferred ad unit came back with the bid responses
      pbjs.onEvent("bidWon", (bid) => {
        if (bid.adUnitCode === deferredAdUnitId) {
          // confirm bid for deferred ad unit has won
          winningBidsWithDeferredAdUnits.push(bid);
        }
      });
    }
  });

  // next, run some custom logic to detect if a publisher is ready to trigger billing (ex: the ad unit became visible).
  // note: the following code block inside of the "impressionViewable" event listener is just one example of how to trigger billing for deferred ad units by utilizing GPT's "impressionViewable" event.
  googletag.pubads().addEventListener("impressionViewable", (event) => {
    const adSlotId = event.slot.getSlotElementId();
    winningBidsWithDeferredAdUnits.find(bid => {
      if (bid.adUnitCode === adSlotId) { // confirm if the ad slot that became viewable was a deferred ad slot
        pbjs.triggerBilling(bid);
      }
    });
  });
}

...

{% endhighlight %}

<hr class="full-rule" />
