---
layout: bidder
title: HypeLab
description: Prebid HypeLab Bidder Adapter
pbjs: true
pbs: false
biddercode: hypelab
sidebarType: 1
media_types: banner
userIds: all
safeframes_ok: false
floors_supported: false
fpd_supported: false
ortb_blocking_supported: false
---

### Registration

The HypeLab adapter requires setup and approval from the HypeLab team. Please reach out to your account manager for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|---------------|----------|------------------|---------|----------|
| `property_slug` | required | The property slug | `prebid` | `string` |
| `placement_slug` | required | The placement slug | `test_placement` | `string` |


### Example Banner Configuration

```js
var adUnits = [
  {
    code: 'banner-div',
    mediaTypes: {
      banner: {
        sizes: [[728, 90]],
      },
    },
    bids: [
        {
            bidder: 'hypelab',
            params: {
                property_slug: 'prebid',
                placement_slug: 'test_placement'
            }
        }
    ]
  }
]
```

