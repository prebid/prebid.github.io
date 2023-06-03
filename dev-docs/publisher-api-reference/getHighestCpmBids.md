---
layout: api_prebidjs
title: pbjs.getHighestCpmBids([adUnitCode])
description: getHighestCpmBids API
sidebarType: 1
---


Use this method to retrieve an array of winning bids.

* `pbjs.getHighestCpmBids()`: with no argument, returns an array of winning bid objects for each ad unit on page
* `pbjs.getHighestCpmBids(adUnitCode)`: when passed an ad unit code, returns an array with the winning bid object for that ad unit

{: .alert.alert-warning :}
Note that from **Prebid 3.0** onwards, `pbjs.getHighestCpmBids` will not return rendered bids.