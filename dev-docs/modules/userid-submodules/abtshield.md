---
layout: userid
title: ABTShield ID
description: ABTShield ID User ID sub-module
useridmodule: abtshieldIdSystem
bidRequestUserId: abtshieldId
eidsource: abtshield.com
example: '"abc-123-def-456"'
---

ABTShield provides cookie-less user identification and audience segmentation for publishers. The module fetches a unique user UUID and optional audience segments from the ABTShield MCR endpoint and surfaces them to bid adapters via the standard Prebid.js `user.eids` interface.

For more information and to obtain a service ID, visit [abtshield.com](https://abtshield.com).

## ABTShield ID Prerequisites

Before using this module you need a **service ID (`sid`)** - register at [abtshield.com](https://abtshield.com) to obtain a unique identifier for your integration. You must also whitelist every domain from which the module will be loaded in the ABTShield dashboard.

## ABTShield ID Configuration

Add the module to your Prebid.js build:

```bash
gulp build --modules=userId,abtshieldIdSystem
```

Then configure the module in your `userSync` configuration:

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'abtshieldId',
            params: {
                sid: 'pb.your-service-id'  // required
            },
            storage: {
                type: 'html5',
                name: 'abtshield_id',
                expires: 1
            }
        }]
    }
});
```

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| `params.sid` | Required | String | Service ID obtained from abtshield.com. |
| `params.endpoint` | Optional | String | Override the MCR endpoint. For test environments only. Must use HTTPS. |
| `storage` | Recommended | Object | Standard Prebid User ID storage block (`html5` or `cookie`). |

## ABTShield ID Example

This will add a `userId.abtshieldId` property to bid requests:

```javascript
{
  abtshieldId: {
    uuid: 'abc-123-def-456',
    segments: ['seg-1', 'seg-2']  // omitted when no segments are returned
  }
}
```

The `user.eids` entry will look like:

```javascript
{
  source: 'abtshield.com',
  uids: [{
    id: 'abc-123-def-456',
    atype: 1,
    ext: { segments: ['seg-1', 'seg-2'] }  // omitted when no segments are returned
  }]
}
```
