---
layout: userid
title: adQuery QiD
description: adQuery QiD User ID sub-module
useridmodule: adqueryIdSystem
---


The adQuery QiD is a first-party identifier designed for publishers using the Adquery adapter. For more information please contact [prebid@adquery.io](mailto:prebid@adquery.io)

## adQuery QiD Configuration

First, add the adQuery QiD module to your Prebid.js build:

```shell
gulp build --modules=userId,adqueryIdSystem
```

Then configure the qui in your `userSync` configuration:

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'qid',
            storage: {
                name: 'qid',
                type: 'html5',
                expires: 365,
            }
        }]
    }
});
```

This will add a `userId.qid` property to all bidRequests. This will be read by the Adquery bid adapter, and any other adapters that support EIDs:

```javascript
{
  qid: 'p9v2dpnuckkzhuc92i'
}
```
