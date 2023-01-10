---
layout: bidder
title: CodeFuel
description: CodeFuel Prebid Bidder Adapter
pbjs: true
pbs: true
media_types: banner
biddercode: CodeFuel
gdpr_supported: false
usp_supported: false
floors_supported: false
sidebarType: 1
---

### Description

Module that connects to Codefuel bidder to fetch bids.
Display format is supported but not native format. Using OpenRTB standard.

### Bid Params
{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                         | Example                                  | Type     |
|---------------|----------|-------------------------------------|------------------------------------------|----------|
| `placementId` | required | Placement-Id defined by the caller  | `'0111f8ac-2d40-4613-8557-b47dbf622fff'` | `string` |


### Configuration


```javascript
    pbjs.setConfig({
    codefuel: {
        bidderUrl: 'https://prebidtest.zemanta.com/api/bidder/prebidtest/bid/'
    }
});
```
