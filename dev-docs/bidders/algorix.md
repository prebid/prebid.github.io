---
layout: bidder
title: AlgoriX
description: Prebid AlgoriX Bidder Adapter
gvl_id: 1176
biddercode: algorix
tcfeu_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
media_types: banner, video, native
pbjs: true
pbs: true
pbs_app_supported: true
prebid_member: true
sidebarType: 1
userIds: all
---

### Note

AlgoriX adapter requires setup and approval from the AlgoriX team, even for existing in-app developers and publishers. Please reach out to your account team or email to <prebid@algorix.co> for more information.

### Prebid Server Adapter Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description   | Example                              | Type     |
|---------------|----------|---------------|--------------------------------------|----------|
| `sid`         | required | Sid           | `'30014'`                            | `string` |
| `token`       | required | Token         | `'028bca2d3b5c4f0ba155fa34864b0c4d'` | `string` |
| `placementId` | optional | Placement Id  | `'123456'`                           | `string` |
| `appId`       | optional | App Id        | `'asdasdasd'`                        | `string` |
| `region`      | optional | Server Region | `'APAC', 'USE', 'EUC'`               | `string` |

Note:

* Prebid Server adapter only checks for and uses first imp bid params. All other imp bid params are ignored.
* placementId and appId will be generated on AlgoriX Platform.
* region is optional param, which determine the AlgoriX server. APAC for SG endpoint, USE for US endpoint, EUC for EU endpoint, Other for Global endpoint.

### Prebid.js Adapter Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description   | Example                              | Type     |
| ------------- | -------- | ------------- | ------------------------------------ | -------- |
| `sid`         | required | Sid           | `'260785'`                           | `string` |
| `token`       | required | Token         | `'89b6d58567e3913e507f2be61fe8823e'` | `string` |
| `region`      | optional | Server Region | `'APAC', 'USE', 'EUC'`               | `string` |

### Test Parameters

```javascript
var adUnits = [
{
    sizes: [
        [300, 250] // a display size
    ],     
    bids: [{
      bidder: 'algorix',
      params: {
        region: 'APAC', // optional
        sid: '260785', // required
        token: '89b6d58567e3913e507f2be61fe8823e', // required
      }
    }]
}];
```

Note:

* AlgoriX server-side Prebid Server adapter supports only `banner`, `video`,`native` media types. But AlgoriX client-side Prebid.js adapter supports only `banner`, doesn't support `video` and `native`.
