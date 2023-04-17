---
layout: userid
title: GrowthCode
description: GrowthCode User ID sub-module
useridmodule: growthCodeIdSystem
---


[GrowthCode](https://growthcode.io/) offers scaled infrastructure-as-a-service
to empower independent publishers to harness data and take control of
identity and audience while rapidly aligning to industry changes and
margin pressure.

## GrowthCode Configuration

First, make sure to add the GrowthCode submodule to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=growthCodeIdSystem,userId

The following configuration parameters are available:

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: 'growthCodeId',
      params: {
          pid: 'TEST01', // Set your Partner ID here for production (obtained from Growthcode)
          publisher_id: '_sharedID',
          publisher_id_storage: 'html5'
      }
    }]
  }
});
```
The following configuration parameters are available:

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope    | Type   | Description | Example         |
|--------------------------------|----------|--------| --- |-----------------|
| name                           | Required | String | The name of this module. | `"growthCodeId"` |
| params                         | Required | Object | Details of module params. |                 |
| params.pid                     | Required | String | This is the Partner ID value obtained from GrowthCode | `"TEST01"`        |
| params.url | Optional | String | Custom URL for server | |
| params.publisher_id | Optional | String | Name if the variable that holds your publisher ID | `"_sharedID"` |
| params.publisher_id_storage | Optional | String | Publisher ID storage (cookie, html5) | `"html5"` |
