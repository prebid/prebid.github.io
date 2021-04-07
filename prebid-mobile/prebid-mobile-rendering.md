---

layout: page_v2
title: Rendering Module
description: Description of how Prebid SDK supports rendering
sidebarType: 2

---

# Rendering Module Overview

> ⚠️ NOTE: Rendering is an Open Beta Feature

Prebid SDK introduces the rendering facilities as a standalone module. Adding this module won't change anything in your current integration. 

![How Prebid Mobile Works]({{site.baseurl}}/assets/images/prebid-mobile/rendering/modularization-roadmap-open-beta.png){: .pb-lg-img :}

In the scope of the Open Beta release, you can use the Core and Rendering modules alongside each other. The current integration will work as is without changes but if you want to add or switch to the rendering integration you will have to make significant changes in the codebase.  

The rendering module consist of three libraries:

- **PrebidSDKRendering**, which introduces the classes for integration into UI and rendering engine
- **PrebidSDKGAMEventHandlers**, which wraps GAM classes in order to support GAM integration
- **PrebidSDKMoPubAdapters**, which wraps MoPub Adapters for Prebid Rendering module

Using rendering module you can integrate next ad formats:

- **Dispaly** - Banner/Interstitial
- **Outsrteam Video** - Banner/Interstitial/Rewarded
- **Native** - Disaply / Video

Intefration steps are convinient and described in the respective docs for [iOS](TBD) and [Android](TBD). 

## Motivation and Benefits 

Rendering serves the general Prebid's aim - to be a trusted, transparent, and configurable monetization solution and gives a lot of benefits to both sides publishers and demand partners. 

- Monitizaion without Ad Server. Publishers can monitize the apps through pure In-App bidding without additional ad requests.
- Support of Prebid Server distinct features like PG, omni-channel, floors, etc.  
- Flexibility in supporting new features of serving ads.

In comparising with no-rendering approach the new module gives next benefits:

- Faster ad delivery. As soon as bid is recieved it can be displayed. It is applayed to both kind of integration with ad server  or without it.
- Litle infrastructure. Since the rendering moduel doesn't need Prebid Cache it can be ommited. 
- Less discrepancy, better analytics. Rendering module is able to track all needed events in the proper time according to the industry standard or demand side custom requrements. 
- Full support of SKAdNetworks and similar frameworks 
- MRAID 3.0 support
- Better measurement. Ability to use any measurement provider. SDK implements the support of Open Measurement, the certification is scheduled to the upcoming releases.  
- Open for improvements and adding exclusive features 

## How It Works

The following diagrams show how the Rendering Module works. So far it supports three integration scenarious:

- **Pure In-App** bidding without Primary Ad Server
- **With Google** Ad Manger as a primary Ad Server
- **With MoPub** as a primary ad Server

### Pure In-App bidding

![How Prebid Mobile Works]({{site.baseurl}}/assets/images/prebid-mobile/rendering/prebid-in-app-bidding-overview-pure-prebid.png){: .pb-lg-img :}

1. Prebid SDK sends the bid request to the Prebid Server.
1. Prebid Server runs the header bidding auction among preconfigured demand partners.
1. Prebid Server responses with the winning bid.
1. Prebid SDK renders the creative from recieved bid.

### GAM Integration

![How Prebid Mobile Works]({{site.baseurl}}/assets/images/prebid-mobile/rendering/prebid-in-app-bidding-overview-gam.png){: .pb-lg-img :}

1. Prebid SDK makes a bid request. 
1. Prebid Server runs the header bidding auction among preconfigured demand partners.
1. Prebid SDK, via GAM Event Handler, sets up the targeting keywords into the GAM's ad request.
1. GAM SDK makes an ad request and recieves the set of ad sources. 
1. Basing on the creative the GAM Event Handler decides whether it's a Prebid Ad or no.
1. The winner is displayed in the App with the respective rendering engine - prebid or GAM. GAM event handler manages the ad views.

GAM Event Handlers determines that Prebid won basing on the next GAM features:

- [App Events](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/banner#app_events) for the display and video ads. It means that creative should contain App Event tag.
- [VAST Metadata Changes](https://firebase.google.com/docs/reference/swift/googlemobileads/api/reference/Classes/GADRewardedAd#admetadatadelegate) for the Rewarded Video. It means that VAST should contain special metainformation.

Make sure that you use correct creatives. For now, If the prebid Line Item contains Universal Creative it will be rendered by GAM. 

### MoPub Integration

![How Prebid Mobile Works]({{site.baseurl}}/assets/images/prebid-mobile/rendering/prebid-in-app-bidding-overview-mopub.png){: .pb-lg-img :}

1. Prebid SDK makes a bid request. 
2. Prebid Server runs the header bidding auction among preconfigured demand partners.
1. Prebid SDK sets up the targeting keywords into the MoPub's ad unit.
1. MoPub SDK makes an ad request. 
1. Basing on the creative the MoPub SDK decides whether it's a Prebid Ad or no.
1. The winner is displayed in the App with the respective rendering engine - prebid or GAM.

Prebid SDK uses the Mediation feature for the integration into MoPub monetization since it is the most convenient approach from the publisher's perspective and doesn't require any modifications for ad unit integration in the codebase.

Make sure that you use correct creatives. For now, If the prebid Line Item contains Universal Creative it will be rendered by MoPub. 

## Future Modularization

Prebid is going to migrate SDK to a modular structure in order to give publishers a more convenient API and customizable set of features. Here is a draft diagram of the long-term perspective plan of modularization. 

![How Prebid Mobile Works]({{site.baseurl}}/assets/images/prebid-mobile/rendering/modularization-roadmap-new-api-with-complete-modularization.png){: .pb-lg-img :}

So that you can use the single solution for any kind of demand and inventory. 




