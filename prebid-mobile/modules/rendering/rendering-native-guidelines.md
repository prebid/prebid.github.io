---

layout: page_v2
title: Native Ads Guidelines
description: The best practices for implementing native ads
sidebarType: 2

---

# Native Ads Guidelines

## Getting Started

The Prebid Rendering Module implements the [OpenRTB Specification](https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf) for the native ads.

The general integration scenario requires these steps from publishers:

1. Prepare the ad layout:
    * HTML and CSS for the Native Styles format.
    * Native components for the Unified Ads format.
1. Configure the Native Ad using [NativeAdConfiguration](rendering-native-ad-configuration.html).
    * Provide the list of [Native Assets](#components) representing the ad's structure.
    * Tune other general properties of the ad.
1. Make a bid request.
1. **OPTIONAL** Bind the data from the bid response with the layout, if it is needed for the particular integration.

### Unified Native Ads

The general integration scenario requires these steps from publishers:

1. Prepare the ad layout using the native components in the codebase of the app.
2. Create Native Ad Unit.
3. Configure the Native Ad unit using [NativeAdConfiguration](rendering-native-ad-configuration.html).
    * Provide the list of [Native Assets](#components) representing the ad's structure.
    * Tune other general properties of the ad.
4. Make a bid request.
5. Find the winning native ad using `GAMUtils.shared.findNativeAd`.
6. Bind the data from the native ad response with the layout.

### Native Styles

The Prebid Rendering Module supports the original prebid's approach for rendering [native ads](https://docs.prebid.org/prebid-mobile/pbm-api/ios/pbm-nativeadunit-ios.html). It is similar to the Google's Native Styles ad format. In this case publisher should preare the layout of the ad using HTML and CSS and add the universal creative to the ad code.

![Rendering with GAM as the Primary Ad Server](/assets/images/prebid-mobile/modules/rendering/Native-Styles-Primary-Ad-Server.png)

1. Prebid Rendering Module sends the bid request.
2. Prebid server runs the header bidding auction among preconfigured demand partners.
3. In-App Bidding SDK sets up the targeting keywords of the winning bid to the ad unit of Primary Ad Server SDK.
4. Primary Ad Server SDK sends the ad request to the Ad Server. If Prebid's line item wins the ad response will contain **Prebid Universal Creative** and **Ad Layout**.
5. The received creative will be rendered in the Web View of Primary Ad Server SDK.  

The ad will be rendered in the web view. The rendering engine will be the prebid's universal creative. It will load the winning bid from the prebid cache and substitute assets into the ad markup. For the more detailed info visit the Prebid's instructions about [How Native Ads Work](https://docs.prebid.org/dev-docs/show-native-ads.html#how-native-ads-work).

In order to prepare the valid layout follow the instructions in the Prebid docs for [Google Ad Manager](/adops/gam-native.html).

In the case of integration of Native Styles ads without Primary Ad Server publishers should provide the Ad Layout to the SDK. And the winning bid will be rendered right after receiving it from Prebid.

![Rendering with GAM as the Primary Ad Server](/assets/images/prebid-mobile/modules/rendering/Native-Styles-Prebid.png)

1. Setup layout for the Native Styles ad.
2. Prebid Rendering Module sends the bid request.
3. Prebid server runs the header bidding auction among preconfigured demand partners.
3. The received creative will be rendered in the Web View of Prebid Rendering Module.

## Components

The Prebid Rendering Module supports all Native Ad components proclaimed by the OpenRTB specification: **title**, **image**, **video**, **data**.

We strongly recommend to follow the industry best practices and requirements, especially in the case of integration with Primary Ad Server:

- [OpenRTB Specification](https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf)
- [The Native Advertizing Playbook](https://www.iab.com/wp-content/uploads/2015/06/IAB-Native-Advertising-Playbook2.pdf)
- [Google Guidelines](https://support.google.com/admanager/answer/6075370)
