---
layout: userid
title: AMX ID
description: AMX ID User ID sub-module
useridmodule: amxIdSystem
---


The AMX ID is a first-party identifier designed for publishers using the AMX RTB adapter. For more information please contact [info@amxdt.net](mailto:info@amxdt.net)

## AMX ID Configuration

First, add the AMX ID module to your Prebid.js build:

```shell
gulp build --modules=userId,amxIdSystem
```

Then configure the amxId in your `userSync` configuration:

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'amxId',
            storage: {
                name: 'amxId',
                type: 'html5',
                expires: 14,
            }
        }]
    }
});
```

This will add a `userId.amxId` property to all bidRequests:

```javascript
{
  amxId: '3ca11058-ecbc-419f-bda7-b52fe7baf02a'
}
```
