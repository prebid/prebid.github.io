---
layout: bidder
title: Publir
description: Prebid Publir Bidder Adapter
multiformat_supported: will-bid-on-any
pbjs: true
biddercode: publir
media_types: banner, video
schain_supported: true
tcfeu_supported: false
gvl_id: none
usp_supported: true
floors_supported: true
userIds: all
sidebarType: 1
safeframes_ok: true,
coppa_supported: true
---

### Note

The Publir adapter requires setup and approval. Please reach out to [info@publir.com] to setup an Publir account.

### Bid Parameters

#### Banner, Video

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description | Example
| ---- | ----- | ---- | ----------- | -------
| `pubId` | required | String |  Publir publisher Id provided by your Publir representative  | "1234567890abcdef12345678"

## Example

```javascript
var adUnits = [{
    code: 'hre_div-hre-vcn-1',
    sizes: [[1080, 1920]]],
    mediaTypes: {
        banner: {
        sizes: [
            [1080, 1920],
        ],
        },
    },
    bids: [{
        bidder: 'publir',
        params: {
        pubId: '1234567890abcdef12345678'
        }
    }]
}];
```

### Configuration

Publir required setting UserSync by iframe for monetization.
