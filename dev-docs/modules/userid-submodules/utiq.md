---
layout: userid
title: Utiq ID
description: Utiq User ID sub-module
useridmodule: utiqSystem
---

Utiq generates unique tokens, enabling improved efficiency in programmatic advertising while safeguarding transparency and control for end customers via `consenthub.utiq.com`. A website visitor’s Utiq is generated based on network identifiers provided by network operators and requires explicit user consent.

Utiq is also the brand name of the service, which is provided by Utiq SA/NV.

## Utiq ID configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of the module | `"utiq"`

Configuration example:

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [
      {
        name: "utiq",
      },
    ],
  },
})
```

## Utiq ID onboarding

If you wish to find out more about Utiq, please contact <csm@utiq.com>
