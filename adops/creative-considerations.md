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

[Prebid Universal Creative Overview](/overview/prebid-universal-creative.html).

## Creatives Overview

This document will provide information to help you set up the ad server so ads of various media formats will be rendered properly. A couple of questions to answer:

- What Prebid scenarios do you need now and in the forseeable future? Is Prebid.js all you need? Or do you have an [AMP](/formats/formats.html#amp) version of your site? Do you have a mobile app?
- Do you want to use the new [dynamic creative](#prebidjs-dynamic-creatives) approach or use the original [Prebid Universal Creative (PUC)](#prebid-universal-creative)?

Here's a set of basic creative recommendations to use as a starting point:

1. **Are you using Prebid.js only?**
    1. Is one extra HTTP fetch a considerable cost for your revenue performance? If yes, then you'll want to consider using the 'dynamic creative' approach.
    1. Is updating the creatives in the future going to be possible? If yes, then again, the dynamic creative approach would be fine.
1. **Are you using both Prebid.js and AMP?**
    1. For now, you'll need to have two sets of line items: one for instream video, and one that uses the PUC for everything else.
    1. In the future, there will be an option to run three sets of line items to utilize the dynamic creative for Prebid.js.
1. **Using Prebid Mobile?**
    1. Choose your integration method and see the "AdOps Guidance" section for that integration method.
        1. GAM Bidding-Only for [iOS](/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html#ad-operations-guidance)/[Android](/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html#ad-operations-guidance)
        1. GAM Prebid-Rendered for [iOS](TBD)/[Android](TBD)
        1. AdMob for [iOS](TBD)/[Android](TBD)
        1. MAX for [iOS](TBD)/[Android](TBD)

## Types of Creatives

Depending on the advertising scenarios you support and how they were implemented, these
are the types of creatives that may be attached to your ad server line items.

### Prebid Universal Creative (PUC)

{: .table .table-bordered }
| :memo: Use Cases          |
|:---------------------------|
| - AMP<br/>- Prebid Mobile Bidding-Only<br/>- Prebid.js when you use AMP or PBSDK and want to minimize line item count or your ad server can't target at the creative level, or you want to keep line item setup simple. |

The original idea behind the Prebid Universal Creative (which we fondly call 'the PUC') was that it would be one set of javascript that would render banners, non-instream, and native creatives.

However, that orignal vision was eroded by several factors:

- The PUC requres an extra HTTP fetch, slowing down ad rendering by some amount. 
- The size of the PUC grew as use cases were added.
- The Prebid SDK doesn't have to render javascript into a webview

So now there are a number of different options for rendering Prebid ads that win the auction. The PUC is still available as a collection of rendering routines. You can find full details in the [Prebid Universal Creative Overview](/overview/prebid-universal-creative.html). 

{: .alert.alert-success :}
**Terminology tip:** the PUC is the script that's loaded from the CDN. The block of HTML and javascript
in your ad server is sometimes called the "PUC agent" - it's what tells your browser/webview to load
the actual PUC.

#### Where to Host the PUC

If you choose to use the Prebid Universal Creative, you'll need to decide where to load it from:

1. Prebid hosts an always-up-to-date copy of the PUC code at `https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/*`. The upside of this location is that it's automatically updated so it contains new features automatically.
1. You can host the PUC at your own location. The upside of this option is that you can control when upgrades happen.
1. You can copy the body of the PUC into your ad server creative directly. This eliminates a browser fetch, but could make upgrades more difficult.

### Prebid.js 'dynamic creatives'

{: .table .table-bordered }
| :memo: Use Cases          |
|:---------------------------|
| - Prebid.js with no need to worry about AMP or Prebid Mobile<br/>- You're using a tool that can modify the creative if needed |

If you have line items that target only browsers running Prebid.js, you can use [dynamic creatives](/adops/js-dynamic-creative.html) to avoid the PUC performance penalty but keep the same ease of setup and maintenance.

### VastUrl

{: .table .table-bordered }
| :memo: Use Cases          |
|:---------------------------|
| - Instream video<br/>- Prebid Mobile non-instream video<br/>- Prebid Mobile rewarded video (GAM Bidding-only integration) |

VAST video does not use the PUC. Instead, video bids provide VAST that Prebid caches to obtain a cache ID that can be retrieved with a URL. The cache ID is passed as a key value to the ad server. (See [Video Overview](/prebid-video/video-overview.html) for details.)

When you’re running campaigns with video creatives, the primary decision you need to make is where to cache your video bids. You’ll enter this location in the creative you add to the line item. The cache location is typically independent of the bidders. The most common cache location is <https://prebid.adnxs.com>. See [Setting Up Video In GAM](/adops/setting-up-prebid-video-in-dfp.html) for detailed instructions on configuring a video creative in GAM.

### Prebid SDK Rendering

{: .table .table-bordered }
| :memo: Use Cases          |
|:---------------------------|
| Prebid Mobile rendering scenarios:<br/>- Display Banner<br/>-Video Banner<br/>- Display Interstitial<br/>- Video Interstitial |

When the mobile app is coded to use the Prebid-Rendered scenario ([iOS](/prebid-mobile/modules/rendering/ios-sdk-integration-gam.html),[Android](/prebid-mobile/modules/rendering/android-sdk-integration-gam.html)), there's no PUC.
Instead, a special ad server creative is used. See the [GAM Prebid Mobile Rendering Ad Ops](/adops/mobile-rendering-gam-line-item-setup.html) page for details.

### Rewarded Video

{: .table .table-bordered }
| :memo: Use Cases          |
|:---------------------------|
| - Prebid Mobile rewarded video (Prebid rendered scenario) |

When the mobile app is coded to use the Prebid-Rendered scenario ([iOS](/prebid-mobile/modules/rendering/ios-sdk-integration-gam.html),[Android](/prebid-mobile/modules/rendering/android-sdk-integration-gam.html)), there's a special
VAST URL required. See the [GAM Prebid Mobile Rendering Ad Ops](/adops/mobile-rendering-gam-line-item-setup.html) page for details.

### Native (PUC)

{: .table .table-bordered }
| :memo: Use Cases          |
|:---------------------------|
| - Prbeid.js Native |

Native ads require close collaboration between web designers, engineering, and ad ops. The primary decision to be made that affects ad ops is where to store the rendering template. The options are:

- The ad server
- The page's Prebid.js adunit
- An external script

If you already have templates stored in your ad server for some native ads, it might make sense to also store the templates for Prebid there and keep everything together and consistent. This also gives ad ops control over when templates change.

The second two options require engineering to make any changes when template updates are required. Because native ad formatting is tied to the look of the site, these options could fit in with normal site maintenance.

Each option requires a different PUC ad tag to be used in the associated creatives, so be sure to get the correct script (and CSS file) from the engineers.

{: .alert.alert-info :}
Engineering details outlining each template storage option can be found in the [Prebid.js Native Implementation Guide](/prebid/native-implementation.html).

### Native (native-trk.js)

{: .table .table-bordered }
| :memo: Use Cases          |
|:---------------------------|
| - Prebid Mobile webview native |

Like Prebid.js, Mobile native ads require close collaboration between web designers, engineering, and ad ops. However, mobile only supports hosting the template in the ad server.

Prebid Mobile uses a special script called 'native-trk.js' to render native creatives implemented on a webview. See the [GAM Native Creatives page](/adops/gam-native.html) for details.

### Mediation platforms

Mobile apps that are integrated with mediation platforms [AdMob](/adops/mobile-rendering-admob-line-item-setup.html) or [MAX](/adops/mobile-rendering-max-line-item-setup.html) should follow those special instructions.

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

## SafeFrames

Another decision you need to make with regards to banner and native creatives is whether to run them in SafeFrames. A SafeFrame is defined by the IAB as “a managed API-enabled iframe that opens a line of communication between the publisher page and the iframe-contained ad creative.” SafeFrames provide an added layer of security by separating the ad from your web page.

We recommend using SafeFrames for banner and native creatives, but there are some things to keep in mind if you do this. For example:

- Some creatives, such as richmedia formats, can’t render in SafeFrames.
- Some bidders do not support the use of SafeFrames.

If you don't trust all your bidders to provide creatives that can safely run inside of SafeFrames, then you'll want to consider using [Send All Bids](/adops/send-all-vs-top-price.html) (the default), which will enable you to allow some bidders to use SafeFrames and some not.

[Prebid documentation for each bidder](/dev-docs/bidders.html) provides information on whether the bidder supports SafeFrames.

Be sure to check with bidders directly if you have questions about their SafeFrame support.

## Further Reading

- [Planning Guide](/adops/adops-planning-guide.html)
- [Key Values for Ad Ops](/adops/key-values.html)
- [Prebid Universal Creative](/overview/prebid-universal-creative.html)
- [Deals in Prebid](/adops/deals.html)
