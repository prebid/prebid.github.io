---
layout: bidder
title: Shinez
description: Prebid Shinez Bidder Adapter
biddercode: shinez
media_types: banner
pbjs: true
enable_download: false
pbjs_version_notes: not in 5.x
---

### Registration

The Shinez adapter requires setup and approval from the Shinez team. Please reach out to tech-team@shinez.io for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description          | Example    | Type     |
|------------|----------|----------------------|------------|----------|
| `placementId` | required | A Shinez-specific identifier that is associated with a specific domain provided by your Shinez representative.  | `'00654321'` | `string` |
| `unit` | optional | An alphanumerical value used to identify the slot_id in reporting. | `'__header-bid-1'`   | `string` |

### Examples

#### Example Banner Ad Unit

```javascript
var adUnit = {
  code: "test-div",
  mediaTypes: {
    banner: {
      sizes: [[300, 250]]
    }
  },
  bids: [{
    bidder: "shinez",
    params: {
      placementId: "00654321"
    }
  }]
};
```
