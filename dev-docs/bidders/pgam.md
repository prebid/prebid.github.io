---
layout: bidder
title: PGAM
description: Prebid PGAM Bidder Adapter
biddercode: pgam
media_types: video,banner
tcfeu_supported: false
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId
schain_supported: true
coppa_supported: true
usp_supported: true
safeframes_ok: true
prebid_member: true
pbjs: true
pbs: false
enable_download: false
sidebarType: 1
pbjs_version_notes: removed in 8.13.0
---

### Bid params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                     | Example  | Type      |
|-------|----------|---------------------------------|----------|-----------|
| `aid` | required | The source ID from PGAM.   | `529814` | `integer` |

### Description

PGAM header bidding adapter connects with PGAM demand sources in order to fetch bids.
This adapter provides a solution for accessing Video demand and display demand.

### Test Parameters

```javascript
var adUnits = [

  // Video instream adUnit
  {
    code: 'test-div',
    mediaTypes: {
      video: {
        context: 'instream',
        playerSize: [640, 480]
      }
    },
    bids: [{
      bidder: 'pgam',
      params: {
        aid: 472386
      }
    }]
  },

  // Video outstream adUnit
  {
    code: 'test-div',
    mediaTypes: {
      video: {
        context: 'outstream',
        playerSize: [640, 480]
      }
    },
    bids: [{
      bidder: 'pgam',
      params: {
        aid: 472386
      }
    }]
  },

    // Video ADPOD adUnit
  {
    code: 'test-div',
    sizes: [[640, 480]],
    mediaTypes: {
      video: {
        context: 'adpod',
        playerSize: [640, 480]            
      }
    },
    bids: [{
      bidder: 'pgam',
      params: {
        aid: 472386
      }
    }]
  },

  // Banner adUnit
  {
    code: 'test-div',
    mediaTypes:{
        banner:{
            sizes: [[300, 250]]
        }
    }
    bids: [{
      bidder: 'pgam',
      params: {
        aid: 529814
      }
    }]
  }
];
```
