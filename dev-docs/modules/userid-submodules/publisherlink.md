---
layout: userid
title: Publisher Link
description: Publisher Link User ID sub-module
useridmodule: publinkIdSystem
---


Publisher Link, provided by [Epsilon](https://www.epsilon.com/us),  is a cross-device identity solution that activates publisher first-party, authenticated
data to improve audience identification and increase bid opportunities, specifically designed for sites with authenticated
traffic.  Publisher first-party authenticated data and a user's unique encrypted ID is linked to an existing people-based
Epsilon CORE ID.  By utilizing Publisher Link, publishers are able to reap the benefits of Epsilon's CORE ID.

## Publisher Link  Registration
Please contact [Epsilon](mailto:PublisherSupport@Epsilon.com) to sign up.

The Epsilon privacy is covered in the [Epsilon Privacy Policy](https://www.epsilon.com/us/privacy-policy).

The Publisher Link opt-out is included [here](https://www.epsilon.com/privacy/dms/opt-out/email)

## Publisher Link Configuration

In addition to the parameters documented above in the Basic Configuration section the following Publisher Link specific configuration is available:

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module. | `'publinkId'` |
| params | Required | Object | Customized parameters. | |
| params.e | Required | String | Hashed email address of the user.  Supports MD5 and SHA256. | `'7D320454942620664D96EF78ED4E3A2A'` |
| params.site_id | Required | String | Site ID provided by Epsilon. | `'123456'` |
| params.api_key | Required | String | API key provided by Epsilon. | `'00000000-0000-0000-0000-00000000000'`

## Publisher Link Examples
```javascript
    pbjs.setConfig({
       userSync: {
           userIds: [{
               name: "publinkId",
               storage: {
                   name: "pbjs_publink",
                   type: "cookie",
                   expires: 30
               },
               params: {
                   e: "7D320454942620664D96EF78ED4E3A2A", // example hashed email (md5)
                   site_id: "123456",
                   api_key: "00000000-0000-0000-0000-00000000000"
               }
           }]
       }
   });
```
