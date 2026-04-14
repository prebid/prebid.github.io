---
layout: userid
title: Adtelligent
description: Adtelligent User ID sub-module
useridmodule: adtelligentIdSystem
bidRequestUserId: adtelligentId
eidsource: adtelligent.com
example: '"1111"'
---


The [Adtelligent](https://adtelligent.com) ID system is a unique per-session user identifier for providing high quality DMP data for advertisers

Add it to your Prebid.js package with:

```bash
gulp build --modules=userId,adtelligentIdSystem
```

## Adtelligent Configuration

adtelligentIdSystem adapter doesn't require any configuration or storage params. The adapter performs asynchronously and to achieve better performance it is recommended to set the `storage` object `refreshInSeconds` to a short period, such as ten minutes. At the end of the set storage refresh the adapter will refresh its configuration.

## Adtelligent Example

```javascript
 pbjs.setConfig({
     userSync: {
         userIds: [{
             name: 'adtelligent'
         }]
     }
 });
```

Example with a short storage for ~10 minutes and refresh in 5 minutes:

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'adtelligent',
            storage: {
                type: "html5",
                name: "adt_id",
                expires:0.003,
                refreshInSeconds: 60 * 5
            }
        }]
    }
});
```
