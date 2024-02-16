---
layout: page_v2
title: Video Intro to Prebid AdOps
description: A video overview of Prebid AdOps
sidebarType: 3
---

# Video Overview of Prebid and Ad Operations

An overview of the process of planning a Prebid integration for ad operations.

<div style="padding:56.25% 0 0 0;margin: 1rem 0;position:relative;"><iframe src="https://player.vimeo.com/video/891677441?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Prebid Ad Operations Planning"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

<p/>
Further Content:

- [Intro to Header Bidding](/overview/intro-to-header-bidding.html)
- [Header Bidding with Prebid](/overview/intro.html#header-bidding-with-prebid)
- [AdOps Planning Guide](/adops/adops-planning-guide.html)
- [Creative Considerations](/adops/creative-considerations.html)
- [Deals in Prebid](/adops/deals.html)
- [Prebid Managed Services](https://prebid.org/managed-services/)

Related Videos:

- [Introduction to Prebid.js](/prebid/prebidjs-video.html)
- [Prebid.js Impression Flow](/prebid/prebidjs-flow-video.html)
- [Components of Prebid.js](/prebid/prebidjs-components-video.html)
- [All Videos](/overview/all-videos.html)

## Transcript

### Introduction

This video is a guide for Ad Ops professionals on planning an integration of Prebid.js with their primary ad server. 

A Prebid ad server setup can be complex, and every publisher’s approach is different. Setting up an ad server to use Prebid can be a large project, so it’s a good idea to make a plan before setting things up.

This video will give an overview of 8 subjects to consider during your planning phase. The topics are: 

- Ad Server Integration Type
- Bid Transparency
- Price Granularity
- Line Item Settings
- Creatives
- Key-Value Pairs
- Deals

This video and the help documents at docs.prebid.org will guide you through each of the topics. Check the video description for a link to the help documentation.

### Objectives

Before we get into the topics, let’s take a step back and talk about what we’re trying to achieve.

An ideal Prebid integration maximizes yield and transparency while keeping complexity in check.

Maximizing yield means generating the most advertising revenue possible by creating a competitive auction for every impression and maximizing the delivery of high-value demand sources such as private marketplace deals. To maximize transparency is to reveal as much about the auction as possible in reporting. Rich reporting allows you to maximize yield and troubleshoot issues more effectively. 

The ad stack should also be easy and inexpensive to set up, operate, and maintain. A complex setup is more prone to errors, requires more resources to run, and is more likely to bump up against ad server limits such as the maximum ad request character length or the maximum number of line items. 

### Topic 1: Ad Server Integration Type
Next, we’ll give an overview of each topic. For more information on each subject, check out the help documentation at docs.prebid.org. 

The first topic is Ad Server Integration Type. This stage is about evaluating the capabilities of your ad server to support header bidding. 

Header bidding’s power lies in its ability to value each impression individually. This means that for each available impression, Prebid needs to tell the ad server the price that header bidding buyers are willing to pay.

Despite header bidding’s wide adoption online, ad servers have been slow to develop mechanisms for header bidding to submit dynamic prices at the impression level. The Prebid community has worked around the lack of options by making creative use of the ad server’s line item key-value targeting features.

These techniques are tried and true: they power header bidding on the world’s biggest websites. But they also require ad ops teams to create large numbers of line items. Ideally, all ad servers would provide powerful dedicated support for header bidding, because this would deliver the best results for publishers. Some ad servers such as Google Ad Manager are beginning to test dedicated header bidding integration in a limited fashion. These experiments are promising, but are generally still too limited for most publishers. As a result, most Prebid publishers still use a traditional line-item-based integration method. As you start the planning process, check to see what your ad servers latest header bidding integration features are

The rest of this video will assume that you’re using a traditional line item setup. Techniques designed to improve the yield and transparency of your header bidding often require you to create more line items.

A typical Prebid.js integration can include thousands of ad server line items, and once  the line items are set up, they’ll run for as long as they meet your header bidding needs.

One goal of this planning process is determining how to satisfy your yield and reporting needs while keeping your line item count in check

### Topic 2: Bid Transparency

The next topic, Bid Transparency, illustrates the trade off between transparency and line item count.

Most Prebid auctions will collect bids from multiple bidders, but it doesn’t have to send all of the bids to the ad server. Instead, it can send only the highest-priced bid. 

The Send All Bids option allows you to use ad server reporting to analyze Prebid auctions in more detail, but this extra power comes at the cost of larger ad server requests, more ad server line items, and more complexity inside the ad server.

Note that using send top bid does not limit your ability to give special priority to bids with deal IDs. We’ll touch upon this special case later on.

### Topic 3: Price Granularity

Next comes Price Granularity.

This is the setting in Prebid.js that defines the rounding of header bidding bids to match the line items set up in the ad server. For example, using a price granularity of $0.10 means that a bid price of $1.26 will be considered by the ad server’s decisioning algorithm to have a price of $1.20. 

Price Granularity does not affect the price that buyers pay for the ads they serve through header bidding, but does affect how header bidding bids compete with other demand sources.

Using high price granularity with many tiers helps to drive yield by valuing header bidding bids accurately. When price granularity is low, the ad server will more often misjudge the value of header bidding bids, which degrades yield.

However, higher price granularity also means more line items, which may be limited by operations resources or by limits imposed by your ad server provider.

To give you a sense for how your Prebid choices affect line item counts, let’s run through some examples. Using Prebid’s high price granularity setting, which sets a $0.01 price tier increment from $0 to $20, will result in about 2,000 line items with a Send Top Bid setting. Using Send All Bids means multiplying 2,000 by the number of bidders. In this example, we’ll assume there are 10 bidders. Using Prebid’s low setting, which is $0.50 tier increment between $0 and $5, results in just 10 line items with Send Top Price and 100 line items with Send All Bids. 

Eliminating trade off between yield and line item count is one key way in which direct ad server integrations for header bidding could improve performance for publishers. Consider talking about this with your ad server provider.

### Topic 4: Line Item Settings

Bid Transparency and Price Granularity are the two factors that have the most impact on your line item count. Once you’ve made these decisions, you’ll need to decide next how to name and group your line items.

Each organization will have their own practices around order naming, line item naming, advertisers, and other ad server settings. Publishers that use the Send All Bids option in Prebid.js will sometimes create separate Orders for each bidder, and many publishers use a separate set of line items to be able to give a special price granularity to high-CPM formats like video.

For practical tips on Prebid.js line item setup, check out the Line Item Creation document at docs.prebid.org.

### Topic 5: Creatives

Next, let’s talk creatives. 

Creatives are Javascript tags that are linked to ad server line items. When the ad server selects a Prebid line item, it triggers the creative to render the winning Prebid ad.

Many Prebid integrations use the Prebid Universal Creative or “PUC”, which is a one-size-fits all solution for rendering every ad format other than VAST video. The PUC is the easiest way to get set up with an ad server creative. 

Most publishers use the PUC, but you could develop a custom solution too. Some advanced publishers choose to use custom rendering solutions to gain small improvements in ad rendering performance.

The Creative Considerations page at docs.prebid.org includes more information about the PUC, along with many more tips and best practices on creative setup for Prebid.

### Topic 6: Key-Value Pairs

The next subject is Key-Value Pairs. 

With a line item-based header bidding setup, Prebid.js communicates bid prices and other information to the ad server using key-value pairs that are appended to the ad server request URL.

Key-value pairs are used to signify the bid prices of Prebid bidders, but that’s not all. Deal IDs, ad size, ad format information, and much more can be transmitted to the ad server.

It’s important to know which key values will be used to pass Prebid data into your ad server, because key values supply the data that you need to target header bidding line items and report on header bidding activity with ad server reports. Sometimes, key value pairs are also necessary for the proper rendering of ads, particularly with the native and video ad formats. Because of this,  it’s critically important that the engineering team in charge of Prebid integration are in close communication with the ad operations team.

Here’s a list of some of the key-value pairs that Prebid.js is able to append to ad server requests.

You may want to augment or restrict the information that Prebid.js  sends to your ad server. For example, if your site already uses key-value pairs to deliver large amounts of contextual page information to the ad server, then you may need to restrict Prebid.js key-value pairs to control the size of your ad server requests. The Prebid.js configuration allows you to add, remove, or modify key-value pairs to meet your needs. 

### Topic 7: Deals

In our final topic, we’ll explain how to think about working with Private Marketplace Deals in your ad server setup for Prebid. 

Deals help publishers drive revenue by developing strategic relationships with buyers.

You can control deal delivery by creating line items targeted to specific deal IDs. This allows you to fine-tune the priority of deal bids relative to other bids and can improve deal reporting. There are options in both Prebid.js and Prebid Server to include or prioritize deal bids. Check the links below this video for more information.

### Line Item Implementation

Once you’ve made a decision about how you will organize your line item setup, you’ll need to think about how you’ll implement it. 

Ad ops teams can create header bidding line items manually in the ad server’s UI, but most teams use automated solutions.
Prebid’s Line Item Manager is an open-source command line tool that automates the creation and configuration of Prebid line items in Google Ad Manager. 

Some publishers  also choose to develop their own line item managers. 

Prebid Managed Service providers also offer robust line item managers along with Prebid hosting, configuration, and optimization services.

For information about the Prebid Line Item Manager and Prebid Managed Services, visit the links in the description below.
