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
    2. If the [`ext.prebid.targeting.preferdeals`](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#targeting) flag is true, then PBS will choose the highest value deal as the overall winner before choosing the highest value non-deal.

Note that is PBS is called from Prebid.js, the javascript code will make sure that hb_deal_BIDDER is present in the KVPs.

However, if Prebid.js is not present, PBS KVP responses are used by the adserver. 
So for app and AMP, if line items are targeted to `hb_deal`, only winning bids will be seen. If instead, line items are targeted to `hb_deal_BIDDER`, all deals will be seen if `ext.prebid.targeting.includebidderkeys` is defined to be true.

## Related Reading

- [Prebid Server Targeting](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#targeting)
