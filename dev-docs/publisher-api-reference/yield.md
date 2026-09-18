---
layout: api_prebidjs
title: pbjs.yield
description: yield setting
sidebarType: 1
---

Since version 10, [pbjs.processQueue](/dev-docs/publisher-api-reference/processQueue.html) yields the main browser thread after executing each command in the queue, to improve UX (and some related metrics such as [interaction to next paint](https://web.dev/articles/inp)).

You can disable yielding by setting `pbjs.yield` to `false`:

```javascript
pbjs.yield = false;

pbjs.que.push(/* ... */)
```
