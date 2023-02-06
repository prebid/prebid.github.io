---
layout: bidder
title: AJA
description: Prebid AJA Bidder Adaptor
userIds: criteo, unifiedId, imuid
pbjs: true
pbs: true
biddercode: aja
media_types: video, native
sidebarType: 1
---

### Note

The AJA Bidding adaptor requires setup and approval before beginning. Please reach out to <ssp_support@aja-kk.co.jp> for more details

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|-------|----------|---------------------|------------|----------|
| `asi` | required | ad spot hash code | `'123abc'` | `string` |

### Configuration

AJA recommends setting UserSync by iframe for monetization.

For Prebid.js v1.15.0 and later:

```javascript
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: "*", // '*' represents all bidders
        filter: "include",
      },
    },
  },
});
```

For Prebid.js v1.14.0 and before:

```javascript
pbjs.setConfig({
  userSync: {
    iframeEnabled: true,
    enabledBidders: ["aja"],
  },
});
```
