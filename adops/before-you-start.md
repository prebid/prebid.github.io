---
layout: page_v2
title: Ad Operations View of Prebid
head_title: Getting Started with Prebid for Ad Ops
sidebarType: 3
sbUUID: 3.2
---

# Ad Ops and Prebid
{: .no_toc }

Ad Operations (Ad Ops) are the people who work directly with the ad server software to create, analyze, and update ad campaigns. In companies that use automated processes rather than working directly in the ad server UI, people in Ad Ops define the inputs to the automation that ensure campaigns run as expected. Whatever your actual job title or exact job description, when we refer to “Ad Ops” we’re talking about the non-engineering tasks involved in running and managing ad campaigns.

## Ad Ops Role in Prebid

Your role in implementing Prebid depends on how Prebid is used on your pages. You can get a general overview in our [Introduction to Header Bidding](/overview/intro-to-header-bidding.html) and [Introduction to Prebid](/overview/intro.html). Prebid is used in two main ways, described in more detail in [Ad Server Integration](/adops/ad-server-integration.html):

- **Prebid as a header bidding library:** Prebid collects bids before the ad server is called, and the ad server makes the final decision.
- **Prebid as a complete bidding library:** Prebid is the decision layer on the page. Demand sources, including your ad server if you have one, bid into Prebid, and Prebid makes the final decision.

### Prebid as a header bidding library

Header bidding is a process for collecting bids for an ad slot before the ad server is called. Those bids and their related targeting information are consolidated and sent along with the ad request to the ad server.

When the ad request arrives at the ad server, the ad server reads the targeting information and looks for matching line items. This is where ad ops comes in. You need to ensure that those line items exist and are configured correctly. In order to do that, there are a number of decisions you need to make before you begin your ad server setup. Our [Ad Ops Planning](/adops/adops-planning-guide.html) guide will lead you through these decisions.

After you’ve completed your planning, move on to the appropriate setup documentation for your ad server.

- [Google Ad Manager](/adops/step-by-step.html)
- [Xandr Monetize Ad Server](/adops/setting-up-prebid-with-the-appnexus-ad-server.html)
- [Smart Ad Server](/adops/setting-up-prebidjs-with-Smart-Ad-Server.html)
- [FreeWheel](/adops/setting-up-prebid-video-in-freewheel.html)

### Prebid as a complete bidding library

Prebid can also choose the winning ad itself. Your ad server, if you use one, takes part in the Prebid auction like any other demand source: it returns its eligible campaigns as bids through its Prebid bid adapter, and Prebid picks the winner across all demand. No price-bucket line items are needed for Prebid bids.

Ad ops then works mostly in the ad server's own campaign setup, making sure each campaign is represented correctly in the auction:

- **Reservation campaigns** compete on a priority-adjusted CPM: the value the ad server ranks them at, for example raised when a campaign is behind on delivery.
- **Sponsorships** get a priority number below the default of 12 (lower numbers win), so they win over all other demand. **House campaigns** get a number above 12, so they only fill when nothing else bids.
- The publisher's engineers enable this with [`allowPriorityBids`](/dev-docs/publisher-api-reference/bidderSettings.html#212-allowprioritybids) for the ad server's adapter. Check with your ad server which of these signals its adapter supports.

See [The ad server bids into Prebid](/adops/ad-server-integration.html#the-ad-server-bids-into-prebid) for details.

## Next Step

Read [Ad Server Integration](/adops/ad-server-integration.html) to choose how Prebid works with your ad server, then the [Ad Ops Planning](/adops/adops-planning-guide.html) guide.
