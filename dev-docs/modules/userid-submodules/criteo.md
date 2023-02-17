---
layout: userid
title: Criteo ID for Exchanges
description: Criteo ID for Exchanges User ID sub-module
useridmodule: criteoIdSystem
---


Criteo is the leading advertising platform for the Open Internet. The Criteo ID for Exchanges module enables publishers to access Criteo’s unique demand - more than 20.000 advertisers & brands -  to monetize their exchange inventory with an optimal take rate across all browsing environments.
Note that direct access to that demand is also available through [Criteo Direct Bidder](https://www.criteo.com/products/criteo-direct-bidder/), in which case this module is unnecessary.

The Criteo privacy policy is at [https://www.criteo.com/privacy/](https://www.criteo.com/privacy/).

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=criteoIdSystem

## Criteo ID Configuration

The Criteo ID module does not require any configuration parameters. It should work as-is provided that bidders use it in their adapters.
When calling Criteo RTB, partners should forward this id in the field `user.ext.prebid_criteoid`.

{: .alert.alert-info :}
NOTE: For optimal performance, the Criteo Id module should be called at every opportunity. It embeds its own optimal caching mechanism. It's best not to use `params.storage` with this module as it may only lower the performances. If you are using multiple id systems, however, you may use it for the other id systems that supports it.

## Criteo ID Example

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "criteo",
        }]
    }
});
{% endhighlight %}
