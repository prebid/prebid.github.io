---
layout: userid
title: Gemius ID
description: Gemius ID User ID sub-module
useridmodule: gemiusIdSystem
bidRequestUserId: gemiusId
eidsource: gemius.com
example: '"1111"'
---

The Gemius ID submodule enables publishers to access the RUID identifier provided by gemius.com
within the Prebid.js ecosystem.

Add support for Gemius ID to your Prebid.js package using:

```bash
gulp build --modules=userId,gemiusIdSystem
```

## Gemius ID Registration

This submodule requires a script provided by gemius.com. For more information, please contact us at: [https://gemius.com/contact/](https://gemius.com/contact/).

## Gemius ID Configuration

The Gemius ID module does not require any configuration parameters except `params.storage` as provided in example

## Gemius ID Example

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'gemiusId',
            storage: {
                name: 'pbjs_gemiusId',
                type: 'cookie',
                expires: 30,
                refreshInSeconds: 3600
            }
        }]
    }
});
```
