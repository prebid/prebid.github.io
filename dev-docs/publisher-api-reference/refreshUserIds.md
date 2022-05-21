---
layout: api_prebidjs
title: pbjs.refreshUserIds(options, callback)
description: 
---


{: .alert.alert-info :}
To use this function, include the [UserId module](/dev-docs/modules/userId.html) in your Prebid.js build.

The `refreshUserIds` function allows you to force either all or a subset of userId submodules to reinitialize their id values. You might want to do this if an event on your page occurred that would change the id value of a submodule. For example, a user logging in.

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| options | optional | Object | Options object |
| options.submoduleNames | optional | Array of strings | The userId submodule names that should be refreshed. If this option is omitted, all userId submodules are refreshed. |
| callback | optional | Function | Callback that is called after refreshing user ids has completed |


```
pbjs.refreshUserIds();
pbjs.refreshUserIds({ submoduleNames: ['britepoolId'] }, () => console.log("Done!"));
```
