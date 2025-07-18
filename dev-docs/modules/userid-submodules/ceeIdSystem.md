---
layout: userid
title: CEEIdSystem
description: CEEID User ID sub-module
useridmodule: ceeIdSystem
bidRequestUserId: ceeId
eidsource: ceeid.eu
example: '"1111"'
---

## Prebid Configuration

First, make sure to add ceeIdSystem to your Prebid.js package with:

```bash
gulp build --modules=ceeIdSystem
```

## CEEID Configuration

{: .table .table-bordered .table-striped }

| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of CEEID user ID module. | `"ceeId"` |
| storage | Required | Object | Container of storage options. |  |
| storage.type | Required | String | Type of storage to use  | `"cookie"` |
| storage.name | Required | String | Name of storage to set  | `"ceeIdToken"` |
| storage.expires | Optional | Int | Time when storage should expire it is recommended to use this options otherwise storage last only during session  | `7` |
| storage.refreshInSeconds | Optional | Int | Time when storage value and expiration date will get refreshed in seconds  | `360` |
| params | Required | Object | Container of all module params. |  |
| params.publisherId | Required | String | Required param which defines your publisher ID to send in query  | `'123'` |
| params.type | Required | String | Required param which defines type of encoding used on user email.  Use 'email' if HEM was encoded by base64 or use 'hex' if it was encoded by hex  | `'hex'` |
| params.value | Required | String | Required param where you pass HEM value  | `'exampleHEMValue'` |
| params.cookieName | Optional | String |  Your custom name of token to read it is only used if second way of integration is chosen. | `'myExampleCookieName'` |

## CEEID Examples

You can configure this submodule in your `userSync.userIds[]` configuration. We have two implementation methods depending on the publisher's needs. The first method we suggest for publishers is to provide appropriate data that will allow you to query the endpoint to retrieve the ceeId token. To query the endpoint correctly, you will need the publisher's ID in the params.publisheId field. In addition, the HEM type, i.e. how the user's email was encoded, we consider two methods: base64 encoding and hex encoding. The value of HEM should be passed in the params.value field.

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'ceeId',
            storage: {
                type: 'cookie',
                name: 'ceeIdToken',
                expires: 7,
                refreshInSeconds: 360
            },
            params: {
                publisherId: '123', // Publisher ID
                type: 'email', // use 'email' if HEM was encoded by base64 or use 'hex' if it was encoded by hex
                value: 'exampleHEMValue', // HEM value
            }
        }]
    }
});
```

The second way is to use a token from a cookie or local storage previously prepared by the publisher. The only thing needed in this approach is to enter the name of the cookie/local storage that the module should use in the params.cookieName field.

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'ceeId',
            storage: {
                type: 'cookie',
                name: 'ceeIdToken',
                expires: 7,
                refreshInSeconds: 360
            },
            params: {
                cookieName: 'name' // Your custom name of token to read from cookies or local storage
            }
        }]
    }
});
```
