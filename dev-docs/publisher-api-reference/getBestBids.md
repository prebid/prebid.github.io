---
layout: api_prebidjs
title: pbjs.getBestBids([adUnitCode])
description: getBestBids API
sidebarType: 1
---


Use this method to retrieve an array of the most desirable bids. It works like [`getHighestCpmBids`](/dev-docs/publisher-api-reference/getHighestCpmBids.html), but picks the winner for each ad unit by desirability instead of CPM.

* `pbjs.getBestBids()`: with no argument, returns an array with the most desirable bid object for each ad unit on the page
* `pbjs.getBestBids(adUnitCode)`: when passed an ad unit code, returns an array with the most desirable bid object for that ad unit

A bid's desirability is its adjusted CPM unless a [`bidDesirabilityAdjustment`](/dev-docs/publisher-api-reference/bidderSettings.html#23-biddesirabilityadjustment) function in `bidderSettings` returns a different score. Higher desirability wins; when two bids are equally desirable, the one that responded fastest wins. Without a `bidDesirabilityAdjustment`, `getBestBids` and `getHighestCpmBids` usually return the same bids.

The same bids are left out as for `getHighestCpmBids`: rendered bids, and zero-CPM bids unless the bidder has `allowZeroCpmBids` set.

This is useful when the page renders the winning bids itself instead of sending targeting to an ad server, for example when the ad server bids into Prebid like any other bidder:

```javascript
pbjs.que.push(function() {
    pbjs.requestBids({
        bidsBackHandler: function() {
            pbjs.getBestBids().forEach(function(bid) {
                const iframe = document.getElementById(bid.adUnitCode).querySelector('iframe');
                pbjs.renderAd(iframe.contentWindow.document, bid.adId);
            });
        }
    });
});
```

{: .alert.alert-info :}
`pbjs.getBestBids` is available from Prebid.js 11.43.0. See `integrationExamples/adserver_first/basic_adserver_first.html` in the Prebid.js repository for a complete example page.
