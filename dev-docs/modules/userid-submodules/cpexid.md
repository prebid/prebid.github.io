---
layout: userid
title: Czech Ad ID (czechAdId)
description: Czech Ad ID (czechAdId) User ID sub-module
useridmodule: czechAdIdSystem
---

Czech Ad ID is a joint project of publishers of the [CPEx alliance](https://www.cpex.cz/) and [Seznam.cz](https://www.seznam.cz). It is a deterministic user ID that offers cross-domain and cross-device identification. For more information see [czechadid.cz](https://www.czechadid.cz)).

{: .alert.alert-info :}
gulp build --modules=czechAdIdSystem

## czechAdId Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module | `"czechAdId"` |

## czechAdId Example

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'czechAdId'
        }]
    }
});
{% endhighlight %}
