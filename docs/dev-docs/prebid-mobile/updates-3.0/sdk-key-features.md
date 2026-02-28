---
title: Prebid Mobile 3.0 Key Features
description: Prebid Mobile 3.0 Key Features
pid: 1
---

# Prebid Mobile 3.0 

Prebid Mobile 3.0 accumulates the results of about 500 closed PRs for both platforms, aiming to extend supported inventory and enhance bidding transparency for In-App publishers and advertisers.

The current doc summarizes the key product features for the 3.0 milestone.


## Rendering Delegation

Documentation: [iOS](/dev-docs/prebid-mobile/pbm-api/ios/pbm-plugin-renderer), [Android](/dev-docs/prebid-mobile/pbm-api/android/pbm-plugin-renderer).

Prebid Mobile introduces a standardized protocol for SDK developers to implement custom ad rendering solutions within In-App Prebid integration. This flexibility allows demand partners to move beyond default options like Prebid Universal Creative, Google Ad Manager (GAM), or other built-in rendering solutions, giving them full control over the ad rendering process with their preferred technology.

For publishers, rendering delegation enhances ad quality and ensures a premium ad experience from trusted partners.

## Rewarded Ad Unit

Documentation: [iOS](/dev-docs/prebid-mobile/modules/rendering/ios-sdk-integration-pb#rewarded), [Android](/dev-docs/prebid-mobile/modules/rendering/android-sdk-integration-pb#rewarded).

Prebid Mobile introduces an enhanced and more publisher-oriented `RewardedAdUnit`, allowing for greater customization, flexibility, and control over the rewarded ad experience, tailored to the specific needs of the publisher. The `RewardedAdUnit` implements special In-App behavior that should be configurable by the platform or publisher according to the application or ad experience guides.

## Shared ID

Documentation: [iOS](/dev-docs/prebid-mobile/pbm-api/ios/pbm-targeting-ios#shared-id), [Android](/dev-docs/prebid-mobile/pbm-api/android/pbm-targeting-android#shared-id).

Prebid Mobile introduces a way for publishers to add a convenient [Prebid-owned first-party identifier](https://docs.prebid.org/identity/sharedid.html) to the bid requests. SharedID is a randomly generated first-party identifier that remains the same throughout the app sessions until reset. However, Shared ID values do not remain consistent across different apps on the same device.

## Arbitrary OpenRTB

Documentation:

- [iOS Global Arbitrary OpenRTB](/dev-docs/prebid-mobile/pbm-api/ios/pbm-targeting-ios#arbitrary-openrtb)  
- [iOS Impression-level Arbitrary OpenRTB](/dev-docs/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.md#arbitrary-openrtb)  
- [Android Global Arbitrary OpenRTB](/dev-docs/prebid-mobile/pbm-api/android/pbm-targeting-android#arbitrary-openrtb)  
- [Android Impression-level Arbitrary OpenRTB](/dev-docs/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api#arbitrary-openrtb)

Prebid Mobile introduces an API that enables publishers to customize the bid request according to their specific requirements. This customization can be done at two levels: global and impression level.

## Multiformat Ad Unit in Bidding-only Scenario

Documentation: [iOS](/dev-docs/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-multiformat), [Android](/dev-docs/prebid-mobile/recipes/subrecipes/android/gam-bidding-only-multiformat)

Prebid Mobile introduces a way to make multiformat bid requests for a single ad unit, specifically within a bidding-only setup. By leveraging this functionality, publishers can request bids that support any combination of ad formats, including banner, video, and native ads, within a single unified request. The SDK's API was extended with the `PrebidAdUnit` and `PrebidRequest` classes responsible for managing multiformat bid requests.

## Impression Tracking Enhancements

Documentation: [iOS](/dev-docs/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api#native-impression-tracking), [Android](/dev-docs/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api#native-impression-tracking)

Prebid Mobile introduces a native impression-tracking method that analyzes the application's view hierarchy at runtime and tracks billing URL(s) only when the ad view is present on the screen. Using this approach, publishers can report more accurate figures for the impression count.

## Documentation Updates

SDK API: [iOS](https://docs.prebid.org/prebid-mobile-ios/index.html), [Android](https://docs.prebid.org/prebid-mobile-android/index.html)

Prebid completely reworked the documentation for Mobile in two ways:

- Focusing on recipes that help publishers integrate header bidding demand in their app. What is available, and how does it work under the hood? This allows publishers to make informed decisions about which integration to use, considering all the pros and cons.
- Introducing auto-generated SDK API documentation, so publishers can always see the current and full description of the SDKs' classes, methods, and properties.

## Support for Apple's ATT Framework

Documentation: [iOS](/dev-docs/prebid-mobile/pbm-api/ios/code-integration-ios#handling-tracking-domains)

Prebid Mobile introduces support for tracking domains in the initialization method of the SDK. Now, publishers can follow Apple's ATT requirements and specify both tracking and non-tracking URLs for the Prebid Server.

## Support for SKAdNetwork

Documentation: [iOS](/dev-docs/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api#skadnetwork)

Prebid Mobile introduces support for SKAdNetwork across all integration APIs, including Bidding-only and Rendering APIs. SKAdNetwork is a privacy-focused solution that allows ad networks to track app installs while protecting user data. These methods include view-through and StoreKit-rendered ads.

## SKOverlay

Documentation: [iOS](/dev-docs/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api#skoverlay)

Prebid Mobile introduces support for SKOverlay for interstitials. SKOverlay enables developers to present additional content or calls to action as an overlay on top of interstitial ads without interrupting the overall flow of the ad experience.

## Video UX

Documentation: [Ad Experience Controls](/dev-docs/prebid-mobile/modules/rendering/combined-ad-experience-controls#ad-experience-controls)

Prebid Mobile introduces enhanced support and configuration of video ads, including interstitial, outstream, and rewarded ads. The configuration values can either be initialized based on the bid response or explicitly defined by the publisher, providing flexibility in managing the user experience.

## API Cleanup

Documentation: [iOS](/dev-docs/prebid-mobile/updates-3.0/ios/api-changes), [Android](/dev-docs/prebid-mobile/updates-3.0/android/api-changes)

In the 3.0 release, the Prebid Mobile SDK gets rid of all previously deprecated methods in order to keep the API clean and minimalistic. Instead of using Ad Unit and configuration properties, the Prebid SDK encourages publishers to use methods to set [Arbitrary OpenRTB](#arbitrary-openrtb) parameters.
