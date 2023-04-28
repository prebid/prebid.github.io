---
layout: userid
title: Utiq
description: Utiq User ID sub-module
useridmodule: utiqSystem
---


Utiq generates unique tokens, enabling improved efficiency in programmatic advertising while safeguarding transparency and control for end customers via `utiq.com`. A website visitor’s Utiq is generated based on network identifiers provided by network operators and requires explicit user consent.

Utiq is also the brand name of the service, which is provided by Utiq SA/NV.

## Utiq configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of the module | `"utiq"`
| params | Required | Object | Object with configuration parameters for utiq User Id submodule | - |
| params.maxDelayTime | Required | Integer | Max amount of time (in seconds) before looking into storage for data | 2500 |
| bidders | Required | Array of Strings | An array of bidder codes to which this user ID may be sent. Currently required and supporting AdformOpenRTB | `['adf']` |
| storage | Required | Object | Local storage configuration object | - |
| storage.type | Required | String | Type of the storage that would be used to store user ID. Must be `"html5"` to utilise HTML5 local storage. | `"html5"` |
| storage.name | Required | String | The name of the key in local storage where the user ID will be stored. | `"utiq"` |
| storage.expires | Required | Integer | How long (in days) the user ID information will be stored. For safety reasons, this information is required.| `1` |

Configuration example:

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [
      {
        name: "utiq",
        params: {
          maxDelayTime: 2500,
        },
        bidders: ["adf"],
        storage: {
          type: "html5",
          name: "utiq",
          expires: 1,
        },
      }],
    syncDelay: 3000,
    auctionDelay: 3000
  }
});
```

## Utiq onboarding

If you wish to find out more about Utiq, please contact onboarding@utiq.com
