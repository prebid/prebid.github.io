---
layout: userid
title: AudienceOne ID by DAC
description: AudienceOne ID by DAC User ID sub-module
useridmodule: dacIdSystem
---


AudienceOne ID, provided by [D.A.Consortium Inc.](https://www.dac.co.jp/), is ID for ad targeting by using 1st party cookie.
Please visit [https://solutions.dac.co.jp/audienceone](https://solutions.dac.co.jp/audienceone) and request your Owner ID to get started.

Add the AudienceOne ID to your Prebid.js Package with:

{: .alert.alert-info :}
gulp build --modules=dacIdSystem

## AudienceOne ID Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module | `"dacId"` |
| params | Required | Object | Details of module params. | |
| params.oid | Required | String | This is the Owner ID value obtained via D.A.Consortium Inc. | `"55h67qm4ck37vyz5"` |

## AudienceOne ID Example

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'dacId',
            params: {
                'oid': '55h67qm4ck37vyz5' // Set your AudienceOne Owner ID here
            }
        }]
    }
});
```
