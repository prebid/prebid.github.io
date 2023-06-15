---
layout: userid
title: LiveRamp RampID
description: LiveRamp RampID User ID sub-module
useridmodule: identityLinkIdSystem
---


RampID, formerly known as IdentityLink, provided by [LiveRamp](https://liveramp.com) is a single person-based identifier which allows marketers, platforms and publishers to perform personalized segmentation, targeting and measurement use cases that require a consistent, cross-channel view of the user in anonymous spaces.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=identityLinkIdSystem

## RampID Registration

LiveRamp's RampID is free of charge and only requires a simple registration with Liveramp. Please sign up through our [Console](https://launch.liveramp.com) platform and request a Placement ID, a unique identifier that is used to identify each publisher, to get started.

The RampID privacy policy is at [https://liveramp.com/privacy/service-privacy-policy/](https://liveramp.com/privacy/service-privacy-policy/).

## RampID Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of LiveRamp's user ID module. | `"identityLink"` |
| params | Required | Object | Container of all module params. |  |
| params.pid | Required | String | This is the Placement ID, a unique identifier that is used to identify each publisher, obtained from registering with LiveRamp. | `"999"` |
| params.notUse3P | Not required | Boolean | Property for choosing if a cookieable RampID envelope (RTIS) should be set and stored until the user authenticates which then will be replaced by an authenticated RampID envelope (ATS) (either `true` or `false`). | `false` |
| storage | Required | Object | This object defines where and for how long the results of the call to get a RampID envelope will be stored. |
| storage.type    | Required | String | This parameter defines where the resolved RampID envelope will be stored (either `"cookie"` or `"html5"` localStorage). | `"cookie"` |
| storage.name | Required | String | The name of the cookie or html5 localstorage where the resolved RampID envelope will be stored. LiveRamp requires `"idl_env"`. | `"idl_env"` |
| storage.expires | Required | Integer | How long (in days) the RampID envelope information will be stored. To be GDPR and CCPA compliant, we strongly advise to set a 15-day TTL ("Time to Live" / expiration time). If you are not planning to obtain RampID envelopes for EU/EEA or U.S. users, we advise you to change the expiration time to 30 days. | `15` |
| storage.refreshInSeconds | Required | Integer | The amount of time (in seconds) the RampID envelope should be cached in storage before calling LiveRamp again to retrieve a potentially updated value for the RampID envelope. | `1800`

{: .alert.alert-info :}
**NOTE:** The RampID envelope that is delivered to Prebid will be encrypted by LiveRamp with a rotating key to avoid unauthorized usage and to enforce privacy requirements. Therefore, we strongly recommend setting `storage.refreshInSeconds` to 30 minutes (1800 seconds) to ensure all demand partners receive an ID that has been encrypted with the latest key, has up-to-date privacy signals, and allows them to transact against it.

## RampID Examples

1) Publisher passes a Placement ID and elects to store the RampID envelope in a first-party cookie.

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "identityLink",
            params: {
                pid: "999",             // Set your Placement ID here
                notUse3P: false
            },
            storage: {
                type: "cookie",
                name: "idl_env",        // "idl_env" is the required storage name
                expires: 15,            // RampID envelope can last for 15 days
                refreshInSeconds: 1800  // RampID envelope will be updated every 30 minutes
            }
        }],
        syncDelay: 3000                 // 3 seconds after the first auction
    }
});
```

2) Publisher passes a Placement ID and elects to store the RampID envelope in HTML5 localStorage.

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "identityLink",
            params: {
                pid: "999",             // Set your Placement ID here
                notUse3P: false
            },
            storage: {
                type: "html5",
                name: "idl_env",        // "idl_env" is the required storage name
                expires: 15,            // RampID envelope can last for 15 days
                refreshInSeconds: 1800  // RampID envelope will be updated every 30 minutes
            }
        }],
        syncDelay: 3000                 // 3 seconds after the first auction
    }
});
```
