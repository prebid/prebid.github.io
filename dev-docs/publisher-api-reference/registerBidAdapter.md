---
layout: api_prebidjs
title: pbjs.registerBidAdapter(bidderAdapter, bidderCode)
description: registerBidAdapter API
sidebarType: 1
---

Registers a custom bid adapter for use within Prebid.js.

**Kind**: static method of `pbjs`.

**Request Params:**

{: .table .table-bordered .table-striped }

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
