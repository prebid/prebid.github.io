---
title: pbjs.getUserIdsAsync()
description: getUserIdsAsync API
---

:::info
To use this function, include the [UserId module](/dev-docs/modules/userId) in your Prebid.js build.
:::

`getUserIdsAsync()` returns a promise to the same value returned by [getUserIds()](/dev-docs/publisher-api-reference/getUserIds), but it's guaranteed to resolve only once the complete set of IDs is available:

```javascript
pbjs.getUserIdsAsync().then(function (userIds) {
   // all IDs are available here:
   pbjs.getUserIds()       // same as the `userIds` argument
   pbjs.getUserIdsAsEids() 
});
```
