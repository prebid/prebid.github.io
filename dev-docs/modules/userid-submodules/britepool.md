---
layout: userid
title: BritePool
description: BritePool User ID sub-module
useridmodule: britepoolIdSystem
---

{: .alert.alert-warning :}
britepool is probably a defunct User ID system, as britepool.com is now an e-commerce site.

The [BritePool](https://britepool.com) ID is a persistent identifier that enables identity resolution for people-based marketing in the cookieless world. Every BritePool ID is associated with a real identity. As a result, publishers, SSPs and DSPs that integrate with BritePool, or automated
integration partners (such as PubMatic), are able to maximize revenues without cookies. As addressable individuals visit publisher websites and mobile apps, the BritePool IDs associated with these identities are passed into the bidstream; enabling advertisers to transact against these BritePool ID's and publishers to maximize the revenues associated with their inventory and audience. The BritePool ID combines consumer privacy with easy, rapid integration for publishers and does not significantly increase the computing resources required of DSPs and SSPs.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=britepoolIdSystem

## BritePool Registration

Please reach out to [prebid@britepool.com](mailto:prebid@britepool.com) and request your `api_key`.

The BritePool privacy policy is at [britepool.com/services-privacy-notice/](https://britepool.com/services-privacy-notice/).

## BritePool Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | `"britepoolId"` | `"britepoolId"` |
| params | Required | Object | Details for britepool initialization. | |
| params.api_key | Required | String | BritePool API Key provided by BritePool | "458frgde-djd7-3ert-gyhu-12fghy76dnmko" |
| params.url | Optional | String | BritePool API url | "<https://sandbox-api.britepool.com/v1/britepool/id>" |
| params.identifier | Required | String | Where identifier in the params object is the key name. At least one identifier is required. Available Identifiers `aaid` `dtid` `idfa` `ilid` `luid` `mmid` `msid` `mwid` `rida` `ssid` `hash` | `params.ssid` `params.aaid` |

## BritePool Examples

### Individual params may be set for the BritePool User ID Submodule. At least one identifier must be set in the params

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "britepoolId",
            storage: {
                name: "britepoolid",
                type: "cookie",
                expires: 30
            },
            params: {
                url: "https://sandbox-api.britepool.com/v1/britepool/id", // optional. used for testing
                api_key: "xxx", // provided by britepool
                hash: "yyyy", // example identifier
                ssid: "r894hvfnviurfincdejkencjcv" // example identifier
            }
        }],
        syncDelay: 3000 // 3 seconds after the first auction
    }
});
```
