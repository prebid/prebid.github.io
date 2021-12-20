---
layout: api_prebidjs
title: pbjs.setBidderConfig(options, mergeFlag: false)
description:
---


This function is similar to [`setConfig`](/dev-docs/publisher-api-reference/setConfig.html), but is designed to support certain bidder-specific scenarios.

Configuration provided through the [`setConfig`](/dev-docs/publisher-api-reference/setConfig.html) function is
globally available to all bidder adapters. This makes sense because
most of these settings are global in nature. However, there are use cases where different bidders require different data, or where certain parameters apply only to a given
bidder. Use `setBidderConfig` when you need to support these cases.

Note if you would like to add to existing config you can pass in `true` for the second argument like `setBidderConfig(options, true)`. If not passed or true this argument defaults to false and `setBidderConfig` functions as above.

The page usage is:

{% highlight js %}
pbjs.setBidderConfig({
   bidders: ['bidderA'],
   config: {
      customArg: "customVal"
   }
});
{% endhighlight %}
or
{% highlight js %}
pbjs.setBidderConfig({
   bidders: ['bidderB'],
   config: {
       ortb2: {
           site: {
               ext: {
                   data: {
                      pageType: "article",
                      category: "tools"
                   }
               }
            },
            user: {
               ext: {
                   data: {
                      registered: true,
                      interests: ["cars"]
                   }
               }
          }
      }
   }
});
{% endhighlight %}

How to interpret these examples:
- When 'bidderA' calls `getConfig('customArg')`, it will receive the object that contains 'customArg'. If any other bidder calls `getConfig('customArg')`, it will receive nothing.
- When 'bidderB' calls `getConfig('ortb2')`, it will receive this override definition rather than whatever else might have been defined globally. If any other bidder calls `getConfig('ortb2')`, it will receive the globally defined objects.

{: .alert.alert-info :}
This function is also used by the `schain` feature. Refer to the [schain](/dev-docs/modules/schain.html) documentation for examples.
