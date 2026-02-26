---
title: pbjs.getAllPrebidWinningBids()
description: getAllPrebidWinningBids API
---


Use this method to get all the bids that have been used to generate targeting but have not yet been rendered on the page. It matches winning bids only after targeting has been applied and before the ad is rendered. Useful for [troubleshooting your integration](/dev-docs/prebid-troubleshooting-guide).

* `pbjs.getAllPrebidWinningBids()`: returns an array of bid objects that have been used to generate targeting and have not yet been rendered on the page.
