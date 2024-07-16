---
layout: page_v2
title: Prebid Mobile iOS - GAM Bidding-Only Integration
description: Integration of Prebid SDK iOS With Google Ad Manager using the 'Bidding-Only' integration
sidebarType: 2
---

# Prebid SDK iOS with the GAM Bidding-Only Integration Method
{:.no_toc}

- TOC
{:toc}

## Overview

This how-to guide covers the original approach for integrating the Prebid SDK into your app with the GMA SDK. It utilizes:

- **Prebid SDK** and the **Prebid server** handle the bidding and auction process.
- **GAM** and the **GMA SDK** manage the ad inventory and select the winning ad to display.
- **Prebid Universal Creative** renders display ads.
- **GMA SDK** renders video ad content.

### Alternative approaches

Another way to integrate GAM into your app is with the [GAM Prebid-Rendered integration](/prebid-mobile/modules/rendering/ios-sdk-integration-gam.html). 

Tradeoffs:

- The 'Bidding Only' integration method detailed here gives programmers direct access to the bid responses, so as a developer, there is greater control over how Prebid bids are handled. 
- However, this approach does not support rendering MRAID 3.0 creatives or SKAdNetwork. If you need those features, you'll want to use the GAM Prebid-Rendered integation method.
- The rendering latency of the GAM Prebid-Rendered integration method for display ads may be somewhat better because it doesn't need to hit the Prebid Cache to retrieve creatives.

## Prerequisites

The GAM Bidding-Only Integration method assumes that you have the following components:

- **Google Ad Manager Account** - Your GAM account allows you to manage and serve ads within your mobile app. Within this account you'll need to configure your ad inventory and create orders for serving ads within your app. This involves defining ad units (spaces within your app where ads will be displayed) and setting up orders and line items to deliver ads to those units. See [Prebid's AdOps Guide](/adops/before-you-start.html) for more information.
- **Google Mobile Ads (GMA) SDK** - This refers to the software development kit provided by your ad server (in this case, Google Ad Manager). You need to ensure that you have the latest version of the Ad Server SDK supported by Prebid SDK. This SDK integration is necessary to communicate with the ad server and display ads in your app.
- **Prebid SDK** - You will need the latest version of the Prebid Mobile SDK for either [Android](/prebid-mobile/pbm-api/android/code-integration-android.html) or [iOS](/prebid-mobile/pbm-api/ios/code-integration-ios.html). This page will help you integrate the Prebid SDK into your app.
- **Prebid Universal Creative** - This needs to be hosted on a CDN and loaded from the creative in GAM as detailed in the [AdOps GAM Step-by-Step reference](/adops/gam-creative-banner-sbs.html).
- **Prebid Server** - You will need a server running [Prebid Server](/prebid-server/use-cases/pbs-sdk.html). You can set up your own Prebid Server or work with a [Prebid Server managed service](https://prebid.org/managed-services/). Prebid Server provides you with the following:
    - Configuration storage - rather than hardcoding all the details of your current business arrangements in the app, Prebid Server stores which bidders you're currently working with, their inventory details, and other settings that can be changed without updating your app.
    - Server-side auction - the server will make the connections to multiple auction bidding partners so the app doesn't have to.
    - Privacy regulation tools - the server can help your legal team meet different regulatory needs in different jurisdictions by configuring various protocols and anonyimization activities.

## High-level overview

The following is a high-level explanation of how the ad bidding-auction-rendering process works in this integration scenario.

![GAM Bidding Only Integration Details](/assets/images/prebid-mobile/mobile-details-gam-bidding-only.png)

1. Prebid SDK calls Prebid Server which supplies one or more bids.
1. Targeting Key Value Pairs are added to GMA SDK
1. GMA SDK calls GAM
1. If a 3rd party HTML creative is chosen (banner or interstitial)
    1. GMA SDK writes the HTML to a webview, loading the Prebid Universal Creative (PUC)
    1. The PUC calls Prebid Cache to load the bid response
    1. The PUC writes the creative into an iframe and hits all the tracking strings.
        1. If MRAID is available, it will consider the view state before hitting the burl.
1. If a video VastUrl creative is chosen
    1. The GMA SDK has a video player which loads the VAST from Prebid Cache.
    1. It then starts playing the VAST, hitting the embedded Impression tags when appropriate.
1. If an In-App Native format is chosen
    1. The app code tells GMA SDK to delegate the rendering of native to PBSDK when a special signal is specified.
    1. The app code gets the native assets from Prebid and renders it right in the code. Native eventtrackers are fired when appropriate. Need to confirm that PBS win, burl, and nurl events are fired.
1. GMA SDK handles the Open Measurement SDK interactions.

## Major Integration Steps

Assuming your app is already built with GMA AdUnits, the technical implementation of Prebid mobile into your app will involve these major steps:

1. [Initialize the Prebid SDK](/prebid-mobile/pbm-api/ios/code-integration-ios.html) - create a connection to your Prebid Server.
2. [Set Global Parameters](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html) - let bidders know important data about the page, privacy consent, and other settings.
3. Work with your Prebid Server team to create the adunit configIds that will be used in the app.
4. Set up GAM orders, line items, and creatives. See [AdOps guidance](#ad-operations-guidance)
5. Link Prebid AdUnit code to your GMA AdUnits - for any adunits that your business team wants to connect to Prebid with the configIds generated in Step 3. See the [adunit-specific instructions](#adunit-specific-instructions) below.


## Ad Operations Guidance

{% include mobile/adops-guidance-bidding-only.md %}

## AdUnit-Specific instructions

This section describes the integration details for different ad formats. In each scenario, you'll be asked for a `configId` - this is a key worked out with your Prebid Server provider. It's used at runtime to pull in the bidders and parameters specific to this adunit. Depending on your Prebid Server partner, it may be a UUID or constructed out of parts like an account number and adunit name.

### [Format: HTML Banner](/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-html-banner.html)

### [Format: Interstitial Banner](/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-interstitial-banner.html)

### [Format: Instream Video](/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-video-instream.html)

### [Format: Non-Instream Video](/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-video-outstream.html)

### [Format: Interstitial Video](/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-interstitial-video.html)

### [Format: Rewarded Video Ad](/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-rewarded-video.html)

### [Format: Native In-App](/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-native-in-app.html)

### [Format: Native In-Webview](/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-native-in-webview.html)

### [Format: Multiformat (Banner+Video+InApp Native)](/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-multiformat.html)

### [Format: Multiformat Interstitial (Banner+Video)](/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-multiformat-interstitial.html)

## Additional Ad Unit Configuration

{% include mobile/adunit-config-ios.md %}

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK iOS integration](/prebid-mobile/pbm-api/ios/code-integration-ios.html)
- [Prebid SDK iOS Global Parameters](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
