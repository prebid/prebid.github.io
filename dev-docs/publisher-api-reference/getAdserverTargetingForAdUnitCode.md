---
layout: api_prebidjs
title: pbjs.getAdserverTargetingForAdUnitCode([adunitCode])
description:
sidebarType: 1
---


This function returns the query string targeting parameters available at this moment for a given ad unit. For full documentation see function [pbjs.getAdserverTargeting()](/dev-docs/publisher-api-reference/getAdserverTargeting.html).

**Kind**: static method of `pbjs`

**Returns**: `object` - returnObj return bids

**Request Params:**

{: .table .table-bordered .table-striped }
| Param | Type | Description |
| --- | --- | --- |
| [adunitCode] | `string` | adUnitCode to get the bid responses for |

**Returned Object Example:**

{% highlight js %}
{
  "hb_bidder": "rubicon",
  "hb_adid": "13f44b0d3c",
  "hb_pb": "0.50"
}
{% endhighlight %}
