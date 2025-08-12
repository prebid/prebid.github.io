---

layout: page_v2
title: Ad Experience Specification
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

 {: .table .table-bordered .table-striped }
| Policy | Behavior | Customization | 
|--------|-----------|---------------|
|`Autorefresh`| **Prebid SDK** refreshes the banner ad every **60 seconds**. SDK makes the bid request and changes the current creative in the ad slot if the refresh has a bid. If there is no bid, the SDK will remove the current creative from the internal ad slot and notify the publisher using the respective delegate methods. <br><br> **Publisher** is responsible for removing or collapsing the ad slot in the application layout. |**iOS**: you can change the refresh interval using [refreshInterval](https://docs.prebid.org/prebid-mobile-ios/Classes/BannerView.html#/c:@M@PrebidMobile@objc(cs)BannerView(py)refreshInterval) property. <br><br> **Android**: you can change the refresh interval using the [setAutoRefreshDelay](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/api/rendering/BannerView.html#setAutoRefreshDelay(int)) property.|
|`Content Resizing`|**Prebid SDK** changes the size of WebView according to the size of the creative received in the bid response. <br><br> **Publisher** is responsible for adopting the application layout for different ad sizes.|To support multisize ads, publishers should implement a dynamic layout for the banner ad place. Prebid SDK will change the size of the `BannerAdView` according to the content. However, the publisher is responsible for adapting the application layout for different ad sizes. <br><br>Currently, the SDK doesn't notify publishers about the change in banner size. Open an issue or PR to add this functionality.|
|`Clickthrough`|**Prebid SDK**: Opens the click URL in the default browser of the device. The SDK calls the respective ad delegate and listeners' methods to notify the publisher that the application is being left. <br><br> **Publisher** is responsible for processing SDK events and managing the application state, respectively.  |Currently, customization is not available. Open an issue or PR for the alternative approach. |

## Outstream Video (in-banner)

Prebid SDK renders the outstream video ad in the OS-specific video player. The publisher is responsible for integrating the `BannerAdView` into the application layout and providing the needed space according to the supported ad sizes. 

 {: .table .table-bordered .table-striped }
| Policy | Behavior | Customization | 
|--------|-----------|---------------|
|`Autoplay`| **Prebid SDK** starts playback only when the ad appears on the app screen. Once the ad is removed or scrolled off the screen, the playback will be stopped. <br> <br> **Publisher** is responsible for removing or collapsing the ad slot in the application layout. |Currently, there is no public API to customize this behavior. Open an issue or PR for the alternative approach.|
|`Sound`| **Prebid SDK** Prebid SDK plays out-stream video with sound enabled. | Currently, there is no way to mute the outstream video. Open an issue or PR for the alternative approach.| 

## Interstitial Video

The Prebid SDK renders the interstitial video ad in the OS-specific video player, within the special full-screen controller. The publisher is responsible for integrating the `Interstitial` controller into the application flow and managing the app's behavior in response to ad signals. 

 {: .table .table-bordered .table-striped }
| Policy | Behavior | Customization | 
|--------|-----------|---------------|
| `Fullscreen` | **Prebid SDK** opens the interstitial ad in the fullscreen controller that overlaps all other application content. The iOS SDK support the SKOverlay format to show the interstitial ad for the bid with respective [configuration](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/main/extensions/community_extensions/skadnetwork.md#bid-request). <br><br> **Publisher** is responsible for implementing the callbacks for interstitial ads and managing the app state according to the ad behavior. | Currently, there is no way to customize the appearance of the interstitial ads. Open an issue or PR for the alternative approach. |
| `Rotation` | **Prebid SDK** allows the rotation of the screen for the interstitial ads. The ad content is rotated according to the screen position. SDK changes the layout of the ad control elements according to the screen orientation. <br><br> **Publisher** has nothing to do in this operation, SDK doesn't provide any events to subscribe. | Currently, there is no way to customize the rotation behavior of the interstitial ads. Open an issue or PR for the alternative approach.|
| `Close Button` | **Prebid SDK** adds a close button to the interstitial ad, providing a way for users to dismiss the fullscreen ad. Depending on the ad format, the button can appear from the very beginning of the ad or with some delay. <br><br>  **Publisher** is responsible for subscribing to the ad flow events and managing the app flow, accordingly.   | **Publisher** can customize the default SDK behavior using the [Ad Experience Controls](https://docs.prebid.org/prebid-mobile/modules/rendering/combined-ad-experience-controls.html) feature.|
| `Learn More Button` | **Prebid SDK** adds a close button to the interstitial ad, providing a way for users to dismiss the fullscreen ad. Depending on the ad format, the button can appear from the very beginning of the ad or with some delay. <br><br>  **Publisher** is responsible for subscribing to the ad flow events and managing the app flow, accordingly. |**Publisher** can customize the default SDK behavior using [Ad Experience Controls](https://docs.prebid.org/prebid-mobile/modules/rendering/combined-ad-experience-controls.html)|
| `Tap` | **Prebid SDK** processes the clicks, actually taps, in different ways, respectively, depending on the type of the ad. <br> **The publisher** is responsible for handling [interstitialDidClickAd](https://docs.prebid.org/prebid-mobile-ios/Protocols/InterstitialAdUnitDelegate.html#/c:@M@PrebidMobile@objc(pl)InterstitialAdUnitDelegate(im)interstitialDidClickAd:) delegate method on iOS or [onAdClicked](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/api/rendering/listeners/InterstitialAdUnitListener.html#onAdClicked(org.prebid.mobile.api.rendering.InterstitialAdUnit)) listener method on Android. |Currently, there is no way to customize the way of processing the taps on the ad. Open an issue or PR for the alternative approach.|
| `Clickthrough` | **Prebid SDK** opens a click URL in the external browser on the platform. Typically, it is the default browser for a particular user's device. <br> **Publisher** is responsible for processing SDK events and managing the application state, respectively.  |Currently, customization is not available. Open an issue or PR for the alternative approach.|
|`Playback`| **Prebid SDK** starts playback only when the ad appears on the app screen. Once the ad is removed or scrolled off the screen, the playback will be stopped. <br> <br> **Publisher** is responsible for removing or collapsing the ad slot in the application layout. |Currently, there is no public API to customize this behavior. Open an issue or PR for the alternative approach.|
|`Sound`| **Prebid SDK** Prebid SDK plays instream video with sound enabled. | **Publisher** can customize the default SDK behavior using [Ad Experience Controls](https://docs.prebid.org/prebid-mobile/modules/rendering/combined-ad-experience-controls.html) |

## Rewarded Ad 

**Prebid SDK** implements a special ad unit for Rewarded ads, maintaining the OS-specific video player, WebView, and rewarding engine under the hood. The publisher should integrate the `RewardedAdUnit` into the application flow and manage app behavior in response to ad signals. 

The following table, based on the `RewardedAdUnit` [specification](https://github.com/prebid/prebid-mobile-ios/issues/1056), describes how publishers can change their behavior: 

 {: .table .table-bordered .table-striped }
| Policy | Behavior | Customization | 
|--------|-----------|---------------|
|`Reward`|**Prebid SDK** can signal the publisher about the type and quantity of reward coins.<br><br> If the `rwdd` or `reward` object is absent in the response, by **default,** SDK will send an empty object into the respective delegate method. |**Publisher** can set the type and number of coins in the `rwdd.reward` object.|
|`Completion`|**Prebid SDK** will inform the application once the reward time has come.<br><br> If the `rwdd` or `reward` object is absent in the response, by **default,** <br><br>- **banner:** SDK triggers the completion of the banner rewarded ad after **120 seconds** on the screen.<br><br>- **video:** SDK triggers the completion of the rewarded ad once the video playback is completed. But only if the ad doesn’t have an end card. | **Publisher** can set the rule when the SDK should inform the app about the reward time. Depending on the ad format, the publisher can set different rules using `rwdd.completion.banner` and `rwdd.completion.video` objects respectively.|
|`Close`|**Prebid SDK** will close the interstitial controller with rewarded ad according to the configuration passed in the response.<br><br> If the `rwdd` or `reward` object is absent in the response, by **default,** SDK will display the **close button** on the interstitial once the completion criteria are met.| **Publisher** can set the rule on how the SDK should behave once the user earns the reward, and the interstitial ad can be dismissed from the app screen. <br><br>The `rwdd.close.postrewardtime` describes how much time the SDK should wait until performing the `action`. <br><br>The action itself is described in `rwdd.close.action` object. Currently, two actions are supported:<br><br>- `autoclose` means that the ad will be dismissed without user interaction.<br><br>- `closebutton` means that the SDK will display the close button on top of the ad, and the user will have to tap on it to dismiss the ad.|

Note: [Ad Experience Controls](https://docs.prebid.org/prebid-mobile/modules/rendering/combined-ad-experience-controls.html) of the rewarded ad can be configured in the same way as for the interstitial ad. 

## Native Ads

The Prebid SDK supplies the content for native ad assets such as titles, images, and custom data, but does not control how these assets are presented within the application. Publishers are responsible for designing the ad layout and integrating it into their app’s user interface. Consequently, the overall user experience of native ads depends on the publisher’s implementation.
