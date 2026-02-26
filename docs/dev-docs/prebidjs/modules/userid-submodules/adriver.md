---
title: Adriver ID
description: Adriver ID User ID sub-module
useridmodule: adriverId
bidRequestUserId: adriverId
eidsource: adriver.ru
example: '"1111"'
---

## Adriver ID Configuration


| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module: `"adriverId"` | `"adriverId"` |

## Adriver ID Example

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "adriverId"
        }]
    }
});
```
