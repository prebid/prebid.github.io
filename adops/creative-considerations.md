---
layout: page_v2
title: Creative Considerations
head_title: Creative Considerations
sidebarType: 3
sbUUID: 3.2
---

# Creative Considerations

{: .no_toc }

- TOC
{: toc }

Some of the major decisions you need to make as you’re setting up your campaigns have to do with creatives. This document will provide information to help you make those decisions.

{: .alert.alert-info :}
Throughout this discussion we’re assuming you’ve chosen to use the Prebid Universal Creative (PUC). See [Prebid Universal Creative](#prebid-universal-creative) below for advantages and disadvantages of this approach. For more information on the PUC as well as alternatives, see the [Prebid Universal Creative Overview](/overview/prebid-universal-creative.html).

## Creatives Overview

When you set up a line item for a campaign in your ad server, you have to add images or ad tags that will be displayed for that campaign. Header bidding line items have a particular kind of ad tag.

The Prebid ad tag is entered into creatives on the ad server in the form of a script that will enable Prebid to find the bid that goes with a winning line item. Depending on your ad server, you’ll have to declare your creative as a Third Party creative (Google Ad Manager), or set it to use HTML, or some other means of entering an ad tag (the Prebid script) rather than an image.

## Prebid Universal Creative

The first decision you’ll need to make when it comes to creatives (with the exception of VAST video) is whether you want to use the Prebid Universal Creative (PUC). The PUC is a collection of rendering routines that can pull a particular ad ID from the Prebid cache and do the right thing to display it. You can find full details about the PUC in the [Prebid Universal Creative Overview](/overview/prebid-universal-creative.html). For now we’ll focus on the advantages and disadvantages to using the PUC.

The big advantage to using the PUC is that it’s the simplest approach to configuring Prebid in your ad server. It provides a robust mechanism that can be used across several formats, platforms, devices, and ad servers.

The primary disadvantage to using the PUC is that it takes an extra fetch to load the PUC file vs doing everything inline to the creative. Also, in version 1.14.1 and earlier of the PUC,  loading a “universal” creative means that more bytes are loaded than are actually necessary for the display of a single creative. This all leads to a very slight performance penalty.

You’ll need to determine whether the ease of implementation is worth the small performance penalty.

## Creative Naming

You can name your creatives whatever makes sense to your organization. We recommend names in the following format: Prebid - Type - Size - N. For example, a banner creative using the PUC would be `Prebid - banner - 1x1 - 1`.

## Creative Modes

No matter what type of media you’re working with, you need to decide how you’re going to represent the size options in the ad server. There are three creative size modes:

- Creatives are all sized 1x1
- Creatives are sized their actual size
- Line items are targeted per size

### All Creatives 1x1

If you select this mode, in the ad server you’ll set the size of all your Prebid creatives to 1x1. The creatives will then be resized based on the value supplied by the demand partner in the hb_size key. This is the simplest option to implement and requires the fewest number of creatives to be created.

If you’re working with Google Ad Manager (GAM) we recommend you create one general 1x1 creative, then duplicate it to attach 3 - 5 identical creatives to each line item. The reason for this is that GAM doesn’t make a distinction between creatives with images attached and creatives with a script that could be used to retrieve one of many different images. It treats every creative as an individual image, and allows each one to be served to only one ad unit per page.

For Prebid line items, this means that if your page has multiple ad slots that fit the same line item targeting, GAM would allow only one of them to display the creative, not realizing that one creative could point to different images. Attaching multiple identical creatives to each line item ensures that creatives from a line item matching the targeting on multiple ad slots can serve on the same page.

For example, say you're using "low" granularity, which means that one line item covers bids from $1.00 to $1.49. If you have three creatives associated with that line item, the page could not display anymore than three Prebid bids in that price range. If you have infinite scroll pages, you'll have to consider the tradeoff for how many copies of creatives you want to have.

### Creative Actual Size

With this mode, you set specific sizes on the creatives. This mode allows for more precise reporting if you’re interested in knowing the exact sizes of creatives being served from Prebid. As with the 1x1 option, we recommend you create 3 - 5 duplicate creatives of each size. The downside is that this requires a lot of creatives per line item. If you specify 20 sizes, you would need as many as 100 duplicate creatives.

### One Line Item Per Size

We recommend against using this mode, but are aware some publishers use it for reporting purposes. With this mode, you would target your line item based on the value of the hb_size key. This would require you to create one line item for every size, for every bidder, for every price. The number of line items required could get extremely large. Here’s an example (see [Price Granularity](/adops/price-granularity.html) for more details):

- Bidders: 10
- Price Increment: 0.10
- Price Cap: 20
- Sizes: 5
- Send all bids

This scenario would require you to create 10,000 line items (10 x 200 x 5). If you were to use either 1x1 mode or creative-level sizing you would need only 2,000 line items.

## Banner and Outstream Creatives

As we mentioned, each creative requires an ad tag script that will call the [Prebid Universal Creative](/overview/prebid-universal-creative.html) to display the correct image.

One decision you'll want to make is which version of the PUC you want to use. Prebid hosts a copy, which you're free to use. But some publishers might want to use their own copy of the PUC so as to have greater control over the upgrade windows.

{: .alert.alert-info :}
Engineers can find the PUC code in the [Prebid Github repository](https://github.com/prebid/prebid-universal-creative).

## Native

Native ads require close collaboration between web designers, engineering, and ad ops. The primary decision to be made that affects ad ops is where to store the rendering template. Your options are:

- The ad server
- The page's Prebid.js adunit
- An external script

If you already have templates stored in your ad server for some native ads, it might make sense to also store the templates for Prebid there and keep everything together and consistent. This also gives ad ops control over when templates change.

The second two options require engineering to make any changes when template updates are required. Because native ad formatting is tied to the look of the site, these options could fit in with normal site maintenance.

Each option requires a different PUC ad tag to be used in the associated creatives, so be sure to get the correct script (and CSS file) from the engineers.

{: .alert.alert-info :}
Engineering details outlining each template storage option can be found in the [Prebid.js Native Implementation Guide](/prebid/native-implementation.html).

## VAST Video

VAST video (instream and long-form video) does not use the PUC. Instead, video bids provide VAST that Prebid caches to obtain a cache ID that can be retrieved with a URL. The cache ID is passed as a key value to the ad server. (See [Video Overview](/prebid-video/video-overview.html) for details.)

When you’re running campaigns with video creatives, the primary decision you need to make is where to cache your video bids. You’ll enter this location in the creative you add to the line item. The cache location is typically independent of the bidders. The most common cache location is [https://prebid.adnxs.com]. See [Setting Up Video In GAM](/adops/setting-up-prebid-video-in-dfp.html) for detailed instructions on configuring a video creative in GAM.

## SafeFrames

Another decision you need to make with regards to banner and native creatives is whether to run them in SafeFrames. A SafeFrame is defined by the IAB as “a managed API-enabled iframe that opens a line of communication between the publisher page and the iframe-contained ad creative.” SafeFrames provide an added layer of security by separating the ad from your web page.

We recommend using SafeFrames for banner and native creatives, but there are some things to keep in mind if you do this. For example:

- Some creatives, such as richmedia formats, can’t render in SafeFrames.
- Some bidders do not support the use of SafeFrames.

If you don't trust all your bidders to provide creatives that can safely run inside of SafeFrames, then you'll want to consider using [Send All Bids](/adops/send-all-vs-top-price.html) (the default), which will enable you to allow some bidders to use SafeFrames and some not.

[Prebid documentation for each bidder](/dev-docs/bidders.html) provides information on whether the bidder supports SafeFrames.

Be sure to check with bidders directly if you have questions about their SafeFrame support.

## Related Reading

- [Planning Guide](/adops/adops-planning-guide.html)
- [Key Values for Ad Ops](/adops/key-values.html)
- [Prebid Universal Creative](/overview/prebid-universal-creative.html)
- [Deals in Prebid](/adops/deals.html)
