---
layout: api_prebidjs
title: pbjs.triggerBilling
description:
sidebarType: 1
---


Allows a publisher the option to manually trigger billing for a winning bid (The winning bid to be billed is passed through the function below as an argument).

{% highlight js %}

pbjs.triggerBilling(winningAdIdToBill);

{% endhighlight %}

{: .alert.alert-warning :}
Note: In order to use `pbjs.triggerBilling`, the following is also required.

- Any bid adapters a publisher integrates with must include the onBidBillable(bid) method which will be invoked by Prebid.js when it deems a bid to be billable (When a bid wins, it is by default also billable. That is, by default, Prebid.js will invoke onBidWon and onBidBillable one after the other).
- A publisher must flag all adUnits as being separately billable via the deferBilling key: `pbjs.addAdUnits({deferBilling: true, ...})` (Setting deferBilling to true will trigger onBidWon but not onBidBillable).
- When appropriate (e.g. an interstitial is displayed), the publisher may call `pbjs.triggerBilling(winningAdIdToBill)`, which would then trigger onBidBillable.


<hr class="full-rule" />
