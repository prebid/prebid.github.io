---
title: pbjs.getAdserverTargetingForAdUnitCodeStr(adunitCode)
description: getAdserverTargetingForAdUnitCodeStr API
---

Returns the query string targeting parameters available at the moment for the specified ad unit.

**Kind**: static method of `pbjs`.

**Returns**: `Array` - list of targeting key-value strings.

**Request Params:**


| Param | Type | Description |
| --- | --- | --- |
| `adunitCode` | `string` | adUnitCode to get the bid responses for |

**Example**

```javascript
const targetingStrings = pbjs.getAdserverTargetingForAdUnitCodeStr('div-1');
// ["hb_bidder=appnexus", "hb_adid=233bcbee889d46d", ...]
```
