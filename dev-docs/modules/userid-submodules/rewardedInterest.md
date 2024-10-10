---
layout: userid
title: Rewarded Interest ID
description: Rewarded Interest User ID Submodule
useridmodule: rewardedInterestIdSystem
---

[Rewarded Interest](https://www.rewardedinterest.com/) is an identity provider that enables users to monetize and manage the exposure of their identity to various ad providers through the Rewarded Interest browser extension.

This submodule passes the Rewarded Interest Identity Token, obtained from the browser extension, into the oRTB request. The Identity Token is included only if the browser has the Rewarded Interest extension installed, and the user has authorized it to share the token.

The Rewarded Interest Identity Token itself does not reveal the user's identity, as it is encrypted and refreshed frequently. Rewarded Interest partners (such as DSPs, SSPs, and publishers) can use the Rewarded Interest Backend API to exchange the Identity Token for a CMAID (Consumer Mediated Advertising Identifier). The CMAID is a durable, cross-site, cross-device advertising identifier that remains consistent across visits and devices enrolled by a Rewarded Interest user, unless they choose to reset or pause it.

Add this submodule to your Prebid.js wrapper with:

{: .alert.alert-info :}
gulp build --modules=userId,rewardedInterestIdSystem

## Rewarded Interest ID Configuration

<div class="table-responsive" markdown="1">
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of the Rewarded Interest user ID submodule. | `"rewardedInterestId"` |
{: .table .table-bordered .table-striped }
</div>

## Rewarded Interest ID Example

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "rewardedInterestId"
        }]
    }
})
```
