---
title: pbjs.installedModules
description: installedModules API
---

When a Prebid.js package is built, the list of modules compiled into it are placed in the pbjs.installedModules array.

e.g. if this builds the package:

```bash
gulp build --modules=a,b,c
```

pbjs.installedModules would have the value ['a','b','c'].
