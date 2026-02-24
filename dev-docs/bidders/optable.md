---
layout: bidder
title: Optable
description: Prebid Optable Bidder Adapter
biddercode: optable
pbjs: true
privacy_sandbox: paapi
prebid_member: true
sidebarType: 1
---

### Registration

If you have any questions regarding set up, please reach out to your account manager or <support@optable.co>.

### Bid Parameters

#### Banner

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| ---- | ----- | ----------- | ------- | ---- |
| `site` | required | Optable site ID provided by your Optable representative. | "aaaaaaaa" | String |

### AdUnit Format for Banner

```javascript
var adUnits = [
  {
    code: 'test-div',
    sizes: [[728, 90]],  // a display size
    mediaTypes: {'banner': {}},
    bids: [
      {
        bidder: 'optable',
        params: {
          site: 'aaaaaaaa',
        }
      }
    ]
  }
];
```
