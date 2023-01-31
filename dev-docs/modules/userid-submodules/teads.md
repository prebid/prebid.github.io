---
layout: userid
title: Teads ID
description: Teads ID User ID sub-module
useridmodule: teadsIdSystem
pbjs_version_notes: please avoid using v7.20.0 and v7.21.0
---


The Teads ID is a first-party identifier designed for publishers using the Teads adapter. For more information please contact [innov-ssp@teads.com](mailto:innov-ssp@teads.com)

## Teads ID Configuration

First, add the Teads ID module to your Prebid.js build:

```shell
gulp build --modules=userId,teadsIdSystem
```

Then configure the teadsId in your `userSync` configuration.  

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | `"teadsId"` | `"teadsId"` |
| params | Required | Object | Details for Teads initialization. | |
| params.pubId | Required | Number | Teads Publisher Id provided by Teads | 1234 |

Replace the `pubId` value by your Publisher Teads Id that you will find in TODO

## Teads ID Example

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'teadsId',
            params: {
                pubId: 1234
            }
        }]
    }
});
```

This will add a `userId.teadsId` property to all bidRequests. This will be read by the Teads bid adapter, and any other adapters that support EIDs:

```javascript
{
  teadsId: '2e3a00de-3800-11ed-a261-0242ac120002'
}
```
