---
layout: userid
title: Utiq
description: Utiq User ID sub-module
useridmodule: utiqIdSystem
---

Utiq generates unique tokens, enabling improved efficiency in programmatic advertising while safeguarding transparency and control for end customers via `consenthub.utiq.com`. A website visitor’s Utiq is generated based on network identifiers provided by network operators and requires explicit user consent.

Utiq is also the brand name of the service, which is provided by Utiq SA/NV.

## Utiq configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of the module | `"utiqId"`
| params | Required | Object | Object with configuration parameters for utiq User Id submodule | - |
| params.maxDelayTime | Required | Integer | Max amount of time (in seconds) before looking into storage for data | 2500 |

Configuration example:

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [
      {
        name: "utiqId",
        params: {
          maxDelayTime: 2500,
        },
      },
    ],
  },
})
```

## Utiq onboarding

If you wish to find out more about Utiq, please contact <csm@utiq.com>
