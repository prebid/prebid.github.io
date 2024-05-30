---
layout: page_v2
title: Video overview of how Prebid Mobile works
description: Video overview of how Prebid Mobile works
sidebarType: 0
---

# Video overview of how Prebid Mobile works

A step-by-step walkthrough of a typical Prebid Mobile auction.

{% include vimeo-iframe.html id="945961210" title="Prebid Mobile Impression Flow" %}

Further Content:

- [Getting Started with Prebid Mobile](/prebid-mobile/prebid-mobile-getting-started.html)
- [All videos](/overview/all-videos.html)

Related Videos:

- [Introduction to Prebid Mobile](/prebid-mobile/prebid-mobile-video.html)
- [Prebid.js Impression Flow](/prebid/prebidjs-flow-video.html)
- [Prebid Mobile Planning Guide](/prebid-mobile/prebid-mobile-video-planning.html)

## Transcript

### Introduction

This video explains how Prebid Mobile works by walking through a typical Prebid Mobile Auction. 

Prebid Mobile is Prebid’s solution for header bidding in the mobile app environment. 

For a high level introduction to the Prebid Mobile product and the benefits it offers app developers, check out our Introduction to Prebid Mobile video. For context on Prebid conventions and terminology, we also recommend watching the Prebid.js Impression Flow video, which walks through a standard Prebid.js auction for websites. The links to these videos are in the notes below. 

Prebid Mobile allows app developers to access demand from multiple programmatic advertising marketplaces simultaneously. It can serve ads with or without a primary ad server and is compatible with every major mobile app ad serving solution. 

### Prebid Mobile Architecture

Let’s start by covering the basic structure of the Prebid Mobile solution.

The Prebid Mobile solution consists of two components that work closely together: the Prebid SDK and Prebid Server. SDK stands for “Software Development Kit”, which is a type of module that can be installed into an app and has specific functionality. The Prebid SDK is responsible for communicating between the app, Prebid Server, and the primary ad server, if one exists. It also helps to render ads from Prebid Mobile demand sources. 

Prebid Server is responsible for running the auction among demand partners. It allows multiple demand partners to bid simultaneously on each ad opportunity, and it’s where inventory and auction controls are set. 

Prebid Server is open source code. To use it, you’ll need to set up your own hosting server or find a partner to manage the hosting server for you.

For more information on this process, check out our other video on planning a Prebid Mobile integration. 

### Impression Flow

With the basics in place, let’s now walk through a Prebid Mobile auction step-by-step.
Like in any Prebid Server auction, the process can be broken down into three stages: Pre-Auction, Auction, and Post-Auction.

#### Pre-Auction

As always, we start with Pre-Auction

In the Pre Auction Phase, the Prebid SDK is initialized. When the development team installs the SDK, they include an auction settings ID, which identifies the entire Prebid Mobile instance. They will also tag each ad slot with a config ID, which allows Prebid Server to look up information about the ad unit and run an auction. 

When an app screen loads that contains ad slots, the SDK will prepare a request for ads. It gathers the auction settings ID and config IDs for each of the page’s ad slots, along with other client-side data like app and device identifiers, first party data, and privacy consent data such as a consent string.

The SDK then calls Prebid Server with an ad request. When Prebid Server receives the request, it uses the auction settings ID and config IDs to look up data. 

Prebid Mobile stores ad unit data like media type parameters and bidder configurations in a database on the server side. Prebid Mobile’s server-side architecture makes it easy for the monetization team to change auction settings without needing to update the app. 

In the Prebid Server documentation, the auction settings ID is sometimes called the “top-level stored request ID”, while config IDs are called “impression-level stored request IDs”.

As noted a moment ago, PBS uses these IDs to look up data. Specifically, the account ID (or auction settings ID) is used to look up settings like price granularity, the auction timeout, and ad server targeting settings.

The config IDs are used to gather information about the ad unit, such as the ad format and the list of bidders enabled to bid on the ad unit. 

During this pre-auction stage, Prebid Server also looks up other data like the device location and applies any location-specific privacy controls. It’s also able to perform extra optional tasks like establishing a price floor to govern the auction. 

Prebid Mobile stores ad unit data like media type parameters and bidder configurations in a database on the server side. Prebid Mobile’s server-side architecture makes it easy for the monetization team to change auction settings without needing to update the app. In the Prebid Server documentation, the auction settings ID is sometimes called the “top-level stored request ID”, while config IDs are called “impression-level stored request IDs”.

When an app screen loads that contains ad slots, the SDK will prepare a request for ads. It gathers the auction settings ID and config IDs for each of the page’s ad slots, along with other client-side data like app and device identifiers, first party data, and privacy consent data such as a consent string.

#### Auction

With the Pre-Auction data-gathering complete, Prebid Server begins the Auction stage. 
It makes OpenRTB bid requests to bidders, who evaluate the impression opportunities and return bid responses. 
#### Post-Auction

When either all of the bidders have responded or the bid timeout period has elapsed, Prebid Server closes the auction, and the Post-Auction stage begins. 

Prebid Server parses the bid responses, and may perform validations such as enforcing price floors, if they exist.

It will cache data including the ad creative for valid bids and prepare a response to the SDK.

Prebid Server then responds to the Prebid SDK with an OpenRTB response that includes bid prices and ad server targeting key-value pairs.

When the Prebid SDK receives the response from Prebid Server, it works with the ad serving or mediation stack to complete the ad decisioning process. The bids that Prebid Mobile has gathered will compete with other demand, such as ad networks or direct campaigns for the opportunity to serve. The details of how this process works depends on your ad serving and mediation setup. 

Some ad stacks construct a sequential waterfall of eligible demand sources, while others use auctions. In general, we recommend using an ad stack that allows Prebid demand to compete using real time bid prices instead of static estimates. Prebid’s ability to bid dynamically into the ad stack helps publishers and app developers maximize CPMs and fill rates. Prebid Mobile is flexible and works with all of the major mobile app ad serving and mediation solutions. 

Once the ad server or mediation solution has made a decision about whose ad should serve, it’s time to render the ad. The specific details of ad rendering also depend on your app and ad stack. 

Some solutions use the Prebid Universal Creative that is commonly used for web integrations, while others use ad rendering capabilities that are built into Prebid SDK, the ad server SDK, or an SDK from a demand partner or rich media vendor. Prebid Mobile is flexible enough to work with any common rendering solution. 

That’s how ads are served with Prebid Mobile. To learn more about Prebid Mobile, check out the links included in the notes below. 
