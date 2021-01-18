---
layout: api_prebidjs
title: pbjs.setBidderConfig(options)
description: 
---


This function is similar to [`setConfig`](#module_pbjs.setConfig), but is designed to support certain bidder-specific scenarios.

Configuration provided through the [`setConfig`](#module_pbjs.setConfig) function is
globally available to all bidder adapters. This makes sense because
most of these settings are global in nature. However, there are use cases where different bidders require different data, or where certain parameters apply only to a given
bidder. Use `setBidderConfig` when you need to support these cases.

The page usage is:

{% highlight js %}
pbjs.setBidderConfig({
   bidders: ["bidderA"],  // one or more bidders
   config: {              // the bidder-specific config
      bidderA: {
         customArg: 'value'
      }
   }
});
{% endhighlight %}

When 'bidderA' calls `getConfig('bidderA')`, it will receive the object that contains 'customArg'.
If any other bidder calls `getConfig('bidderA')`, it will receive nothing.

{: .alert.alert-info :}
This function is currently used by the `schain` feature. Refer to the [schain]({{site.baseurl}}/dev-docs/modules/schain.html) documentation for examples.