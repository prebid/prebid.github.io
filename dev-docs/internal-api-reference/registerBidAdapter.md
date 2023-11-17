---
layout: internal_api_prebidjs
title: pbjs.registerBidAdapter(bidderAdapter, bidderCode)
description: Wrapper to register a bid adapter externally
sidebarType: 1
---

This function provides a wrapper to register a bid adapter for use by Prebid.js. The intended use case is in registering a non-open-source adapter that a publisher may add into their Prebid.js package. After calling this function, Prebid.js will recognize the biddercode in adunits and everywhere a bidder code can be used.

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| bidderAdapter | Required | `function` | bid adapter instance that returns a `callBids` function  |
| bidderCode | Required | `string` | code to correlate with the bid adapter  |

```javascript
let myAdapter = function myAdapter() {
            return {
                callBids: function(p) {
                    ...
                }
            };
        };
        pbjs.registerBidAdapter(myAdapter, 'my');
```
