---
layout: api_prebidjs
title: pbjs.getUserIds()
description: 
sidebarType: 1
---


{: .alert.alert-info :}
To use this function, include the [UserId module](/dev-docs/modules/userId.html) in your Prebid.js build.

If you need to export the user IDs stored by Prebid User ID module, the `getUserIds()` function will return an object formatted the same as bidRequest.userId.

```
pbjs.getUserIds() // returns object like bidRequest.userId. e.g. {"pubcid":"1111", "tdid":"2222"}
```