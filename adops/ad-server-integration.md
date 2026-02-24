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

Before you start your Prebid implementation, you need to have signed on with an ad server. As an independent header bidding solution, Prebid was designed to work with any ad server. One step in determining how your integration is going to work is exploring the type of support your ad server has for header bidding and how you’re going to use it. We’re not able to provide details on all ad servers, but we can give you some general information on the most popular ad servers and those the Prebid community has documented.

Note that not many ad servers currently have native support for header bidding. This is a reminder to check with your ad server to see what they support directly before you move forward.

{: .alert.alert-success :}
If you want to include information about a particular ad server not documented here, create a PR in our [Github repo](https://github.com/prebid/prebid.github.io).

## Google Ad Manager

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

## Other Ad Servers

We don’t currently have details on specific header bidding support in other ad servers. But practically speaking, these are the requirements to integrate Prebid into an ad server:

- The ability to pass key-value pairs into the ad call.

    {: .alert.alert-info :}
    See the [getAdserverTargeting function](/dev-docs/publisher-api-reference/getAdserverTargeting.html) for engineering instructions on creating whatever format is required.
- The ability to bulk create orders, line items, and creatives (or the equivalent). Since there can be hundreds - or even thousands - of objects to create, it's uncommon for people to create their ad server objects one-by-one.
- The ability to create hundreds or thousands of objects without exceeding ad server limits.

For step-by-step instructions on using some of the other ad servers, see the following documentation:

- [Xandr Monetize Ad Server](/adops/setting-up-prebid-with-the-appnexus-ad-server.html)
- [Smart Ad Server](/adops/setting-up-prebidjs-with-Smart-Ad-Server.html)
- [FreeWheel](/adops/setting-up-prebid-video-in-freewheel.html)

## Next Step

[Send All Bids vs Top Price](/adops/send-all-vs-top-price.html)

## Further Reading

- [Planning Guide](/adops/adops-planning-guide.html)
- [Key Values for Ad Ops](/adops/key-values.html)
- [Prebid Universal Creative](/overview/prebid-universal-creative.html)
- [Deals in Prebid](/adops/deals.html)
