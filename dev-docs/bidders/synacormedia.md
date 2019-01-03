---
layout: bidder
title: Synacor Media
description: Prebid Synacor Media Bidder Adapter
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: synacormedia
biddercode_longer_than_12: false
prebid_1_0_supported: true
media_types: banner
gdpr_supported: false

---
### "Send All Bids" Ad Server Keys:

`hb_pb_synacormedia`
`hb_adid_synacormedia`
`hb_size_synacormedia`

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

