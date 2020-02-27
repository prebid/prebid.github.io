---
layout: bidder
title: RDN
description: Prebid RDN Bidder Adaptor
hide: true
biddercode: rdn
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description    | Example | Type     |
|---------------|----------|----------------|---------|----------|
| `adSpotId`    | required | The AdSpot ID  | 1234    | `int`    |

### Configuration

The RDN adapter allows the endpoint to be configured with the following configuration option.  

``` javascript
pbjs.setConfig({
   rdn: {
     endpoint: "https://new-endpoint.rakuten.com"
   }
});
```

If unspecified the adapter will fallback to the default endpoint.
