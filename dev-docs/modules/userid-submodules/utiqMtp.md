---
layout: userid
title: UtiqMtp ID
description: UtiqMtp User ID sub-module
useridmodule: utiqMtpIdSystem
---

Utiq generates unique tokens, enabling improved efficiency in programmatic advertising while safeguarding transparency and control for end customers via `consenthub.utiq.com`. A website visitor’s Utiq is generated based on network identifiers provided by network operators and requires explicit user consent.

Utiq provides different tokens type, known as adtechpass and martechpass. UtiqMtpId module helps publishers support and pass the martechpass token to their SSP partners of choice.
martechpass is a first party ID and shouldn't be forwarded to third parties. martechpass can be used to enable first party audience in publisher's SSPs.

Both Utiq and UtiqMtpId user id submodules can be used in parallel as both supports different use cases and scenarios.

Utiq is also the brand name of the service, which is provided by Utiq SA/NV.

## UtiqMtp ID configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of the module | `"utiqMtpId"` |

Configuration example:

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [
      {
        name: "utiqMtpId",
      },
    ],
  },
})
```

## Utiq ID onboarding

If you wish to find out more about Utiq, please contact <csm@utiq.com>
