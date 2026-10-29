---
layout: api_prebidjs
title: pbjs.processQueue()
description: processQueue API
sidebarType: 1
---

Processes commands that were pushed onto `pbjs.cmd` or `pbjs.que` before Prebid.js finished loading.

**Kind**: static method of `pbjs`.

Calling this method manually is rarely necessary because Prebid.js runs it automatically when the library loads.

**Example**

```javascript
pbjs.processQueue();
```
