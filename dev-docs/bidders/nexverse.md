
---
layout: bidder
title: Nexverse
description: Prebid Nexverse Bidder Adapter
biddercode: nexverse
gdpr_supported: true
usp_supported: true
coppa_supported: true
tcf2_supported: true
prebid_1_0_supported: true
media_types: banner, video, native
schain_supported: true
userId: pubCommonId, unifiedId, id5Id, identityLink, britepoolId, dmdId, criteo, netId, sharedId, intentIqId, zeotapIdPlus
pbs_supported: true
---

### Nexverse Bidder Adapter

#### Bidder Parameters

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                     | Example     | Type     |
|--------------|----------|---------------------------------|-------------|----------|
| `uid`        | required | Unique user ID                  | `"12345"`   | `string` |
| `pub_id`     | required | Publisher ID                    | `"67890"`   | `string` |
| `pub_epid`   | required | Publisher endpoint ID           | `"epid123"` | `string` |

#### Example Ad Unit

```javascript
var adUnits = [{
  code: 'ad-slot-1',
  mediaTypes: {
    banner: {
      sizes: [[300, 250]]
    }
  },
  bids: [{
    bidder: 'nexverse',
    params: {
      uid: '12345',
      pub_id: '67890',
      pub_epid: 'epid123'
    }
  }]
}];
```

#### Test Parameters

```javascript
{
  bidder: 'nexverse',
  params: {
    uid: '12345',
    pub_id: '67890',
    pub_epid: 'epid123'
  }
}
```
