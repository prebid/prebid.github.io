---
layout: userid
title: UtiqMtp ID
description: UtiqMtp User ID sub-module
useridmodule: utiqMtpIdSystem
---

Utiq generates unique tokens, enabling improved efficiency in programmatic advertising while safeguarding transparency and control for end customers via `consenthub.utiq.com`. A website visitor’s Utiq ID is generated based on network identifiers provided by network operators and requires explicit user consent.

Utiq provides different tokens type, known as 'adtechpass' and 'martechpass'. UtiqMtpId module helps publishers support and pass the 'martechpass' token to their SSP partners of choice. 'martechpass' is a first party ID meant to enable first party audiences in the SSP and shouldn't be forwarded to other parties.

Both Utiq and UtiqMtpId user id submodules can be used in parallel as both supports different use cases and scenarios.

Utiq is also the brand name of the service, which is provided by Utiq SA/NV.

## Utiq installation

In order to use utiq in your prebid setup, you must first integrate utiq solution on your website as per <https://docs.utiq.com/>
If you are interested in using Utiq on your website, please contact Utiq on <https://utiq.com/contact/>

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
