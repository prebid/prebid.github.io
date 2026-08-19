---
layout: api_prebidjs
title: pbjs.markWinningBidAsUsed(markBidRequest)
description: markWinningBidAsUsed API
sidebarType: 1
---


This function can be used to mark the winning bid as used, removing it from the bid cache. This is useful when running multiple video advertisements on the page, since these are not automatically marked as “rendered”.

If you know the adId, then be specific, otherwise Prebid will retrieve the winning bid for the adUnitCode and mark it accordingly.

#### Argument Reference

##### The `markBidRequest` object (use one or both)

{: .table .table-bordered .table-striped }
| Param | Type | Description |
| --- | --- | --- |
| adUnitCode | `string` | (Optional) The ad unit code |
| adId | `string` | (Optional) The id representing the ad we want to mark |
| events | `boolean` | (Optional) if true, triggers the 'bidWon' event and tracking pixels for the marked bid |
