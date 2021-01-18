---
layout: api_prebidjs
title: pbjs.aliasBidder(adapterName, aliasedName)
description: 
---


To define an alias for a bidder adapter, call this method at runtime:

{% highlight js %}

pbjs.aliasBidder('appnexus', 'newAlias');

{% endhighlight %}

Defining an alias can help avoid user confusion since it's possible to send parameters to the same adapter but in different contexts (e.g, The publisher uses `"appnexus"` for demand and also uses `"newAlias"` which is an SSP partner that uses the `"appnexus"` adapter to serve their own unique demand).

It's not technically necessary to define an alias, since each copy of an adapter with the same name gets a different ID in the internal bidder registry so Prebid.js can still tell them apart.

If you define an alias and are using `pbjs.sendAllBids`, you must also set up additional line items in the ad server with keyword targeting that matches the name of the alias.  For example:

+ `hb_pb_newalias`
+ `hb_adid_newalias`
+ `hb_size_newalias`
+ `hb_deal_newalias`

{: .alert.alert-info :}
Creating an alias for a Prebid Server adapter is done differently. See 'extPrebid'
config in the [`s2sConfig`](#setConfig-Server-to-Server) object.

<hr class="full-rule" />