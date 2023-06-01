---
layout: userid
title: OneKey IDs & Preferences
description: OneKey IDs & Preferences User ID sub-module
useridmodule: oneKeyIdSystem
---


The OneKey real-time data module in Prebid has been built so that publishers
can quickly and easily setup the OneKey Addressability Framework.
This module is used along with the oneKeyRtdProvider to pass OneKey data to your partners.
Both modules are required. This module will pass oneKeyData to your partners
while the oneKeyRtdProvider will pass the transmission requests.

Background information:
- [OneKey-Network/addressability-framework](https://github.com/OneKey-Network/addressability-framework)
- [OneKey-Network/OneKey-implementation](https://github.com/OneKey-Network/OneKey-implementation)


It can be added to you Prebid.js package with:

{: .alert.alert-info :}
gulp build –modules=userId,oneKeyIdSystem

⚠️ This module works with a RTD module. Both must be configured. See the [OneKey RTD Module](/dev-docs/modules/oneKeyRtdProvider.html).

## OneKey Registration

OneKey is a community based Framework with a decentralized approach.
Go to [onekey.community](https://onekey.community/) for more details.

## OneKey Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module | `"oneKeyData"` |


## OneKey Exemple

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'oneKeyData'
        }]
    }
});
```
