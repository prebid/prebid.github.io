---
layout: api_prebidjs
title: pbjs.triggerBilling
description:
sidebarType: 1
---


Allows a publisher the option to manually trigger billing for a winning bid.

{% highlight js %}

pbjs.triggerBilling({adId});

{% endhighlight %}

{: .alert.alert-warning :}
Note: In order to use `pbjs.triggerBilling`, the following is also required.

- Any bid adapters a publisher integrates with must include the onBidBillable(bid) method which will be invoked by core when it deems a bid to be billable (When a bid wins, it is by default also billable. That is, by default, core will invoke onBidWon and onBidBillable one after the other).
- A publisher must flag all adUnits as being separately billable via deferBilling key: `pbjs.addAdUnits({deferBilling: true, ...})` (Setting deferBilling to true will trigger onBidWon but not onBidBillable).
- When appropriate (e.g. an interstitial is displayed), the publisher may call `pbjs.triggerBilling({adId})`, which would then trigger onBidBillable.


<hr class="full-rule" />
