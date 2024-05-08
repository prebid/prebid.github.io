---

layout: page_v2
title: GAM Bidding-Only Integration
description: Integration of Prebid SDK with Prebid Server responsible for bidding only while Google Ad Manager handles rendering.
sidebarType: 2

---

# GAM Bidding-Only Integration

* TOC
{:toc}

## Overview

This how-to guide covers the original approach for integrating the Prebid SDK into your app with the GMA SDK. It utilizes:

- **Prebid SDK** and the **Prebid server** handle the bidding and auction process.
- **GAM** and the **GMA SDK** manage the ad inventory and select the winning ad to display.
- [**Prebid Universal Creative**](/overview/prebid-universal-creative.html) renders display ads.
- **GMA SDK** renders video ad content.

### Alternative approaches

Another way to integrate GAM into your app is with the [GAM SDK-Rendered integation](TBD). 

Tradeoffs:

- The 'Bidding Only' approach detailed here gives programmers direct access to the bid responses, so as a developer, there is greater control over how Prebid bids are handled. 
- However, this approach does not support rendering MRAID 3.0 creatives or SKAdNetwork. If you need those features, you'll want to use the [GAM SDK-Rendered integation](TBD) method.
- The rendering latency of the [GAM SDK-Rendered integation](TBD) approach for display ads may be somewhat better because it does not need to hit the Prebid Cache to retrieve creatives.

## Prerequisites

The GAM Bidding-Only Integration approach assumes that you have the following ingredients:

- **Google Ad Manager Account** - Your GAM account allows you to manage and serve ads within your mobile app. Within this account you'll need to configure your ad inventory and create orders for serving ads within your app. This involves defining ad units (spaces within your app where ads will be displayed) and setting up orders and line items to deliver ads to those units. See [Prebid's AdOps Guide](/adops/before-you-start.html) for more information.
- **Google Mobile Ads (GMA) SDK** - This refers to the software development kit provided by your ad server (in this case, Google Ad Manager). You need to ensure that you have the latest version of the Ad Server SDK supported by Prebid SDK. This SDK integration is necessary to communicate with the ad server and display ads in your app.
- **Prebid SDK** - You will need the latest version of the Prebid Mobile SDK for either [Android](/prebid/prebid-mobile-android) or [iOS](/prebid/prebid-mobile-ios). This page will help you integrate the Prebid SDK into your app.
- **Prebid Universal Creative** - This needs to be hosted on a CDN and loaded from the creative in GAM as detailed in the [AdOps GAM Step-by-Step reference](/adops/gam-creative-banner-sbs.html).
- **Prebid Server** - You will need a server running [Prebid Server](/prebid-server/use-cases/pbs-sdk.html). You can set up your own Prebid Server or work with a [Prebid Server managed service](https://prebid.org/managed-services/). Prebid Server provides you with the following:
    - Configuration storage - rather than hardcoding all the details of your current business arrangements in the app, Prebid Server stores which bidders you're currently working with, their inventory details, and other settings that can be changed without updating your app.
    - Server-side auction - the server will make the connections to multiple auction bidding partners so the app doesn't have to.
    - Privacy regulation tools - the server can help your legal team meet different regulatory needs in different jurisdictions by configuring various protocols and anonyimization activities.

## High-level overview

The following is a high-level explanation of how the ad bidding-auction-rendering process works in this integration scenario.

![GAM Bidding Only Integration Overview](https://docs.prebid.org/assets/images/prebid-mobile/prebid-in-app-bidding-overview-prebid-original.png)

### Step 1: Initial bid request

When your mobile app wants to show an ad, the Prebid SDK sends a basic request to the Prebid Server. This request includes details about the ad space (like size and location) but not specific bidders.

### Step 2: Full bid request

The Prebid Server takes the incomplete information received from the Prebid SDK and adds more details to create a full request for each bidder configured by the app developer's business team. It then sends this request to these various demand partners. Each bidder evaluates the request and decides if they want to bid on it. If they do, they send back their bid, including the price they're willing to pay and the ad creative - the actual content like image or video to be displayed if they win.

### Step 3: Bid Response and caching

After validating the received bids, Prebid Server caches them for a limited time and sends them back to the Prebid SDK with [ad server key-value pairs](/adops/key-values.html) attached.

### Step 4: Bid details passed GMA SDK

The Prebid SDK passes the bid details to the adunit created in the Google Mobile Ads (GMA) SDK.

### Step 5: Ad server request

The GMA SDK makes a request to Google Ad Manager (GAM) for an ad to be chosen. It includes a number of targeting key/value pairs correspondinging to bid price, format, size, and other details.

### Step 6: GAM ad source resolution

GAM resolves the competing ad sources including the special line items created for Prebid bids. If the Prebid line item associated with the winning bid is selected, GAM returns the creative associated with it to the GMA SDK. 

### Step 7: Ad Rendering

Depending on the ad type (banner, native, or video), the rendering process begins. For banners and native ads, the GMA SDK renders the ad markup using Prebid Universal Creative (PUC). For video ads, the VAST URL (a format for serving video ads) is handed off to the video player on the mobile device.

### Step 8: Prebid Cache lookup

Before displaying the ad, the PUC or the video player may check the Prebid Cache Server to load the creative content associated with the winning bid has been cached. If it has, the content is fetched and rendered.

## Initialization and General Parameters

Assuming your app is already built with GMA AdUnits, the technical implementation of the Prebid SDK into your app will involve 4 major steps:

1. Initialize the Prebid SDK - create a connection to your Prebid Server.
2. Set Global Parameters - let bidders know important data about the page, privacy consent, and other settings.
3. Link Prebid AdUnit code to your GMA AdUnits - for any adunits that your business team wants to connect to the Prebid auction.
4. Test

[TBD links to be added once pages are written]

## AdUnit-Specific instructions

This section describes the integration details for different ad formats. In each scenario, you'll be asked for a `configId` - this is a key worked out with your Prebid Server provider. It's used at runtime to pull in the bidders and parameters specific to this adunit. Depending on your Prebid Server partner, it may be a UUID or constructed out of parts like your account number and adunit name.


###  [Format: HTML Banner](/prebid-mobile/recipes/sub-recipes/ios/gam-bidding-only-html-banner.html)

###  [Format: Multiformat (banner+video)](/prebid-mobile/recipes/sub-recipes/ios/gam-bidding-only-multiformat.html)

###  [Format: Interstitial Banner](/prebid-mobile/recipes/sub-recipes/ios/gam-bidding-only-interstitial-banner.html)

###  [Format: Video Interstitial](/prebid-mobile/recipes/sub-recipes/ios/gam-bidding-only-video-interstitial.html)

###  [Format: Rewarded Video Ad](/prebid-mobile/recipes/sub-recipes/ios/gam-bidding-only-rewarded-video.html)

###  [Format: Multiformat (Banner + In-App Native)](/prebid-mobile/recipes/sub-recipes/ios/gam-bidding-only-banner-in-app-native.html)

###  [Format: Multiformat Interstitial (HTML + Video)](/prebid-mobile/recipes/sub-recipes/ios/gam-bidding-only-multiformat-interstitial.html)

###  [Format: Native Banner](/prebid-mobile/recipes/sub-recipes/ios/gam-bidding-only-native-banner.html)

###  [Format: Native In-App](/prebid-mobile/recipes/sub-recipes/ios/gam-bidding-only-native-in-app.html)

###  [Format: Multiformat (HTML + Video + Native)](/prebid-mobile/recipes/sub-recipes/ios/gam-bidding-only-html-video-native.html)
