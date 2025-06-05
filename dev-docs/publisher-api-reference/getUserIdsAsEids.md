---
layout: api_prebidjs
title: pbjs.getUserIdsAsEids()
description: getUserIdsAsEids API
sidebarType: 1
---


{: .alert.alert-info :}
To use this function, include the [UserId module](/dev-docs/modules/userId.html) in your Prebid.js build.

If you need to export the user IDs stored by Prebid User ID module in ORTB Eids frormat, then the `getUserIdsAsEids()` function will return an array formatted as per [ORTB Eids](https://github.com/prebid/Prebid.js/blob/master/modules/userId/eids.md).

```javascript
pbjs.getUserIdsAsEids() // returns userIds in ORTB Eids format. e.g.
[
  {
      source: 'pubcid.org',
      uids: [{
          id: 'some-random-id-value',
          atype: 1
      }]
  },

  {
      source: 'adserver.org',
      uids: [{
          id: 'some-random-id-value',
          atype: 1,
          ext: {
              rtiPartner: 'TDID'
          }
      }]
  }
]
```
