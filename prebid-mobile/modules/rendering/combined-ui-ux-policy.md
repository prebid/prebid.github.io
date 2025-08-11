---

layout: page_v2
title: Ad Experience
description: Ad Experience Specification
sidebarType: 2

---

# Prebid SDK Ad Experience
{:.no_toc}

If you use the Prebid SDK to render the winning bid, be aware of how the SDK implements ad experiences and how you can modify them.

This specification does not apply to the Bidding-Only API, where the Google Mobile Ads SDK or any other rendering engine performs rendering. In such integration scenarios, the ad experience is defined by the third-party SDK, and the Prebid SDK is not able to influence this. 

* TOC
{:toc}

## Banner

Prebid SDK renders the banner ad in the OS-specific WebView. The publisher is responsible for integrating `BannerAdView` into the application layout and providing the screen space according to the supported ad sizes. 

The following table describes the ad experience properties of the banner ad and how they can be changed.

| Policy | Behaviour | Customization | 
|--------|-----------|---------------|
|`Autorefresh`| **Prebid SDK** refreshes the banner ad every **60 seconds**. SDK makes the bid request and changes the current creative in the ad slot if the refresh has a bid. If there is no bid, the SDK will remove the current creative from the internal ad slot and notify the publisher using the respective delegate methods. <br><br> **Publisher** is responsible for removing or collapsing the ad slot in the application layout. |**iOS**: you can change the refresh interval using [refreshInterval](https://docs.prebid.org/prebid-mobile-ios/Classes/BannerView.html#/c:@M@PrebidMobile@objc(cs)BannerView(py)refreshInterval) property. <br><br> **Android**: you can change the refresh interval using the [setAutoRefreshDelay](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/api/rendering/BannerView.html#setAutoRefreshDelay(int)) property.|
|`Content Resizing`|**Prebid SDK** changes the size of WebView according to the size of the creative received in the bid response. <br><br> **Publisher** is responsible for adopting the application layout for different ad sizes.|To support multisize ads, publishers should implement a dynamic layout for the banner ad place. Prebid SDK will change the size of the `BannerAdView` according to the content. However, the publisher is responsible for adapting the application layout for different ad sizes. <br><br>Currently, the SDK doesn't notify publishers about the change in banner size. Open an issue or PR to add this functionality.|
|`Clickthrough`|**Prebid SDK**: Opens the click URL in the default browser of the device. The SDK calls the respective ad delegate and listeners' methods to notify the publisher that the application is being left. <br><br> **Publisher** is responsible for processing SDK events and managing the application state, respectively.  |Currently, the customization is not available. Open an issue or PR for the alternative approach. |

## Outstream Video (in-banner)

Prebid SDK renders the outstream video ad in the OS-specific video player. The publisher is responsible for integrating the `BannerAdView` into the application layout and providing the needed space according to the supported ad sizes. 

| Policy | Behaviour | Customization | 
|--------|-----------|---------------|
|`Autoplay`| **Prebid SDK** starts playback only when the ad appears on the app screen. Once the ad is removed or scrolled off the screen, the playback will be stopped. <br> <br> **Publisher** is responsible for removing or collapsing the ad slot in the application layout. |Currently, there is no public API to customize this behaviour. Open an issue or PR for the alternative approach.|
|`Sound`| **Prebid SDK** Prebid SDK plays out-stream video in loud. | Currently, there is no way to mute the outstream video. Open an issue or PR for the alternative approach.| 

## Interstitial Video

The Prebid SDK renders the interstitial video ad in the OS-specific video player, within the special full-screen controller. The publisher is responsible for integrating the `Interstitial` controller into the application flow and managing the app's behavior in response to ad signals. 

| Policy | Behaviour | Customization | 
|--------|-----------|---------------|
| `Fullscreen` | **Prebid SDK** opens the interstitial ad in the fullscreen controller that overlaps all other application content. The iOS SDK suport the SKOverlay format to show the interstitial ad for the bid with respective [configuration](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/main/extensions/community_extensions/skadnetwork.md#bid-request). <br><br> **Publisher** is responsible for implementing the callbacks for interstitial ads and managing the app state according to the ad behaviour. | Currently, there is no way to customize the appearance of the interstitial ads. Open an issue or PR for the alternative approach. |
| `Rotation` | **Prebid SDK** allows the rotation of the screen for the interstitial ads. The ad content is rotated according to the screen position. SDK changes the layout of the ad control elements according to the screen orientation. <br><br> **Publisher** has nothing to do in this operation, SDK doesn't provide any events to subscribe. | Currently, there is no way to customize the rotation behaviour of the interstitial ads. Open an issue or PR for the alternative approach.|
| `Close Button` | **Prebid SDK** adds a close button to the interstitial ad, providing a way for users to dismiss the fullscreen ad. Depending on the ad format, the button can appear from the very beginning of the ad or with some delay. <br><br>  **Publisher** is responsible for subscribing to the ad flow events and managing the app flow, respectively, to them.   | **Publisher** can customize the default SDK behaviour using the [Ad Experience Controls](https://docs.prebid.org/prebid-mobile/modules/rendering/combined-ad-experience-controls.html) feature.|
| `Learn More Button` | **Prebid SDK** adds a close button to the interstitial ad, providing a way for users to dismiss the fullscreen ad. Depending on the ad format, the button can appear from the very beginning of the ad or with some delay. <br><br>  **Publisher** is responsible for subscribing to the ad flow events and managing the app flow, respectively, to them. |**Publisher** can customize the default SDK behaviour using [Ad Experience Controls](https://docs.prebid.org/prebid-mobile/modules/rendering/combined-ad-experience-controls.html)|
| `Tap` | **Prebid SDK** processes the clicks, actually taps, in different ways, respectively, depending on the type of the ad. <br> **The publisher** is responsible for handling `adwillopen` delegate. |Currently, there is no way to customize the way of processing the taps on the ad. Open an issue or PR for the alternative approach.|
| `Clickthrough` | **Prebid SDK** opens a click URL in the external browser on the platform. Typically, it is the default browser for a particular user's device. <br> **Publisher** is responsible for processing SDK events and managing the application state, respectively.  |Currently, the customization is not available. Open an issue or PR for the alternative approach.|
|`Playback`| **Prebid SDK** starts playback only when the ad appears on the app screen. Once the ad is removed or scrolled off the screen, the playback will be stopped. <br> <br> **Publisher** is responsible for removing or collapsing the ad slot in the application layout. |Currently, there is no public API to customize this behaviour. Open an issue or PR for the alternative approach.|
|`Sound`| **Prebid SDK** Prebid SDK plays instream video in loud. | **Publisher** can customize the default SDK behaviour using [Ad Experience Controls](https://docs.prebid.org/prebid-mobile/modules/rendering/combined-ad-experience-controls.html) |

## Rewarded Video 

**Prebid SDK** implements a special ad unit for Rewarded ads, based on the interstitial ad unit, and maintains the OS-specific video player, WebView, and rewarding under the hood. The publisher is responsible for integrating the Interstitial controller into the application flow and managing app behavior in response to ad signals. 

| Policy | Behaviour | Customization | 
|--------|-----------|---------------|
|Autoplay| **Prebid SDK** starts playback only when the ad appears on the app screen. Once the ad is removed or scrolled off the screen, the playback will be stopped. <br> **The publisher** is responsible for removing or collapsing the ad slot in the application layout. ||

## Native Ads

The Prebid SDK supplies the content for native ad assets such as titles, images, and custom data, but does not control how these assets are presented within the application. Publishers are responsible for designing the ad layout and integrating it into their app’s user interface. Consequently, the overall user experience of native ads depends on the publisher’s implementation.

