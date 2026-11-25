---
layout: userid
title: Merkle ID
description: Merkle IDUser ID sub-module
useridmodule: merkleIdSystem
bidRequestUserId: merkleId
eidsource: merkleinc.com
example: '"1111"'
---


[Merkury by Merkle](https://merkury.merkleinc.com/contact) enables marketers, media owners, and publishers to own, build, and control a cookie-less Private Identity Graph. Merkury uses an organization’s first-party CRM data and valuable interactions such as logins, outbound email campaigns and media reach to create and grow a universe of person-based IDs for cross-channel targeting, personalization, measurement and more.

## Merkury by Merkle ID Configuration

{: .table .table-bordered .table-striped }

| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module. | `"merkleId"` |
| params | Required | Object | Container of all module params. | |
| params.sv_pubid | Required | String | Publisher ID provided by Merkle. No ID is requested without it. | `"example_pubid"` |
| params.ssp_ids | Required | String[] | SSP IDs provided by Merkle. No ID is requested without it. | `["example_sspid_1"]` |
| params.endpoint | Optional | String | ID endpoint URL. Default `https://prebid.sv.rkdms.com/identity/`. | |
| params.sv_domain | Optional | String | Domain sent as `sv_domain`. Defaults to the page's root domain. | `"example.com"` |
| params.sv_session | Optional | String | Session ID sent as `sv_session`. Defaults to the `_svsid` cookie, which the module sets when the ID response includes one. | |
| params.refreshInSeconds | Optional | Number | Age in seconds after which the module requests a new ID to replace the stored one. Default `25200` (7 hours). If both `storage.refreshInSeconds` and `params.refreshInSeconds` are set, the module never refreshes the stored ID itself and leaves refreshing to the User ID module. | `86400` |

## Merkury by Merkle ID Examples

Publisher stores Merkury by Merkle in local storage for 30 days

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
        name: 'merkleId',
        params: {
          sv_pubid:'example_pubid',
          ssp_ids: ['example_sspid_1', 'example_sspid_2']
        },
        storage: {
          type: 'html5',
          name: 'merkleId',
          expires: 30
        }
      }]
    }
});
```
