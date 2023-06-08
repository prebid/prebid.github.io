---
layout: bidder
title: AppierBR
description: Prebid Appier Bidder Adapter
biddercode: appierBR
aliasCode: appier
pbjs: true
media_types: banner
gdpr_supported: true
sidebarType: 1
---

#### Bid Params

{: .table .table-bordered .table-striped }
| Name      | Scope    | Description               | Example    | Type     |
|-----------|----------|---------------------------|------------|----------|
| `hzid`    | required | The zone ID from Appier.  | `"WhM5WIOp"` | `string` |

#### Custom Settings (Optional)

Set the "farm" to use region-specific server

```
pbjs.que.push(function() {
  // use the bid server in Taiwan (country code: tw)
  pbjs.setConfig({
    appier: {
      'farm': 'tw'
    }
  });
});
```

Explicitly override the bid server used for bidding

```
pbjs.que.push(function() {
  pbjs.setConfig({
    appier: {
      'server': '${HOST_NAME_OF_THE_SERVER}'
    }
  });
});
```
AppierBR is an aliased bidder for Appier
