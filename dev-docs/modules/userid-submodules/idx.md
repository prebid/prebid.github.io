---
layout: userid
title: IDx
description: IDx User ID sub-module
useridmodule: idxIdSystem
---


IDx, a universal ID solution provided by [Retargetly](https://retargetly.com), is the evolution of digital identifiers for the Latin American region. Through a proprietary identity graph, it allows publishers, advertisers, and ad tech platforms to recognize users across domains and devices even where third party cookies aren't available.

The IDx platform is designed with privacy at its core and allows for nearly every conceivable digital use case including but not limited to audience targeting, retargeting, frequency management, personalization, and total reach reporting.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=idxIdSystem

## IDx Registration

If you are a publisher or an advertiser, then IDx is free to use but requires a simple registration process. To do this, please send an email to [idx-partners@retargetly.com](mailto:idx-partners@retargetly.com) to request your IDx Partner ID.

We may ask for some basic information from you before approving your request. For more information on IDx, please visit [retargetly.com](https://retargetly.com/).

## IDx Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | `"idx"` | `"idx"` |

## IDx Example

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "idx"
        }]
    }
});
```
