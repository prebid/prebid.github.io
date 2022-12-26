---
layout: page_v2
title: Price Granularity
head_title: Price Granularity
sidebarType: 3
sbUUID: 3.2
---

# Price Granularity
{: .no_toc }

* TOC
{: toc }

Price granularity is a way to quantize bids so that you don't need to make an infinite number of line items. It allows you to balance the work of creating line items with the desire to optimize revenue from your header bidding partners. This document will explain price granularity in detail and why it’s necessary, and provide you with the information you need to make the best decisions for your Prebid implementation.

## Price Granularity Explained

When your ad server looks to fill an ad request, it takes many things into consideration. Broken down to its simplest form, we can say that the highest price that matches the targeting will win the auction for the ad slot. In a non-header bidding scenario, when you set up line items for your advertisers in your ad server, you specify the amount of money the advertiser is willing to spend for a particular ad unit based on whether it matches the targeting. For example, an advertiser might be willing to pay 1.52 CPM for an ad unit that targets people aged 18 - 25 who live in the U.S. So you set up your line item for that advertiser with a rate of 1.52 CPM.

With header bidding, you have bids coming in from outside the ad server, so you don’t have any price information until the actual bid is passed into the ad server. Instead, it works like this:

-  Prebid contacts your demand partners, who find advertisers running campaigns that match the available contextual and user information.
-  The demand partners send in their top bid or bids for the ad slot.
-  Those bids are then sent to your ad server.

With this process, you don’t know in advance what price your demand partner’s advertisers were willing to pay. So how do you know what price to target in your line items? Do you have to create a line item for every possible price that could come in? Given the fact that open market bids can be fractions of units (so a bid of 0.255 is acceptable), the number of line items you would have to create to cover every possibility is almost infinite.

This is where price granularities come in. Price granularities allow you to group bids into “price buckets.” These buckets give you a definitive set of bid prices to target, and therefore a definitive set of line items to create.

## Components of Price Granularity

In Prebid, there are four components to price granularity.

**Price increments**: The increments between prices you’ll be targeting in your line items. For example, if you choose .10 increments, you will create line items with prices of 0.00, 0.10, 0.20, 0.30, etc. Prebid comes with built-in options for .10 and .50 increments, and also allows you to define your own.

**Price cap**: The maximum price allowed within a set of price increments. For example, if you choose an increment of .50 and a cap of 5.00, your line item pricing will range from 0.00 through 5.00 at .50 increments: 0.00, 0.50, 1.00, 1.50…5.00.

**Price range**: An increment/price cap within a price granularity. You can have multiple price ranges within one price granularity, which allows you to specify different increments at different CPM values. For example, you might want a smaller increment (such as .10) for CPMs under 10, and larger increments (such as .50) for any CPM over 10.

**Price bucket**: The actual price targeted in the line item. (Note the name of the key that is passed in with the bid price, hb_pb, stands for header bidding price bucket.) For example, if you’re using 0.50 increments and you have one bidder who bids 1.45 and another who bids 1.20, both will be rounded down and placed into the 1.00 price bucket. (See the next section for a description of Rounding.)


## Rounding


Bids received from your Prebid demand partners are rounded down according to your price granularity. If your granularity is .50, a bid of 2.95 will be rounded down to 2.50. Consider the following scenario:

-  Price granularity is set to .50
-  BidderA submits a bid for 2.75.
-  BidderB submits a bid for 2.55.

In this case, BidderA is the top bid at 2.75. If only the top bid is sent to the ad server, BidderA will be rounded down to 2.50 and sent. If all bids are sent, BidderA would still be the top bid, but both BidderA and BidderB bids will be rounded down to 2.50 and sent to the ad server. After reaching the ad server, both bids could lose to an ad server bidder that bid 2.51, even though both BidderA and BidderB initially bid higher than that.

{: .alert.alert-warning :}
**Important**: Rounding does not impact the price paid, only the auction on the ad server. For example, if your bid for 2.75 is rounded down to 2.50 and wins on the ad server at 2.50, you will be paid 2.75.

Bids also round down to reflect the top price in your granularity definition. If your price cap is 5.00 and you receive a bid of 20.00, that bid will be rounded down to 5.00. This is important to keep in mind for [video inventory](#video-price-granularity), which often sells for higher prices than other media types.

{: .alert.alert-success :}
You might have noticed earlier that we gave examples of price buckets of 0.00. This is necessary because it captures bids that are less than the increment value, but are still valid bids. For example, if you have 0.10 granularity and a bid price of 0.02, that gets rounded down to 0.00. Even with a 0.01 granularity, there can be fractional bids, so a bid price of 0.005 would still have value but get rounded down to 0.00. It's not going to compete very well, but if the hb_pb=0.00 line item is chosen, the bidder will still pay their bid price of 0.005.


This rounding might initially sound like a bad idea. You’re obviously losing revenue when a lower bid price wins over a higher price, right? But there are advantages to using price granularities and price caps, which we’ll discuss below in “Pros and Cons.”


## Prebid Default Price Granularities

Prebid provides several default price granularity options. Work with your software engineers to ensure the Prebid implementation is configured to match your line item setup.

### Currency Considerations

Before we get into the details of Prebid’s price granularity options we need to talk about different currencies. Prebid’s built-in granularity options were designed to represent typical bid prices in 2016 if your currency was USD, EUR, GBP, CAD, AUD, or other currency of similar value. So when you read the values below, think about whether your normal bid prices fall into these ranges.


If you’re working with currencies, such as JPY, INR, and CZK, that don’t fit into the predefined price granularities, you may need to define custom price buckets (explained below). See [Currency Module](/dev-docs/modules/currency.html) for more information and additional options for working with these currencies. Specifically note the granularity multiplier option, which lets you "scale up" the standard buckets to make sense for your currency.

### Built-In Price Granularity Options

{: .table .table-bordered .table-striped }  
| Granularity | Increment | Cap | Number of Line Items Required per Bidder |
| ----------- | --------- | --- | ---------------------------------------- |
| low | 0.50 | 5.00 | 11 |
| medium | 0.10 | 20.00 | 201 |
| high | 0.01 | 20.00 | 2001 |
| auto | Sliding scale | Sliding scale | See [Auto](#auto) |
| dense | Sliding scale | Sliding scale | See [Dense](#dense) |
| custom | Custom sliding scale | Custom sliding scale | Dependent on scale |


#### Auto

The auto option contains a series of predefined buckets. Any bid over the cap falls into the next highest bucket.

{: .table .table-bordered .table-striped }  
| Increment | Cap | Number of Line Items Required per Bidder |
| --------- | --- | ---------------------------------------- |
| 0.05 | 5.00 | 51 |
| 0.10 | 10.00 | 50 |
| 0.50 | 20.00 | 10 |
| Any bid > 20.00 | 20.00 | n/a |
| | | Total: 111 |


#### Dense

Dense provides a sliding scale similar to auto, but with smaller granularity. Any bid over the cap falls into the next highest bucket.

{: .table .table-bordered .table-striped }  
| Increment | Cap | Number of Line Items Required per Bidder |
| --------- | --- | ---------------------------------------- |
| 0.01 | 3.00 | 301 |
| 0.05 | 8.00 | 100 |
| 0.50 | 20.00 | 24 |
| Any bid over 20.00 | 20.00 | n/a |
| | | Total: 425 |


#### Custom

Custom buckets allow you to set your own price granularity. In determining what that granularity should be, we recommend analyzing your average bid prices from SSPs and placing them into a histogram. The price cap should be around your 95th-percentile bid, and there should be finer-grained buckets where more popular bid values are clustered. Note that if you use a [price floor](/dev-docs/modules/floors.html#price-floors-module), you shouldn't need fine-grained buckets below that floor.

After you’ve determined what you’d like your granularity and caps to be, work with your software engineers to ensure the Prebid configuration matches your line item setup.

## Pros and Cons

As we mentioned earlier, you need to create a line item for every price that could come in from your header bidding demand partners. Without price buckets this could result in an almost infinite number of line items. Instead, you’ll need to weigh the pros and cons of high vs low granularity, and possibly adjust your granularities as you analyze the results of your Prebid implementation.

The following examples give a general idea of the pros and cons of high and low granularity.

### Example: High Price Granularity

-  10 bidders
-  Cap 20.00
-  Increment .01
-  Send top price: Minimum 2,000 line items
-  Send all bids: Minimum 20,000 line items

**Pro**: At .01 increments, there will be minimal price rounding (up to the price cap). All bids will compete at (or very near) the price the demand partner is willing to pay, maximizing revenue.

**Con**: You have to create a lot of line items. The numbers shown above increase dramatically as you increase your price cap and your number of bidders. If you send all bids and add five more bidders, suddenly you need 10,000 more line items.

### Example: Low Price Granularity

-  10 bidders
-  Cap 5.00
-  Increment 1.00
-  Send top price: Minimum 5 line items
-  Send all bids: Minimum 50 line items

**Pro**: Setting up your line items is a relatively quick process because you won’t need very many. You’re also less likely to run into volume limits your ad server might impose on numbers of line items.

**Con**: Prices received from demand partners will be rounded down, so you could be losing money. A bid of 2.95 would be rounded down to 2.00, and lose to an ad server bid of 2.05. You’d be losing almost a dollar CPM.

The following diagram, based on the high and low granularity scenarios with ten bidders we described above, illustrates just how quickly your line item count can grow.

![Line Items Required per Price Granularity](/assets/images/ad-ops/planning/pg-line-items-required.png){: .center-image :}

### Balanced Price Granularity

Taking the pros and cons into consideration, you’ll want to balance your price granularity in a way that makes sense for your configuration. We recommend starting with the predefined Prebid price bucket that makes the most sense based on bids you expect, then adjusting as needed as you evaluate the results. The exceptions to this would be in the case of video (see below), and when you’re working with currencies that don’t fit well into the predefined values. In both these cases we recommend custom price granularities.


## Video Price Granularity

The predefined price granularities in Prebid max out with price caps of 20.00. However, video inventory is often valued much higher. You don’t want to have a 20.00 price cap in place for inventory for which you’re expecting to receive 50.00 or more. For video inventory, we recommend you create custom price granularities. Determine the granularity and caps for your video inventory, and work with your software engineers to ensure they configure Prebid with custom price buckets to match your line items.

## Mobile Price Granularity

We’ve mentioned that you need to work with your software engineers to ensure the price buckets in the Prebid configuration match the line items you’re setting up in the ad server. However, if you’re setting up line items for advertising in a mobile app, your software engineers will be working with the Prebid Mobile SDK, which does not have price granularity controls; price buckets for mobile are set in Prebid Server. In this case you’ll need to work with your managed service provider to ensure price buckets are set up to match your line items. Note that from the ad server side, line item setup for price buckets is the same whether you’re working with mobile or web.

## Next Step

[Creative Considerations](/adops/creative-considerations)

## Further Reader

-  [Planning Guide](/adops/adops-planning-guide.html)
-  [Key Values for Ad Ops](/adops/key-values.html)
-  [Prebid Universal Creative](/overview/prebid-universal-creative.html)
-  [Deals in Prebid](/adops/deals.html)
