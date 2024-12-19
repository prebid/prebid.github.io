---
layout: userid
title: TechLab PAIR ID
description: pair TechLab PairId User ID sub-module
useridmodule: openPairIdSystem
---

Originally developed by Google and subsequently donated to the IAB TechLab.
This version supports single and two Data Clean Room setups, in which the advertiser and publisher use different clean rooms.

(Publisher Advertiser Identity Reconciliation) is a secure and privacy-forward way for enabling advertisers and publishers to reconcile their
first-party data for marketing use cases via advanced data encryption methods without the
reliance on third-party cookies.

PAIR can help advertisers and publishers maintain control of first-party data while ensuring there is no pooling of data, no leakage of data, no leakage of insights, durablility for the future using secure encryption methods, and no user tracking across publishers.

See this [page](https://iabtechlab.com/pair/) for more information about PAIR.

Add it to your Prebid.js package with:

```bash
gulp build --modules=openPairIdSystem
```

## PAIR ID Configuration

{: .table .table-bordered .table-striped }

| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of PAIR ID user ID module. | `"openPairId"` |
| params | Optional | Object | Container of all module params. Each entry can be used to configured a specific clean room. |  |
| params.liveramp | Optional | Object | Container of all liveramp cleanroom specified params. |  |
| params.liveramp.storageKey | Optional | String | storage key to fetch liveramp provided PAIR Id, the default value is `"_lr_pairId"` | `"_lr_pairId"` |

## PAIR ID Examples

Publishers manage PAIR Ids themselves can store pairIds as a byte64 encoded array of ids in local storage and/or 1st party cookies entry `pairId`.

```javascript

// should have byte64 value ready in 'pairId' local storage/cookie entry

pbjs.setConfig({
    userSync: {
        userIds: [{
        name: 'openPairId'
      }]
    }
});
```

Clean rooms may use specific storage keys, this version supports specifying the storage key for any clean room such as the following example.

```javascript

// value in 'pairId' local storage/cookie entry will be combined with ids provided by cleanroom liveramp
pbjs.setConfig({
    userSync: {
        userIds: [{
        name: 'openPairId',
        params: {
                liveramp: {
                    storageKey: '_lr_pairId'
                },
                habu: {
                    storageKey: '_habu_pairId'
                },
            },
      }]
    }
});
```
