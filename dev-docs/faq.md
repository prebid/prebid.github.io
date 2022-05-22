---
layout: page_v2
title: Prebid.js FAQ
description: FAQ on Prebid.js for header bidding.
sidebarType: 1
---

# Prebid.js FAQ
{:.no_toc}

This page has answers to some frequently asked questions about Prebid.js.  If you don't find what you're looking for here, there are other ways to [get help](/support/index.html).

* TOC
{:toc}

## Do we need to be a member of Prebid.org to submit a bidder adapter or analytics adapter?

Nope. The only approval process is a code review. There are separate instructions for:

- [adding a bidder in Prebid.js](/dev-docs/bidder-adaptor.html)
- [adding an analytics adapter in Prebid.js](/dev-docs/integrate-with-the-prebid-analytics-api.html)

As for [membership](https://prebid.org/membership/) in Prebid.org, that's entirely optional -- we'd be happy to have you join and participate in the various committees,
but it's not necessary for contributing code as a community member.

## What should my timeouts be?

Below is a set of recommended best practice starting points for your timeout settings:

- 1,000 milliseconds or less for the internal auction timeout
- 3,000 milliseconds or less for the Prebid tag's overall failsafe timeout

The former setting is used to track the auction once it started; if it expires, we will use whichever bidders have responded and select the winner(s) accordingly.

The latter setting is used when for some reason Prebid did not load (or there's some other serious issue); if it expires, we will default to the adserver.

For examples of setting up these timeouts, please refer to the [Basic Example]({{site.baseurl}}/dev-docs/examples/basic-example.html) page.

See the [Prebid Timeouts Reference](/features/timeouts.html) for more information about timeouts in general.

## How many header bidders should I have?

Every publisher is different.  In order to answer this question you'll need to run some tests, gather data, and decide what works for you based on your performance and monetization needs.

Generally speaking, in a client-side header bidding implementation, you should aim to bring in approximately 1-5 demand partners. In a server-to-server implementation, you have some flexibility to add more partners.

In both scenarios, your goal should be to see your inventory fill at the highest CPMs without adding too much latency in the process. When selecting your demand partners, it’s important to choose marketplaces that have premium demand at scale, high ad quality and low latency.

There is an analysis from the Prebid team here which may be useful:

[How many bidders should I work with?](https://prebid.org/blog/how-many-bidders-for-header-bidding)

## Does Prebid.js cache bids?

It can. Versions 1.x of Prebid.js would re-consider previous bids under limited circumstances. In Prebid.js 2.0 and later, the [`useBidCache`](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Use-Bid-Cache) option can be used to enable this functionality.

The "limited bid caching" feature applies only:

- for the same AdUnit,
- on the same page view,
- for the same user, and
- up to a certain Time-to-Live (TTL) or until the bid wins and is displayed.

Since the storage is in the browser, cached bids only apply to a single page context. If the user refreshes the page, the bid is lost.

Each bid adapter defines the amount of time their bids can be cached and reconsidered.
This setting is called “Time to Live” (TTL), documented in the <code>pbjs.getBidResponse</code> [parameter table here](/dev-docs/publisher-api-reference/getBidResponses.html).

Examples of scenarios where a bid may be reconsidered in Prebid.js:

- Auto-refresh: Some pages will reload an AdUnit on a set interval (often 60-240 seconds). Previous bids for that particular AdUnit can be reconsidered for subsequent refreshes of that unit up to the TTL or until they win the unit.
- Infinite scroll: As the user scrolls, the same AdUnit may be dynamically created over and over. The bid can be reconsidered for dynamically-created AdUnits with the same name. Again, the bid is only re-considered on that AdUnit up to the bid TTL or until it's displayed.
- Galleries: Some pages feature carousel-style galleries that contain an AdUnit that refreshes as the user cycles through the content in the gallery.

Here's how it works:

1. Bid responses are stored in an AdUnit-specific bid pool.
1. When the same AdUnit is called, Prebid.js calls the bidder again regardless of whether there's a bid in that AdUnit's bid pool.
1. When all the new bids are back or the timeout is reached, Prebid.js considers both the new bids on that AdUnit and previously cached bids.
1. Previously cached bids will be discarded if they've reached their TTL or if they have status `targetingSet` or `rendered`.
1. A cached bid may be used if its CPM beats the new bids.
1. Bids that win are removed from the pool. This is automatic for display and native ads, and can be done manually by the publisher for video ads by using the [markWinningBidAsUsed](/dev-docs/publisher-api-reference/markWinningBidAsUsed.html) function.

## Some of my demand partners send gross bids while others send net bids; how can I account for this difference?

You will want to adjust the gross bids so that they compete fairly with the rest of your demand, so that you are seeing the most revenue possible.

In Prebid.js, you can use a `bidCpmAdjustment` function in [the `bidderSettings` object](/dev-docs/publisher-api-reference/bidderSettings.html) to adjust any bidder that sends gross bids.

## Does Prebid.js support synchronous ad server tags?

Short answer: not out of the box, because of header bidding partners' limitations. But there are workarounds.

Take GPT synchronous mode as an example - if you’re loading GPT synchronously, there is no simple way of delaying GPT library loading to wait for bidders’ bids (`setTimeout()` cannot be used).

Therefore, it requires Prebid.js to run in a blocking/synchronous fashion. **This will require all header bidding partners’ code to be blocking/synchronous**.  We're not even sure if this is possible. We do not have a great out-of-the box solution for turning Prebid.js blocking at the moment.

Here are a couple of alternative workarounds:

- **Option 1:**

	Load a blocking script that has a load time of 300-500ms. This script does nothing but keep the page waiting.  In the meantime Prebid.js can run asynchronously and return the bids. After the blocking script finishes loading, GPT can start synchronously; at this point there will be header bidding bids available.

	For the best user experience, you probably want to insert this blocking script after the above the fold page content has loaded. Or if you're okay with additional 500ms latency added to your page load time, this can be easily done.

- **Option 2:**

	Use post-bid. The downsides are that post-bid no longer allows your header bidding partners to compete with Google Ad Manager/AdX, but they can still compete with each other.  For more information, see [What is post-bid?]({{site.baseurl}}/overview/what-is-post-bid.html).

## How do I use Prebid.js on secure (HTTPS) pages?

All prebid adapters that get merged should automatically detect if they're serving into a secure page environment and respond appropriately.

In other words, you shouldn't have to do anything other than make sure your own page loads Prebid.js securely, e.g.,

```html
<script src='https://cdn.jsdelivr.net/npm/prebid.js@latest/dist/not-for-prod/prebid.js' async=true />
```

(Except that you should *never never never* use the copy of Prebid.js at that URL in production, it isn't meant for production use and may break everything at any time.)

## How often is Prebid.js updated?

See [the GitHub release schedule](https://github.com/prebid/Prebid.js/blob/master/RELEASE_SCHEDULE.md) for more details.

## When do I have to upgrade my version of Prebid.js?

Prebid.org does not support any version of Prebid.js prior to the previous version. e.g. if the current version is 4.x, we'll help debug 3.x, but not 2.x. If you want continued support through updates and documentation you should upgrade to a newer version.

## How can I change the price granularity for different ad units?

If you need different [price granularities](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Price-Granularity) for different AdUnits (e.g. video and display), the only way for now is to make sure the auctions don't run at the same time. e.g. Run one of them first, then kick off the other in the bidsBackHandler. e.g. here's one approach:

1. Call `setConfig` to define the priceGranularity for the first set of AdUnits
1. Initiate the first auction with `requestBids`
1. In the bidsBackHandler
   1. Set the adserver targeting for the first auction
   1. Call `setConfig` to define the priceGranularity for the second set of AdUnits
   1. Initiate the second auction with `requestBids`

The handling of this scenario will be improved in a future release.

## How can I control how many targeting variables are sent to my ad server?

One way to limit the number of bytes sent to the ad server is to send only the winning bid by disabling the [enableSendAllBids](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Send-All-Bids) option. However, there are optimization and reporting
benefits for sending more than one bid.

Once you find the right balance for your application, you can specify
what's sent to the ad server with [targetingControls.auctionKeyMaxChars](/dev-docs/publisher-api-reference/setConfig.html#setConfig-targetingControls) and/or [sendBidsControl.bidLimit](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Send-Bids-Control)

## Can I run multiple different versions of Prebid.js concurrently?

It's technically possible, but we don't recommend doing this:

- The code isn't small. For performance reasons you don't want to run two versions if you can help it
- We don't test concurrent versions
- We won't specifically support debugging problems caused by running two concurrent versions. But will take take PRs if someone finds an issue.

If all this wasn't enough to warn you away from trying, it should work if you name the PBJS global differently for each instance (https://github.com/prebid/Prebid.js/blob/master/package.json#L20)

## Can I filter bid responses that don't meet my criteria?

Yes. Many bidders provide metadata about the bid that can be used in troubleshooting
and filtering. See the [list of bid response metadata](/dev-docs/bidder-adaptor.html#interpreting-the-response) and the [filtering example](/dev-docs/examples/meta-bid-filtering.html).

## Does Prebid.js resolve the AUCTION_PRICE macro?

Yes, but in a way that could cause discrepancies in reporting. It's recommended
that [bid adapters resolve OpenRTB macros](/dev-docs/bidder-adaptor.html#resolve-openrtb-macros-in-the-creatives) themselves before giving them to Prebid.js.

For historic reasons, Prebid will resolve the AUCTION_PRICE macro.
 Header Bidding is a first-price auction, the best candidate for “clearing price” is the original bid itself. Prebid may deprecate this resolution; it is not recommended to be resolved client-side, as it opens opportunities for abuse. 

## How does Prebid interact with the GAM yield group header bidding feature?

Google is developing this technology to help publishers create and manage line items in bulk. This should enable more publishers to integrate their sites with header bidding on the open web. Here is Google's [official blog post](https://blog.google/products/admanager/improved-header-bidding-support-in-google-ad-manager/) on yield group. This feature is currently in beta production. 

What we know about yield group feature:
- The beta is limited to which publishers are involved.
- The feature is limited to premium GAM accounts.
- The [Prebid Universal Creative](/overview/prebid-universal-creative.html) is not supported. Google has ported some portions of the PUC to an internal creative.
- GPT reads Prebid.js objects directly from the 'pbjs' global.
- Not all Prebid bid adapters are supported.
- While detailed performance testing has not taken place, we hope that the improved auction dynamics from no longer using price bucketing will have beneficial effects on auction outcomes.

What we don't know:
- Whether all use cases currently work well when using yield groups. e.g. [Native](/formats/native.html), [video](/formats/video.html), [AMP](/formats/amp.html), [Post-Bid](/overview/what-is-post-bid.html).
- Whether utilizing the feature might cause an impact to some analytics scenarios.
- Whether GPT can find Prebid at a global other than 'pbjs'.
- Google's timelines for adding publishers to the beta or making the feature Generally Available.

When we have solid information to share with the community, we will create additional [AdOps pages](/adops/before-you-start.html) and update existing ones.

## I'm a developer - how do I change the name of my module?

Sometimes the owner of a bid adapter or other kind of module wants to rename their module. However, Prebid considers module renames a
'breaking change' -- publishers' build processes and pages could break as a result of a renaming, so Prebid's policy on renaming is:

1) Create the new Prebid.js module files (js and md)
2) If they're basically the same code base, change the old file so that it includes the new file. This prevents duplicate maintenance of code. In general we don't approve modules including each other, but we'll approve it to avoid repetition.
3) The docs repo should contain both names, with the old name referring to the new name. You can add the "enable_download: false" flag to prevent installations of the old name.
4) At the next major release the old files may be removed.

## Related Reading

+ [Prebid.js Troubleshooting Guide](/troubleshooting/troubleshooting-guide.html)
+ [Prebid.js Common Issues](/dev-docs/common-issues.html)
+ [Prebid.js issues tagged 'question'](https://github.com/prebid/Prebid.js/issues?utf8=%E2%9C%93&q=is%3Aissue%20label%3Aquestion%20)
