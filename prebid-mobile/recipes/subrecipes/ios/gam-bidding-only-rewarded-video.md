---
layout: page_v2
title: iOS GAM Bidding-Only Integration - Rewarded Video
description: iOS GAM Bidding-Only Integration - Rewarded Video
sidebarType: 2
---

# iOS GAM Bidding-Only Integration - Rewarded Video

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html#adunit-specific-instructions)

To integrate Rewarded Video ads into the app you should use the Prebid SDK `RewardedVideoAdUnit` class. It makes bid requests to Prebid Server and provides targeting keywords of the winning bid to the GMA SDK.

**Integration Example**

```swift
func createAd() {
    // 1. Create a RewardedVideoAdUnit using Prebid Mobile SDK
    adUnit = RewardedVideoAdUnit(configId: CONFIG_ID)
    
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
        
        // 4. Load the GAM rewarded ad using Google Mobile Ads SDK
        GADRewardedAd.load(withAdUnitID: AD_UNIT_ID, request: gamRequest) { [weak self] ad, error in
            guard let self = self else { return }
            if let error = error {
                DemoLogger.shared.error("Failed to load rewarded ad with error: \(error.localizedDescription)")
            } else if let ad = ad {
                // 5. Present the rewarded ad
                ad.fullScreenContentDelegate = self
                ad.present(fromRootViewController: self, userDidEarnRewardHandler: {
                    _ = ad.adReward
                })
            }
        }
    }
}
```

## Step 1: Create an Ad Unit

Initialize the `RewardedVideoAdUnit` with properties:

- `configId` - an ID of Stored Impression on Prebid Server

## Step 2: Configure video parameters

{% include mobile/video-params.md %}

## Step 3: Make the bid request

The _fetchDemand_ method makes a bid request to the Prebid Server. The `GAMRequest` object provided to this method must be the one used in the next step to make the GAM ad request.

When Prebid Server responds, Prebid SDK will set the targeting keywords of the winning bid into provided object.

## **Step 4: Load a GAM Rewarded Ad**

After receiving a bid it's time to load the ad from GAM. If the `GAMRequest` contains targeting keywords, the respective Prebid line item may be returned from GAM, and GMA SDK will render its creative. 

## Step 5: Display the Rewarded Ad

Follow the [GMA SDK guide](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/rewarded#show_the_ad) to display the rewarded ad.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK iOS integration](/prebid-mobile/pbm-api/ios/code-integration-ios.html)
- [Prebid SDK Global Parameters - iOS](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
