---
layout: userid
title: AMX RTB ID
description: AMX RTB ID User ID sub-module
useridmodule: amxIdSystem
---


The AMX RTB ID is a first-party identifier designed for publishers using the AMX RTB adapter. For more information please contact [prebid@amxrtb.com](mailto:prebid@amxrtb.com)

## AMX RTB ID Configuration

First, add the AMX RTB ID module to your Prebid.js build:

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

This will add a `userId.amxId` property to all bidRequests. This will be read by the AMX RTB bid adapter, and any other adapters that support EIDs:

```javascript
{
  amxId: '3ca11058-ecbc-419f-bda7-b52fe7baf02a'
}
```
