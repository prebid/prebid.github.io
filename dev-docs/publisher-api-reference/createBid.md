---
layout: api_prebidjs
title: pbjs.createBid(statusCode)
description: createBid API
sidebarType: 1
---

Creates a bid object using the given status code.

**Kind**: static method of `pbjs`.

**Request Params:**

{: .table .table-bordered .table-striped }

| Param | Type | Description |
| --- | --- | --- |
| `statusCode` | `number` | Bid status code. Optional; defaults to 0 |

**Example**

```javascript
const bid = pbjs.createBid(1);
```
