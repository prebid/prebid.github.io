---
layout: userid
title: 33Across ID
description: 33Across ID User ID sub-module
useridmodule: 33acrossIdSystem
---


The 33Across User ID sub-module is a way for publishers to monetize their cookieless inventory across multiple supply-side platforms via Prebid.JS. The sub-module provides publishers with addressability for their open marketplace cookieless inventory and access to cookieless demand. The 33Across User ID sub-module utilizes Lexicon technology to connect Publishers to Demand partners via proprietary technologies in a probabilistic and privacy-safe manner. Please contact [PrebidUIM@33across.com](mailto:PrebidUIM@33across.com) to get your authorization process started.

## 33Across ID Configuration

Please make sure to add the 33across user ID sub-module to your Prebid.js package with:

```shell
gulp build --modules=33acrossIdSystem,userId
```

The following configuration parameters are available:

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this sub-module | `"33acrossId"` |
| params ||| Details for the sub-module initialization ||
| params.pid | Required | String | Partner ID (PID) | Please reach out to [PrebidUIM@33across.com](mailto:PrebidUIM@33across.com) and request your PID |
| storage |||||
| storage.name | Required | String | The name of the cookie or html5 local storage key | `"33acrossId"` (recommended) |
| storage.type | Required | String | This is where the 33across user ID will be stored | `"html5"` (recommended) or `"cookie"` |
| storage.expires | Strongly Recommended | Number | How long (in days) the user ID information will be stored | `90` (recommended) |
| storage.refreshInSeconds | Strongly Recommended | Number | How many seconds until the ID is refreshed | `8 * 3600` (recommended) |

## 33Across ID Example

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: "33acrossId",
      params: {
        pid: "0010b00002GYU4eBAH" // Example ID
      },
      storage: {
        name: "33acrossId",
        type: "html5",
        expires: 90,
        refreshInSeconds: 8 * 3600
      }
    }]
  }
});
```
