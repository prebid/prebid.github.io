---
layout: page_v2
title: Prebid Mobile 3.0 Key Features
description: Prebid Mobile 3.0 Key Features
pid: 1
top_nav_section: prebid-mobile
nav_section: prebid-mobile-ios
sidebarType: 2
---

# Prebid Mobile 3.0 
{:.no_toc}

Prebid Mobile 3.0 accumulates the results of about 500 closed PRs for both platforms, aiming to extend supported inventory and enhance bidding transparency for In-App publishers and advertisers. 

The current doc summarizes the key product features for the 3.0 milestone.

- TOC
{:toc}

## Rendering Delegation

The SDK offers a standardized way for developers to implement custom ad rendering solutions, enabling publishers to integrate their own custom rendering SDK. This layer provides the flexibility to move away from default solutions like Prebid Universal Creative, Google Ad Manager (GAM), or other rendering options, allowing publishers to take full control of the rendering process with their preferred solution.

For the implementation details, refer to these articles:

- iOS: [Create your implementation of the `PrebidMobilePluginRenderer`](/prebid-mobile/pbm-api/ios/pbm-plugin-renderer.html#create-your-implementation-of-the-prebidmobilepluginrenderer);
- Android: [Create your implementation of the `PrebidMobilePluginRenderer`](/prebid-mobile/pbm-api/android/pbm-plugin-renderer.md#create-your-implementation-of-the-prebidmobilepluginrenderer). 

## Rewarded Ad Unit 

The SDK provides an enhanced and more publisher-oriented `RewardedAdUnit`, allowing for greater customization, flexibility, and control over the rewarded ad experience, tailored to the specific needs of the publisher. The `RewardedAdUnit` assumes special behavior that should be configurable by the platform or publisher according to the application or ad experience guides.

Refer to these pages for the implementation details:

- iOS: [Rewarded](/prebid-mobile/modules/rendering/ios-sdk-integration-pb.html);
- Android: [Rewarded](/prebid-mobile/modules/rendering/android-sdk-integration-pb.html). 

## Shared ID

The SDK provides a way for publishers to opt into having the Prebid SDK generate a Shared ID. Shared ID is a randomly generated first-party identifier managed by Prebid. It remains the same throughout the current app session unless reset. If local storage access is permitted, the same ID may persist across multiple app sessions indefinitely. However, Shared ID values do not remain consistent across different apps on the same device.

For further information, read these articles:

- iOS: [Shared ID](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html#shared-id);
- Android: [Shared ID](/prebid-mobile/pbm-api/android/pbm-targeting-android.html#shared-id). 

## Arbitrary OpenRTB

The SDK enables publishers to customize the OpenRTB request according to their specific requirements. This customization can be done at two levels: the global and the impression level.

For more information about global configuration, check out these pages: 

- iOS: [Global Arbitrary OpenRTB](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html#arbitrary-openrtb);
- Android: [Global Arbitrary OpenRTB](/prebid-mobile/pbm-api/android/pbm-targeting-android.html#arbitrary-openrtb).

The information about impression-level configuration is available here: 

- iOS: [Impression-level Arbitrary OpenRTB](/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.md#arbitrary-openrtb);
- Android: [Impression-level Arbitrary OpenRTB](/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html#arbitrary-openrtb).

## Multiformat Ad Unit in Bidding-only Scenario

This feature enables publishers to generate multiformat bid requests, specifically within a bidding-only setup. By leveraging this functionality, publishers can request bids that support any combination of ad formats, including banner, video, and native ads, within a single unified request. The Original API was extended with `PrebidAdUnit` and `PrebidRequest` classes that are responsible for managing the bid-requesting process by incapsulating the existing `AdUnit` class to perform all needed work.

Further details could be found on the pages below:

- iOS: [Prebid Mobile - GAM Bidding-only Multiformat](/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-multiformat.html);
- Android: [Prebid Mobile - GAM Bidding-only Multiformat](/prebid-mobile/recipes/subrecipes/android/gam-bidding-only-multiformat.html). 

## Impression Tracking Enchancents

The SDK offers a native impression tracking API that enables publishers to track and record ad impressions by firing a billing notice URL (burl) whenever an impression is served.

Refer to these articles for more information:

- iOS: [Native Impression Tracking](/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html#native-impression-tracking);
- Android: [Native Impression Tracking](/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html#native-impression-tracking). 

## Documentation Updates



## Support Apple's ATT framework



## SKAdNetwork 

Apple offers SKAdNetwork as a privacy-focused solution that allows ad networks to track app installs while protecting user data. In line with this, the SDK supports two SKAdNetwork methods that enable ad networks to deliver ads in a bidding-only context, specifically for **banner** and **native** ad formats. These methods include view-through and StoreKit-rendered ads.

Refer to this article for more information: [SKAdNetwork](/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html#skadnetwork).

## SKOverlay

The SDK also provides support of SKOverlay for interstitials. SKOverlay enables developers to present additional content or calls to action as an overlay on top of interstitial ads, without interrupting the overall flow of the ad experience.

Refer to this article for more information: [SKOverlay](/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html#skoverlay).


## Video UX

When utilizing the Prebid SDK to render the winning bid, you have the ability to customize its behavior. The configuration values can either be initialized based on the bid response or explicitly defined by the publisher, providing flexibility in managing the user experience.

Refer to this page for the implementation details: [Ad Experience Controls](/prebid-mobile/modules/rendering/combined-ad-experience-controls.html#ad-experience-controls).
