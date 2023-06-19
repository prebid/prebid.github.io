---
layout: page_v2
title: Video Intro to Prebid.js Components
description: A video overview of Prebid.js Components
sidebarType: 1
---

# A Video Overview of Prebid.js Components

An explanation of Prebid.js’ components and a guide to using Prebid.js reference documentation.

<div style="padding:56.25% 0 0 0;margin: 1rem 0;position:relative;"><iframe src="https://player.vimeo.com/video/826314008?h=ec9fad7080&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Components of Prebid.js"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

Further Content:

- [Ad Unit Reference](/dev-docs/adunit-reference.html)
- [Bidder Params Reference](/dev-docs/bidders.html)
- [Modules Overview](/dev-docs/modules/)
- [Analytics Overview](/overview/analytics.html)
- [Prebid.js Download](/download.html)
- [Prebid.js Configuration Reference](/dev-docs/publisher-api-reference/setConfig.html)
- [All videos](/overview/all-videos.html)

Related Videos

- [Introduction to Prebid.js](/prebid/prebidjs-video.html)
- [Prebid.js Impression Flow](/prebid/prebidjs-flow-video.html)
- [Identity in Prebid.js](/identity/prebid-identity-video.html)

## Transcript

### Introduction

This video will take a tour of Prebid.js. We’ll show you Prebid.js’ basic components and explain how they work together to serve ads.

The video assumes that you have a basic understanding of what Prebid.js does. For some background, check out our other videos, including the Introduction to Prebid.js, and the Prebid.js Impression Flow, which walks through a Prebid.js auction step-by-step.

A typical Prebid.js installation includes four basic components: the Prebid.js core, modules, bid adapters, and Ad Units.

Prebid.js core components  are the functional components of Prebid.js that do things like execute the auction. Prebid.js must include these components in order to work properly.

Modules are optional components that extend Prebid.js’ capabilities. There are many different kinds of modules for purposes like ad request enrichment, analytics, consent management, and more.

Bid adapters are functional components that allow bidders to be integrated into Prebid.js. Each bidder has its own bid adapter.

Finally, Ad Units are where ad slots are defined within Prebid.js. They describe the characteristics of ad slots and are used to determine the set of bidders that are allowed to serve on each slot.

Now we’ll explore modules, bid adapters, and ad units in more detail. As we go, we’ll refer to the relevant sections of the Prebid.js reference documentation, which lives at docs.prebid.org. Check the notes section below this video for links to all of the documentation referred to in the video.

### Bid Adapters

We’ll start with bid adapters.

Bid adapters are plugins that enable Prebid.js to send bid requests to and receive bid responses from bidders. A company that wants to be able to compete in Prebid auctions builds their own bid adapter and contributes it to the Prebid repository

When the Prebid auction runs, bid adapters construct a bid request into the bidder’s proprietary format. The request can include information from the Ad Unit and from other sources such as consent modules and real time data modules.

Bid adapters also allow Prebid.js to translate each bidder’s response into a format that Prebid understands.

### Ad Units

An Ad Unit represents a single ad slot on a web page, and contains all the information needed for Prebid.js to request bids for the slot.

Each ad unit has a unique identifier called an ad unit code, and includes two key blocks of information that are configured by the publisher: Media Types and Bids.

#### Media Types

Media Types define the ad formats that the ad placement can display, such as banner, native, or video. Within the mediaType configuration, the publisher describes the characteristics of the ad slot.

For example, the banner ad mediaType allows the publisher to specify the dimensions of the slot, and the video mediaType lets the publisher specify whether the slot is an instream or outstream placement.

An ad unit can include multiple mediaTypes, which makes the slot a multi-format slot.

The Ad Unit Reference at docs.prebid.org contains detailed information about Ad Units and Media Types.

#### Bids

Bids is an array of bid objects: one for each bidder who is enabled to compete for the ad slot’s impression opportunities.

To include a bidder in auctions for a given Ad Unit, the publisher adds a bid object for the bidder to the Ad Unit.

The contents of the bid object are used to control the data that’s sent to bidders in bid requests. Bidders decide which parameters appear in their own bid objects. Common parameters are bidder-specific identifiers of the publisher, site, and ad slot. Publishers work with their bidder partners to configure these parameters.

The Bidder Params reference is where to look for documentation on how to configure Prebid bidders parameters.  

### Modules

Next, we’ll discuss Prebid modules, which are optional components that add extra functionality to Prebid.js. Some modules have been built by the core Prebid team, while others have been contributed by Prebid member companies and third-party developers. Modules are always open-source. In some cases, companies will develop a module to help power a Prebid-related paid service.

There are many types of modules in Prebid. They serve many purposes and can plug into any phase of the Prebid.js auction. For more information on the auction phases, check out the Prebid.js Impression Flow video. Prebid.js Modules page at docs.prebid.org has a list of all of Prebid.js’ modules, including a short description of each one.

In this video, we’ll focus on a few key categories of modules:

One category is modules for ad request enrichment, which is the process of adding extra information to bid requests. Ad request enrichment can help publishers improve monetization by helping bidders evaluate impression opportunities more effectively. Enrichment data is a broad category, and can include user identifiers, seller-defined audiences, contextual targeting data, viewability signals, and more.

Another important and commonly-used category is consent management modules. These modules allow publishers to execute on their approach to user privacy and data consent. To learn more about consent management, check out our video on Identity in Prebid.js.

A final key category are modules commonly known as analytics adapters. These are vital for getting the best possible performance out of Prebid. Analytics adapters are used to gather information about Prebid auctions and send it to servers that will aggregate the data into reports. There are dozens of analytics adapters. A complete list of analytics adapters can be found on the Analytics for Prebid page at docs.prebid.org.

The capabilities of Prebid’s modules go even further beyond these three key categories. For example, some modules help publishers optimize Prebid’s performance by controlling auction settings like bid timeout and price floors dynamically. More information about these can be found on the Prebid.js modules page.

When you’re ready to build a Prebid.js wrapper with a hand-picked selection of modules, visit the Download page at docs.prebid.org.

### Prebid.js Configuration

As we’ve already seen, much of a Prebid.js integration’s parameters are configured inside ad units. However, there are also settings of Prebid.js that apply globally, such as general auction controls and the parameters of modules. These settings are stored in the Prebid.js configuration, which is set using the pbjs.setConfig() method.

Many of Prebid’s most important settings live here, including bidder timeout, user sync settings, and price granularity.

Detailed documentation of the Prebid.js configuration can be found in the publisher API reference. <https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html>

That’s it for this overview of Prebid.js for more information, check the links in the description below or visit docs.prebid.org.
