---
layout: bidder
title: Synacor Media
description: Prebid Synacor Media Bidder Adapter
hide: true
biddercode: synacormedia
biddercode_longer_than_12: false
media_types: banner
gdpr_supported: false
---

### Note:

The Synacor Media bidder adapter requires setup and approval from Synacor. Please reach out to your account manager for more information and to start using it.

### Configuration

Synacor Media requires that iframe is used for user syncing.

Example configuration:

```javascript
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: '*', // represents all bidders
        filter: 'include'
      }
    }
  }
});
```

### Bid params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| ---- | ----- | ----------- | ------- | ---- |
| `seatId` | required | The seat ID from Synacor Media. This will be the same for all ad units. | `'prebid'` | `string` |
| `placementId` | required | The placement ID from Synacor Media. | `'demo1'` | `string` |
| `bidfloor` | optional | The floor price for the request. | `0.1` | `float` |
| `pos` | optional | The position of the placement on the page, see Open RTB spec v2.5. | `0` | `int` |

