---
layout: internal_api_prebidjs
title: pbjs.registerBidAdapter(bidderAdapter, bidderCode)
description: Wrapper to register a bid adapter externally
sidebarType: 1
---

This function provides a wrapper to register a bid adapter externally.


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
