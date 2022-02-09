---
layout: page_v2
sidebarType: 5
title: Prebid Server | Features | Native Support

---

# Prebid Server | Features | Native Support

Support for the Native format in Prebid Server is simple:

1. Bid adapters that support the native format must declare it in their static config. In PBS-Go, this is capabilities.{site,app}.mediaTypes. For PBS-Java it's adapters.BIDDER.meta-info.{site,app}-media-types.
1. Prebid Server passes the imp[].native object through to bid adapters that support native.
1. When receiving a native bid response, PBS checks that each asset in the response carries a `type`. If it does not, PBS helpfully links the assetIds in the request and response and adds the original asset type to the response.
1. When this bid is chosen as the winner, the Prebid Universal Creative uses the type for proper rendering.


## Related Reading
- [Prebid Native Format](/formats/native.html)
