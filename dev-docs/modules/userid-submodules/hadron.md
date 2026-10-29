---
layout: userid
title: Hadron ID from Audigent
description: Hadron ID from Audigent User ID sub-module
useridmodule: hadronIdSystem
bidRequestUserId: hadronId
eidsource: audigent.com
example: {"hadronId":"user-hadron-id", "auSeg":["segment1", "segment2"]}
---

Audigent is a next-generation data management platform and a first-of-a-kind "data agency" containing some of the most exclusive content-consuming audiences across desktop, mobile and social platforms. Our HadronId module allows for user id resolution and Audigent user data segmentation to be retrieved for users across the web.  For assistance setting up your module please contact us at [prebid@audigent.com](mailto:prebid@audigent.com).

## HadronId Configuration

Add the Hadron ID system to your Prebid.js package with:

```bash
gulp build --modules=userId,hadronIdSystem
```

Add HadronId to the userSync configuration.

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'hadronId',
            storage: {
                name: 'hadronId',
                type: 'html5'
            },
            params: {
                partnerId: 1234   // change it to the Partner ID you got from Audigent
            }
        }]
    }
});
```

The `request.userId.hadronId` will contain the Audigent HadronId:

```json
{
  "hadronId": "0aRSTUAackg79ijgd8e8j6kah9ed9j6hdfgb6cl00volopxo00npzjmmb"
}
```

The following configuration parameters are available:

{: .table .table-bordered .table-striped }

| Param under usersync.userIds[] | Scope    | Type    | Description                                                                                                                                                                                                                 | Example                                     |
|--------------------------------|----------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------|
| name                           | Required | String  | ID value for the HadronID module - `"hadronId"`                                                                                                                                                                             | `"hadronId"`                                |
| storage                        | Required | Object  | The publisher must specify the local storage in which to store the results of the call to get the user ID. This can be either cookie or HTML5 storage.                                                                      |                                             |
| storage.type                   | Required | String  | This is where the the user ID will be stored. The recommended method is `localStorage` by specifying `html5`.                                                                                                               | `"html5"`                                   |
| storage.name                   | Required | String  | The name of the cookie or html5 local storage where the user ID will be stored. The recommended value is `hadronId`.                                                                                                        | `"auHadronId"`                              |
| storage.expires                | Optional | Integer | How long (in days) the user ID information will be stored. The recommended value is 14 days.                                                                                                                                | `14`                                        |
| value                          | Optional | Object  | Used only if the page has a separate mechanism for storing the Hadron ID. The value is an object containing the values to be sent to the adapters. In this scenario, no URL is called and nothing is added to local storage | `{"hadronId": "0a..mb"}`                    |
| params                         | Optional | Object  | Used to store params for the id system                                                                                                                                                                                      |                                             |
| params.partnerId               | Required | Number  | This is the Audigent Partner ID obtained from Audigent.                                                                                                                                                                     | `1234`                                      |
