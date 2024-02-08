---
layout: page_v2
title: Line Item Creation
head_title: Line Item Creation
sidebarType: 3
sbUUID: 3.2
---

# Line Item Creation

{: .no_toc }

- TOC
{: toc }

The settings you apply when creating line items to capture bids coming in from the header bidding process are typically different from those you apply when creating line items for house ads. This document will walk you through some of the differences, and outline requirements and recommendations for creating line items to work with Prebid.

{: .alert.alert-success :}
Manually configuring ad server elements for Prebid can be a fair amount of work. If you’re using Google Ad Manager (GAM), consider using our official command line tool, [Prebid Line Item Manager](/tools/line-item-manager.html#prebid-line-item-manager.html), to create the setup. Using this tool may save you time and help you avoid mistakes.

## Advertisers and Orders

Line items (and creatives) must, at some level, be associated with advertisers. When you create line items to capture Prebid bids, you won’t know who the actual advertisers are. Instead you need to create generic advertisers in your ad server that are used for Prebid. For example, you can create an advertiser named “Prebid Advertiser.” Or if you’re using Send All Bids, you can create one advertiser per bidder, such as “Prebid BidderA,” “Prebid BidderB,” etc. You then associate your line items and creatives with those advertisers.

Depending on your ad server, line items are typically grouped within orders under each advertiser.

## Line Item Details

You have many options for the way in which you set up your line items. The following are Prebid requirements, and also some recommendations, to ensure bids are captured correctly and to make keeping track of your header bidding line items easier.

### At a Glance

These tables show the Prebid line item recommendations and requirements. The following sections provide more details on each.

**Required**

{: .table .table-bordered .table-striped }
| Detail | Requirement |
| ------ | ----------- |
| Line Item Type | Price Priority (depending on your ad server) |
| Key Value Pricing | Include the number of decimal places that are defined in the price granularity precision. Normally this is two decimal places, e.g. hb_pb=0.50 or hb_pb=1.00 |

**Recommended**

{: .table .table-bordered .table-striped }
| Detail | Recommendation |
| ------ | -------------- |
| Line Item Groups | Determine the number of containers you'll need to store the line items based on price granularity, number of bidders, and ad server restrictions. Name your group in the format Prebid, format, bidder name (for [Send All Bids](/adops/send-all-vs-top-price.html)), and unique number; for example, `Prebid - banner - BidderA - 1`. |
| Line Item Name | Name each line item for the header bidding price bucket. Use the naming pattern Prebid, mediatype, bidder (for Send All Bids), and price bucket; for example, `Prebid - banner - BidderA - 1.50`. |
| Creative Name | In the creative name, include Prebid, the media type and the size (if applicable), and a unique identifying number (if more than one creative of a given size is attached to the line item). If using Send All Bids, also include the bidder name; for example, `Prebid - banner - BidderA - 1x1 - 1`. |
| Start and End Dates | Start immediately, no end date |
| Priority | Above house ads but below directly sold ads |
| Impression Goal | None |
| Media Types | Group media types by price granularity. This typically means you can group banner, outstream video, and native together but video will be a separate set of line items. |

### Line Item Type

If your ad server supports it, you should set your line item type to Price Priority, which will let it compete with bids from other sources.

### Key Value Pricing

When you enter your key values for price, you must include the number of digits following the decimal point that are specified with your [price granularity](/adops/price-granularity.html). This is known as the precision value. For example, if Prebid is configured with a precision of two decimal places, then when you enter a value for the key hb_pb you must include two decimal places in your value: 0.50 or 1.00 rather than 0.5 or 1. If you don’t include the correct number of decimal places, your line item will not match any header bidding values.

For predefined Prebid price granularities the precision is 2; for custom price granularities this value can be defined in your Prebid configuration.

{: .alert.alert-info :}
Engineering instructions for setting the precision value can be found in [setConfig Price Granularity](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Price-Granularity).

See [Key Values](/adops/key-values.html) for general information about key value pairs.

### Line Item Groups

If you are [sending all bids](/adops/send-all-vs-top-price.html) to the ad server, you’ll most likely want to group your line items by bidder. (In Google Ad Manager this means creating at least one set of orders per bidder, with that bidder’s line items attached to the order.) This allows each group to have a set of line items that use the same targeting keywords, all of which include the bidder’s name. For example, if you are working with BidderA, all line items within a group would use the key hb_pb_BidderA in the line item’s key-value targeting, and hb_adid_BidderA in the attached creative.

Depending on your ad server and the number of line items you’re creating, you might need more than one group per bidder. For example, suppose you need to create 2000 line items for one bidder. If GAM is your ad server, you’re allowed only 450 line items per order, so you will need five orders per bidder to store the 2000 line items, for a total of 25 orders.

We recommend naming the group to include “Prebid”, media type, the bidder name, and also a number or other identifier if you need more than one group per bidder. For example, `Prebid - banner - BidderA - 1`. For [Send Top Price Bid](/adops/send-all-vs-top-price.html) you can omit the bidder name: `Prebid - banner - 1`.

### Line Item Name

Because you’ll be creating one line item per price within each [price bucket](/adops/price-granularity.html), it’s helpful to name your line items based on the price. It can also be helpful to include the mediatype, since different types of media could be priced the same. Some examples include `Prebid - banner - 1.00`, `Prebid - video - 1.50`, etc. If you’re [sending all bids](/adops/send-all-vs-top-price.html), include the bidder code: `Prebid - banner - BidderA - 1.00`, `Prebid - banner - BidderA - 1.50`.

### Creative Name

We recommend naming creatives to include the media type, size (where applicable), and a number if there is more than one. For example, `Prebid - banner - BidderA - 1x1 - 1`; `Prebid - video - BidderA - 1`.

### Start and End Dates

With header bidding, start and end dates of the actual ad campaigns are controlled by the header bidding demand partners. The demand partners check their inventory and bid for an ad slot based on campaigns running on their systems. The line items you’re creating are generic and immortal line items created to capture a bid from a campaign your demand partner will be running at some point in the future.

What this means is that you typically don’t want to include an end date in your line items. Your line item will always be active to read in bids coming from your demand partner.

Set your start date to begin immediately.

### Priority

Unless you’re working with [deals](/adops/deals.html), bids received from header bidding will typically have a priority lower than directly sold ads but higher than any competing house ads.

### Impression Goal

We recommend you do not set an impression goal. Because these are general line items with (typically) no end date, there’s no need to set a goal.

### Media Types

Prebid supports many media types, and you can set up a single line item with multiple types. The media types you choose can impact the way in which you decide to organize your line items.

Grouping media types within line items is typically dictated by the pricing structure:

- Banner, outstream video, and native generally run together because they have similar pricing expectations and therefore can share [price granularities](/adops/price-granularity.html).
- Instream video is normally created as a separate set of line items because they are usually priced higher than other formats, often requiring custom price granularity.

You must set a key value for each format used by an ad unit using the hb_format (or hb_format_BIDDER) key and setting its value to the appropriate format. For example, if the ad unit is set up as a banner ad, you would target hb_format=banner (along with the price, such as hb_pb=1.00). If your ad unit supports multiple types, set the key value to include all types: `hb_format` in `banner`,`native`.

## Example Line Item Setup

Here's an example that encapsulates a number of the key decisions outlined in this document. In this scenario, we’ve made the following decisions:

- Send Top Bid
- Banner granularity: high
- Video granularity: custom
- Order naming pattern: Prebid - banner - N, Prebid - video - N
- Line Item naming pattern: Prebid - banner - PRICE, Prebid - video - PRICE
- Creative naming pattern: Prebid - banner - 1x1 - N, Prebid - video - N
- Choosing to make three copies of each creative

The granularity we’ve chosen means we’ll be creating 2000 line items for banner and 1000 line items for video. Those line items will be named as shown here:

- Order: Prebid - banner - 1
  - LI: Prebid - banner - 0.00 (If the bid is less than 1 penny, it rounds down to 0, but is still worth something)
    - Creative: Prebid - banner - 1x1 - 1
    - Creative: Prebid - banner - 1x1 - 2
    - Creative: Prebid - banner - 1x1 - 3
  - LI: Prebid - banner - 0.01
    - ... creatives ...
  - LI: Prebid - banner - 0.02
  - LI: Prebid - banner - 0.03
  - ...
  - LI: Prebid - banner - 4.49
- Order: Prebid - banner - 2
  - LI: Prebid - banner - 4.50
  - LI: Prebid - banner - 4.51
  - LI: Prebid - banner - 4.52
  - LI: Prebid - banner - 4.53
  - ...
  - LI: Prebid - banner - 09.49
- ... other banner orders up to 20.00 ...

- Order: Prebid - video - 1
  - LI: Prebid - video - 0.00
    - Creative: Prebid - video - 1
    - Creative: Prebid - video - 2
    - Creative: Prebid - video - 3
  - LI: Prebid - video - 0.05
  - LI: Prebid - video - 0.10
  - ...
- ...

If we had chosen Send All Bids (the Prebid default), every element shown above would be recreated for each bidder, and each name would include the bidder name. For example:

- Order: Prebid - banner - BidderA - 1
  - LI: Prebid - banner - BidderA - 0.00
    - Creative: Prebid - banner - BidderA - 1x1 - 1
    - Creative: Prebid - banner - BidderA - 1x1 - 2
    - Creative: Prebid - banner - BidderA - 1x1 - 3
- ...

## Next Step

[Price Granularity](/adops/price-granularity.html)

## Further Reader

- [Planning Guide](/adops/adops-planning-guide.html)
- [Key Values for Ad Ops](/adops/key-values.html)
- [Prebid Universal Creative](/overview/prebid-universal-creative.html)
- [Deals in Prebid](/adops/deals.html)
