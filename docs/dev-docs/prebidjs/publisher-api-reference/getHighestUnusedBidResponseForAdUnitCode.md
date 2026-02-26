---
title: pbjs.getHighestUnusedBidResponseForAdUnitCode(adUnitCode)
description: getHighestUnusedBidResponseForAdUnitCode API
---

Use this method to retrieve the highest unused bid for the specified adUnit. Unused means not it's not rendered.

This differs from [`getHighestCpmBids()`](/dev-docs/publisher-api-reference/getHighestCpmBids) in that getHighestCpmBids only considers bids for auctions that have completed (and are also unused), this function considers bids for ongoing auctions as well.
