---
layout: userid
title: Yandex ID
description: Yandex User ID sub-module
useridmodule: yandexIdSystem
bidRequestUserId: yandexId
eidsource: yandex.com
example: '"1111"'
---

Yandex ID module is designed to improve the personalization of ads for publishers' users. This documentation provides information about the Yandex User ID module, and instructions to install it. 

## Step 1. Add Yandex ID to Prebid.js package

Add the module to your Prebid.js package:

```bash
gulp build --modules=yandexIdSystem
```

## Step 2. Enable Yandex ID

Include the following call to `setConfig` in your Prebid.js code:

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [
            {
                name: 'yandex',
                bidders: ['yandex'],
                storage: {
                    type: 'cookie',
                    name: '_ym_uid',
                    expires: 365,
                },
            },
        ],
    },
});
```

**Storage Requirements**: Yandex ID requires the storage object to specify cookie `type`, name `_ym_uid`, and an expiration of at least 30 days.
