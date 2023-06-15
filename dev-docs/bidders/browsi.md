---
layout: bidder
title: Browsi
description: Prebid Browsi Bidder Adapter
biddercode: browsi
pbjs: true
gvl_id: 329
gdpr_supported: true
usp_supported: true
media_types: no-display, video
schain_supported: true
safeframes_ok: true
sidebarType: 1
---

### Note:
For more information about [Browsi](https://www.browsi.com), please contact [support@browsi.com](support@browsi.com).

### Bid Params

{: .table .table-bordered .table-striped }
| Name             | Scope    | Description      | Example                      | Type     |
|------------------|----------|------------------|------------------------------|----------|
| `pubId` | required | Publisher ID  | `'117a476f-9791-4a82-80db-4c01c1683db0'` | `string` |
| `tagId`   | required | Tag ID       | `'1'` | `string` |

# Sample Ad Unit: For Publishers
```javascript
let videoAdUnit = [
    {
        code: 'videoAdUnit',
        mediaTypes: {
            video: {
                playerSize: [[300, 250]],
                context: 'outstream'
            },
        },
        bids: [{
            bidder: 'browsi',
            params: {
                pubId: '117a476f-9791-4a82-80db-4c01c1683db0', // Publisher ID provided by Browsi
                tagId: '1' // Tag ID provided by Browsi
            }
        }]
    }];
```
