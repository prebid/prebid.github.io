---
layout: bidder
title: Robusta
description: Robusta Bidder Adaptor
biddercode: robusta
media_types: banner, video
tcfeu_supported: false
gpp_supported: false
usp_supported: false
pbjs: true
pbs: true
sidebarType: 1
---

# Bid Params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description      | Example | Type     |
|------------|----------|------------------|---------|----------|
| lineItemId | Required | The Line Item ID | `'123'` | `string` |


# Example Ad Unit Config

```javascript
var adUnits = [
  {
    code: 'banner-div',
    mediaTypes: {
      banner: {
        sizes: [[300, 250], [728, 90]]
      }
    },
    bids: [{
      bidder: 'robusta',
      params: {
        lineItemId: '323bfac4-a3cb-40e8-a3ae-e9832b35f969'
      }
    }]
  }
];
```