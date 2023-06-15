---
layout: userid
title: IM-UID by Intimate Merger
description: IM-UID by Intimate Merger User ID sub-module
useridmodule: imuIdSystem
---

IM-UID, provided by [Intimate Merger](https://corp.intimatemerger.com/), is a universal identifier that designed for publishers, platforms and advertisers to perform segmentation and targeting even in environments where 3rd party cookies are not available. IM-UID is currently only available in Japan.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=imuIdSystem

## IM-UID Registration

Please visit [https://lp.intimatemerger.com/im-uid](https://lp.intimatemerger.com/im-uid) and request your Customer ID to get started.

The Intimate Merger privacy policy is at https://corp.intimatemerger.com/privacypolicy/

## IM-UID Configuration

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module. | `"imuid"` |
| params | Required | Object | Details of module params. | |
| params.cid | Required | Number | This is the Customer ID value obtained via Intimate Merger. | `5126` |
| params.url | Optional | String | Use this to change the default endpoint URL. | `"https://example.com/some/api"` |

## IM-UID Example

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "imuid",
            params: {
                cid: 5126 // Set your Intimate Merger Customer ID here for production
            }
        }]
    }
});
```
