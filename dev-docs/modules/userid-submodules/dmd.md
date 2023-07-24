---
layout: userid
title: DMD ID by DMD Marketing Corp
description: DMD ID by DMD Marketing Corp User ID sub-module
useridmodule: dmdIdSystem
---


DMD is the preeminent supplier of US-based healthcare professional (HCP) identity data to the pharmaceutical, health system and medical publishing industries. DMD is the only data provider that has acquired its deterministic identity data through a fully consented, first-party, opt-in process. DMD’s privacy policy that can be found at [Privacy Policy](https://hcn.health/privacy-policy).

For assistance setting up your module, please contact us at <prebid@dmdconnects.com>

Add the DMD ID to your Prebid.js Package with:

{: .alert.alert-info :}
gulp build --modules=userId,dmdIdSystem

## DMD ID Registration

Please reach out to [prebid@dmdconnects.com](mailto:prebid@dmdconnects.com) to request your `api_key`

## DMD ID Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of Module | `"dmdId"` |
| storage | Required | Object |  |
| storage.name | Required | String | `dmd-dgid` |
| params | Required | Object | Container of all module params. |  |
| params.api_key | Required | String | This is your `api_key` as provided by DMD Marketing Corp. | `3fdbe297-3690-4f5c-9e11-ee9186a6d77c` |

## DMD ID Example

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'dmdId',
            params: {
                api_key: '3fdbe297-3690-4f5c-9e11-ee9186a6d77c' // provided to you by DMD
            }
        }]
    }
});
```
