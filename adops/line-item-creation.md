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

The settings you apply when creating line items to capture bids coming in from the header bidding process are different from those you apply when creating line items for house ads. This document will walk you through some of the differences, and outline requirements and recommendations for creating line items to work with Prebid.

{: .alert.alert-success :}
Manually configuring ad server elements for Prebid can be a fair amount of work. If you’re using Google Ad Manager (GAM), consider using our official command line tool, [Prebid Line Item Manager](/tools/line-item-manager.html#prebid-line-item-manager.html), to create the setup. Using this tool may save you time and help you avoid mistakes.

## The Big Picture

The ad server configuration that supports Prebid is important. Header bidding is a way to gather bids from many sources and funnel them into your ad server, so the ad server needs to have a way to detect and prioritize these bids against other sources.

The traditional Prebid.js setup is to have two sets of line items in your ad server: one set that covers the price granularity range for display, non-instream video, and native, and another set that covers the price granularity range for instream video. This is because instream video generally has a higher price profile.

However, there may be reasons to set up more than 2 sets of line items. You can start by considering a few questions:

- What Prebid scenarios do you need now and in the forseeable future? Is Prebid.js all you need? Or do you have an [AMP](/formats/formats.html#amp) version of your site? Do you have a mobile app?
- How many line items can you afford to create? Very high [price granularities](/adops/price-granularity.html) can consume a large number of line items, and some ad servers have strict limits on the number of active and/or historic line items.

Here's a set of basic recommendations to use as a starting point:

1. **Do you run Prebid.js only?** Create 2 sets of line items: one set for instream-video and another set for everything else.
1. **Do you run Prebid.js and AMP?**
    1. For now, you'll need to have two sets of line items: one for instream video, and one that uses the PUC for everything else.
    1. In the future, there will be an option to run three sets of line items to utilize the [dynamic creative](/adops/creative-considerations.html#prebidjs-dynamic-creatives) for Prebid.js.
1. **Do you run Prebid.js and Prebid Mobile?**
    1. If you're using multiformat banner and "in-renderer" video (formerly "outstream"), you will need to have a separate set of adunits and line items for mobile. This is because Prebid Mobile does not support javascript renderers like Prebid.js, instead replying the ad server SDK, which requires them to be treated the same as instream video. So in this scenario you'll have 4 sets of line items: Prebid.js instream, Prebid.js banner+native+noninstream, mobile video, and mobile banner. If you run mobile native or rewarded video, each will be another set of line items.
    1. If you have chosen the Prebid-Rendered approach for your mobile apps in order to get SKAdNetork and advanced adunit support, you'll want to have separate sets of line items for mobile and Prebid.js as described for the multiformat item just above.
    1. If you're running Rewarded Video, you'll want to define which adunits run that format and have a separate set of video line items that target those units. This is because rewarded video has a special creative type.
1. **Or just Prebid Mobile?**
    1. As a base, you'll want one set of line items that covers all video (instream and non-instream), and another set for banner.
    1. If you run native, you'll want another set of line items for them.
    1. And then if you run rewarded video, another set of line items for those ad units.

Yes, setting up line items for Prebid Mobile is complicated. We recommend reading the "Ad Operations Guidance" section of the
specific mobile integration method you're using:

    - GAM Bidding-Only for [iOS](/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html#ad-operations-guidance)/[Android](/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html#ad-operations-guidance)
    - GAM Prebid-Rendered for [iOS](TBD)/[Android](TBD)
    - AdMob for [iOS](TBD)/[Android](TBD)
    - MAX for [iOS](TBD)/[Android](TBD)

## Advertisers and Orders

Line items (and creatives) must, at some level, be associated with advertisers. When you create line items to capture Prebid bids, you won’t know who the actual advertisers are. Instead you need to create one or more generic advertisers in your ad server that are used for Prebid. For example, you can create an advertiser named “Prebid Advertiser.” Or if you’re using Send All Bids, you can create one advertiser per bidder, such as “Prebid BidderA,” “Prebid BidderB,” etc. You then associate your line items and creatives with those advertisers.

{: .alert.alert-info :}
The tradeoff for advertisers is this: having just one advertiser for all Prebid config makes it easier to share creates across line items.
But having separate advertisers for each bidder may be more useful within ad server reports.

Depending on your ad server, line items are typically grouped within orders under each advertiser.

## Line Item Details

You have many options for the way in which you set up your line items. The following are Prebid requirements, and also some recommendations, to ensure bids are captured correctly and to make keeping track of your header bidding line items easier.

### Line Item Type

If your ad server supports it, you should set your line item type to "Price Priority", which will let it compete with bids from other sources based on bid price.

### Key Value Pricing

When you enter your key values for price, you must include the number of digits following the decimal point that are specified with your [price granularity](/adops/price-granularity.html). This is known as the precision value. For example, if Prebid is configured with a precision of two decimal places, then when you enter a value for the key hb_pb you must include two decimal places in your value: 0.50 or 1.00 rather than 0.5 or 1. If you don’t include the correct number of decimal places, your line item will not match any header bidding values.

For predefined Prebid price granularities the precision is 2; for custom price granularities this value can be defined in your Prebid configuration.

{: .alert.alert-info :}
Engineering instructions for setting the precision value can be found in [setConfig Price Granularity](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Price-Granularity).

See [Key Values](/adops/key-values.html) for general information about key value pairs.

### Line Item Groups

If you are [sending all bids](/adops/send-all-vs-top-price.html) to the ad server, you’ll most likely want to group your line items by bidder. This means creating a set of orders per bidder, with that bidder’s line items attached to the order. This allows each group to have a set of line items that use the same targeting keywords, all of which include the bidder’s name. For example, if you are working with BidderA, all line items within a group would use the key hb_pb_BidderA in the line item’s key-value targeting, and hb_adid_BidderA in the attached creative.

Depending on your ad server and the number of line items you’re creating, you might need more than one group per bidder. For example, suppose you need to create 2000 line items for one bidder. If GAM is your ad server, you’re allowed only 450 line items per order, so you will need five orders per bidder to store the 2000 line items, for a total of 25 orders.

We recommend naming the group to include “Prebid”, media type, the bidder name, and also a number or other identifier if you need more than one group per bidder. For example, `Prebid.js - banner - BidderA - 1`. For [Send Top Price Bid](/adops/send-all-vs-top-price.html) you can omit the bidder name: `Prebid SDK - banner - 1`.

### Line Item Name

Because you’ll be creating one line item per price within each [price bucket](/adops/price-granularity.html), it’s helpful to name your line items based on the price. It can also be helpful to include the mediatype, since different types of media could be priced the same. Some examples include `Prebid.js - banner - 1.00`, `Prebid.js - video - 1.50`, etc. If you’re [sending all bids](/adops/send-all-vs-top-price.html), include the bidder code: `Prebid SDK - banner - BidderA - 1.00`, `Prebid SDK - banner - BidderA - 1.50`.

### Creative Name

We recommend naming creatives to include the media type, size (where applicable), and a number if there is more than one. For example, `Prebid.js - banner - BidderA - 1x1 - 1`; `Prebid.js - video - BidderA - 1`.

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

- Banner, non-instream video, and native generally run together because they have similar pricing expectations and therefore can share [price granularities](/adops/price-granularity.html).
- Instream video is normally created as a separate set of line items because they are usually priced higher than other formats, often requiring custom price granularity.

You must set a key value for each format used by an ad unit using the hb_format (or hb_format_BIDDER) key and setting its value to the appropriate format. For example, if the ad unit is set up as a banner ad, you would target hb_format=banner (along with the price, such as hb_pb=1.00). If your ad unit supports multiple types, set the key value to include all types: `hb_format` in `banner`,`native`.

## Example Line Item Setup

Here's an example that encapsulates a number of the key decisions outlined in this document. In this scenario, we’ve made the following decisions:

- Send Top Bid
- Banner granularity: high
- Video granularity: custom
- Order naming pattern: Prebid.js - banner - N, Prebid - video - N
- Line Item naming pattern: Prebid.js - banner - PRICE, Prebid - video - PRICE
- Creative naming pattern: Prebid.js - banner - 1x1 - N, Prebid - video - N
- Choosing to make three copies of each creative

The granularity we’ve chosen means we’ll be creating 2000 line items for banner and 1000 line items for video. Those line items will be named as shown here:

- Order: Prebid.js - banner - 1
  - LI: Prebid.js - banner - 0.00 (If the bid is less than 1 penny, it rounds down to 0, but is still worth something)
    - Creative: Prebid.js - banner - 1x1 - 1
    - Creative: Prebid.js - banner - 1x1 - 2
    - Creative: Prebid.js - banner - 1x1 - 3
  - LI: Prebid.js - banner - 0.01
    - ... creatives ...
  - LI: Prebid.js - banner - 0.02
  - LI: Prebid.js - banner - 0.03
  - ...
  - LI: Prebid.js - banner - 4.49
- Order: Prebid.js - banner - 2
  - LI: Prebid.js - banner - 4.50
  - LI: Prebid.js - banner - 4.51
  - LI: Prebid.js - banner - 4.52
  - LI: Prebid.js - banner - 4.53
  - ...
  - LI: Prebid.js - banner - 09.49
- ... other banner orders up to 20.00 ...

- Order: Prebid.js - video - 1
  - LI: Prebid.js - video - 0.00
    - Creative: Prebid.js - video - 1
    - Creative: Prebid.js - video - 2
    - Creative: Prebid.js - video - 3
  - LI: Prebid.js - video - 0.05
  - LI: Prebid.js - video - 0.10
  - ...
- ...

If we had chosen Send All Bids (the Prebid default), every element shown above would be recreated for each bidder, and each name would include the bidder name. For example:

- Order: Prebid.js - banner - BidderA - 1
  - LI: Prebid.js - banner - BidderA - 0.00
    - Creative: Prebid.js - banner - BidderA - 1x1 - 1
    - Creative: Prebid.js - banner - BidderA - 1x1 - 2
    - Creative: Prebid.js - banner - BidderA - 1x1 - 3
- ...

## Next Step

[Price Granularity](/adops/price-granularity.html)

## Further Reader

- [Planning Guide](/adops/adops-planning-guide.html)
- [Key Values for Ad Ops](/adops/key-values.html)
- [Prebid Universal Creative](/overview/prebid-universal-creative.html)
- [Deals in Prebid](/adops/deals.html)
