---
layout: bidder
title: Undertone
description: Prebid undertone Bidder Adaptor
hide: true
biddercode: undertone
---



### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                               | Example    | Type      |
|---------------|----------|-------------------------------------------|------------|-----------|
| `placementId` | optional | Your placement ID (provided by undertone) | `"13as14d0"` | `string`  |
| `publisherId` | required | publisher ID (provided by undertone)      | `12345`    | `integer` |

### Configuration

To maximize revenue efficiency, please enable iframe-based user syncing. This functionality will improve user match rates and will help increasing the bid rate.

Example code to enable iframe user-sync for Undertone:

```javascript
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: ['undertone'],
        filter: 'include'
      }
    }
  }
});
```

Note: Combine the above the configuration with any other UserSync configuration. Multiple setConfig() calls overwrite each other and only last call for a given attribute will take effect.
