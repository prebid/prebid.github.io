---
layout: userid
title: AdPlus ID
description: AdPlus ID User ID sub-module
useridmodule: adplusIdSystem
bidRequestUserId: adplusId
eidsource: ad-plus.com.tr
example: '"1111"'
---

## AdPlus ID Configuration

Please make sure to add the AdPlus user ID sub-module to your Prebid.js package with:

```shell
gulp build --modules=adplusIdSystem,userId
```

{: .table .table-bordered .table-striped }

| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module: `"adplusId"` | `"adplusId"` |
| storage.expires | Optional | Number | How long (in days) the user ID information will be stored | `7` (recommended) |
| storage.refreshInSeconds | Optional | Number | How many seconds until the ID is refreshed | `24 * 3600` (recommended) |

## AdPlus ID Example

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "adplusId",
            storage: {
                name: "adplusId",
                type: "cookie&html5",
                expires: 7,
                refreshInSeconds: 24 * 3600
            }
        }]
    }
});
```
