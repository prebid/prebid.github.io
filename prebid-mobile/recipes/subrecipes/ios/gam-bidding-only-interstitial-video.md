---
layout: page_v2
title: iOS GAM Bidding-Only Integration - Interstitial Video
description: iOS GAM Bidding-Only Integration - Interstitial Video
sidebarType: 2
---

# iOS GAM Bidding-Only Integration - Interstitial Video

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html#adunit-specific-instructions)

To integrate Video Interstitial ads into the app you should use the Prebid SDK `InterstitialAdUnit` class. It makes bid requests to Prebid Server and provides targeting keywords of the winning bid to the GMA SDK.

**Integration example(Swift):**

{% capture gma12 %}func createAd() {
    // 1. Create an InterstitialAdUnit
    adUnit = InterstitialAdUnit(configId: CONFIG_ID)
    
    // 2. Set ad format
    adUnit.adFormats = [.video]
    
    // 3. Configure video parameters
    let parameters = VideoParameters(mimes: ["video/mp4"])        
    parameters.protocols = [Signals.Protocols.VAST_2_0]
    parameters.playbackMethod = [Signals.PlaybackMethod.AutoPlaySoundOff]
    adUnit.videoParameters = parameters
    
    // 4. Make a bid request to Prebid Server
    let gamRequest = AdManagerRequest()
    adUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
        PrebidDemoLogger.shared.info("Prebid demand fetch for GAM \(resultCode.name())")
        
        // 5. Load a GAM interstitial ad
        AdManagerInterstitialAd.load(
            with: AD_UNIT_ID,
            request: gamRequest
        ) { ad, error in
            guard let self = self else { return }
            if let error = error {
                PrebidDemoLogger.shared.error("Failed to load interstitial ad with error: \(error.localizedDescription)")
            } else if let ad = ad {
                // 6. Present the interstitial ad
                ad.present(from: self)
                ad.fullScreenContentDelegate = self
            }
        }
    }
}
{% endcapture %}
{% capture gma11 %}func createAd() {
    // 1. Create a InterstitialAdUnit using Prebid Mobile SDK
    adUnit = InterstitialAdUnit(configId: CONFIG_ID)

    // 2. Set ad format
    adUnit.adFormats = [.video]
    
    // 3. Configure video parameters using Prebid Mobile SDK
    let parameters = VideoParameters()
    parameters.mimes = ["video/mp4"]
    parameters.protocols = [Signals.Protocols.VAST_2_0]
    parameters.playbackMethod = [Signals.PlaybackMethod.AutoPlaySoundOn]
    adUnit.bannerParameters = parameters
    
    // 4. Make a bid request to Prebid Server using Prebid Mobile SDK
    let gamRequest = GAMRequest()
    adUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
        DemoLogger.shared.info("Prebid demand fetch for GAM \(resultCode.name())")
        
        // 5. Load a GAM interstitial ad using Google Mobile Ads SDK
        GAMInterstitialAd.load(withAdManagerAdUnitID: AD_UNIT_ID, request: gamRequest) { ad, error in
            guard let self = self else { return }
            if let error = error {
                DemoLogger.shared.error("Failed to load interstitial ad with error: \(error.localizedDescription)")
            } else if let ad = ad {
                // 6. Immediately render the interstitial ad
                ad.present(fromRootViewController: self)
                ad.fullScreenContentDelegate = self
            }
        }
    }
}
{% endcapture %}

{% include code/gma-versions-tabs.html id="interstitial-video" gma11=gma11 gma12=gma12 %}

## Step 1: Create an Ad Unit

Initialize the `InterstitialAdUnit` with properties:

- `configId` - an ID of the Ad Unit Level Stored Request on Prebid Server

## Step 2: Set the ad format

Set the desired ad formats using `adFormats` property.

## Step 3: Configure video parameters

{% include mobile/video-params.md %}

## Step 4: Make the bid request

The _fetchDemand_ method makes a bid request to the Prebid Server. The `AdManagerRequest` object provided to this method must be the one used in the next step to make the GAM ad request.

When Prebid Server responds, Prebid SDK will set the targeting keywords of the winning bid into provided object.

## Step 5: Load a GAM interstitial ad

After receiving a bid it's time to load the ad from GAM. If the `AdManagerRequest` contains targeting keywords, the respective Prebid line item may be returned from GAM, and GMA SDK will render its creative. 

## Step 6: Render the interstitial ad

Follow the [GMA SDK guide](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/interstitial#display_the_ad) to display the interstitial ad. Note that you'll need to decide whether it's going to be rendered immediately after receiving it or rendered later in the flow of an app. Note that the example above implements an immediate render approach.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK iOS integration](/prebid-mobile/pbm-api/ios/code-integration-ios.html)
- [Prebid SDK Global Parameters - iOS](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
