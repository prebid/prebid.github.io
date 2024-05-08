---

layout: page_v2
title: Video Interstitial - GAM Bidding Only
description: xxx
sidebarType: 2

---

# Video Interstitial

To integrate Video Interstitial ads into the app you should use the Prebid SDK `VideoInterstitialAdUnit` class. It makes bid requests to Prebid Server and provides targeting keywords of the winning bid to the GMA SDK.

**Integration Example:**

```swift
func createAd() {
    // 1. Create a VideoInterstitialAdUnit using Prebid Mobile SDK
    adUnit = VideoInterstitialAdUnit(configId: CONFIG_ID)
    
    // 2. Configure video parameters using Prebid Mobile SDK
    let parameters = VideoParameters()
    parameters.mimes = ["video/mp4"]
    parameters.protocols = [Signals.Protocols.VAST_2_0]
    parameters.playbackMethod = [Signals.PlaybackMethod.AutoPlaySoundOn]
    adUnit.parameters = parameters
    
    // 3. Make a bid request to Prebid Server using Prebid Mobile SDK
    let gamRequest = GAMRequest()
    adUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
        DemoLogger.shared.info("Prebid demand fetch for GAM \(resultCode.name())")
        
        // 4. Load a GAM interstitial ad using Google Mobile Ads SDK
        GAMInterstitialAd.load(withAdManagerAdUnitID: AD_UNIT_ID, request: gamRequest) { ad, error in
            guard let self = self else { return }
            if let error = error {
                DemoLogger.shared.error("Failed to load interstitial ad with error: \(error.localizedDescription)")
            } else if let ad = ad {
                // 5. Immediately render the interstitial ad
                ad.present(fromRootViewController: self)
                ad.fullScreenContentDelegate = self
            }
        }
    }
}
```

#### Step 1: Create an Ad Unit

Initialize the `VideoInterstitialAdUnit` with properties:

- `configId` - an ID of the Ad Unit Level Stored Request on Prebid Server

#### Step 2: Configure video parameters

Provide configuration properties for the video ad using the [VideoParameters](TBD) object.

#### Step 3: Make the bid request

The _fetchDemand_ method makes a bid request to the Prebid Server. The `GAMRequest` object provided to this method must be the one used in the next step to make the GAM ad request.

When Prebid Server responds, Prebid SDK will set the targeting keywords of the winning bid into provided object.

#### Step 4: Load a GAM interstitial ad

After receiving a bid it's time to load the ad from GAM. If the `GAMRequest` contains targeting keywords, the respective Prebid line item may be returned from GAM, and GMA SDK will render its creative. 

#### Step 5: Render the interstitial ad

Follow the [GMA SDK guide](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/interstitial#display_the_ad) to display the interstitial ad. Note that you'll need to decide whether it's going to be rendered immediately after receiving it or rendered later in the flow of an app. Note that the example above implements an immediate render approach.