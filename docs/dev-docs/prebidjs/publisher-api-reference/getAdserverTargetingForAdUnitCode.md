---
title: pbjs.getAdserverTargetingForAdUnitCode([adunitCode])
description: getAdserverTargetingForAdUnitCode API
---


This function returns the query string targeting parameters available at this moment for a given ad unit. For full documentation see function [pbjs.getAdserverTargeting()](/dev-docs/publisher-api-reference/getAdserverTargeting).

**Kind**: static method of `pbjs`

**Returns**: `object` - returnObj return bids

**Request Params:**


| Param | Type | Description |
| --- | --- | --- |
| [adunitCode] | `string` | adUnitCode to get the bid responses for |

**Returned Object Example:**

```javascript
{
  "hb_bidder": "rubicon",
  "hb_adid": "13f44b0d3c",
  "hb_pb": "0.50"
}
```
