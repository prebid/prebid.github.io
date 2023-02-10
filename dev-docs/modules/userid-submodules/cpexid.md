---
layout: userid
title: Czech Publisher Exchange ID (CPExID)
description: Czech Publisher Exchange ID (CPExID) User ID sub-module
useridmodule: cpexIdSystem
---


CPExID is provided by [Czech Publisher Exchange](https://www.cpex.cz/), or CPEx. It is a user ID for ad targeting by using first party cookie, or localStorage mechanism. Please contact CPEx before using this ID.

{: .alert.alert-info :}
gulp build --modules=cpexIdSystem

## CPExId Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module | `"cpexId"` |

## CPExId Example

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'cpexId'
        }]
    }
});
{% endhighlight %}
