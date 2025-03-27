---
layout: userid
title: PubMatic ID
description: PubMatic ID User ID sub-module
useridmodule: pubmaticIdSystem
bidRequestUserId: pubmaticId
eidsource: esp.pubmatic.com
example: '"1111"'
---


## PubMatic ID Configuration

Please make sure to add the PubMatic user ID sub-module to your Prebid.js package with:

```shell
gulp build --modules=pubmaticIdSystem,userId
```

The following configuration parameters are available:

{: .table .table-bordered .table-striped }

| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this sub-module | `"pubmaticId"` |
| params ||| Details for the sub-module initialization ||
| params.publisherId | Required | Number | Publisher ID | `123456` |
| storage |||||
| storage.name | Required | String | The name of the cookie or html5 local storage key | `"pubmaticId"` |
| storage.type | Required | String | This is where the PubMatic user ID will be stored | `"cookie&html5"` (recommended) or `"html5"` or `"cookie"` |
| storage.expires | Required (Must be `30`) | Number | How long (in days) the user ID information will be stored | `30` |
| storage.refreshInSeconds | Required (Must be `86400`) | Number | How many seconds until the ID is refreshed | `86400` |

## PubMatic ID Example

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: "pubmaticId",
      params: {
        publisherId: "123456" // Example ID
      },
      storage: {
        name: "pubmaticId",
        type: "cookie&html5",
        expires: 30,
        refreshInSeconds: 86400
      }
    }]
  }
});
```
