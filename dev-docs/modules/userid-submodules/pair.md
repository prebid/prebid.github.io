---
layout: userid
title: Google PAIR ID
description: pair PairId User ID sub-module
useridmodule: pairIdSystem
---

Developed by and for use with Display and Video 360, PAIR (Publisher Advertiser Identity Reconciliation) is a secure and privacy-forward way for enabling advertisers and publishers to reconcile their
first-party data for marketing use cases via advanced data encryption methods without the
reliance on third-party cookies. PAIR can help advertisers and publishers maintain control of first-party data while ensuring there is no pooling of data, no leakage of data, no leakage of insights, durablility for the future using secure encryption methods, and no user tracking across publishers.  See this [document](https://services.google.com/fh/files/misc/pair_visual_final_10242022.pdf) for more information about PAIR.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=pairIdSystem

## PAIR ID Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of PAIR ID user ID module. | `"pairId"` |
| params | Optional | Object | Container of all module params. |  |
| params.liveramp | Optional | Object | Container of all liveramp cleanroom specified params. |  |
| params.liveramp.storageKey | Optional | String | storage key to fetch liveramp provided PAIR Id, the default value is `"_lr_pairId"` | `"_lr_pairId"` |

## PAIR ID Examples

Publishers manage PAIR Ids themselves can store pairIds as a byte64 encoded array of ids in local storage and/or 1st party cookies entry `pairId`.

```javascript

// should have byte64 value ready in 'pairId' local storage/cookie entry

pbjs.setConfig({
    userSync: {
        userIds: [{
        name: 'pairId'
      }]
    }
});
```

Or if to use cleanrooms provided implementation, it can be specified by adding the provider and their configs to the config, take liveramp as an example.

```javascript

// value in 'pairid' local storage/cookie entry will be combined with ids provided by cleanroom liveramp

pbjs.setConfig({
    userSync: {
        userIds: [{
        name: 'pairId',
        params: {
                liveramp: {
                    storageKey: '_lr_pairId'
                }
            },
      }]
    }
});
```
