---
layout: page_v2
title: A video guide to planning your first Prebid Mobile integration
description: A video guide to planning your first Prebid Mobile integration
sidebarType: 0
---

# Planning a Prebid Mobile integration

A video guide to planning your first Prebid Mobile integration.

{% include vimeo-iframe.html id="948475423" title="Prebid Mobile Planning Guide" %}

Further Content:

- [Getting Started with Prebid Mobile](/prebid-mobile/prebid-mobile-getting-started.html)
- [Prebid Managed Services](https://prebid.org/product-suite/managed-services/)
- [All videos](/overview/all-videos.html)

Related Videos:

- [Introduction to Prebid Mobile](/prebid-mobile/prebid-mobile-video.html)
- [Prebid.js Impression Flow](/prebid/prebidjs-flow-video.html)
- [Prebid Mobile Impression Flow](/prebid-mobile/prebid-mobile-video-flow.html)

## Transcript

### Introduction

This video is a guide to planning an integration of Prebid Mobile. It focuses on the decisions that monetization, ad ops, and development teams should make collaboratively before beginning the technical process of implementing Prebid Mobile. 

This video assumes you have a good grasp on what Prebid Mobile does and how it works. For a high-level introduction to the Prebid Mobile solution, we recommend the Introduction to Prebid Mobile. For a more detailed look at how Prebid Mobile monetizes mobile app ad slots, check out the Prebid Mobile Impression Flow video. You can find the links to these videos in the notes below. 

This video will talk about the planning required to set up the two main components of Prebid Mobile: the Prebid SDK and Prebid Server. 

To set up Prebid Mobile, you’ll need to build the Prebid SDK into your application and configure it with IDs that will define auction settings instances and ad slots. You’ll also need to set up Prebid Server to run on a hosting server and configure it to run auctions for requests that Prebid SDK will make from the mobile app. 
### Prebid SDK Planning

Let’s start with the Prebid SDK. The Prebid SDK acts as the interface between the app’s ad slots and Prebid Server. When an app screen loads, Prebid SDK will make a request to Prebid Server that contains data that Prebid Server and bidders will use. 

There are five key types of data transmitted in an ad request from Prebid SDK: an account ID, an auction settings ID, a config ID, first-party data, and consent data. 

Account ID is used to identify your requests to the Prebid Server instance that is responsible for running your auctions. If you work with a managed service provider to maintain your Prebid Server infrastructure, the ID will be used to separate your data from the provider’s other customers’ data.

The auction settings ID is used by Prebid Server to determine auction-level settings like bid timeout and ad server targeting.

Config IDs are ad-unit level parameters that control the settings for a specific ad slot, including the ad slot characteristics and bidder selection. 

First party data, also called targeting data, is free-form data that you can use to enrich your ad requests with additional data that is valuable to bidders. 

Consent data relates to privacy regulations that apply to users in many regions of the world. Prebid SDK is able to obtain consent data from your Consent Management Platform and transmit it to Prebid Server. On the Prebid Server side, you’ll be able to configure how the advertising auction reacts to consent data it receives.

Prebid Mobile has powerful tools for managing privacy and consent. How you use those tools is up to you. It’s important to develop your own strategy concerning privacy and regulatory compliance.

When you install the Prebid SDK into your app, you’ll assign an account ID, auction settings ID, and config IDs to the app and ad placements, and you’ll set up specific first party data to be passed. It’s important to think carefully about how you want to set this up,  because you would need to update the app in order to change this information. Once the SDK is installed and passing IDs and first party data in requests, your day-to-day management of Prebid Mobile doesn’t require app modifications. This is because Prebid Mobile has a server-side architecture that houses the auction and ad unit-level configurations within Prebid Server.

Next, we’ll examine each of the Auction Settings, and First Party Data in detail.

### Auction Settings ID

The auction settings ID links to an object inside Prebid Server called a top-level stored request, which contains configuration parameters that apply to the entire auction. These parameters include the bid timeout, price granularity, and ad server targeting settings. 

Each time Prebid Server receives a request from Prebid SDK, it expects that request to include one auction settings ID. Many app developers use a single auction settings ID for all of their mobile app inventory, while others break up the inventory more granularly. The primary reasons to use separate auction settings are to be able to customize the bid timeout or a user privacy settings for specific apps or app screens. This increased flexibility can be useful, but it comes at the cost of greater complexity in managing configurations. 

### Config ID

Next let’s discuss the config ID.

The config ID links to an object inside Prebid Server called an impression-level stored request, which contains ad-unit level data, which includes bidder configurations and can include details about supported ad formats. 

Bidder parameters are one of the most important parts of any Prebid Ad Unit. By including a bidder’s parameters in the ad unit, you’re making that bidder eligible to compete for the ad unit’s impressions. Further, each bidder requires a proprietary set of ad unit identifiers and other data. Bidder params are where this bidder-specific data lives. 

A separate config ID is used for each ad placement on the app screen, so Prebid Server will expect to receive one or more config IDs in ad requests from the Prebid SDK. You'll coordinate with your Prebid Server team to define these IDs.

When you set up the Prebid SDK, you can use a streamlined setup that uses relatively few config IDs, or a very detailed one that uses many config IDs to differentiate ad placements by position, screen type, app, and other dimensions. Using many unique config IDs gives you more flexibility in reporting and yield optimization, but can be difficult to manage operationally. Using few config IDs is the opposite: reporting and configuration is simple, but the power and the flexibility of your setup is limited. For example, let’s say you want to add a particular bidder to just one highly specific ad placement. To do so, you’d need to give that placement its own config ID. 

For many app developers, it makes sense to create a Prebid Mobile config ID mapping that matches your ad server ad units. This way, you don’t need to keep track of multiple inventory segmentation schemes, and the ad server scheme usually strikes a healthy balance between flexibility and ease of use.

Before you start implementing your config ID setup, it’s smart to talk to your header bidding partners. Many bidders also require ad slot identifiers in the the bidder parameters section of the impression-level stored request. These identifiers help bidders understand where the impression is coming from, and bidders may have preferences regarding ad slot identification. Similarly, some Prebid Managed Services include algorithmic yield management features that rely on config IDs to optimize parameters like bid timeout, bidder selection, and price floors. 

### First Party Data

Requests to Prebid Server can also include first party data. First party data is a wide category that can include contextual information about the app or non-personally-identifiable user data like seller-defined audiences. Like with config IDs, a good starting point is to send to Prebid Server the first party data that you already send in requests to your primary ad server. You can then take things a step further by asking your bidder partners and managed service provider for advice on what first party data signals to pass. 

Once you’ve made decisions about how to set inventory identifiers and first party data, you’ll be ready to move forward with integrating the Prebid SDK. Visit docs.prebid.org for integration documentation for the major platforms and ad stacks.

### Prebid Server Planning

Now let’s move to the server side. We’ll explain how to plan a Prebid Server integration.

As we’ve said, Prebid Server receives requests from the Prebid SDK that contains auction settings IDs and config IDs and runs an auction among bidders, then responds to the Prebid SDK with the auction results. 

Prebid Server is code that the Prebid community has developed to run advertising auctions in the cloud. Anybody is welcome to use it, but they must set up their own servers to run the solution. 

Running an instance of Prebid Server is much like operating an OpenRTB marketplace. The servers must be able to process large numbers of ad requests originating from devices around the globe and run auctions that capture as many bids from bidders as possible. The servers must be both powerful and efficient. Estimating traffic volumes and managing server capacity is critically important to make sure that every ad request can be processed without wasting resources. 

Additionally, Prebid Server setup will need tools for managing auction and ad unit configurations, which can change often as you fine tune your header bidding setup. For example, adding a new bidder means changing the ad unit configuration.

If your organization has experience managing scaled ad serving infrastructure and is able to develop configuration interfaces, then running Prebid Server on servers that you manage directly could be a good choice. 

An alternative option is to hire a company that specializes in this work. The Prebid community includes several companies that have developed Prebid Managed Services that provide products and services that include Prebid Server hosting as well as configuration tools and analytics. For more information about Prebid Managed Services, visit the link in the description below.

### Outro

That’s all for this guide on Prebid Mobile planning. For more information on Prebid Mobile, check out the reference documentation and docs.prebid.org.
