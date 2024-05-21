---

layout: page_v2
title: Prebid Mobile
description: What is Prebid.js
sidebarType: 2

---

# Prebid Mobile Overview
{:.no_toc}

Prebid Mobile is an open-source library that provides an end-to-end header bidding solution for mobile app publishers.

Prebid Mobile libraries are available for iOS and Android.

{: .alert.alert-info :}
The Prebid Mobile team is pleased to announce that we're getting ready
to start building the next major version. Please see the
[plan for Prebid Mobile 3.0](/prebid-mobile/docs/Prebid_Mobile_3_0_0.pdf)
and provide feedback to <support@prebid.org>.

- TOC
{:toc}

## Video Overview of Prebid Mobile

A high-level overview of Prebid Mobile, Prebid’s header bidding product for iOS and Android applications.

{% include vimeo-iframe.html id="822158733" title="1.4_Intro-to-Prebid-Mobile_v3" %}

Further Content:

- [Transcript of this video](/prebid-mobile/prebid-mobile-video.html)
- [Prebid Managed Services](https://prebid.org/product-suite/managed-services/)

## Benefits and Features

Prebid SDK rendering offers the following benefits:

- **Transparent, open source header bidding solution**. The single integration point with Prebid Server, enabling direct access to more mobile buyers.
- **Monetization without an Ad Server**: Publishers who do not have a direct sales force or have no need for an ad server can still access Prebid's mobile demand stack. Publishers will be able to render ads directly without relying on any 3rd party SDKs.
- **Reduced ad delivery latency**: The rendering module enables Prebid SDK to render ads immediately when demand is returned from Prebid Server or when receiving the render signal from an ad server. The render process should vastly reduce ad delivery speeds.
- **Less infrastructure**: The rendering API does not rely on Prebid Server's Cache server, reducing the cost and utility of Prebid Server Cache.
- **Less discrepancy**: Having control of the rendering process provides the potential to reduce discrepancy by having ads instantly available (less http calls, less infrastructure, less setup). This control enables the publisher to follow open and transparent industry standards or even potentially custom requirements from buyers.
- **Framework support**: Full support of SKAdNetworks and similar frameworks
- **MRAID 3.0 support**
- **Flexible Ad Measurement**: Controlling the rendering and Open Measurement process allows publishers to potentially configure any measurement provider in a transparent and open source process. Prebid SDK will eventually be IAB Open Measurement certified.
- **Ad Server Support**: can be integrated in any potential monetization stack.
- **Community driven**: Being a part of Prebid, there is the ability to add features not readily or easily available either through the Ad Server or other SDKs

### Potential Features

This set of features are not supported in the current release but are designated for future implementation.

- **Multiformat Ad Unit**: The rendering engine will enable Prebid SDK to display any bid format in the given inventory regardless of Primary Ad Server capabilities.
- **Support of Custom Ad Servers**: With rendering engine, the Prebid SDK can work with any Ad Server. Right now it supports GAM, AdMob, and MAX.

## How It Works

Prebid SDK supports following integration scenarios:

- **Custom or No mediation** when no Primay Ad Server is used. The SDK renders the winning bid immediately when it is available.
- **Using a Primary Ad Server**. There are three aproaches are avaliable for integration with primary ad server
  - **Original API**. In this case the SDK plays a transport role of the bid from PBS to Primary ad Server where it takes place in the internal auction and the winning bid is rendered later with Prebid Universal Creative as part of Primary Ad Server Creaitve
  - **Rendering API** Prebid SDK detects when a Prebid line item wins on the ad server and renders the cached bid in the owned Web view or Video view.
  - **Mediation API** Prebid Adapter detects when a Prebid line item corresponds to the winning bid and renders the cached bid in the owned Web view or Video view.

In all scenarios, Prebid SDK leverages Prebid Server for demand.

The following chart shows which API is used for which Ad Server

{: .table .table-bordered .table-striped }

|Ad Server|Original API|Rendering API|Mediation API|
|------------|------------|-------------|-------------|
|No Ad Server|            |      ✅   |             |
|GAM         |     ✅   |      ✅   |             |
|AdMob       |            |             |     ✅   |
|MAX         |            |             |     ✅   |

The following sections describe each integration method.

### No Ad Server

![In-App Rendering](/assets/images/prebid-mobile/modules/rendering/Prebid-In-App-Bidding-Overview-Pure-Prebid.png){: .pb-lg-img :}

1. The Prebid SDK sends the bid request to the Prebid Server
1. Prebid Server runs the header bidding auction among preconfigured demand partners
1. Prebid Server responds with the winning bid
1. The rendering module renders the winning bid

### With Ad Server: Original API

Supported Ad Servers: GAM.

![How Prebid Mobile Works - Diagram]({{site.baseurl}}/assets/images/prebid-mobile/prebid-in-app-bidding-overview-prebid-original.png)
{: .pb-lg-img :}

1. Prebid Mobile sends a request to Prebid Server. This request consists of the Prebid Server account ID and config ID for each tag included in the request.
1. Prebid Server constructs an OpenRTB bid request and passes it to the demand partners. Each demand partner returns a bid response to Prebid Server. The bid response includes the bid price and the creative content.
1. Prebid Server sends the bid responses to Prebid Mobile.
1. Prebid Mobile sets key/value targeting for each ad slot through the primary ad server mobile SDK.
1. The primary ad server SDK sends the ad request enriched with targeting keywords of the wiining bid.
1. The primary ad server responds with an ad. If the line item associated with the Prebid Mobile bid wins, the primary ad server returns the Prebid Universal Creative (PUC) to the ad server's SDK.
1. The primary ad server SDK starts the rendering recived ad markup.
1. The PUC fetches creative content of the winning bid from the Previd Cache and renders it.

### With Ad Server: Rendering API

Supported Ad Servers: GAM.

![Rendering with Primary Ad Server](/assets/images/prebid-mobile/modules/rendering/In-App-Bidding-Integration.png)
{: .pb-lg-img :}

1. The rendering module sends the bid request to the Prebid server.
1. Prebid server runs the header bidding auction among preconfigured demand partners.
1. Prebid Server responds with the winning bid that contains targeting keywords.
1. The rendering module sets up the targeting keywords of the winning bid into the ad unit of the primary ad server SDK.
1. The primary ad server SDK sends the ad request to the primary ad server.
1. The primary ad server responds with an ad or mediation chain.
1. The winning ad meta information is passed to the rendering module.
1. Depending on the ad response, the rendering module renders the winning bid or allows the primary ad server SDK to show its own winning ad.

### With Ad Server: Mediation API

Supported Ad Servers: AdMob, MAX.

![How Prebid Mobile Works - Diagram]({{site.baseurl}}/assets/images/prebid-mobile/prebid-in-app-bidding-overview-mediation.png)
{: .pb-lg-img :}

1. The Prebid SDK sends the bid request to the Prebid server.
1. Prebid server runs the header bidding auction among preconfigured demand partners.
1. Prebid Server responds with the winning bid that contains targeting keywords.
1. [OPTIONAL] The Prebid SDK sets up the targeting keywords of the winning bid into the ad unit of the primary ad server SDK.
1. The primary ad server SDK sends the ad request to the primary ad server.
1. The primary ad server responds with a mediation chain.
1. The Primary Ad Server SDK runs the Waterfall.
1. If the mediation item contains the name Prebid Adatper it instantiates the respoctive class.
1. [OPTIONAL] adaters checks the wheather the Line Item's targeting keywors match the bid targeting keywords
1. Adapter renders a wiining bid cached in the SDK.

Note: passing the targeting keywords to the ad server depends on the server's ability to target line items. If the server doesn't provide such a feature, Prebid SDK doesn't enrich an ad request with targeting info. But activation of a line item with the proper price still works. The implementation details of such selection you can find in the respective integration guide.

## Integration Reference

### Prebid Server

You must have a Prebid Server account in order to use Prebid Mobile. Prebid Server is a server-based host that communicates bid requests and responses between Prebid Mobile and demand partners.  

To set up your Prebid Server account for Prebid Mobile, refer to [Getting Started with Prebid Mobile]({{site.github.url}}/prebid-mobile/prebid-mobile-getting-started.html).

### Android

Follow these steps to integrate the Prebid SDK:

1. If integrating into an ad server, create line items specific for rendering (line items for rendering API are unique and do not coincide with the standard Prebid SDK line items):
    - [GAM Original API](../adops/step-by-step.html)
    - [GAM Rendering API](../adops/mobile-rendering-gam-line-item-setup.html)
    - [AdMob](../adops/mobile-rendering-admob-line-item-setup.html)
    - [MAX](../adops/mobile-rendering-max-line-item-setup.html)
1. [Integrate Prebid SDK](pbm-api/android/code-integration-android.html) into your project.
1. Add prebid's ad units to your app respectively to the monetization scenario:
    - [GAM Original API](pbm-api/android/android-sdk-integration-gam-original-api.html)
    - [Custom in-app bidding](modules/rendering/android-sdk-integration-pb.html) integration without primary ad server.
    - [GAM Rendering API](modules/rendering/android-sdk-integration-gam.html) as a primary ad server
    - [AdMob](modules/rendering/android-sdk-integration-admob) as a primary ad server.
    - [AppLovin MAX](modules/rendering/android-sdk-integration-max.html) as a primary ad server.

1. Actualize the [integration and targeting](pbm-api/android/pbm-targeting-params-android.html) properties.  

### iOS

Follow these steps to integrate the rendering API:

1. If integrating into an ad server, create line items specific for rendering (line items are uniqe for the Rendering Module and do not cooicide with the standard Prebid SDK line items):
    - [GAM Original API](../adops/step-by-step.html)
    - [GAM](../adops/mobile-rendering-gam-line-item-setup.html)
    - [AdMob](../adops/mobile-rendering-admob-line-item-setup.html)
    - [MAX](../adops/mobile-rendering-max-line-item-setup.html)
1. [Integrate Prebid SDK](pbm-api/ios/code-integration-ios.html).
1. Add prebid's ad units to your app respectively to the monetization scenario:
    - [GAM Original API](pbm-api/ios/code-integration-ios.html)
    - [Custom in-app bidding](modules/rendering/ios-sdk-integration-pb.html) integration without a primary ad server.
    - [GAM Rendering API](modules/rendering/ios-sdk-integration-gam.html) as a primary ad server.
    - [AdMob](modules/rendering/ios-sdk-integration-gam.html) as a primary ad server.
    - [AppLovin MAX](modules/rendering/ios-sdk-integration-max.html) as a primary ad server.
1. Actualize the [integration and targeting](pbm-api/ios/pbm-targeting-params-ios.html) properties.

## Additional References

- [Deep Links Support](modules/rendering/rendering-deeplinkplus.html)
- [Impression Tracking](modules/rendering/rendering-impression-tracking.html)

## Mobile Analytics

Currently Prebid Mobile SDK doesn't offer direct analytics capabilities. While we build out analytics in Prebid Server to support the SDK, some options are:

- Generate analytics from the ad server, as key metrics are available there if the line items are broken out by bidder.
- Integrate an analytics package directly into the app. You may have one already that can accomodate header bidding metrics.
