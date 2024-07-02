---
layout: api_prebidjs
title: pbjs.aliasBidder(adapterName, aliasedName, options)
description:
sidebarType: 1
---

To define an alias for a bidder adapter, call this method at runtime:

```javascript

pbjs.aliasBidder('appnexus', 'newAlias', optionsObject );

```

Defining an alias can help avoid user confusion since it's possible to send parameters to the same adapter but in different contexts (e.g, The publisher uses `"appnexus"` for demand and also uses `"newAlias"` which is an SSP partner that uses the `"appnexus"` adapter to serve their own unique demand).

If you define an alias and are using `pbjs.sendAllBids`, you must also set up additional line items in the ad server with keyword targeting that matches the name of the alias.  For example:

+ `hb_pb_newalias`
+ `hb_adid_newalias`
+ `hb_size_newalias`
+ `hb_deal_newalias`

The options object supports these parameters:

{: .table .table-bordered .table-striped }
| Option Parameter    | Type    | Description             |
|------------|---------|---------------------------------|
| gvlid | integer | IAB Global Vendor List ID for this alias for use with the [TCF control module](/dev-docs/modules/tcfControl.html). |

{: .alert.alert-info :}
Creating an alias for a Prebid Server adapter is done differently. See 'extPrebid'
config in the [`s2sConfig`](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Server-to-Server) object.

For example:

```javascript
pbjs.aliasBidder('bidderA', 'aliasOfBidderA', {gvlid: 9999});
```
