---

layout: page_v2
title: Prebid Mobile - GAM with Original API
description: Integration of Prebid SDK With Google Ad Manager using the original API
sidebarType: 2

---

# Prebid Mobile with GAM (Original API)
{:.no_toc}

Prebid Mobile is an open-source library that provides an end-to-end header bidding solution for mobile app publishers.

* TOC
{:toc}

## Overview

This is the original Prebid mobile integration approach when SDK plays the transport role and the winning bid is rendered by the primary ad server SDK using PUC. You can find details of how it works and other integration approaches on the [overview page](/prebid-mobile/prebid-mobile.html#with-ad-server-original-api).

![In-App Bidding with Prebid](/assets/images/prebid-mobile/prebid-in-app-bidding-overview-prebid-original-gam.png)

## Banner API

Starting with Prebid Mobile `2.1.0` you can use `BannerAdUnit` to bid over the banner and/or video demand. The default ad format is `.banner`. To customize the bidding format you should specify the `adFormats` property of the `BannerAdUnit`.

### HTML Banner

Integration example:

``` swift
// 1. Create a BannerAdUnit
adUnit = BannerAdUnit(configId: CONFIG_ID, size: adSize)
adUnit.setAutoRefreshMillis(time: 30000)

// 2. Configure banner parameters
let parameters = BannerParameters()
parameters.api = [Signals.Api.MRAID_2]
adUnit.bannerParameters = parameters

// 3. Create a GAMBannerView
gamBanner = GAMBannerView(adSize: GADAdSizeFromCGSize(adSize))
gamBanner.adUnitID = gamAdUnitDisplayBannerOriginal
gamBanner.rootViewController = self
gamBanner.delegate = self

// Add GMA SDK banner view to the app UI
bannerView?.addSubview(gamBanner)

// 4. Make a bid request to Prebid Server
let gamRequest = GAMRequest()
adUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
    PrebidDemoLogger.shared.info("Prebid demand fetch for GAM \(resultCode.name())")

    // 5. Load GAM Ad
    self?.gamBanner.load(gamRequest)
}
```

Implement GADBannerViewDelegate:

``` swift
func bannerViewDidReceiveAd(_ bannerView: GADBannerView) {

    // 6. Resize ad view if needed
    AdViewUtils.findPrebidCreativeSize(bannerView, success: { size in
        guard let bannerView = bannerView as? GAMBannerView else { return }
        bannerView.resize(GADAdSizeFromCGSize(size))
    }, failure: { (error) in
        PrebidDemoLogger.shared.error("Error occuring during searching for Prebid creative size: \(error)")
    })
}
```

#### Step 1: Create a BannerAdUnit
{:.no_toc}

Initialize the `BannerAdUnit` with the following properties:

* `configId` - an ID of the Stored Impression on the Prebid Server
* `adSize` - the size of the ad unit which will be used in the bid request.

#### Step 2: Configure banner parameters
{:.no_toc}

Using the `BannerParameters` you can customize the bid request for the BannerAdUnit.

The `api` property is dedicated to adding values for API Frameworks to bid response according to the OpenRTB [2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) spec. The supported values for GMA SDK integration are:

* `3` or `Signals.Api.MRAID_1` : MRAID-1 support signal
* `5` or `Signals.Api.MRAID_2` : MRAID-2 support signal
* `6` or `Signals.Api.MRAID_3` : MRAID-3 support signal
* `7` or `Signals.Api.OMID_1` :  signals OMSDK support

{: .alert.alert-warning :}
Starting from PrebidMobile `2.1.0` the `parameters` property is deprecated. Use `bannerParameters` instead.

#### Step 3: Create a GAMBannerView
{:.no_toc}

Follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/banner) to integrate a banner ad unit.

#### Step 4: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide a `GAMRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

#### Step 5: Load an Ad
{:.no_toc}

Now you should request the ad from GAM. If the `GAMRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM and GMA SDK will render its creative.

Be sure that you make the ad request with the same `GAMRequest` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

#### Step 6: Adjust the ad view size
{:.no_toc}

Once an app receives a signal that an ad is loaded, you should use the method `AdViewUtils.findPrebidCreativeSize` to verify whether it is a Prebid ad and resize the ad slot respectively to the creative's properties.

### Video Banner (Outstream Video)

Integration example:

``` swift
// 1. Create a BannerAdUnit
adUnit = BannerAdUnit(configId: CONFIG_ID, size: adSize)

// 2. Set ad format
adUnit.adFormats = [.video]

// 3. Configure video parameters
let parameters = VideoParameters(mimes: ["video/mp4"])
parameters.protocols = [Signals.Protocols.VAST_2_0]
parameters.playbackMethod = [Signals.PlaybackMethod.AutoPlaySoundOff]
parameters.placement = Signals.Placement.InBanner
adUnit.videoParameters = parameters

// 4. Create a GAMBannerView
gamBanner = GAMBannerView(adSize: GADAdSizeFromCGSize(adSize))
gamBanner.adUnitID = gamAdUnitVideoBannerOriginal
gamBanner.rootViewController = self
gamBanner.delegate = self

// Add GMA SDK banner view to the app UI
bannerView.addSubview(gamBanner)
bannerView.backgroundColor = .clear

// 5. Make a bid request to Prebid Server
let gamRequest = GAMRequest()
adUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
    PrebidDemoLogger.shared.info("Prebid demand fetch for GAM \(resultCode.name())")

    // 6. Load GAM Ad
    self?.gamBanner.load(gamRequest)
}
```

{: .alert.alert-warning :}
Starting from PrebidMobile `2.1.0` the `VideoAdUnit` class is deprecated. Use `BannerAdUnit` class with video ad format instead.

#### Step 1: Create a BannerAdUnit
{:.no_toc}

Initialize the `BannerAdUnit` with the following properties:

* `configId` - an ID of the Stored Impression on the Prebid Server
* `adSize` - the size of the ad unit which will be used in the bid request.

#### Step 2: Set ad format
{:.no_toc}

For video ad unit, you must set video ad format. Default value for `adFormats` property is `[.banner]`.

#### Step 3: Configure the video parameters
{:.no_toc}

Using the `VideoParameters` you can customize the bid request for video ads.

#### placement
{:.no_toc}

[OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) Placement Type for the auction can be expressed as an integer array or you can use an enum for easier readability. Option 1 (in-stream) is intentionally left out due to lack of in-stream support in Prebid SDK.

In the context of a VideoInterstitialAdUnit, rewarded video ads are typically labeled as interstitial. As such, Prebid SDK will default to value 5 if no placement value is supplied.

* `2` or `InBanner` : In-Banner placement exists within a web banner that leverages the banner space to deliver a video experience as opposed to another static or rich media format. The format relies on the existence of display ad inventory on the page for its delivery.
* `3` or `InArticle` : In-Article placement loads and plays dynamically between paragraphs of editorial content; existing as a standalone branded message.
* `4` or `InFeed` : In-Feed placement is found in content, social, or product feeds.
* `5` or `Slider`, `Floating` or `Interstitial` : Open RTB supports one of three values for option 5 as either Slider, Floating or Interstitial. If an enum value is supplied in placement, bidders will receive value 5 for placement type and assume to be interstitial with the instl flag set to 1.

#### api
{:.no_toc}

The `api` property is dedicated to adding values for API Frameworks to bid response according to the [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) spec. The supported values for GMA SDK integration are:

* `1` or `Signals.Api.VPAID_1` : VPAID 1.0
* `2` or `Signals.Api.VPAID_2` : VPAID 2.0
* `3` or `Signals.Api.MRAID_1` : MRAID-1 support signal
* `5` or `Signals.Api.MRAID_2` : MRAID-2 support signal
* `6` or `Signals.Api.MRAID_3` : MRAID-3 support signal
* `7` or `Signals.Api.OMID_1`  : signals OMSDK support

#### maxBitrate
{:.no_toc}

Integer representing the OpenRTB 2.5 maximum bit rate in Kbps.

#### minBitrate
{:.no_toc}

Integer representing the OpenRTB 2.5 minimum bit rate in Kbps.

#### maxDuration
{:.no_toc}

Integer representing the OpenRTB 2.5 maximum video ad duration in seconds.

#### minDuration
{:.no_toc}

Integer representing the OpenRTB 2.5 minimum video ad duration in seconds.

#### mimes
{:.no_toc}

Array of strings representing the supported OpenRTB 2.5 content MIME types (e.g., “video/x-ms-wmv”, “video/mp4”).
Required property.

#### playbackMethod
{:.no_toc}

Array of OpenRTB 2.5 playback methods. If none are specified, any method may be used. Only one method is typically used in practice. It is strongly advised to use only the first element of the array.

* `1` or `Signals.PlaybackMethod.AutoPlaySoundOn` : Initiates on Page Load with Sound On
* `2` or `Signals.PlaybackMethod.AutoPlaySoundOff` : Initiates on Page Load with Sound Off by Default
* `3` or `Signals.PlaybackMethod.ClickToPlay` : Initiates on Click with Sound On
* `4` or `Signals.PlaybackMethod.MouseOver` : Initiates on Mouse-Over with Sound On
* `5` or `Signals.PlaybackMethod.EnterSoundOn` : Initiates on Entering Viewport with Sound On
* `6` or `Signals.PlaybackMethod.EnterSoundOff`: Initiates on Entering Viewport with Sound Off by Default

#### protocols
{:.no_toc}

  Array or enum of OpenRTB 2.5 supported Protocols. Values can be one of:

* `1` or `Signals.Protocols.VAST_1_0` : VAST 1.0
* `2` or `Signals.Protocols.VAST_2_0` : VAST 2.0
* `3` or `Signals.Protocols.VAST_3_0` : VAST 3.0
* `4` or `Signals.Protocols.VAST_1_0_Wrapper` : VAST 1.0 Wrapper
* `5` or `Signals.Protocols.VAST_2_0_Wrapper` : VAST 2.0 Wrapper
* `6` or `Signals.Protocols.VAST_3_0_Wrapper` : VAST 3.0 Wrapper
* `7` or `Signals.Protocols.VAST_4_0` : VAST 4.0
* `8` or `Signals.Protocols.VAST_4_0_Wrapper` : VAST 4.0 Wrapper

#### Step 4: Create a GAMBannerView
{:.no_toc}

Follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/banner) to integrate a banner ad unit.

#### Step 5: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide a `GAMRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

#### Step 6: Load an Ad
{:.no_toc}

You should now request the ad from GAM. If the `GAMRequest` contains targeting keywords. The respective Prebid line item will be returned from GAM and GMA SDK will render its creative.

Be sure that you make the ad request with the same `GAMRequest` object that you passed to the `fetchDemand` method. Otherwise the ad request won't contain targeting keywords and Prebid's ad won't ever be displayed.

### Multiformat Banner (HTML + Video)

Integration example:

``` swift
// 1. Create a BannerAdUnit
adUnit = BannerAdUnit(configId: CONFIG_ID, size: adSize)
adUnit.setAutoRefreshMillis(time: 30000)

// 2. Set adFormats
adUnit.adFormats = [.banner, .video]

// 3. Configure banner parameters
let bannerParameters = BannerParameters()
bannerParameters.api = [Signals.Api.MRAID_2]
adUnit.bannerParameters = bannerParameters

// 4. Configure video parameters
let videoParameters = VideoParameters(mimes: ["video/mp4"])
videoParameters.protocols = [Signals.Protocols.VAST_2_0]
videoParameters.playbackMethod = [Signals.PlaybackMethod.AutoPlaySoundOff]
videoParameters.placement = Signals.Placement.InBanner
adUnit.videoParameters = videoParameters

// 5. Create a GAMBannerView
gamBanner = GAMBannerView(adSize: GADAdSizeFromCGSize(adSize))
gamBanner.adUnitID = gamAdUnitMultiformatBannerOriginal
gamBanner.rootViewController = self
gamBanner.delegate = self

// Add GMA SDK banner view to the app UI
bannerView?.addSubview(gamBanner)

// 6. Make a bid request to Prebid Server
let gamRequest = GAMRequest()
adUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
    PrebidDemoLogger.shared.info("Prebid demand fetch for GAM \(resultCode.name())")

    // 7. Load GAM Ad
    self?.gamBanner.load(gamRequest)
}
```

Implement GADBannerViewDelegate:

``` swift
func bannerViewDidReceiveAd(_ bannerView: GADBannerView) {

    // 8. Resize ad view if needed
    AdViewUtils.findPrebidCreativeSize(bannerView, success: { size in
        guard let bannerView = bannerView as? GAMBannerView else { return }
        bannerView.resize(GADAdSizeFromCGSize(size))
    }, failure: { (error) in
        PrebidDemoLogger.shared.error("Error occuring during searching for Prebid creative size: \(error)")
    })
}
```

#### Step 1: Create a BannerAdUnit
{:.no_toc}

Initialize the `BannerAdUnit` with the following properties:

* `configId` - an ID of the Stored Impression on the Prebid Server
* `adSize` - the size of the ad unit which will be used in the bid request.

#### Step 2: Set ad formats
{:.no_toc}

For multiformat ad unit, you must set both banner and video ad formats.

#### Step 3: Configure banner parameters
{:.no_toc}

Provide configuration properties for the banner ad using the [BannerParameters](#step-2-configure-banner-parameters) object.

#### Step 4: Configure video parameters
{:.no_toc}

Provide configuration properties for the video ad using the [VideoParameters](#step-3-configure-the-video-parameters) object.

#### Step 5: Create a GAMBannerView
{:.no_toc}

Follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/banner) to integrate a banner ad unit.

#### Step 6: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide a `GAMRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

#### Step 7: Load an Ad
{:.no_toc}

Now you should request the ad from GAM. If the `GAMRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM and GMA SDK will render its creative.

Be sure that you make the ad request with the same `GAMRequest` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

#### Step 8: Adjust the ad view size
{:.no_toc}

Once an app receives a signal that an ad is loaded, you should use the method `AdViewUtils.findPrebidCreativeSize` to verify whether it is a Prebid ad and resize the ad slot respectively to the creative's properties.

## Interstitial API

Starting with Prebid Mobile `2.1.0` you can use `InterstitialAdUnit` to bid over the banner and/or video demand. The default ad format is `.banner`. To customize the bidding format you should specify the `adFormats` property of the `InterstitialAdUnit`.

### HTML Interstitial

Integration example:

``` swift
// 1. Create an Interstitial Ad Unit
adUnit = InterstitialAdUnit(configId: CONFIG_ID)

// 2. Make a bid request to Prebid Server
let gamRequest = GAMRequest()
adUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
    PrebidDemoLogger.shared.info("Prebid demand fetch for GAM \(resultCode.name())")

    // 3. Load a GAM interstitial ad
    GAMInterstitialAd.load(withAdManagerAdUnitID: gamAdUnitDisplayInterstitialOriginal, request: gamRequest) { ad, error in
        guard let self = self else { return }
        if let error = error {
            PrebidDemoLogger.shared.error("Failed to load interstitial ad with error: \(error.localizedDescription)")
        } else if let ad = ad {
            ad.fullScreenContentDelegate = self

            // 4. Present the interstitial ad
            ad.present(fromRootViewController: self)
        }
    }
}
```

#### Step 1: Create an InterstitialAdUnit
{:.no_toc}

Initialize the InterstitialAdUnit with the following properties:

* `configId` - an ID of Stored Impression on the Prebid Server
* `minWidthPerc`: Optional parameter to specify the minimum width percent an ad may occupy of a device's real estate. Support in SDK version 1.2+
* `minHeightPrec`: Optional parameter to specify the minimum height percent an ad may occupy of a device's real estate. Support in SDK version 1.2+

> **NOTE:** As of version 1.2+, Prebid SDK has extended the functionality of Interstitial ad monetization by using a smart ad size selection process to monetize sizes smaller than full screen ads. App developers can specify a minimum width and minimum height percentage an ad can occupy of a devices real state, with Prebid Server (PBS) deriving a limited set of ad sizes (max 10) as eligible for the auction.
>
> PBS will take the AdUnit's size (width and height) as the max size for the interstitial as size, generating a list of ad sizes, selecting the first 10 sizes that fall within the imp's max size and minimum percentage size. All the interstitial parameters will still be passed to the bidders, allowing them to use their own size matching algorithms if they prefer.
>
> Prebid Server will send the eligible size list to each bidder to solicit a bid. For a full description of the Prebid Server logic, please refer to the [Prebid Server PR 797](https://github.com/prebid/prebid-server/pull/797/files).

{: .alert.alert-warning :}
Starting from PrebidMobile `2.1.0` the `parameters` property is deprecated. Use `bannerParameters` instead.

#### Step 2: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide a `GAMRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

#### Step 3: Load a GAM interstitial ad
{:.no_toc}

You should now request the ad from GAM. If the `GAMRequest` contains targeting keywords. The respective Prebid line item will be returned from GAM and GMA SDK will render its creative.

Be sure that you make the ad request with the same `GAMRequest` object that you passed to the `fetchDemand` method. Otherwise the ad request won't contain targeting keywords and Prebid's ad won't ever be displayed.

#### Step 4: Present the interstitial ad
{:.no_toc}

Follow the [GMA SDK guide](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/interstitial#display_the_ad) to display an interstitial ad right after receiving it or later in a natural pauses in the flow of an app.

### Video Interstitial

Integration Example:

``` swift
// 1. Create a InterstitialAdUnit
adUnit = InterstitialAdUnit(configId: CONFIG_ID)

// 2. Set ad format
adUnit.adFormats = [.video]

// 3. Configure video parameters
let parameters = VideoParameters(mimes: ["video/mp4"])
parameters.protocols = [Signals.Protocols.VAST_2_0]
parameters.playbackMethod = [Signals.PlaybackMethod.AutoPlaySoundOff]
adUnit.videoParameters = parameters

// 4. Make a bid request to Prebid Server
let gamRequest = GAMRequest()
adUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
    PrebidDemoLogger.shared.info("Prebid demand fetch for GAM \(resultCode.name())")

// 5. Load a GAM interstitial ad
GAMInterstitialAd.load(withAdManagerAdUnitID: gamAdUnitVideoInterstitialOriginal, request: gamRequest) { ad, error in
    guard let self = self else { return }
    if let error = error {
        PrebidDemoLogger.shared.error("Failed to load interstitial ad with error: \(error.localizedDescription)")
    } else if let ad = ad {

        // 6. Present the interstitial ad
        ad.present(fromRootViewController: self)
        ad.fullScreenContentDelegate = self
    }
    }
}
```

{: .alert.alert-warning :}
Starting from PrebidMobile `2.1.0` the `VideoInterstitialAdUnit` class is deprecated. Use `InterstitialAdUnit` class with video ad format instead.

#### Step 1: Create an Ad Unit
{:.no_toc}

Initialize the Interstitial Video Ad Unit with properties:

* `configId` - an ID of Stored Impression on the Prebid Server

#### Step 2: Set ad format
{:.no_toc}

For video ad unit, you must set video ad format. Default value for `adFormats` property is `[.banner]`.

#### Step 3: Configure video parameters
{:.no_toc}

Provide configuration properties for the video ad using the [VideoParameters](#step-3-configure-the-video-parameters) object.

#### Step 4: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide a `GAMRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

#### Step 5: Load a GAM interstitial ad
{:.no_toc}

Now you should request the ad from GAM. If the `GAMRequest` contains targeting keywords. The respective Prebid line item will be returned from GAM and GMA SDK will render its creative.

Be sure that you make the ad request with the same `GAMRequest` object that you passed to the `fetchDemand` method. Otherwise the ad request won't contain targeting keywords and Prebid's ad won't ever be displayed.

#### Step 6: Present the interstitial ad
{:.no_toc}

Follow the [GMA SDK guide](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/interstitial#display_the_ad) to display an interstitial ad right after receiving it or later in a natural pauses in the flow of an app.

### Multiformat Interstitial (HTML + Video)

Integration example:

``` swift
// 1. Create an InterstitialAdUnit
adUnit = InterstitialAdUnit(configId: CONFIG_ID, minWidthPerc: 60, minHeightPerc: 70)

// 2. Set adFormats
adUnit.adFormats = [.banner, .video]

// 3. Configure parameters
let parameters = VideoParameters(mimes: ["video/mp4"])
parameters.protocols = [Signals.Protocols.VAST_2_0]
parameters.playbackMethod = [Signals.PlaybackMethod.AutoPlaySoundOff]
adUnit.videoParameters = parameters

// 4. Make a bid request to Prebid Server
let gamRequest = GAMRequest()
adUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
    PrebidDemoLogger.shared.info("Prebid demand fetch for GAM \(resultCode.name())")

    // 5. Load a GAM interstitial ad
    GAMInterstitialAd.load(withAdManagerAdUnitID: gamAdUnitMultiformatInterstitialOriginal, request: gamRequest) { ad, error in
        guard let self = self else { return }

        if let error = error {
            PrebidDemoLogger.shared.error("Failed to load interstitial ad with error: \(error.localizedDescription)")
        } else if let ad = ad {
            // 5. Present the interstitial ad
            ad.fullScreenContentDelegate = self
            ad.present(fromRootViewController: self)
        }
    }
}
```

#### Step 1: Create an InterstitialAdUnit
{:.no_toc}

Initialize the InterstitialAdUnit with the following properties:

* `configId` - an ID of Stored Impression on the Prebid Server
* `minWidthPerc`: Optional parameter to specify the minimum width percent an ad may occupy of a device's real estate. Support in SDK version 1.2+
* `minHeightPrec`: Optional parameter to specify the minimum height percent an ad may occupy of a device's real estate. Support in SDK version 1.2+

> **NOTE:** As of version 1.2+, Prebid SDK has extended the functionality of Interstitial ad monetization by using a smart ad size selection process to monetize sizes smaller than full screen ads. App developers can specify a minimum width and minimum height percentage an ad can occupy of a devices real state, with Prebid Server (PBS) deriving a limited set of ad sizes (max 10) as eligible for the auction.

> PBS will take the AdUnit's size (width and height) as the max size for the interstitial as size, generating a list of ad sizes, selecting the first 10 sizes that fall within the imp's max size and minimum percentage size. All the interstitial parameters will still be passed to the bidders, allowing them to use their own size matching algorithms if they prefer.

> Prebid Server will send the eligible size list to each bidder to solicit a bid. For a full description of the Prebid Server logic, please refer to the [Prebid Server PR 797](https://github.com/prebid/prebid-server/pull/797/files).

#### Step 2: Set ad formats
{:.no_toc}

For multiformat ad unit, you must set both banner and video ad formats.

#### Step 3: Configure parameters
{:.no_toc}

Provide configuration properties for the banner ad using the [BannerParameters](#step-2-configure-banner-parameters) object.
Provide configuration properties for the video ad using the [VideoParameters](#step-3-configure-the-video-parameters) object.

#### Step 4: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide a `GAMRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

#### Step 5: Load a GAM interstitial ad
{:.no_toc}

You should now request the ad from GAM. If the `GAMRequest` contains targeting keywords. The respective Prebid line item will be returned from GAM and GMA SDK will render its creative.

Be sure that you make the ad request with the same `GAMRequest` object that you passed to the `fetchDemand` method. Otherwise the ad request won't contain targeting keywords and Prebid's ad won't ever be displayed.

#### Step 6: Present the interstitial ad
{:.no_toc}

Follow the [GMA SDK guide](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/interstitial#display_the_ad) to display an interstitial ad right after receiving it or later in a natural pauses in the flow of an app.

## Rewarded Video API

Integration example:

``` swift
// 1. Create a RewardedVideoAdUnit
adUnit = RewardedVideoAdUnit(configId: CONFIG_ID)

// 2. Configure video parameters
let parameters = VideoParameters(mimes: ["video/mp4"])
parameters.protocols = [Signals.Protocols.VAST_2_0]
parameters.playbackMethod = [Signals.PlaybackMethod.AutoPlaySoundOff]
adUnit.videoParameters = parameters

// 3. Make a bid request to Prebid Server
adUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
    PrebidDemoLogger.shared.info("Prebid demand fetch for GAM \(resultCode.name())")

    // 4. Load a GAM Rewarded Ad
    GADRewardedAd.load(withAdUnitID: gamAdUnitVideoRewardedOriginal, request: self?.gamRequest) { [weak self] ad, error in
        guard let self = self else { return }
        if let error = error {
            PrebidDemoLogger.shared.error("Failed to load rewarded ad with error: \(error.localizedDescription)")
        } else if let ad = ad {
            ad.fullScreenContentDelegate = self

            // 5. Present the interstitial ad
            ad.present(fromRootViewController: self, userDidEarnRewardHandler: {
                _ = ad.adReward
            })
        }
    }
}
```

### Step 1: Create a RewardedVideoAdUnit
{:.no_toc}

Initialize the Rewarded Video Ad Unit with properties:

* `configId` - an ID of Stored Impression on the Prebid Server

### Step 2: Configure video parameters
{:.no_toc}

Provide configuration properties for the video ad using the [VideoParameters](#step-3-configure-the-video-parameters) object.

{: .alert.alert-warning :}
Please, note that starting from PrebidMobile `2.1.0` the `parameters` property is deprecated. Use `videoParameters` instead.

### Step 3: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide a `GAMRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

### Step 4: Load a GAM Rewarded Ad
{:.no_toc}

Now you should request the ad from GAM. If the `GAMRequest` contains targeting keywords. The respective Prebid line item will be returned from GAM and GMA SDK will render its creative.

Be sure that you make the ad request with the same `GAMRequest` object that you passed to the `fetchDemand` method. Otherwise the ad request won't contain targeting keywords and Prebid's ad won't ever be displayed.

### Step 5: Present the Rewarded Ad
{:.no_toc}

Follow the [GMA SDK guide](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/rewarded#show_the_ad) to display a rewarded ad right after receiving it or later in natural pauses in the flow of an app.

## Instream Video API

Integration example:

``` swift
// 1. Create InstreamVideoAdUnit
adUnit = InstreamVideoAdUnit(configId: CONFIG_ID, size: CGSize(width: 1,height: 1))

// 2. Configure Video Parameters
let parameters = VideoParameters(mimes: ["video/mp4"])
parameters.protocols = [Signals.Protocols.VAST_2_0]
parameters.playbackMethod = [Signals.PlaybackMethod.AutoPlaySoundOn]
adUnit.videoParameters = parameters

// 3. Prepare IMAAdsLoader
adsLoader = IMAAdsLoader(settings: nil)
adsLoader.delegate = self

// 4. Make a bid request
adUnit.fetchDemand { [weak self] (resultCode, prebidKeys: [String: String]?) in
    guard let self = self else { return }
    if resultCode == .prebidDemandFetchSuccess {
        do {

            // 5. Generate GAM Instream URI
            let adServerTag = try IMAUtils.shared.generateInstreamUriForGAM(adUnitID: gamAdUnitVideo, adSlotSizes: [.Size320x480], customKeywords: prebidKeys!)

            // 6. Load IMA ad request
            let adDisplayContainer = IMAAdDisplayContainer(adContainer: self.instreamView, viewController: self)
            let request = IMAAdsRequest(adTagUrl: adServerTag, adDisplayContainer: adDisplayContainer, contentPlayhead: nil, userContext: nil)
            self.adsLoader.requestAds(with: request)
        } catch {
            PrebidDemoLogger.shared.error("\(error.localizedDescription)")
            self.contentPlayer?.play()
        }
    } else {
        PrebidDemoLogger.shared.error("Error constructing IMA Tag")
        self.contentPlayer?.play()
    }
}

////////////

// Step: 7
// MARK: - IMAAdsLoaderDelegate

func adsLoader(_ loader: IMAAdsLoader, adsLoadedWith adsLoadedData: IMAAdsLoadedData) {
    // Grab the instance of the IMAAdsManager and set ourselves as the delegate.
    adsManager = adsLoadedData.adsManager
    adsManager?.delegate = self

    // Initialize the ads manager.
    adsManager?.initialize(with: nil)
}

func adsLoader(_ loader: IMAAdsLoader, failedWith adErrorData: IMAAdLoadingErrorData) {
    PrebidDemoLogger.shared.error("IMA did fail with error: \(adErrorData.adError)")
    contentPlayer?.play()
}

// Step: 8
// MARK: - IMAAdsManagerDelegate

func adsManager(_ adsManager: IMAAdsManager, didReceive event: IMAAdEvent) {
    if event.type == IMAAdEventType.LOADED {
        // When the SDK notifies us that ads have been loaded, play them.
        adsManager.start()
    }
}

func adsManager(_ adsManager: IMAAdsManager, didReceive error: IMAAdError) {
    PrebidDemoLogger.shared.error("AdsManager error: \(error.message ?? "nil")")
    contentPlayer?.play()
}

func adsManagerDidRequestContentPause(_ adsManager: IMAAdsManager) {
    // The SDK is going to play ads, so pause the content.
    contentPlayer?.pause()
}

func adsManagerDidRequestContentResume(_ adsManager: IMAAdsManager) {
    // The SDK is done playing ads (at least for now), so resume the content.
    contentPlayer?.play()
}
```

{: .alert.alert-warning :}
Starting from PrebidMobile `2.1.0` the `VideoAdUnit` class is deprecated. Use `InstreamVideoAdUnit` class instead.

### Step 1: Create an InstreamVideoAdUnit
{:.no_toc}

Initialize the Instream Video Ad Unit with properties:

* `configId` - an ID of Stored Impression on the Prebid Server
* `size` - Width and height of the video ad unit.

### Step 2: Configure video parameters
{:.no_toc}

Provide configuration properties for the video ad using the [VideoParameters](#step-3-configure-the-video-parameters) object.

### Step 3: Prepare IMAAdsLoader
{:.no_toc}

Prepare the in-stream setup according to the [Google's docs](https://developers.google.com/interactive-media-ads/docs/sdks/ios/client-side).

### Step 4: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should use the version of the `fetchDemand` which returns the targeting keywords in the callback. Later you will construct the IMA ad request using these keywords.

### Step 5: Generate GAM Instream URI
{:.no_toc}

Using Prebid util method, generate Google IMA URI for downloading the cached creative from the winning bid.

### Step 6: Load IMA ad request
{:.no_toc}

Create an ad display container for ad rendering. Then create an ad request with our ad tag, display container, and optional user context. Load the ad. Follow the [in-stream video guide](https://developers.google.com/interactive-media-ads/docs/sdks/ios/client-side#6_initialize_the_ads_loader_and_make_an_ads_request) for additional details.


### Step 7: Set up an ads loader delegate
{:.no_toc}

On a successful load event, the `IMAAdsLoader` calls the adsLoadedWithData method of its assigned delegate, passing it an instance of `IMAAdsManager`. You can then initialize the ads manager, which loads the individual ads as defined by the response to the ad tag URL.

### Step 8: Set up an ads manager delegate
{:.no_toc}

Lastly, to manage events and state changes, the ads manager needs a delegate of its own. The `IMAAdManagerDelegate` has methods to handle ad events and errors, as well as methods to trigger play and pause on your video content.

## Native API

### Native Banner

Integration example:

Prepare the set of requested assets first.

``` swift
private var nativeRequestAssets: [NativeAsset] {
    let image = NativeAssetImage(minimumWidth: 200, minimumHeight: 50, required: true)
    image.type = ImageAsset.Main

    let icon = NativeAssetImage(minimumWidth: 20, minimumHeight: 20, required: true)
    icon.type = ImageAsset.Icon

    let title = NativeAssetTitle(length: 90, required: true)
    let body = NativeAssetData(type: DataAsset.description, required: true)
    let cta = NativeAssetData(type: DataAsset.ctatext, required: true)
    let sponsored = NativeAssetData(type: DataAsset.sponsored, required: true)

    return [title, icon, image, sponsored, body, cta]
}
```

Then integrate the native style ad using GAM Banner ad unit

``` swift
// 1. Create NativeRequest
nativeUnit = NativeRequest(configId: CONFIG_ID, assets: nativeRequestAssets)
nativeUnit.context = ContextType.Social
nativeUnit.placementType = PlacementType.FeedContent
nativeUnit.contextSubType = ContextSubType.Social
nativeUnit.eventtrackers = eventTrackers

// 2. Create GAMBannerView
gamBannerView = GAMBannerView(adSize: GADAdSizeFluid)
gamBannerView.adUnitID = storedImpNativeStyleBanner
gamBannerView.rootViewController = self
gamBannerView.delegate = self
bannerView.addSubview(gamBannerView)

// 3. Make a bid request
nativeUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
    PrebidDemoLogger.shared.info("Prebid demand fetch for GAM \(resultCode.name())")

    // 4. Load and GAM ad
    self?.gamBannerView.load(self?.gamRequest)
}
```

#### Step 1: Create a NativeRequest
{:.no_toc}

Initialize the `NativeRequest` with properties:

* `configId` - an ID of the Stored Impression on the Prebid Server
* `assets` - the array of `NativeAsset` objects which describes your native ad.

##### NativeAssetImage
{:.no_toc}

{: .table .table-bordered .table-striped }
| Type | Scope | Description |
|-------|--------|---------|
| Main | Optional | The image that will be displayed in the native ad. Include a value for `minimumWidth` and `minimumHeight`. Ensure that the `NativeAssetImage.type` is set to ImageAsset.Main |
| Icon | Optional | The icon that will be displayed with the native ad. Include a value for `minimumWidth` and `minimumHeight`. Ensure that the `NativeAssetImage.type` is set to ImageAsset.Icon. |

##### NativeAssetData
{:.no_toc}

{: .table .table-bordered .table-striped }
| Type | Scope | Description |
|-------|--------|---------|
| Description | Optional | The content to appear with the ad. Ensure that the type is set to `DataAsset.description`. |
| ctatext | Optional | The text for the call to action button of the native ad. Ensure that the type is set to `DataAsset.ctatext`. |
| Sponsored | Optional | The sponsor (brand) of the native ad. Ensure that the type is set to `DataAsset.sponsored`. |

##### NativeAssetTitle
{:.no_toc}

{: .table .table-bordered .table-striped }
| Type | Scope | Description |
|-------|--------|---------|
| Title | Optional | The title of the native ad. |


#### Step 2: Create a GAMBannerView
{:.no_toc}

Just follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/banner) to integrate a banner ad unit.

#### Step 3: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide a `GAMRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

#### Step 4: Load an Ad
{:.no_toc}

You should now request the ad from GAM. If the `GAMRequest` contains targeting keywords the respective Prebid line item will be returned from GAM and GMA SDK will render its creative.

Be sure that you make the ad request with the same `GAMRequest` object that you passed to the `fetchDemand` method. Otherwise the ad request won't contain targeting keywords and Prebid's ad won't ever be displayed.

### In-App Native

At a high level the in app rendering process works like this:

1. The publisher configures a native ad unit.
2. PBM fetches native demand. However, instead of caching the native assets on the server, the assets are cached locally in the SDK.
3. Ad request are made to Google Ad Manager.
4. Upon receiving results from Google Ad Manager, PBM determines if any of the received items are from Prebid Server.
5. If there are Prebid ads, the cached assets are then rendered.

{% capture importantNote %}
The cached assets might expire. If this occurs the publisher will receive a notification and they will have to fetch the assets again.
{% endcapture %}

### Ad Ops Setup
{:.no_toc}

These instructions will enable you to create a creative template in either Google Ad Manager that can then be applied to native ads in your app.

1. Sign in to Google Ad Manager.
2. Create an ad unit with fluid ad size.
3. Click `Delivery` and then `Native`
4. Click `Create native ad`.
5. Click `Android & iOS app code`.
6. Name your new format.
7. Choose `ADD VARIABLE` and add the following variable names and placeholders.

{: .table .table-bordered .table-striped }
| Variable Name| Placeholder|
|--------------+------------|
| isPrebid            | [%isPrebid%]                |
| hb_cache_id_local   | [%hb_cache_id_local%]       |

Make sure to indicate that the variables are required.

8. Return to the home screen, click `Delivery > Creatives`, and create a creative with `Native Format`, choosing the template you created. In the user-defined variables you just created, set the following values:

  {: .table .table-bordered .table-striped }
| Variable Name       | Value                            |
|---------------------+----------------------------------|
| isPrebid            | 1                                |
| hb_cache_id_local   | %%PATTERN:hb_cache_id_local%%    |

9. Create Prebid line items with price priority and a display ad type that is targeting `hb_pb key-values`. Associate the creative you added in steps 4 thru 8 (making sure to choose your native format as expected creatives on the line item) to the ad unit you created in the second step.

#### Integration Example
{:.no_toc}

Prepare the set of requested assets first.

``` swift
private var nativeRequestAssets: [NativeAsset] {
    let image = NativeAssetImage(minimumWidth: 200, minimumHeight: 50, required: true)
    image.type = ImageAsset.Main

    let icon = NativeAssetImage(minimumWidth: 20, minimumHeight: 20, required: true)
    icon.type = ImageAsset.Icon

    let title = NativeAssetTitle(length: 90, required: true)
    let body = NativeAssetData(type: DataAsset.description, required: true)
    let cta = NativeAssetData(type: DataAsset.ctatext, required: true)
    let sponsored = NativeAssetData(type: DataAsset.sponsored, required: true)

    return [title, icon, image, sponsored, body, cta]
}
```

Then integrate the native style ad using GADAdLoader

``` swift
// 1. Setup NativeRequest
nativeUnit = NativeRequest(configId: storedPrebidImpression, assets: nativeRequestAssets)
nativeUnit.context = ContextType.Social
nativeUnit.placementType = PlacementType.FeedContent
nativeUnit.contextSubType = ContextSubType.Social
nativeUnit.eventtrackers = eventTrackers

// 2. Make a bid request
nativeUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
    guard let self = self else { return }

    //3. Configure and make a GAM ad request
    self.adLoader = GADAdLoader(adUnitID: gamRenderingNativeAdUnitId,rootViewController: self,
                                adTypes: [GADAdLoaderAdType.customNative], options: [])
    self.adLoader.delegate = self
    self.adLoader.load(self.gamRequest)
}

.....

// Step 4
// MARK: GADCustomNativeAdLoaderDelegate

func customNativeAdFormatIDs(for adLoader: GADAdLoader) -> [String] {
    ["11934135"]
}

func adLoader(_ adLoader: GADAdLoader, didReceive customNativeAd: GADCustomNativeAd) {
    Utils.shared.delegate = self
    Utils.shared.findNative(adObject: customNativeAd)
}

// Step 5
// MARK: - NativeAdDelegate

func nativeAdLoaded(ad: NativeAd) {
    nativeAd = ad
    titleLabel.text = ad.title
    bodyLabel.text = ad.text

    if let iconString = ad.iconUrl {
        ImageHelper.downloadImageAsync(iconString) { result in
            if case let .success(icon) = result {
                DispatchQueue.main.async {
                    self.iconView.image = icon
                }
            }
        }
    }

    if let imageString = ad.imageUrl {
        ImageHelper.downloadImageAsync(imageString) { result in
            if case let .success(image) = result {
                DispatchQueue.main.async {
                    self.mainImageView.image = image
                }
            }
        }
    }

    callToActionButton.setTitle(ad.callToAction, for: .normal)
    sponsoredLabel.text = ad.sponsoredBy

    nativeAd.registerView(view: view, clickableViews: [callToActionButton])
}

func nativeAdNotFound() {
    PrebidDemoLogger.shared.error("Native ad not found")
}

func nativeAdNotValid() {
    PrebidDemoLogger.shared.error("Native ad not valid")
}
```

##### Step 1: Create a NativeRequest
{:.no_toc}

Initialize the `NativeRequest` with properties:

* `configId` - an ID of the Stored Impression on the Prebid Server
* `assets` - the array of [NativeAsset](#step-1-Create-a-NativeRequest) objects which describes your native ad.

##### Step 2: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide a `GAMRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

##### Step 3: Configure and make a GAM ad request
{:.no_toc}

Prepare the `GADAdLoader` and run ad request as described in the GMA SDK docs for the [native ads](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/native/start).

If the `GAMRequest` contains targeting keywords the respective Prebid line item will be returned from GAM and GMA SDK will render its creative.

Be sure that you make the ad request with the same `GAMRequest` object that you passed to the `fetchDemand` method. Otherwise the ad request won't contain targeting keywords and Prebid's ad won't ever be displayed.

##### Step 4: Implement GADCustomNativeAdLoaderDelegate protocol
{:.no_toc}

In order to capture the native ad response you need to implement [GADCustomNativeAdLoaderDelegate](GADCustomNativeAdLoaderDelegate) protocol.

In the method `-adLoader:didReceiveCustomNativeAd:` you should pass the following Prebid functions:

``` swift
Utils.shared.delegate = self
Utils.shared.findNative(adObject: customNativeAd)
```

Without it the SDK won't be able to recognize the Prebid line item.

##### Step 5: Implement NativeAdDelegate
{:.no_toc}

Once the Prebid line item is recognized, the `NativeAdDelegate` will be activated. The method `nativeAdLoaded` will be invoked and provide the `NativeAd` object with a description of all ad assets that should be rendered.

## Multiformat API

Starting with version `2.1.5` Prebid SDK supports the fully multiformat ad unit. It allows to run bid requests with any combination of `banner`, `video`, and `native` formats.

The following code demonstrates the integration of multiformat ad unit.

``` swift
func createAd() {
    // 1. Setup a PrebidAdUnit
    adUnit = PrebidAdUnit(configId: configId)
    adUnit.setAutoRefreshMillis(time: 30_000)

    // 2. Setup the parameters
    let bannerParameters = BannerParameters()
    bannerParameters.api = [Signals.Api.MRAID_2]
    bannerParameters.adSizes = [adSize]

    let videoParameters = VideoParameters(mimes: ["video/mp4"])
    videoParameters.protocols = [Signals.Protocols.VAST_2_0]
    videoParameters.playbackMethod = [Signals.PlaybackMethod.AutoPlaySoundOff]
    videoParameters.placement = Signals.Placement.InBanner
    videoParameters.adSize = adSize

    let nativeParameters = NativeParameters()
    nativeParameters.assets = nativeAssets
    nativeParameters.context = ContextType.Social
    nativeParameters.placementType = PlacementType.FeedContent
    nativeParameters.contextSubType = ContextSubType.Social
    nativeParameters.eventtrackers = eventTrackers

    // 3. Configure the PrebidRequest
    let prebidRequest = PrebidRequest(bannerParameters: bannerParameters, videoParameters: videoParameters, nativeParameters: nativeParameters)

    // 4. Make a bid request
    let gamRequest = GAMRequest()
    adUnit.fetchDemand(adObject: gamRequest, request: prebidRequest) { [weak self] _ in
        guard let self = self else { return }

        // 5. Configure and make a GAM ad request
        self.adLoader = GADAdLoader(adUnitID: gamRenderingMultiformatAdUnitId, rootViewController: self,
                                    adTypes: [GADAdLoaderAdType.customNative, GADAdLoaderAdType.gamBanner], options: [])
        self.adLoader.delegate = self
        self.adLoader.load(gamRequest)
    }
}
```

To handle the banner, video and in-banner native (Native Styles) ads:

``` swift
func adLoader(_ adLoader: GADAdLoader, didReceive bannerView: GAMBannerView) {
    self.bannerView.isHidden = false
    self.nativeView.isHidden = true
    self.bannerView.backgroundColor = .clear
    self.bannerView.addSubview(bannerView)

    AdViewUtils.findPrebidCreativeSize(bannerView, success: { [weak self] size in
        bannerView.resize(GADAdSizeFromCGSize(size))

        self?.bannerView.constraints.first { $0.firstAttribute == .width }?.constant = size.width
        self?.bannerView.constraints.first { $0.firstAttribute == .height }?.constant = size.height
    }, failure: { (error) in
        PrebidDemoLogger.shared.error("Error occuring during searching for Prebid creative size: \(error)")
    })
}
```

If you use Custom Native Ads follow the [guide](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/native-banner) on how to implement processing of the ad response of the respective type. To handle the wining native ad:


``` swift
// MARK: - NativeAdDelegate

func nativeAdLoaded(ad: NativeAd) {
    nativeView.isHidden = false
    bannerView.isHidden = true

    nativeAd = ad
    titleLabel.text = ad.title
    bodyLabel.text = ad.text

    if let iconString = ad.iconUrl {
        ImageHelper.downloadImageAsync(iconString) { result in
            if case let .success(icon) = result {
                DispatchQueue.main.async {
                    self.iconView.image = icon
                }
            }
        }
    }

    if let imageString = ad.imageUrl {
        ImageHelper.downloadImageAsync(imageString) { result in
            if case let .success(image) = result {
                DispatchQueue.main.async {
                    self.mainImageView.image = image
                }
            }
        }
    }

    callToActionButton.setTitle(ad.callToAction, for: .normal)
    sponsoredLabel.text = ad.sponsoredBy

    nativeAd.registerView(view: view, clickableViews: [callToActionButton])
}
```

### Step 1: Create a PrebidAdUnit
{:.no_toc}

Initialize the `PrebidAdUnit` with the following properties:

* `configId` - an ID of the Stored Impression on the Prebid Server

### Step 2: Setup the parameters
{:.no_toc}

For each intersted ad format you should creatae a respective configuration parameter:

* [BannerParameters](#step-2-configure-banner-parameters) object.
* [VideoParameters](#step-3-configure-the-video-parameters) object.
* [NativeParameters](#nativeparameters) object

#### NativeParameters
{:.no_toc}

Using the `NativeParameters` you can customize the bid request for video ads.

##### assets
{:.no_toc}

The array of requested asset objects. Prebid SDK supports all kinds of assets according to the [IAB spec](https://iabtechlab.com/wp-content/uploads/2016/07/OpenRTB-Native-Ads-Specification-Final-1.2.pdf)  except `video`.

##### eventtrackers
{:.no_toc}

The array of requested native trackers. Prebid SDK supports inly `image` trackers according to the [IAB spec](https://iabtechlab.com/wp-content/uploads/2016/07/OpenRTB-Native-Ads-Specification-Final-1.2.pdf).

##### version
{:.no_toc}

Version of the Native Markup version in use. The default value is `1.2`

##### context
{:.no_toc}

The context in which the ad appears.

##### contextSubType
{:.no_toc}

A more detailed context in which the ad appears.

##### placementType
{:.no_toc}

The design/format/layout of the ad unit being offered.

##### placementCount
{:.no_toc}

The number of identical placements in this Layout.

##### sequence
{:.no_toc}

0 for the first ad, 1 for the second ad, and so on.

##### asseturlsupport
{:.no_toc}

Whether the supply source/impression supports returning an assetsurl instead of an asset object. 0 or the absence of the field indicates no such support.

##### durlsupport
{:.no_toc}

Whether the supply source / impression supports returning a dco url instead of an asset object. 0 or the absence of the field indicates no such support.

##### privacy
{:.no_toc}

Set to 1 when the native ad supports buyer-specific privacy notice.  Set to 0 (or field absent) when the native ad doesn’t support custom privacy links or if support is unknown.

##### ext
{:.no_toc}

This object is a placeholder that may contain custom JSON agreed to by the parties to support flexibility beyond the standard defined in this specification


### Step 3: Create PrebidRequest
{:.no_toc}

Create the instance of `PrebidRequest` initializing it with respective ad format parameters.

In addition you can set the following properties of the `PrebidRequest`.

### Step 4: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide a `GAMRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

### Step 5: Create a GAMBannerView
{:.no_toc}

Follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/banner) to integrate a banner ad unit.

### Step 6: Load an Ad
{:.no_toc}

Now you should request the ad from GAM. If the `GAMRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM and GMA SDK will render its creative.

Be sure that you make the ad request with the same `GAMRequest` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

### Step 7: Process the Ad Response
{:.no_toc}

Once an app receives a signal that an ad is loaded, you should use the method `AdViewUtils.findPrebidCreativeSize` to verify whether it is a Prebid ad and resize the ad slot respectively to the creative's properties.

## Ad Unit Configuration

Each ad unit in the original API is a subclass of the `AdUnit` class, which provides the following properties and methods for the additional configuration.

### Ad Slot

PB Ad Slot is an identifier tied to the placement the ad will be delivered in. The use case for PB Ad Slot is to pass to exchange an ID they can use to tie to reporting systems or use for data science driven model building to match with impressions sourced from alternate integrations. A common ID to pass is the ad server slot name.

``` swift
adUnit.ortb2Imp.ext.data.pbadslot = "/1111111/homepage/med-rect-2"`
```

### Autorefresh

#### setAutoRefreshMillis
{:.no_toc}

If set on a given banner the Prebid Mobile ad unit the `fetchDemand` function will be called every `periodMillis` until `stopAutoRefresh` is called. Each call to `fetchDemand` will invoke the `onComplete` function. This refresh only pertains to Prebid Mobile and not to any ad server refresh processes. It is suggested that the adServes refresh be turned off.

#### stopAutoRefresh
{:.no_toc}

Halts the auto-refresh behavior for a given Prebid Mobile ad unit. If no auto-refresh behavior has been set, `stopAutoRefresh` will be ignored.

#### resumeAutoRefresh
{:.no_toc}

Allows to resume the stopped autorefresh for the ad unit with predefined autorefresh value.

### Context Keyword

#### addContextKeyword
{:.no_toc}

Ad Unit context keywords object is a free form list of comma separated keywords about the app as defined in app.keyword in OpenRTB 2.5. The `addContextKeyword` function adds a single keyword to the ad unit.

``` swift
func addContextKeyword(_ newElement: String)
```

#### addContextKeywords
{:.no_toc}

Ad Unit context keywords object is a free form list of comma separated keywords about the app as defined in app.keyword in OpenRTB 2.5. The `addContextKeywords` function adds a multiple keyword to the ad unit.

``` swift
func addContextKeywords(_ newElements: Set<String>)
```

#### removeContextKeyword
{:.no_toc}

``` swift
func removeContextKeyword(_ element: String)
```

### clearContextKeywords
{:.no_toc}

``` swift
func clearContextKeywords()
```

### App Content

The `ContentObject` allows you to provide more details about content within the app. All properties provided to the `ContentObject` will be sent in the `app.content` field of the bid request.

``` swift
func setAppContent(_ appContent: ContentObject)

func getAppContent() -> ContentObject?

func clearAppContent()
```

### App Content Data

Using the following methods you can add `app.content.data` objects to the bid requests.

``` swift
func addAppContentData(_ dataObjects: [ContentDataObject])

func removeAppContentData(_ dataObject: ContentDataObject)

func clearAppContentData()
```

### User Data

Using the following methods you can add `user.data` objects to the bid requests.

``` swift
func getUserData() -> [PBMORTBContentData]?

func addUserData(_ userDataObjects: [PBMORTBContentData])

func removeUserData(_ userDataObject: PBMORTBContentData)

func clearUserData()
```

### Data Object

The Data object is free form data (also known as First Party Data) supplied by the publisher to provide additional targeting of the user or inventory context, used primarily for striking PMP (Private MarketPlace) deals with Advertisers. Data supplied in the data parameters are typically not sent to DSPs whereas information sent in non-data objects (i.e. `setYearOfBirth`, `setGender`, etc.) will be. Access to FPD can be limited to a supplied set of Prebid bidders via an access control list.

Data is broken up into two different data types:
* User
  * Global in scope only
* Inventory (context)
  * Global scope
  * Ad Unit grain

The first party inventory context below will apply to the specic ad unit the data object is applied to. For global user or inventory context level first party data, refer to [first party data section of the Targeting](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html#first-party-data) page.

#### addContextData
{:.no_toc}

``` swift
func addContextData(key: String, value: String)
```

**Parameters**
`key`: string containing the key for the specific data object
`value`: String containing the value for the supplied key


#### updateContextData
{:.no_toc}

```
func updateContextData(key: String, value: Set<String>)
```

**Parameters**
`key`: string containing the key for the specific data object
`value`: String containing the value for the supplied key


#### removeContextData
{:.no_toc}

``` swift
func removeContextData(forKey: String)
```

**Parameters**
`key`: string containing the key for the specific data object
`value`: String containing the value for the supplied key


#### clearContextData
{:.no_toc}

``` swift
func clearContextData()
```
