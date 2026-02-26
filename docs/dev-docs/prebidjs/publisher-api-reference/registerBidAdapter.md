---
title: pbjs.registerBidAdapter(bidderAdapter, bidderCode)
description: registerBidAdapter API
---

Registers a custom bid adapter for use within Prebid.js.

**Kind**: static method of `pbjs`.

**Request Params:**


| Param | Type | Description |
| --- | --- | --- |
| `bidderAdapter` | `function` | Adapter instance that returns a `callBids` function |
| `bidderCode` | `string` | Code that identifies the adapter |

**Example**

```javascript
function myAdapter() {
  return { callBids: function() { /* ... */ } };
}
pbjs.registerBidAdapter(myAdapter, 'my');
```
