---
layout: userid
title: Google PAIR ID
description: pair PairId User ID sub-module
useridmodule: pairIdSystem
---

[PAIR](https://blog.google/products/marketingplatform/360/engage-your-first-party-audience-in-display-video-360/) (Publisher Advertiser Identity Reconciliation) is developed by Google DV360, which provides a secure and privacy safe way for advertisers and publishers to reconcile encrypted first-party data using unique keys. 

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
| params.liveramp.storageKey | Optional | String | storage key to fetch liveramp provided PAIR Id, the default key is `"_lr_pairId_"` | `"_lr_pairId_custom"` |

## PAIR ID Examples

Publishers manage PAIR Ids themselves can store pairIds as a byte64 encoded array of ids in local storage and/or 1st party cookies entry `pairId`.

{% highlight javascript %}

// should have byte64 value ready in 'pairId' local storage/cookie entry

pbjs.setConfig({
    userSync: {
        userIds: [{
        name: 'pairId'
      }]
    }
});
{% endhighlight %}

Or if to use cleanrooms provided implementation, it can be specified by adding the provider and their configs to the config, take liveramp as an example.

{% highlight javascript %}

// value in 'pairid' local storage/cookie entry will be combined with ids provided by cleamroom liveramp

pbjs.setConfig({
    userSync: {
        userIds: [{
        name: 'pairId',
        params: {
                liveramp: {
                    storageKey: '_lr_pairId_custom'
                }
            },
      }]
    }
});
{% endhighlight %}



