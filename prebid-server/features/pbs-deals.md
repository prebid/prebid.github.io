---
layout: page_v2
sidebarType: 5
title: Prebid Server | Features | Deals
---

# Prebid Server | Features | Deals

Prebid Server supports Private MarketPlace deals in this way:

1. Prebid Server Bid Adapters can respond with a deal in `seatbid.bid.dealid`. All bids are returned to the client and the deal can pulled from `seatbid.bid.dealid`.
2. Prebid-style ad server targeting is also applied:
    1. If the deal is the highest bid overall and the [`ext.prebid.targeting.includewinners`](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#targeting) option is on, then the `hb_deal` targeting value will contain the winning deal ID.
    2. If the deal is the highest bid for a particular bidder and the [`ext.prebid.targeting.includebidderkeys`](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#targeting) is on, then the `hb_deal_BIDDER` targeting value will contain that deal ID

Ad server line items should be targeted to `hb_deal_BIDDER` (for sendAllBids)
or `hb_deal` (for sendTopBid).

Currently Prebid Server doesn't support the option of preferring deals over open market bids, though a [PreferDeals](https://github.com/prebid/prebid-server/issues/1355) flag is being considered.
