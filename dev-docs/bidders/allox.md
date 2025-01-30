---
layout: bidder
title: Allox
description: Prebid Allox Bidder Adaptor
pbjs: true
biddercode: allox
media_types: banner
userIds: none
floors_supported: true
deals_supported: false
schain_supported: false
prebid_member: false
privacy_sandbox: none
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|---------------|----------|-----------------------------------|----------|----------|
| `placementId` | required | Ad placement ID provided by Allox | `'1234'` | `string` |

### Registration

The Allox bidding adapter requires setup and approval before use. Please contact mi-allox-devbot@ml.nttdocomo.com for more details.

### Modules to include in your build process

When running the build command, include `alloxBidAdapter` as a module, as well as `alloxAnalyticsAdapter`.

If a JSON file is being used to specify the bidder modules, add `"alloxBidAdapter"`
to the top-level array in that file.

```json
[
    "alloxBidAdapter",
    "alloxAnalyticsAdapter",
    "fooBidAdapter",
    "bazBidAdapter"
]
```

### Configuration

Access to local storage is required for Allox's Prebid adapter. Ensure that local storage access is enabled; otherwise, the adapter may not function properly.
```js
pbjs.bidderSettings = {
    allox: {
        storageAllowed: true
    }
};
```
