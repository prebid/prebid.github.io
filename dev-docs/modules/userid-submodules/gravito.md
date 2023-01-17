---
layout: userid
title: GRAVITO ID by Gravito Ltd.
description: GRAVITO ID by Gravito Ltd. User ID sub-module
useridmodule: gravitoIdSystem
---


Gravito ID, provided by [Gravito Ltd.](https://gravito.net), is ID for ad targeting by using 1st party cookie.
Please contact Gravito Ltd. for using this ID.

Add the Gravito ID to your Prebid.js Package with:

{: .alert.alert-info :}
gulp build --modules=gravitoIdSystem

## Gravito ID Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module | `"gravitompId"` |

## Gravito ID Example

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'gravitompId'
        }]
    }
});
{% endhighlight %}
