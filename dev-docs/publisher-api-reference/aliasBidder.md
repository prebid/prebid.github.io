---
layout: api_prebidjs
title: pbjs.aliasBidder(adapterName, aliasedName, options)
description:
sidebarType: 1
---

To define an alias for a bidder adapter, call this method at runtime:

```javascript

pbjs.aliasBidder('bidderA', 'newAlias', optionsObject);

```

Defining an alias can help avoid user confusion since it's possible to send parameters to the same adapter but in different contexts (e.g, The publisher uses `"bidderA"` for demand and also uses `"newAlias"` which is an SSP partner that uses the `"bidderA"` adapter to serve their own unique demand).

If you define an alias and are using `pbjs.sendAllBids`, you must also set up additional line items in the ad server with keyword targeting that matches the name of the alias.  For example:

+ `hb_pb_newalias`
+ `hb_adid_newalias`
+ `hb_size_newalias`
+ `hb_deal_newalias`

The options object supports these parameters:

{: .table .table-bordered .table-striped }
| Option Parameter | Scope | Type | Description |
| :--- | :--- | :--- | :--- |
| gvlid | optional | integer | IAB Global Vendor List ID for this alias for use with the [TCF control module](/dev-docs/modules/tcfControl.html). |
| acpId | optional | integer | Google Additional Consent provider ID for this alias, used by the [TCF control module](/dev-docs/modules/tcfControl.html#additional-consent) when the alias has no GVL ID. (PBJS 11.41+) |
| useBaseGvlid | optional | boolean | Flag determining if the GVL ID of the original adapter should be re-used. Since PBJS 11.41, the original adapter's `acpId` is re-used as well. (PBJS 9.14+) |
| skipPbsAliasing | optional | boolean | If `true`, requests to Prebid Server don't declare the alias in `ext.prebid.aliases`. Only needed when Prebid Server has its own adapter or hard-coded alias with the same name; see [skipPbsAliasing](/dev-docs/bidder-adaptor.html#skippbsaliasing). Has no effect if the original adapter isn't included in the Prebid.js build. Default `false`. |

{: .alert.alert-info :}
Creating an alias for a Prebid Server adapter is done differently. See 'extPrebid'
config in the [`s2sConfig`](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Server-to-Server) object.

For example:

```javascript
pbjs.aliasBidder('bidderA', 'aliasOfBidderA', {gvlid: 9999});
```
