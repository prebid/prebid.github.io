To integrate an interstitial banner ad into the app you use the Prebid SDK `InterstitialAdUnit` class. It makes bid requests to Prebid Server and provides targeting keywords of the winning bid to the GMA SDK.

**Integration example(Swift):**

```swift
func createAd() {
    // 1. Create an InterstitialAdUnit using Prebid Mobile SDK
    adUnit = InterstitialAdUnit(configId: CONFIG_ID, minWidthPerc: 60, minHeightPerc: 60)
    
    // 2. Make a bid request to Prebid Server using Prebid Mobile SDK
    let gamRequest = GAMRequest()
    adUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
        DemoLogger.shared.info("Prebid demand fetch for GAM \(resultCode.name())")
        
        // 3. Load a GAM interstitial ad using Google Mobile Ads SDK
        GAMInterstitialAd.load(withAdManagerAdUnitID: AD_UNIT_ID, request: gamRequest) { ad, error in
            guard let self = self else { return }
            
            if let error = error {
                DemoLogger.shared.error("Failed to load interstitial ad with error: \(error.localizedDescription)")
            } else if let ad = ad {
                // 4. Immediately render the interstitial ad
                ad.fullScreenContentDelegate = self
                ad.present(fromRootViewController: self)
            }
        }
    }
}
```

#### Step 1: Create an Ad Unit

Initialize the Interstitial Ad Unit with properties:

- `configId` - an ID of the Ad Unit Level Stored Request on Prebid Server
- `minWidthPerc` - Optional parameter to specify the minimum width percent an ad may occupy of a device's real estate. For example, a screen width of 1170 and "minWidthperc": 60 would allow ads with widths from 702 to 1170 pixels inclusive.
- `minHeightPerc` - Optional parameter to specify the minimum height percent an ad may occupy of a device's real estate. For example, a screen height of 2532 and "minHeightPerc": 60 would allow ads with widths from 1519 to 2532 pixels inclusive.

{: .alert.alert-info :}
Here's how min size percentage work: Prebid Server takes the screen width/height and the minWidthPerc/minHeightPerc as a size range, generating a list of ad sizes from a [predefined list](https://github.com/prebid/prebid-server/blob/master/config/interstitial.go). It selects the first 10 sizes that fall within the max size and minimum percentage size. All the interstitial parameters will still be passed to the bidders, allowing them to use their own size matching algorithms if they prefer.

#### Step 2: Make the bid request

The _fetchDemand_ method makes a bid request to the Prebid Server. The `GAMRequest` object provided to this method must be the one used in the next step to make the GAM ad request.

When Prebid Server responds, Prebid SDK will set the targeting keywords of the winning bid into provided object.

#### Step 3: Load a GAM interstitial ad

After receiving a bid it's time to load the ad from GAM. If the `GAMRequest` contains targeting keywords, the respective Prebid line item may be returned from GAM, and GMA SDK will render its creative. 

#### Step 4: Render the interstitial ad

Follow the [GMA SDK guide](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/interstitial#display_the_ad) to display the interstitial ad. Note that you'll need to decide whether it's going to be rendered immediately after receiving it or rendered later in the flow of an app. Note that the example above implements an immediate render approach.