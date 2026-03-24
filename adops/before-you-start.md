---
layout: page_v2
title: Ad Operations View of Prebid
head_title: Getting Started with Prebid for Header Bidding
sidebarType: 3
sbUUID: 3.2
---

# Ad Ops and Prebid
{: .no_toc }

Ad Operations (Ad Ops) are the people who work directly with the ad server software to create, analyze, and update ad campaigns. In companies that use automated processes rather than working directly in the ad server UI, people in Ad Ops define the inputs to the automation that ensure campaigns run as expected. Whatever your actual job title or exact job description, when we refer to “Ad Ops” we’re talking about the non-engineering tasks involved in running and managing ad campaigns.

## Ad Ops Role in Prebid

To understand your role in implementing Prebid, you need to understand how header bidding works. You can get a general overview in our [Introduction to Header Bidding](/overview/intro-to-header-bidding.html) and [Introduction to Prebid](/overview/intro.html). But we’re going to provide a few more details here.

Header bidding is a process for collecting bids for an ad slot before the ad server is called. Those bids and their related targeting information are consolidated and sent along with the ad request to the ad server.

When the ad request arrives at the ad server, the ad server reads the targeting information and looks for matching line items. This is where ad ops comes in. You need to ensure that those line items exist and are configured correctly. In order to do that, there are a number of decisions you need to make before you begin your ad server setup. Our [Ad Ops Planning](/adops/adops-planning-guide.html) guide will lead you through these decisions.

After you’ve completed your planning, move on to the appropriate setup documentation for your ad server.

- [Google Ad Manager](/adops/step-by-step.html)
- [Xandr Monetize Ad Server](/adops/setting-up-prebid-with-the-appnexus-ad-server.html)
- [Smart Ad Server](/adops/setting-up-prebidjs-with-Smart-Ad-Server.html)
- [FreeWheel](/adops/setting-up-prebid-video-in-freewheel.html)

## Next Step

Read the [Ad Ops Planning](/adops/adops-planning-guide.html) guide.
