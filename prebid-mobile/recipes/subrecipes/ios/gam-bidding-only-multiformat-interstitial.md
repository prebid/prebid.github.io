---
layout: page_v2
title: iOS GAM Bidding-Only Integration - Multiformat Interstitial Banner+Video
description: iOS GAM Bidding-Only Integration - Multiformat Interstitial Banner+Video
sidebarType: 2
---

# iOS GAM Bidding-Only Integration - Multiformat Interstitial Banner+Video

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html#adunit-specific-instructions)

Integration example:

``` swift
// 1. Create an InterstitialAdUnit
adUnit = InterstitialAdUnit(configId: CONFIG_ID, minWidthPerc: 60, minHeightPerc: 70)
adUnit.adUnitConfig.adSize = CGSize(width: 1, height: 1)

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

## Step 1: Create an InterstitialAdUnit
{:.no_toc}

Initialize the InterstitialAdUnit with the following properties:

* `configId` - an ID of Stored Impression on the Prebid Server
* `minWidthPerc`: Optional parameter to specify the minimum width percent an ad may occupy of a device's real estate. Support in SDK version 1.2+
* `minHeightPrec`: Optional parameter to specify the minimum height percent an ad may occupy of a device's real estate. Support in SDK version 1.2+

{: .alert.alert-info :}
Here's how min size percentages work. If the adunit size is 1x1, Prebid Server takes the screen width/height and the minWidthPerc/minHeightPerc as a size range, generating a list of ad sizes from a [predefined list](https://github.com/prebid/prebid-server/blob/master/config/interstitial.go). It selects the first 10 sizes that fall within the max size and minimum percentage size. All the interstitial parameters will still be passed to the bidders, allowing them to use their own size matching algorithms if they prefer. If you'd prefer to just define the size list, that's ok too - just set the sizes a
nd don't define minWidthPerc/minHeightPerc.

## Step 2: Set ad formats
{:.no_toc}

For multiformat ad unit, you must set both banner and video ad formats.

## Step 3: Configure parameters
{:.no_toc}

### Banner parameters

{% include mobile/banner-params.md %}

### Video parameters

{% include mobile/video-params.md %}

## Step 4: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide a `GAMRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

## Step 5: Load a GAM interstitial ad
{:.no_toc}

You should now request the ad from GAM. If the `GAMRequest` contains targeting keywords. The respective Prebid line item will be returned from GAM and GMA SDK will render its creative.

Be sure that you make the ad request with the same `GAMRequest` object that you passed to the `fetchDemand` method. Otherwise the ad request won't contain targeting keywords and Prebid's ad won't ever be displayed.

## Step 6: Present the interstitial ad
{:.no_toc}

Follow the [GMA SDK guide](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/interstitial#display_the_ad) to display an interstitial ad right after receiving it or later in a natural pauses in the flow of an app.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK iOS integration](/prebid-mobile/pbm-api/ios/code-integration-ios.html)
- [Prebid SDK Global Parameters - iOS](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
