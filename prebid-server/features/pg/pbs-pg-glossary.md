---
layout: page_v2
sidebarType: 5
title: Programmatic Guaranteed Glossary
---

# Programmatic Guaranteed Glossary
{: .no_toc}

* TOC
{:toc}

## Basic terminology

- **Programmatic Ad** - an ad request that flows through the multi-vendor ad tech ecosystem
- **Guaranteed** - A buyer and seller have entered into a contract: to deliver a certain amount of impressions to a particular target over a particular date range. If contract isn't met, there may be financial penalties or extra impressions.
- **PG Host Company** - the entity running the Prebid PG software: Prebid Servers, General Planner, Delivery Stats, and Dimension Value API.
- **Prebid Ad Slot** - the "hole in the page" that's requesting an ad (note: this is not currently standard Prebid.org terminology).
- **Prebid Ad Unit** - a package of bidding parameters that defines which bidders and bid parameters are to be used for a specific "hole in the page".
- **Client Requests** - OpenRTB-like network calls from a client to the Prebid Server requesting one or more auctions.
- **Auction Requests** - a single OpenRTB ad request may contain 1 or more 'imp' blocks that define different auction scenarios. Each of these blocks is an "auction". Auctions are sent to one or more bidders and are associated with auction parameters for each bidder.
- **PG Bidder** - the ad exchange, demand side platform, or other bid source that directly or indirectly connects the Auction Request to a bid. Example bidders include Magnite, Criteo, etc.
- **Bidder Parameters** - the specific parameters required by the bidder describing the auction to take place. The Rubicon account, site, and zone are example parameters.
- **PG Line Item** - the base unit of ad delivery has a goal, date range, target, creatives, deal ID, and pacing options.
- **AdServer Line Item** - corresponding to the PG Line Item, the AdServer has a similar line item which prioritizes the PG Line Item in relation to other direct-sold agreements. It may also have a goal and date range, but the targeting will be just to the deal ID, not the full PG target. The creative is the Prebid-standard creative instead of the actual creative.
- **Deal** - an agreement between a buyer and a seller. In the PG context, a Deal may be comprised of 1 or more line items for different media types, targets, date ranges, etc. Since most bidders won't understand "line items", a candidate Deal ID is likely to be what's passed to each bidder.
- **Line Item Type** - sponsorship, guaranteed, non-guaranteed, house. 
- **Creative** - the actual ad that will be seen by an end user. May be an image, HTML, video, or native.
- **Target** - a description of the specific sites, user, device, and geographic characteristics a line item is aimed at.
- **Goal** - How many total impressions a campaign line needs to serve
- **Bonus** - Extra impressions assigned to a campaign line to make sure it delivers at least the total goal. This may be stated as a percentage or a number of impressions. Bonus is important to make sure that impression counting discrepancies don't cause the campaign to be perceived as missing its goal.
- **Goal Type** - which metric is used to meet the goal. (i.e. wins or views) 
- **Start and End Datetime** - the date range for the campaign could include starting and ending mid-day. Each campaign may also be associated with a timezone. 
- **Delivery Type** - defines the general shape of the desired delivery curve: 
    - even delivery - impressions are roughly equal each day of the campaign
    - front-loaded delivery - there may be more impressions delivered in the early days of the campaign
    - as-soon-as-possible - serve this thing whenever there's a chance
- **Historic Delivery** - Number of impressions a line delivered until the end of previous day.
- **Deficit** - The number of impressions a line is behind due to lack of overall inventory, existence of road-blocks, or other reason.
- **Late Deficit** - Number of impressions that a line is behind due to trafficking reasons, normally late creative. We may choose to catch up on a late deficit differently than other kinds of deficits because it's the fault of the advertiser, and it could affect other campaigns.
- **Priority** - a way of ranking competing line items against each other.
- **Oversold** - one or more guaranteed line items are struggling and are unlikely to reach their goals. In some cases it may be better to let some of the line items finish at the expense of others, while in other scenarios it's better to distribute what's available. 
- **Underdelivery** - when a line item is not serving enough impressions to meet its goal.
- **Overdelivery** - when a line item is serving too many impressions, or has met its delivery goal too early.
- **Frequency Cap** - how often a given user is allowed to see the advertising message.
- **Discrepancy** - impressions are counted by multiple systems which often different from each other by a few percent. The buyer and seller agree on which numbers are billable. The ad system needs to deliver enough impressions that the goal is met in the system-of-record.
- **Ad Inventory** - the combined set of attributes supplied with an ad request, whether direct or indirect. e.g. page context, user info, device info, etc. Line Item 'Targets' inspect these inventory attributes for matching.
- **Forecast** - how much inventory of a particular type is expected to come in over a specified time period. e.g. "how many 300x250 ad requests from example.com will come from Windows machines next week?"
- **Commitment** - a guaranteed line item that the publisher has promised to deliver to an advertiser.
- **Availability** - starts with the Projection, but removes traffic that's already sold to other committed line items.
- **Availability Buffer** - a safety factor to recognize that projections are always an estimate, and only the most sophisticated delivery systems can properly support the juggling involved in tightly sold overlapping inventory.

## Metrics

The basic design of the metrics offered by the PG system is a funnel that allows us to see where a line item's chance to deliver may be struggling. Here are the metrics available:

- **clientAuctions** - the total number of auction impression requests seen by the system across all accounts. A single HTTPS request to PBS may contain multiple auction requests – this number basically reflects all auctions taking place.
- **accountAuctions** - the number of auctions taking place for the specific Rubicon Project account ID
- **domainMatched** - the number of times the domain portion of this line item's target matched an impression request. e.g. "1000 auctions for example.com". If there is no domain targeting, this number should be the same as accountAuctions.
- **targetMatched** - the number of times the line item's entire target matched a request.
- **targetMatchedButFcapped** - the number of times the line item's entire target matched a request, but the user ad already reached their personal frequency cap limit for this line item.
- **targetMatchedButFcapLookupFailed** - the number of times the line item's entire target matched a request, but was removed from consideration because the lines item has a frequency cap and the lookup to the Frequency Capping system failed.
- **pacingDeferred** - Prebid has taken the line item out of consideration in order to make sure it's not delivering too often
- **sentToBidder** - only the top few matching line items or deals will be sent to each bidder. This metric indicates whether the line item was in the top few.
- **sentToBidderAsTopMatch** - if the line item was considered most ready to serve by Prebid Server before going to the bidder, this metric will be incremented.
- **receivedFromBidder** - this metric indicates whether the bidder chose this deal/line item from the candidates sent to it. Bidders may reject any suggested Deal ID or fail to respond.
- **receivedFromBidderInvalidated** - indicates the number of times this deal/line item was received from a bidder, but rejected by Prebid Server for any reason. Rejection reasons include: incorrect size for auction, target didn't match, ahead of pace and not ready to serve.
- **sentToClient** - indicates how many times this line item was sent as the bidder's top match to the client, and therefore the ad server.
- **sentToClientAsTopMatch** - indicates how many times this line item was sent to the client/ad server flagged by Prebid Server as the most eligible PG line item.
- **lostToLineItems** - this array provides a measure of which competing line items have been considered more eligible to serve than this line item
- **events** - how many times this line item received notification of the stated event type. For now only the only supported event type is "win", but eventually there may be other types like "click", "video 50% played", etc.

Here's a graphical representation showing what point in the delivery funnel each of these metrics measures:

![PG Metrics](/assets/images/prebid-server/pg/pg-metrics.png){: .pb-xlg-img :}

## Related Topics

- [PG Home Page](/prebid-server/features/pg/pbs-pg-idx.html)
- [PG White Paper](https://files.prebid.org/pg/Prebid_Programmatic_Guaranteed_White_Paper.pdf)
