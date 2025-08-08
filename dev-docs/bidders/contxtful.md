---
layout: bidder
title: Contxtful
description: Prebid Contxtful Bidder Adapter
biddercode: contxtful
tcfeu_supported: false
usp_supported: true
coppa_supported: true
schain_supported: true
userId: all
media_types: banner, video, audio
safeframes_ok: true
floors_supported: true
fpd_supported: true 
pbjs: true
pbs: true
pbs_app_supported: false
prebid_member: true
multiformar_supported: will-bid-on-any
ortb_blocking_supported: true
---

### Note

The Contxtful bidder adapter requires some setup. Contact us at [contact@contxtful.com](mailto:contact@contxtful.com)

### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                | Example                      | Type                 |
|-------------|----------|------------------------------------------------------------|------------------------------|----------------------|
| `placementId`      | required | The placement identifier                                          | `'p12345678'` | `string`             |
| `customerId`      | required | The customer identifier              | `'DEMO123456'`       | `string`           |

### User Sync
Contxtful recommends enabling [User Syncing](https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html#setConfig-Configure-User-Syncing) to optimize match rate and monetization.

{% include dev-docs/storageAllowed.md %}

```javascript
// Enable iframe usersync 
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: ['contxtful'],
        filter: 'include'
      }
    }
  }
});

// Allow local storage usage
pbjs.bidderSettings = {
  contxtful: {
    storageAllowed: true
  }
}
```
