---
layout: api_prebidjs
title: pbjs.installedModules
description: 
---

When a Prebid.js package is built, the list of modules compiled into it are placed in the pbjs.installedModules array.

e.g. if this builds the package:
```
gulp build --modules=a,b,c
```

pbjs.installedModules would have the value ['a','b','c'].

If you happen to compile in all 400+ modules (not a good idea!), the value of pbjs.installedModules will be an empty array.

