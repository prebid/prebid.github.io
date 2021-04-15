---

layout: page_v2
title: Rendering Module
description: Description of how Prebid SDK supports rendering
sidebarType: 2

---

# Rendering Module Overview

> ⚠️ NOTE: Rendering is an Open Beta Feature

Prebid SDK is introducing full ad rendering capabilities into the full suite of product features through an Open Beta as we design, introduce and test various rendering capabilities and interfaces. The Rendering Open Beta features will be available through our Modular structure, leaving intact existing functionality and interface API. All Rendering features will introduce new APIs tied strictly to rendering and will change over time as align the rendering APIs with the existing Prebid SDK APIs.

![How Prebid Mobile Works]({{site.baseurl}}/assets/images/prebid-mobile/rendering/modularization-roadmap-open-beta.png){: .pb-lg-img :}

In the scope of the Open Beta release, you can use the Core and Rendering modules alongside each other. The current integration will work as is without changes but if you want to add or switch to the rendering integration you will have to make changes in the codebase.
 
The rendering module consists of three libraries:

- **PrebidSDKRendering**, which introduces the classes for integration into the UI and rendering engine
- [OPTIONAL] **PrebidSDKGAMEventHandlers**, which wraps the GAM classes in order to support the GAM integration.. 
- [OPTIONAL] **PrebidSDKMoPubAdapters**, which wraps MoPub Adapters for Prebid Rendering module

The rendering module will have the following ad formats available:

- **Dispaly** - Banner/Interstitial
- **Outsrteam Video** - Banner/Interstitial/Rewarded
- **Native** - Disaply / Video

Integration steps are described in the respective environment docs for [iOS](TBD) and [Android](TBD). 

## Motivation and Benefits 

Rendering serves the general Prebid's aim - to be a trusted, transparent, and configurable monetization solution and gives a lot of benefits to both sides publishers and demand partners. 

Prebid SDK rendering offers the following benefits:

- Monetization without an Ad Server: Publishers who do not have a direct sales force or do not have use for an ad server, but wish to access Prebid's mobile demand stack can render ads directly without relying on any 3rd party SDKs.
- Reduced ad delivery latency: With the Prebid rendering module, Prebid SDK can render ads immediately when demand is returned from Prebid Server or when receiving the render signal from an ad server. The full render process should vastly reduce ad delivery speeds.
- Less infrastructure: The Prebid SDK does not rely on Prebid Server's Cache server, reducing the cost and utility of Prebid Server Cache. 
- Less discrepancy: Having full control of the rendering process has the potential to reduce discrepancy with ads instantly available (less http calls, less infrastructure, less setup). Additionally, having control of ad rendering allows the publisher to follow open and transparent industry standards or even potentially custom requirements from buyers. 
- Full support of SKAdNetworks and similar frameworks 
- MRAID 3.0 support
- Flexible measurement configuration: Owning the rendering and Open Measurement process allows publishers to potentially configure any measurement provider in a transparent and open source process. Prebid SDK will eventually be IAB Open Measurement certified and listed on the IAB site once complete.  
- Community driven: Being a part of Prebid, there is the ability to add features not readily or easily available either through the Ad Server or other SDKs. 
- Support of Prebid Server distinct features like PG, omni-channel, floors, etc.  

## How It Works

The following diagrams show how the Rendering Module works. So far it supports three integration scenarious:

- **Pure In-App** bidding without Primary Ad Server
- **With Google** Ad Manger as a primary Ad Server
- **With MoPub** as a primary ad Server

### Pure In-App bidding

![How Prebid Mobile Works]({{site.baseurl}}/assets/images/prebid-mobile/rendering/prebid-in-app-bidding-overview-pure-prebid.png){: .pb-lg-img :}

1. Prebid SDK makes a bid request to Prebid Server.
1. Prebid Server runs the header bidding auction among preconfigured demand partners.
1. Prebid Server responses with the winning bid.
1. Prebid SDK renders an ad.

### GAM Integration

![How Prebid Mobile Works]({{site.baseurl}}/assets/images/prebid-mobile/rendering/prebid-in-app-bidding-overview-gam.png){: .pb-lg-img :}

1. Prebid SDK makes a bid request to Prebid Server. 
1. Prebid Server runs the header bidding auction among preconfigured demand partners.
1. Prebid SDK, via GAM Event Handler, sets up the targeting keywords into the GAM's ad request.
1. GAM SDK makes an ad request and recieves the set of ad sources. 
1. Basing on the creative the GAM Event Handler decides whether it's a Prebid Ad or no.
1. The winner is displayed in the App with the respective rendering engine - prebid or GAM. GAM event handler manages the ad views.

GAM Event Handlers determines if a Prebid Line Item was selected in the ad server using the following GAM features:

- [App Events](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/banner#app_events) for the display and video ads. It means that creative should contain App Event tag.
- [VAST Metadata Changes](https://firebase.google.com/docs/reference/swift/googlemobileads/api/reference/Classes/GADRewardedAd#admetadatadelegate) for the Rewarded Video. It means that VAST should contain special metainformation.

Make sure that you use correct creatives. For now, If the prebid Line Item contains Universal Creative it will be rendered by GAM. 

### MoPub Integration

![How Prebid Mobile Works]({{site.baseurl}}/assets/images/prebid-mobile/rendering/prebid-in-app-bidding-overview-mopub.png){: .pb-lg-img :}

1. Prebid SDK makes a bid request to Prebid Server. 
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




