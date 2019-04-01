---
layout: bidder
title: AJA
description: Prebid AJA Bidder Adaptor
hide: true
biddercode: aja
biddercode_longer_than_12: false
media_types: video, native
---

### Note:

The AJA Bidding adaptor requires setup and approval before beginning. Please reach out to <ssp_support@aja-kk.co.jp> for more details

### bid params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description         | Example    | Type     |
|-------|----------|---------------------|------------|----------|
| `asi` | required | ad spot hash code   | `'123abc'` | `string` |

### Configuration

AJA recommends setting UserSync by iframe for monetization.

For Prebid.js v1.15.0 and later:

```javascript
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: '*',      // '*' represents all bidders
        filter: 'include'
      }
    }
  }
});
```

For Prebid.js v1.14.0 and before:

```javascript
pbjs.setConfig({
  userSync: {
    iframeEnabled: true,
    enabledBidders: ['aja']
  }
});
```

