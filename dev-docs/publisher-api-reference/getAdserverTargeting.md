---
layout: api_prebidjs
title: pbjs.getAdserverTargeting()
description: getAdserverTargeting API
sidebarType: 1
---

<a name="module_pbjs.getAdserverTargeting"></a>


Returns all ad server targeting for all ad units. Note that some bidder's response may not have been received if you call this function too quickly after the requests are sent.

The targeting keys can be configured in [ad server targeting](/dev-docs/publisher-api-reference/bidderSettings.html).

When [deals are enabled]({{site.baseurl}}/adops/deals.html), the object returned by this method may include a field `hb_deal_BIDDERCODE`, where `BIDDERCODE` is replaced by the name of the bidder, e.g., AppNexus, Rubicon, etc.

**Kind**: static method of `pbjs`

**Returns**: `object` - Map of adUnitCodes and targeting values []

**Returned Object Example:**

```javascript
{
  "/9968336/header-bid-tag-0": {
    "hb_bidder": "rubicon",
    "hb_adid": "13f44b0d3c",
    "hb_pb": "1.50"
  },
  "/9968336/header-bid-tag-1": {
    "hb_bidder": "openx",
    "hb_adid": "147ac541a",
    "hb_pb": "1.00"
  },
  "/9968336/header-bid-tag-2": {
    "hb_bidder": "appnexus",
    "hb_adid": "147ac541a",
    "hb_pb": "2.50",
    "hb_deal_appnexus": "ABC_123"
  }
}
```
