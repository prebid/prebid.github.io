---

layout: page_v2
title: Multiformat Interstitial (HTML + Video) - GAM Bidding Only
description: 
sidebarType: 2

---

# Multiformat Interstitial (HTML + Video)

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
>
> PBS will take the AdUnit's size (width and height) as the max size for the interstitial as size, generating a list of ad sizes, selecting the first 10 sizes that fall within the imp's max size and minimum percentage size. All the interstitial parameters will still be passed to the bidders, allowing them to use their own size matching algorithms if they prefer.
>
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