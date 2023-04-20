---
layout: userid
title: FreePass ID
description: FreePass User ID sub-module
useridmodule: freepassIdSystem
---

[FreePass](https://freepass-login.com/introduction.html) is a common authentication service operated by Freebit Co., Ltd. Users with a FreePass account do not need to create a new account to use partner services.

Please contact FreePass before using this ID at [freepass-headerbidding@craid-inc.com](mailto:freepass-headerbidding@craid-inc.com)

## FreePass ID Configuration

Please make sure to add the FreePass user ID sub-module to your Prebid.js package with:

```shell
gulp build --modules=freepassIdSystem,userId
```

The following configuration parameters are available:

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope    | Type   | Description                                          | Example        |
|--------------------------------|----------|--------|------------------------------------------------------|----------------|
| name                           | Required | String | The name of this module                              | `"freepassId"` |
| freepassData                   | Optional | Object | FreePass data                                        | `{}`           |
| freepassData.commonId          | Optional | String | Common ID obtained from FreePass                     | `"abcd1234"`   |
| freepassData.userIp            | Optional | String | User IP obtained in cooperation with partner service | `"127.0.0.1"`  |

Usage example:

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'freepassId',
            storage: { name: '_freepassId', type: 'cookie', expires: 30 },
            params: {
                freepassData: {
                    commonId: 'fpcommonid123',
                    userIp: '127.0.0.1'
                }
            }
        }]
    }
});
```
