---
layout: api_prebidjs
title: pbjs.mergeBidderConfig(options)
description:
sidebarType: 1
---

This is the same as [`setBidderConfig(options, true)`](/dev-docs/publisher-api-reference/setBidderConfig.html) -- it merges the supplied bidder config into the config structure rather than replacing it.

The page usage is:

{% highlight js %}
pbjs.mergeBidderConfig({
   bidders: ['bidderA'],
   config: {
      customArg: "customVal"
   }
});
{% endhighlight %}

Intrepration: When 'bidderA' calls `getConfig('customArg')`, it will receive the object that contains 'customArg'. If any other bidder calls `getConfig('customArg')`, it will receive nothing.
