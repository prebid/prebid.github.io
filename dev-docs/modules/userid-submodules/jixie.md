---
layout: userid
title: Jixie ID
description: Jixie ID User ID sub-module
useridmodule: jixieId
bidRequestUserId: jixieId
eidsource: jixie.io
example: '"1111"'
---


The Jixie ID module is specially useful for publishers that will connect with Jixie bidder through PrebidServer adapter feature of PrebidJS and/or for publishers that are unable to integrate with the Jixie ID/event script to still acquire the important Jixie client ID for users. 

For assistance setting up your module, please contact us at <partners.jixie.io>

Add the Jixie ID to your Prebid.js Package with:

```bash
gulp build --modules=userId,jixieIdSystem
```

## Jixie ID Registration

Please reach out to [partners.jixie.io](mailto:partners.jixie.io) to request your `accountid`

## Jixie ID Configuration

{: .table .table-bordered .table-striped }

| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of Module | `"jixieId"` |
| params | optional | Object | Container of all module params. |  |
| params.accountid | optional | String | This is your `accountid` as provided by Jixie. | `Mo165qXxxx` |

## DMD ID Example

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'jixieId',
            params: {
                accountid: 'Mo165qXxxx' // provided to you by Jixie
            }
        }]
    }
});
```
