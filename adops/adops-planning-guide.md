---
layout: page_v2
title: Ad Operations Planning
head_title: Ad Operations Planning
sidebarType: 3
sbUUID: 3.2
---

# Ad Ops Planning Guide
{: .no_toc }

* TOC
{: toc }

There are several decisions you need to make as you’re planning out your Prebid implementation. The following diagram guides you through these decisions. Click on the boxes to navigate to detailed information about each one. (See below for an overview of these options.)

<img src="/assets/images/ad-ops/planning/ad-ops-planning.png" alt="Ad Ops Decisions" usemap="#decisions">

<map name="decisions">
  <area shape="rect" coords="16,18,121,87" alt="Ad Server Integration" href="/adops/ad-server-integration.html">
  <area shape="rect" coords="132,118,242,189" alt="Send All Bids vs Top Price" href="/adops/send-all-vs-top-price.html">
  <area shape="rect" coords="251,218,359,288" alt="Line Item Creation" href="/adops/line-item-creation.html">
  <area shape="rect" coords="368,318,478,388" alt="Price Granularity" href="/adops/price-granularity.html">
  <area shape="rect" coords="486,417,598,486" alt="Creative Considerations" href="/adops/creative-considerations.html">
</map>

<!--- ![Ad Ops Planning Process](/assets/images/ad-ops/planning/ad-ops-planning.png){: .center-image :} --->

{: .alert.alert-success :}
As you go through the steps, we recommend that you document all your decisions. Many of the decisions will need to be made only once when you first set up Prebid, so good documentation will help you and future users understand the decisions and why they were made.

## Planning Process

We’ve presented the decision steps in what we believe is a logical order, but you can go in any order that makes sense to you and your implementation. Here is a brief overview of each step so you can decide where to start.

[Ad Server Integration](/adops/ad-server-integration.html): Determine what type of support your ad server has for header bidding and whether you want to add that into your configuration.

[Send All Bids vs Top Price](/adops/send-all-vs-top-price.html): You can choose to send all bids that are received from header bidding demand partners, or send only the top bid. Learn the advantages and disadvantages of each.

[Line Item Creation](/adops/line-item-creation.html): Here we provide you with some general recommendations and requirements for setting up your line items.

[Price Granularity](/adops/price-granularity.html): The granularity you want in your line item pricing is dependent on your goals, your workload, and more. Learn how to balance everything to get the outcomes you want.

[Creative Considerations](/adops/creative-considerations.html): Do you want to work with one universal creative, or have many different creatives? Should you use SafeFrames? These and other questions related to working with creatives are addressed here.

Some additional resources that might be helpful as you work through your setup include:

[Key Values for Ad Ops](/adops/key-values.html): Your line item setup is dependent on the key-value pairs the ad server receives in the ad request. Learn what key-value pairs are and how they’re used by Prebid, and the coordination required between ads op and engineering to ensure information gets to and from the ad server correctly.

[Prebid Universal Creative](/overview/prebid-universal-creative.html): Simplify your line item setup with the Prebid Universal Creative.

[Deals in Prebid](/adops/deals.html): You can negotiate deals with header bidding demand partners and have them compete with ad server inventory. You’ll need to create additional line items to support these deals. This document explains how to set up Prebid to make that happen.

## Terminology

Throughout this planning guide, we use the following terms to describe elements within the ad server. These terms may vary among different ad servers.

**Order**: A container used to group line items that share similar properties. Orders contain information that applies to all line items attached to that order. Prebid integrations are typically set up with at least one order per bidder.

**Line Item**: Line items contain the details of each bid, such as price, priority, and media format. Each line item has at least one creative attached.

**Creative**: A creative is the ad that will be displayed in the ad slot if the associated line item wins the auction. In Prebid, creatives are entered in the ad server as an ad tag (or script) with directions to the actual media that will be displayed.

**Key Value Pair (KVP)**: Additional parameters sent to the ad server to provide additional targeting or reporting information. Prebid sends keys with associated values that enable the ad server to match a line item to the bid and display the winning creative. A key value pair for a Prebid parameter can include things like the bid price or the name of the bidder. See [Key Values](/adops/key-values.html) for more information.

## Next Step
[Ad Server Integration](/adops/ad-server-integration.html)
