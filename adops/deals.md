---
layout: page_v2
title: Deals in Prebid
head_title: Deals in Prebid
sidebarType: 3
sbUUID: 3.2
---

# Deals in Prebid

{: .no_toc }

* TOC
{: toc }

In the same way that you can negotiate deals with advertisers in your ad server, you can also set up deals with your header bidding partners. When you do that, there are just a few things to keep in mind to ensure those deals get sent to the ad server and your line items are prepared to receive them.

## Send Deal to Ad Server

In [Send All Bids vs Top Price](/adops/send-all-vs-top-price.html) we described those two options for sending bids to the ad server. There is also a third option created specifically for deals: Send top price and deals.

### Deals with Send All Bids

If you send all bids to the ad server, deals will be sent along with the rest of the bids. If you want your deals to be prioritized over the rest of the bids, be sure to inform the software engineers so they can configure Prebid for this scenario.

{: .alert.alert-info :}
See [Configure Send Bids Control](/dev-docs/publisher-api-reference/setConfig.html#configure-send-bids-control) for engineering instructions on this configuration.

### Deals with Send Top Price

If you decide to send only the top price bid, the deal might not be the top price, in which case it would not be sent and the ad server would never see it. To ensure deals make it to the ad server, the software engineers need to know that deal bids should be included along with the top priced bid. They can then configure Prebid to send both the top price and any deals that come through.

{: .alert.alert-info :}
See the  [Send All Bids engineering reference](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Send-All-Bids) for engineering instructions on sending deals along with the top bid.

## Deal Line Item Details

In [Line Item Creation](/adops/line-item-creation.html) we talked about some requirements and recommendations for setting up line items for Prebid. You can follow most of those settings for deals, with the modifications outlined here.

### Deal Key Value Pairs

From the ad server side, you need to create special line items for each deal. This is done through a key-value pair. (See [Key Values](/adops/key-values.html) for details on how key value pairs work.)

For each header bidding partner you negotiate deals with, create a keyword in the format hb_deal_BIDDERCODE, e.g., hb_deal_BidderA. Then when you create the line item for the deal, add in that code with the associated deal ID. For example, hb_deal_BidderA=BDA_123.

{: .alert.alert-info :}
The actual value of the deal ID (BDA_123 in this example) will be obtained from the demand partner.

### Start and End Dates

Prebid line items normally start immediately with no end date; the line item exists to receive a bid at any time, whenever it gets sent to the ad server. Because deals are negotiated with the demand partner, deals will have date ranges in accordance with the agreement.

### Priority

Bids from header bidding typically have a priority lower than directly sold ads but higher than any competing house ads. Deals should have a priority higher than the line items that cover the regular open market bids.

## Further Reader

* [Planning Guide](/adops/adops-planning-guide.html)
* [Key Values for Ad Ops](/adops/key-values.html)
* [Prebid Universal Creative](/overview/prebid-universal-creative.html)
