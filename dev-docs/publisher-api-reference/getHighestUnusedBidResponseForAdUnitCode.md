---
layout: api_prebidjs
title: pbjs.getHighestUnusedBidResponseForAdUnitCode(adUnitCode)
description: 
---

Use this method to retrieve the highest unused bid for the specified adUnit. Unused means not it's not rendered.

This differs from [`getHighestCpmBids()`](#module_pbjs.getHighestCpmBids) in that getHighestCpmBids only considers bids for auctions that have completed (and are also unused), this function considers bids for ongoing auctions as well.
