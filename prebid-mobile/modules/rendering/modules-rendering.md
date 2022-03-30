---

layout: page_v2
title: Prebid Mobile Rendering Modules
description: Prebid Mobile Rendering Modules architecture
sidebarType: 2

---

# Prebid Mobile Rendering (Open Beta)

Prebid Mobile has added a rendering module (currently in open beta) which provides an API for rendering display and video media types independently of the current core feature set and interfaces. The API enables Prebid Mobile to have full ownership of the Web view selected for rendering and will pass any associated ad markup to the controlled view. This new functionality enables publishers to have improved control of features such as Open Measurement, MRAID, SKAdNetwork. This same functionality is available for rendering video (VAST) creatives through an internal video player.

{% capture warning_note %}
This open beta release will contain a temporary API structure and is subject to change when a general audience release is made available.   
{% endcapture %}
{% include /alerts/alert_important.html content=warning_note %}

The rendering API is available on iOS and Android starting with the `1.13.0-beta1` version. 

Starting with `1.14.0-beta1` Prebid mobile supports integration with AdMob. 

## Benefits

Prebid SDK rendering offers the following benefits:

- **Monetization without an Ad Server**: Publishers who do not have a direct sales force or have no need for an ad server can still access Prebid's mobile demand stack. Publishers will be able to render ads directly without relying on any 3rd party SDKs.
- **Reduced ad delivery latency**: The rendering module enables Prebid SDK to render ads immediately when demand is returned from Prebid Server or when receiving the render signal from an ad server. The render process should vastly reduce ad delivery speeds.
- **Less infrastructure**: The rendering API does not rely on Prebid Server's Cache server, reducing the cost and utility of Prebid Server Cache.
- **Less discrepancy**: Having control of the rendering process provides the potential to reduce discrepancy by having ads instantly available (less http calls, less infrastructure, less setup). This control enables the publisher to follow open and transparent industry standards or even potentially custom requirements from buyers.
- **Framework support**: Full support of SKAdNetworks and similar frameworks
- **MRAID 3.0 support**
- **Flexible Ad Measurement**: Controlling the rendering and Open Measurement process allows publishers to potentially configure any measurement provider in a transparent and open source process. Prebid SDK will eventually be IAB Open Measurement certified.  
- **Community driven**: Being a part of Prebid, there is the ability to add features not readily or easily available either through the Ad Server or other SDKs

## Potential Features

This set of features are not supported in the current release but are designated for future implementation.

- **Multiformat Ad Unit**: The rendering module will enable Prebid SDK to display any bid format in the given inventory regardless of Primary Ad Server capabilities.
- **Support of Custom Ad Servers**: The rendering module will work with any ad server not just GAM and MoPub.
- **Rendering Delegation**:  The module will potentially delegate rendering of the winning bid to the Demand Partner SDK if it is required for special creatives.

## How It Works

Rendering API supports two integration scenarios:

* **Pure In-App Bidding** With in-app bidding, no Primay Ad Server is used. The module renders the winning bid immediately when it is available.
* **Using a Primary Ad Server** Prebid SDK detects when a Prebid line item wins on the ad server and renders the cached bid in the owned Web view or Video view.

In both scenarios, Prebid SDK leverages Prebid Server for demand. Below are the processes for both In-App and Primary Ad Server modes:

### Pure In-App Bidding

![In-App Rendering](/assets/images/prebid-mobile/modules/rendering/Prebid-In-App-Bidding-Overview-Pure-Prebid.png)

1. The Prebid SDK sends the bid request to the Prebid Server
1. Prebid Server runs the header bidding auction among preconfigured demand partners
1. Prebid Server responses with the winning bid
1. The rendering module renders the winning bid

### Prebid Rendering Module with Primary Ad Server

![Rendering with Primary Ad Server](/assets/images/prebid-mobile/modules/rendering/In-App-Bidding-Integration.png)

1. The rendering module sends the bid request to the Prebid server.
1. Prebid server runs the header bidding auction among preconfigured demand partners.
1. Prebid Server responds with the winning bid that contains targeting keywords.
1. The rendering module sets up the targeting keywords of the winning bid into the ad unit of the primary ad server SDK.
1. The primary ad server SDK sends the ad request to the primary ad server.
1. The primary ad server responds with an ad or mediation chain.
1. The winning ad meta information is passed to the rendering module.
1. Depending on the ad response, the rendering module renders the winning bid or allows the primary ad server SDK to show its own winning ad.

## Supported Ad Formats

Prebid Mobile rendering supports the following ad formats:

* Display Banner
* Video Banner (for GAM, pure in-app bidding)
* Display Interstitial
* Video Interstitial
* Rewarded Video

## Integration Scenarios

### Android

Follow these steps to integrate the rendering API:

1. If integrating into an ad server, create line items specific for rendering (line items for rendering API are unique and do not coincide with the standard Prebid SDK line items):
    * [GAM](rendering-gam-line-item-setup.html)
    * [AdMob](rendering-admob-line-item-setup.html)
    * [MoPub](rendering-mopub-line-item-setup.html)
1. [Integrate Prebid SDK](android-sdk-integration.html) into your project.
1. Add prebid's ad units to your app respectively to the monetization scenario: 
    * [Pure in-app Bidding](android-sdk-integration-pb.html) integration without primary ad server.
    * In-app bidding using [Google Ad Manager (GAM)](android-sdk-integration-gam.html) as a primary ad server
    * In-app bidding using [AdMob](android-sdk-integration-admob) as a primary ad server.
    * In-app bidding using [MoPub](android-sdk-integration-mopub.html) as a primary ad server.
    
1. Actualize the [integration and targeting](android-sdk-parameters.html) properties.  

### iOS

Follow these steps to integrate the rendering API:

1. If integrating into an ad server, create line items specific for rendering (line items are uniqe for the Rendering Module and do not cooicide with the standard Prebid SDK line items):
    * [GAM](rendering-gam-line-item-setup.html)
    * [AdMob](rendering-admob-line-item-setup.html)
    * [MoPub](rendering-mopub-line-item-setup.html)
1. [Integrate Prebid SDK](ios-sdk-integration.html).
1.  Add prebid's ad units to your app respectively to the monetization scenario: 
    * [Pure in-app bidding](ios-sdk-integration-pb.html) integration without a primary ad server.
    * In-app bidding using [Google Ad Manager (GAM)](ios-sdk-integration-gam.html) as a primary ad server.
    * In-app bidding using [AdMob](ios-sdk-integration-gam.html) as a primary ad server.
    * In-app bidding using [MoPub](ios-sdk-integration-mopub.html) as a primary ad server.
   1. Actualize the [integration and targeting](ios-sdk-parameters.html) properties.

## Additional refences

- [Deep Links Support](rendering-deeplinkplus.html)
- [Impression Tracking](rendering-impression-tracking.html)
