---
layout: userid
title: Yandex ID
description: Yandex User ID sub-module
useridmodule: yandexIdSystem
---

Yandex ID module is designed to improve the personalization of ads for publishers' users. This documentation provides information about the Yandex User ID module, and instructions to install it. 

## Step 1. Add Yandex ID to Prebid.js package

Add the module to your Prebid.js package:

{: .alert.alert-info :}
gulp build --modules=yandexIdSystem

## Step 2. Enable Yandex ID

Include the following call to `setConfig` in your Prebid.js code:

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'yandex',
            bidders: ['yandex'],
        }]
    }
});
```
