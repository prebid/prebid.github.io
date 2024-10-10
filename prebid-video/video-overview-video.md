---
layout: page_v2
title: Video Intro to Prebid Video
description: A video overview of Prebid Video
sidebarType: 5
---

# Prebid.js and the Video Ad Format

An introduction to how video works with Prebid.js.

{% include vimeo-iframe.html id="871606980" title="3.2 Video in Prebid 2023-12-20" %}

<p/>
Further Content:

- [Getting Started with Video for Prebid.js](/prebid-video/video-getting-started.html)
- [Intro to Header Bidding](/overview/intro-to-header-bidding.html)
- [Header Bidding with Prebid](/overview/intro.html#header-bidding-with-prebid)

Related Videos:

- [Introduction to Prebid.js](/prebid/prebidjs-video.html)
- [Prebid.js Impression Flow](/prebid/prebidjs-flow-video.html)
- [Components of Prebid.js](/prebid/prebidjs-components-video.html)
- [All Videos](/overview/all-videos.html)

## Transcript

### Introduction

This video explains how video ads work in Prebid.js. 

We’ll discuss the two main ways that video ads can be integrated with page content, how to run Prebid.js auctions for video ads, and how to integrate Prebid.js with your primary ad server for video.

Let’s start with page integration. There are many ways for video ads to be shown on a website. 

In some cases, the video ads run before, during, or after video content within a video player that is the focus of the user’s attention on the page.

We call these player-initiated video placements.

In others, the video ads are positioned alongside static content like a banner ad. Sometimes, publishers even set up multi-format placements that can display banners, video, or native ads.

We call these page-initiated video placements.

How you choose to design your video advertising experiences depends on your content and monetization strategies. Your Prebid.js setup will follow the decisions you’ve made about how to integrate video ads into your pages.

As you start to think about integrating video ad placements with Prebid.js, it’s important to keep one distinction in mind: what communicates with the ad server? Is it the player, or a JavaScript tag on the page? You can certainly run successful Prebid.js auctions in either scenario, but the distinction does impact how Prebid.js is set up. Let’s take a moment to explore each type.

With player-initiated video ads, the ad opportunity occurs within a video player. In these cases, the video player will be responsible for making the ad request to the primary ad server. Usually, these ads run before, during, or after video content. This type of ad is sometimes called “instream”. To serve ads in this scenario, Prebid.js will work closely with the player in a process that differs in a few key ways from a traditional Prebid.js banner auction.

Conversely, page-initiated video auctions are quite similar to ordinary banner auctions. For page-initiated video, a video player does not load with the page source code. The ad slot is defined much like a banner or native slot, and JavaScript tags are responsible for making the request to the primary ad server. 

This video will focus mainly on the player-initiated scenario. We’ll touch on the page-initiated case at the end.

Next, we’ll explain how in-player video works. To get the most of out of this video, you’ll need a basic understanding about how a Prebid.js auction works. For a refresher, check out our other videos, particularly the Introduction to Prebid.js and the Prebid.js Impression Flow. The links to these videos can be found in the notes below.

### How Prebid.js Video Works

Next, we’ll explain how in-player video works. To get the most of out of this video, you’ll need a basic understanding about how a Prebid.js auction works. For a refresher, check out our other videos, particularly the Introduction to Prebid.js and the Prebid.js Impression Flow. The links to these videos can be found in the notes below.

Like in any Prebid.js auction, the process can be broken down into three stages: Pre-Auction, Auction, and Post-Auction

#### Pre-Auction

The Pre-Auction phase for pages containing player-initiated video placements is the same as the process we describe in the Prebid.js Impression Flow video. 

In the Pre-Auction phase, the user requests the page, the publishers’ CMS is called and returns the page source, which includes instructions to load Prebid.js and begin an auction for one or more Ad Units. An ad unit defines a unique impression opportunity. 

The ad unit’s media type configuration includes slot attributes like the player size and playback methods.

Video ads require several more parameters than banner ads. Many of these parameters describe the characteristics of the video player that affect user interaction. These include the size of the video player, whether or not the video plays automatically, whether or not the video has sound automatically enabled, and more. You can set these details manually in the Ad Unit Configuration, or use the Prebid Video Module, which is able to gather them automatically from the video player

You can set these details manually in the Ad Unit Configuration, or use the Prebid Video Module, which is able to gather them automatically from the video player.

For more information about the Prebid Video Module, including a list of supported video players, visit docs. Prebid.org.

#### Auction

Next comes the auction stage. During this stage, Prebid.js will collect bids.

Prebid.js makes bid requests to bidders who are enabled for the video ad units.

The bid request signals that that ad unit is a video player using the `placement` parameter.

Bidders consider the impression opportunity and decide whether or not to submit a bid.

When a bidder chooses to bid, they make a response to Prebid.js that contains a price, a VAST Document, and other optional information such as deal IDs. 

VAST is an XML file whose format is standardized by the Interactive Advertising Bureau, or IAB. It contains information that the player will need to display the ad correctly. It also contains information that the player will use to send notifications for tracking events. 

#### Post-Auction

Next, the Post Auction stage begins.

Prebid.js evaluates the bid responses using the steps described in the Prebid.js impression flow video. 

In addition, Prebid.js extracts the VAST XML from video bid responses and may be configured to store it in a server-side cache. For most bidders, the cache is a shared location, but some bidders prefer to use their own caching servers. When it’s time for the player to display the ad, the stored VAST document will be retrieved.

Prebid.js evaluates the bids and generates an ad server request URL for the player. This URL will contain the bid key-value pairs and is passed on to the video player.

The video player loads the ad server request URL to make a request for ads to the primary ad server.

The ad server receives the request and chooses a line item to serve, using information about the ad slot and bids to make its decision.

The creative associated with Prebid line items is a URL that points to the cache where the VAST XML has been stored. When the ad server selects a Prebid line item, it responds to the video player with this URL.

The video player begins the process of displaying the ad by requesting the VAST XML from the caching server. 

The video ad interprets the VAST document and displays the video ad.

If the Prebid Video Module is installed, it will generate Prebid.js analytics tracking events from the player as the ad plays.

### Page-Initiated Video Ads

We’ll end this video with a brief discussion of page-initiated video ads.

Page-initiated and player-initiated differ substantially in how Prebid.js identifies the ad slots and communicates with the ad server. 

From Prebid’s perspective, page-initiated video behaves much like the banner and native media types. It is able to coexist with banner and native in multi ad format ad slots, and auction information for page-initiated ad units are sent to the ad server using the targeting key-value pairs used for banner.

It also uses a JavaScript component like the Prebid Universal Creative to trigger the process of displaying the ad.

This process usually involves Prebid.js retrieving a renderer which is a JavaScript component that is able to play the video ad. Many renderers integrate seamlessly with the page layout by collapsing and expanding or adhering to a position within the browser window. 

Many bidders provide the renderer for the ads they deliver, but you can use your own instead if you prefer

### Conclusion

That’s it for this explanation of Video in Prebid.js. To learn more, check out the reference documentation at docs.prebid.org
