---
layout: bidder
title: Appier
description: Prebid Appier Bidder Adapter
biddercode: appier
pbjs: true
media_types: banner
gdpr_supported: true
sidebarType: 1
---

<a name="appier-bid-params"></a>

#### Bid Params

{: .table .table-bordered .table-striped }
| Name      | Scope    | Description               | Example    | Type     |
|-----------|----------|---------------------------|------------|----------|
| `hzid`    | required | The zone ID from Appier.  | `"WhM5WIOp"` | `string` |

<a name="appier-custom-settings"></a>

#### Custom Settings (Optional)

Set the "farm" to use region-specific server

```javascript
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

```javascript
pbjs.que.push(function() {
  pbjs.setConfig({
    appier: {
      'server': '${HOST_NAME_OF_THE_SERVER}'
    }
  });
});
```
