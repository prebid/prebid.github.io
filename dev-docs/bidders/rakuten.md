---
layout: bidder
title: Rakuten
description: Prebid Rakuten Bidder Adaptor
pbjs: true
biddercode: rakuten
prebid_member: true
sidebarType: 1
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description    | Example | Type     |
|---------------|----------|----------------|---------|----------|
| `adSpotId`    | required | The AdSpot ID  | 1234    | `int`    |

### Configuration

The Rakuten adapter allows the endpoint to be configured with the following configuration option.  

``` javascript
pbjs.setConfig({
   rdn: {
     endpoint: "https://new-endpoint.rakuten.com"
   }
});
```

If unspecified the adapter will fallback to the default endpoint.
