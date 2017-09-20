---
layout: bidder
title: Prebid Server
description: Prebid Server S2S Adaptor
top_nav_section: dev_docs
nav_section: reference
biddercode: prebidServer
biddercode_longer_than_12: true
hide: true
---

### Sign up

Sign up for account on [prebid.adnxs.com](https://prebid.adnxs.com)

### bid params

Bid params are sourced from the adapter configurations set for client side. These do not need to change for Prebid Server. 

### Configuration
To enable prebid server, set the following configuration. 

{% highlight js %}
    pbjs.setS2SConfig({
        accountId : '1',                            //string:required: account ID obtained in sign up process
        enabled : true,                             //boolean:required: enables s2s - default false
        bidders : ['appnexus','audienceNetwork'],   //array[string]:required: of bidder codes to enable S2S.
        timeout : 1000,                             //number:optional timeout in ms for bidders called via the S2S endpoint.
        cookieSet : true                            //boolean:optional: If 'false' (not recommended), opt out of link rewriting to improve cookie syncing.
    });
{% endhighlight %}