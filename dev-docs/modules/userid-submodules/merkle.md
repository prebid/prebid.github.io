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
