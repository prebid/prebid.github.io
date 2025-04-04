---

layout: page_v2
title: Ad Experience Controls
description: Ad experience specification
sidebarType: 2

---

# Prebid SDK Ad Experince
{:.no_toc}

If you use Prebid SDK to render the winning bid, you should be aware of how SDK implements ad experience and how you can change it.

This spec is not applicable for the bidding-only API where Google Mobile Ads SDK or any other rendering engine performs rendering. In such integration scenarios, the ad experience is dictated by the third-party SDK, and Prebid SDK is not able to influence this. 


* TOC
{:toc}

## Banner

Prebid SDK renders the banner ad in the OS-specific WebView. The publisher is responsible for integrating BannerAdView into the application layout and providing the needed space according to the supported ad sizes.  

| Policy | Behaviour | Customization | 
|--------|-----------|---------------|
|Autorefresh| **Prebid SDK** refreshes the banner ad every 60 seconds. SDK makes the bid request and changes the current creative in the ad slot if the refresh has a bid. If there is no bid - SDK will remove the current creative from the internal ad slot and signal about it to publishers using respective delegate methods. <br><br> **The publisher** is responsible for removing or collapsing the ad slot in the application layout. |**iOS**: you can change the refresh interval using [refreshInterval](https://docs.prebid.org/prebid-mobile-ios/Classes/BannerView.html#/c:@M@PrebidMobile@objc(cs)BannerView(py)refreshInterval) property. <br><br> **Android**: you can change the refresh interval using the [setAutoRefreshDelay](https://docs.prebid.org/prebid-mobile-android/org/prebid/mobile/api/rendering/BannerView.html#setAutoRefreshDelay(int)) property.|
| Resize of the content|**Prebid SDK** changes the size of WebView according to the size of the creative received in the bid response. <br><br> **Publisher** is responsible for adopting the application layout for different ad sizes.|To support multisize ads publishers should implement a dynamic layout for the banner ad place. Prebid SDK will change the size of BannerAdView according to the content. However, the publisher is responsible for adapting the application layout for different ad sizes. |



## Outstream Video

Prebid SDK renders the out-stream video ad in the OS-specific video player. The publisher is responsible for integrating BannerAdView into the application layout and providing the needed space according to the supported ad sizes. 

| Policy | Behaviour | Customization | 
|--------|-----------|---------------|
|`Autoplay`| **Prebid SDK** starts playback only when the ad appears on the app screen. Once the ad is removed or scrolled out from the screen, the playback will be stopped. <br> <br> **The publisher** is responsible for removing or collapsing the ad slot in the application layout. |Currently, there is no public API to customize this behaviour.|
|`Sound`| **Prebid SDK** Prebid SDK plays out-stream video in loud. | Currently, there is no way to mute the outseam video.|

## Interstitial Video

Prebid SDK renders the interstitial video ad in the OS-specific video player, which is placed in the special full-screen controller. The publisher is responsible for integrating the Interstitial controller into the application flow and managing the app behavior according to the ad signals. 

| Policy | Behaviour | Customization | 
|--------|-----------|---------------|
| `Fullscreen` | **Prebid SDK** starts playback only when the ad appears on the app screen. Once the ad is removed or scrolled out from the screen, the playback will be stopped. <br> **The publisher** is responsible for removing or collapsing the ad slot in the application layout. ||
| `Rotation` | **Prebid SDK** starts playback only when the ad is appear on the app screen. Once the ad is removed or scrolled out from the screen, the playback will be stopped. <br> **The publisher** is responsible for removing or collapsing the ad slot in the application layout. ||
| `Close Button` | **Prebid SDK** starts playback only when the ad appears on the app screen. Once the ad is removed or scrolled out from the screen, the playback will be stopped. <br> **The publisher** is responsible for removing or collapsing the ad slot in the application layout. ||
| `Learn More Button` | **Prebid SDK** starts playback only when the ad appears on the app screen. Once the ad is removed or scrolled out from the screen, the playback will be stopped. <br> **The publisher** is responsible for removing or collapsing the ad slot in the application layout. ||
| `Click` | **Prebid SDK** starts playback only when the ad appears on the app screen. Once the ad is removed or scrolled out from the screen, the playback will be stopped. <br> **The publisher** is responsible for removing or collapsing the ad slot in the application layout. ||
| `Clickthrough` | **Prebid SDK** starts playback only when the ad appears on the app screen. Once the ad is removed or scrolled out from the screen, the playback will be stopped. <br> **The publisher** is responsible for removing or collapsing the ad slot in the application layout. ||
| `Sound` | **Prebid SDK** starts playback only when the ad appears on the app screen. Once the ad is removed or scrolled out from the screen, the playback will be stopped. <br> **The publisher** is responsible for removing or collapsing the ad slot in the application layout. ||

## Rewarded Video 

Prebid SDK implements the special ad unit for Reawarded ads. It is based on interstitial ad unit and keeps the OS-specific video player, WebView and rewarding login under the hood. The publisher is responsible for integrating the Interstitial controller into the application flow and manage app behavior, respectively, to the ad signals. 

| Policy | Behaviour | Customization | 
|--------|-----------|---------------|
|Autoplay| **Prebid SDK** starts playback only when the ad appears on the app screen. Once the ad is removed or scrolled out from the screen, the playback will be stopped. <br> **The publisher** is responsible for removing or collapsing the ad slot in the application layout. ||

## Native

