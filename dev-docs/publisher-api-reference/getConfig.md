---
layout: api_prebidjs
title: pbjs.getConfig([string])
description: 
---


The `getConfig` function is for retrieving the current configuration object or subscribing to configuration updates. When called with no parameters, the entire config object is returned. When called with a string parameter, a single configuration property matching that parameter is returned.

{% highlight js %}
/* Get config object */
config.getConfig()

/* Get debug config */
config.getConfig('debug')
{% endhighlight %}

The `getConfig` function also contains a 'subscribe' ability that adds a callback function to a set of listeners that are invoked whenever `setConfig` is called. The subscribed function will be passed the options object that was used in the `setConfig` call. Individual topics can be subscribed to by passing a string as the first parameter and a callback function as the second.  For example:

{% highlight js %}

/* Subscribe to all configuration changes */
getConfig((config) => console.log('config set:', config));

/* Subscribe to only 'logging' changes */
getConfig('logging', (config) => console.log('logging set:', config));

/* Unsubscribe */
const unsubscribe = getConfig(...);
unsubscribe(); // no longer listening

{% endhighlight %}

<hr class="full-rule" />