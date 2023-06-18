---
layout: userid
title: Hadron ID from Audigent
description: Hadron ID from Audigent User ID sub-module
useridmodule: hadronIdSystem
---


Audigent is a next-generation data management platform and a first-of-a-kind "data agency" containing some of the most exclusive content-consuming audiences across desktop, mobile and social platforms. Our HadronId module allows for user id resolution and Audigent user data segmentation to be retrieved for users across the web.  For assistance setting up your module please contact us at [prebid@audigent.com](mailto:prebid@audigent.com).

## HadronId Configuration

Add the Hadron ID system to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=userId,hadronIdSystem

Add HadronId to the userSync configuration.

```
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'hadronId',
            storage: {
                name: 'hadronId',
                type: 'html5'
            },
            params: {
                partnerId: 1234
            }
        }]
    }
});
```

The `request.userId.hadronId` will contain the Audigent HadronId:

```
{
  "hadronId": "0201chpvai07jv2yg08xizqr0bwpa1w0evvmq014d2ykn0b5oe"
}
```

The following configuration parameters are available:

{: .table .table-bordered .table-striped }
| Param under usersync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | ID value for the HadronID module - `"hadronId"` | `"hadronId"` |
| params | Optional | Object | Used to store params for the HadronId system |
| params.url | Optional | String | Set an alternate GET url for HadronId with this parameter |
| params.urlArg | Optional | Object | Optional url parameter for params.url |
| params.partnerId | Required | Number | This is the Audigent Partner ID obtained from Audigent. |
