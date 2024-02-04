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
          customerEids: 'customerEids', 
      }
    }]
  }
});
```

The following configuration parameters are available:

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope    | Type   | Description                                                            | Example         |
|--------------------------------|----------|--------|------------------------------------------------------------------------|-----------------|
| name                           | Required | String | The name of this module.                                               | `"growthCodeId"` |
| params                         | Required | Object | Details of module params.                                              |                 |
| params.customerEids | Optional | String | Name of the variable name where the customer EID information is stored | |

### Sample Eids
Below is an example of the EIDs stored in Local Store (customerEids)

```json
[
   {
      "source":"domain.com",
      "uids":[
         {
            "id":"8212212191539393121",
            "ext":{
               "stype":"ppuid"
            }
         }
      ]
   },
   {
      "source":"example.com",
      "uids":[
         {
            "id":"e06e9e5a-273c-46f8-aace-6f62cf13ea71",
            "ext":{
               "stype":"ppuid"
            }
         }
      ]
   }
]
```
