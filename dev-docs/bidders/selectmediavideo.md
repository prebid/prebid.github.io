---
layout: bidder
title: SelectMedia Video
description: Prebid SelectMedia Video Bidder Adapter
pbjs: true
biddercode: selectmediavideo
aliasCode: aniview
media_types: banner, video
gvl_id: 780 (aniview)
gdpr_supported: true
usp_supported: true
schain_supported: true
safeframes_ok: true
sidebarType: 1
---

### Note

For more information about [SelectMedia](https://www.selectmedia.asia/), please contact <info@selectmedia.asia>.

### Bid Params

{: .table .table-bordered .table-striped }
| Name             | Scope    | Description      | Example                      | Type     |
|------------------|----------|------------------|------------------------------|----------|
| `AV_PUBLISHERID` | required | Publisher/Netid  | `'55b88d4a181f465b3e8b4567'` | `string` |
| `AV_CHANNELID`   | required | Channel id       | `'5a5f17a728a06102d14c2718'` | `string` |

### Test Parameters

```javascript
const videoAdUnit = [
{
  code: 'video1',
  mediaTypes: {
    video: {
      playerSize: [[640, 480]],
      context: 'outstream'
    },
  },
  bids: [{
    bidder: 'selectmediavideo',
    params: {
      AV_PUBLISHERID: '55b78633181f4603178b4568',
      AV_CHANNELID: '5d19dfca4b6236688c0a2fc4'
    }
  }]
}];
```
