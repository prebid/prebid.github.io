---
layout: userid
title: AdmixerID
description: AdmixerID User ID sub-module
useridmodule: admixerIdSystem
---


Admixer ID, provided by [Admixer](https://admixer.com/), is a universal ID solution that doesn't rely on 3rd party cookies and helps publishers and advertisers to recognize users across various browsers and environments.  Our sub adapter takes deterministic signals like email and phone as input and returns an anonymous id that unlocks access to a wide range of Admixer's demand sources, amplifying audience segmentation, targeting and measurement.

The Admixer privacy policy is at <https://admixer.com/privacy/>

Add Admixer ID module to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=admixerIdSystem

## AdmixerID Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | `"admixerId"` | `"admixerId"` |
| params | Required | Object | Details for admixer initialization. | |
| params.pid | Optional | String | id provided by admixer | "458frgde-djd7-3ert-gyhu-12fghy76dnmko" |
| params.e | Optional | String | The hashed email address of a user. We can accept the hashes, which use the following hashing algorithms: md5, sha1, sha256. | "3d400b57e069c993babea0bd9efa79e5dc698e16c042686569faae20391fd7ea" |
| params.p | Optional | String | The hashed phone number of a user. We can accept the hashes, which use the following hashing algorithms: md5, sha1, sha256. | "05de6c07eb3ea4bce45adca4e0182e771d80fbb99e12401416ca84ddf94c3eb9" |

## AdmixerID Examples

### Individual params may be set for the Admixer ID Submodule

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "admixerId",
            storage: {
                name: "admixerId",
                type: "cookie",
                expires: 30
            },
            params: {
                pid: "4D393FAC-B6BB-4E19-8396-0A4813607316", // example id
                e: "3d400b57e069c993babea0bd9efa79e5dc698e16c042686569faae20391fd7ea", // example hashed email (sha256)
                p: "05de6c07eb3ea4bce45adca4e0182e771d80fbb99e12401416ca84ddf94c3eb9" //example hashed phone (sha256)
            }
        }],
        auctionDelay: 50             // 50ms maximum auction delay, applies to all userId modules
    }
});
```
