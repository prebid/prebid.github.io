---
title: pbjs.registerAnalyticsAdapter(options)
description: registerAnalyticsAdapter API
---

Registers an analytics adapter so it can listen to auction events.

**Kind**: static method of `pbjs`.

**Request Params:**


| Param | Type | Description |
| --- | --- | --- |
| `options` | `object` | Object containing the adapter instance and code |

**Example**

```javascript
pbjs.registerAnalyticsAdapter({
  adapter: myAnalyticsAdapter,
  code: 'myAnalytics',
  gvlid: 1
});
```
