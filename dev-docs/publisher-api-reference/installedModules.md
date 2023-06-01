---
layout: api_prebidjs
title: pbjs.installedModules
description: installedModules API
sidebarType: 1
---

When a Prebid.js package is built, the list of modules compiled into it are placed in the pbjs.installedModules array.

e.g. if this builds the package:
```
gulp build --modules=a,b,c
```

pbjs.installedModules would have the value ['a','b','c'].
