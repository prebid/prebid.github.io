---
layout: page_v2
title: Ad Server Integration
head_title: Ad Server Integration
sidebarType: 3
sbUUID: 3.2
---

# Ad Server Integration

{: .no_toc }

- TOC
{: toc }

Prebid was designed as an independent header bidding solution that works with any ad server, or without one. An early step in planning your implementation is deciding where the final decision about which ad to show is made. There are two ways to integrate Prebid with an ad server:

{: .table .table-bordered .table-striped }
| | [The ad server decides](#the-ad-server-decides) | [The ad server bids into Prebid](#the-ad-server-bids-into-prebid) |
| --- | --- | --- |
| How it works | Prebid collects bids and passes them to the ad server as key-values. The ad server weighs them against its own campaigns and picks the winner. | The ad server responds to Prebid like any other bidder, returning its campaigns as bids. Prebid picks the winner, and the page renders it. |
| Ad server requirements | Key-value targeting, and bulk creation of line items and creatives for Prebid's price buckets | A Prebid.js bid adapter or Prebid Server bidder that returns the ad server's campaigns as bids, ideally with deal metadata (`bid.meta.deal`) |
| Direct-sold and guaranteed campaigns | Prioritized by the ad server | Prioritized by Prebid, using the [priority and priority-adjusted CPM](/dev-docs/publisher-api-reference/bidderSettings.html#212-allowprioritybids) the ad server sends |
| Typical use | The most common setup, for example with Google Ad Manager | Ad servers with a Prebid adapter; publishers who want one auction across all demand |

We’re not able to provide details on every ad server, but this page gives general information on the most popular ones and those the Prebid community has documented. Check with your ad server about which of these approaches it supports.

{: .alert.alert-success :}
If you want to include information about a particular ad server not documented here, create a PR in our [Github repo](https://github.com/prebid/prebid.github.io).

## The ad server decides

This is Prebid used as a header bidding library. Prebid runs its auction before the ad server is called and sends some or all of the bids to the ad server as key-value targeting. Line items set up for Prebid's price buckets let those bids compete with the ad server's own campaigns, and the ad server chooses the winner.

### Google Ad Manager

Google Ad Manager (GAM) is currently the most-used ad server. Google has header bidding support in a feature called [Header Bidding Trafficking](https://support.google.com/admanager/answer/12273163?hl=en), a technology to help publishers manage external integrations. Because header bidding often involved the creation of hundreds or even thousands of line items, this feature could be a useful option. Here are some things to consider when deciding whether to use it with Prebid:

- You must have a GAM premium GAM account to use yield groups.
- The following use cases currently don’t work with yield groups: Native, video, AMP, Post-Bid. Google is open to feedback from the community about these scenarios.
- The Prebid Universal Creative is not utilized. Google has ported some portions of the PUC to an internal creative.
- Not all Prebid bid adapters are supported.
- Aliases are not currently supported, but Google may eventually support aliases that are commonly used. There may also be future updates to support custom aliases.
- Google Publisher Toolkit (GPT) determines bid values using Prebid.js events.
- The trafficking group should win when the adjusted bid price is higher than the header bidding price bucket, which should typically occur if the publisher is rounding bids down, as is the Prebid default.
- While we haven’t seen any detailed performance testing, we hope that the improved auction dynamics from no longer using price bucketing will have beneficial effects on auction outcomes.
- Most Prebid Mobile scenarios are not supported.

For step-by-step instructions on using GAM, see the [Google Ad Manager Step by Step](/adops/step-by-step.html).

### Other ad servers

We don’t currently have details on specific header bidding support in other ad servers. But practically speaking, these are the requirements to integrate Prebid into an ad server this way:

- The ability to pass key-value pairs into the ad call.

    {: .alert.alert-info :}
    See the [getAdserverTargeting function](/dev-docs/publisher-api-reference/getAdserverTargeting.html) for engineering instructions on creating whatever format is required.
- The ability to bulk create orders, line items, and creatives (or the equivalent). Since there can be hundreds - or even thousands - of objects to create, it's uncommon for people to create their ad server objects one-by-one.
- The ability to create hundreds or thousands of objects without exceeding ad server limits.

For step-by-step instructions on using some of the other ad servers, see the following documentation:

- [Xandr Monetize Ad Server](/adops/setting-up-prebid-with-the-appnexus-ad-server.html)
- [Smart Ad Server](/adops/setting-up-prebidjs-with-Smart-Ad-Server.html)
- [FreeWheel](/adops/setting-up-prebid-video-in-freewheel.html)

## The ad server bids into Prebid

This is Prebid used as a complete bidding library: the decision layer on the page. The ad server takes part in the Prebid auction as a demand source, through its Prebid.js bid adapter or Prebid Server bidder. It returns its eligible campaigns as bids, Prebid chooses the winner across all demand, and the page renders it, for example with `pbjs.getBestBids()` and [`pbjs.renderAd`](/dev-docs/publisher-api-reference/renderAd.html). No price-bucket line items are needed. See the [ad server first example page](https://github.com/prebid/Prebid.js/blob/master/integrationExamples/adserver_first/basic_adserver_first.html) in the Prebid.js repository.

For Prebid to rank the ad server's campaigns correctly against other demand, the ad server should send deal metadata with its bids (`seatbid[].bid[].ext.prebid.deal` in OpenRTB responses, which Prebid.js exposes as `bid.meta.deal`), and the publisher should trust it. Since Prebid.js 11.44:

- **Opt in:** set [`allowPriorityBids`](/dev-docs/publisher-api-reference/bidderSettings.html#212-allowprioritybids) for the ad server's adapter, or list it in `s2sConfig.allowPriorityBids` when it runs through Prebid Server. Deal metadata from other bidders is ignored.
- **Priority-adjusted CPM:** for most reservation campaigns, the ad server only needs to send a `priorityAdjustedCpm`: the value it would rank the campaign at, for example raised when the campaign is behind on delivery. The campaign then competes with programmatic demand on that value, while the bid's reported price stays the same.
- **Priority:** send a `priority` only for campaigns that shouldn't compete on price: sponsorships (a priority below the default of 12, so they always win) and house campaigns (above 12, so they only fill when nothing else bids). Lower numbers win.
- **Price floors:** priority doesn't bypass [price floors](/dev-docs/modules/floors.html). Deal bids are exempt from floor enforcement unless `enforcement.floorDeals` is set.
- **House bids at CPM 0** are dropped by default. Since Prebid.js 11.45, set [`allowHouseBids`](/dev-docs/publisher-api-reference/bidderSettings.html#213-allowhousebids) for the ad server's adapter to accept its 0 CPM house bids (bids with a priority above 12) without accepting its other 0 CPM bids.

- **Click analytics:** Prebid renders the winner, so no ad server creative counts its clicks. With [`bidClickTracking`](/dev-docs/modules/bidClickTracking.html) (Prebid.js 11.45 and later), clicks observed on the rendered creative emit `bidClick` events for analytics, and the ad server's click URL can be passed to `pbjs.renderAd` as `clickThrough` to be requested on each click.

The two approaches can also be combined: for example, an ad server can bid into Prebid while Prebid's winner is still sent to a second ad server as key-values.

## Next Step

If the ad server decides: [Send All Bids vs Top Price](/adops/send-all-vs-top-price.html)

## Further Reading

- [Planning Guide](/adops/adops-planning-guide.html)
- [Key Values for Ad Ops](/adops/key-values.html)
- [Prebid Universal Creative](/overview/prebid-universal-creative.html)
- [Deals in Prebid](/adops/deals.html)
