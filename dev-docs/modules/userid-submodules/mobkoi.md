---
layout: userid
title: Mobkoi ID
description: Mobkoi ID User ID sub-module
useridmodule: mobkoiIdSystem
bidRequestUserId: mobkoiId
eidsource: mobkoi.com
example: '"1111111111111"'
---

The Mobkoi ID system provides user identification capabilities for improved addressability and targeted advertising. This module handles user ID synchronization and storage while supporting GDPR consent management.

## Add Mobkoi ID to your Prebid.js Package

Add the module to your Prebid.js package:

```bash
gulp build --modules=consentManagementTcf,tcfControl,mobkoiIdSystem,userId
```

## Mobkoi ID Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module | `"mobkoiId"` |
| storage | Required | Object | Storage settings for the ID | |
| storage.type | Required | String | Where to store the ID - must be `"cookie"` | `"cookie"` |
| storage.name | Required | String | Cookie name for storing the ID | `"_mobkoi_Id"` |
| storage.expires | Required | Integer | Number of days before the cookie expires | `30` |

## Example Configuration

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [
            {
                name: 'mobkoiId',
                storage: {
                    type: 'cookie',
                    name: '_mobkoi_Id',
                    expires: 30, // days
                },
            },
        ],
    },
});
```

For integration support or questions, contact <platformteam@mobkoi.com>.
