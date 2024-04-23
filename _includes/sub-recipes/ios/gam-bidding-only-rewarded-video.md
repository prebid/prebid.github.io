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

#### Step 1: Create an Ad Unit

Initialize the `RewardedVideoAdUnit` with properties:

- `configId` - an ID of Stored Impression on Prebid Server

#### Step 2: Configure video parameters

Provide configuration properties for the video ad using the [VideoParameters](TBD) object.

#### Step 3: Make the bid request

The _fetchDemand_ method makes a bid request to the Prebid Server. The `GAMRequest` object provided to this method must be the one used in the next step to make the GAM ad request.

When Prebid Server responds, Prebid SDK will set the targeting keywords of the winning bid into provided object.

#### **Step 4: Load a GAM Rewarded Ad**

After receiving a bid it's time to load the ad from GAM. If the `GAMRequest` contains targeting keywords, the respective Prebid line item may be returned from GAM, and GMA SDK will render its creative. 

#### Step 5: Display the Rewarded Ad

Follow the [GMA SDK guide](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/rewarded#show_the_ad) to display the rewarded ad.

### Format: Video Instream

To integrate instream video ads into the app you should use the Prebid SDK `VideoAdUnit` class. It makes bid requests to Prebid Server and provides targeting keywords to the [Google IMA SDK](https://developers.google.com/interactive-media-ads/docs/sdks/ios/client-side).

**Integration Example (Swift):**

```swift
// 1. Create VideoAdUnit using Prebid Mobile SDK
adUnit = VideoAdUnit(configId: CONFIG_ID, size: CGSize(width: 1,height: 1))

// 2. Configure Video Parameters using Prebid Mobile SDK
let parameters = VideoParameters()
parameters.mimes = ["video/mp4"]
parameters.protocols = [Signals.Protocols.VAST_2_0]
parameters.playbackMethod = [Signals.PlaybackMethod.AutoPlaySoundOn]
adUnit.parameters = parameters

// 3. Prepare IMAAdsLoader
adsLoader = IMAAdsLoader(settings: nil)
adsLoader.delegate = self

// 4. Make the Prebid bid request using Prebid Mobile SDK
adUnit.fetchDemand { [weak self] (resultCode, prebidKeys: [String: String]?) in
    guard let self = self else { return }
    if resultCode == .prebidDemandFetchSuccess {
        do {
            
            // 5. Generate GAM Instream ad tag
            let adServerTag = try IMAUtils.shared.generateInstreamUriForGAM(adUnitID: GAM_AD_UNIT_ID, adSlotSizes: [.Size320x480], customKeywords: prebidKeys!)
            
            // 6. Make IMA ad request
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

```

Implement  `IMAAdsLoaderDelegate`:

```swift
// 7. ads loader delegate (Google Mobile Ads SDK)
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

```

Implement `IMAAdsManagerDelegate`:

```swift
// 8. ads manager delegate (Google Mobile Ads SDK)
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

#### Step 1: Create an Ad Unit

Initialize the Video Ad Unit with properties:

- `configId` - an ID of Stored Impression on the Prebid Server
- `size` - Width and height of the video ad unit.

#### Step 2: Configure video parameters

Provide configuration properties for the video ad using the [VideoParameters](TBD) object.

#### Step 3: Prepare IMAAdsLoader

Prepare the instream setup according to [Google's docs](https://developers.google.com/interactive-media-ads/docs/sdks/ios/client-side).

#### Step 4: Make the bid request

The _fetchDemand_ method makes a bid request to the Prebid Server. The `GAMRequest` object provided to this method must be the one used in the next step to make the GAM ad request. Later you will construct the IMA ad request using these keywords. 

#### Step 5: Generate GAM Instream ad tag

Using Prebid SDK `IMAUtils.shared.generateInstreamUriForGAM` method, generate Google IMA ad tag for downloading the cached creative from the winning bid.

#### Step 6: Invoke IMA ad request

First, create an ad display container for ad rendering. Then create an ad request with the ad tag, display container, and optional user context. Finally, call IMA with the ad request. See the [in-stream video guide](https://developers.google.com/interactive-media-ads/docs/sdks/ios/client-side#6_initialize_the_ads_loader_and_make_an_ads_request) for additional details.  

#### Step 7: Set up an ads loader delegate

On a successful load event, the `IMAAdsLoader` calls the _adsLoadedWithData_ method of its assigned delegate, passing it an instance of `IMAAdsManager`.

#### Step 8: Set up an ads manager delegate

Lastly, to manage events and state changes during the ad playback, the ads manager needs a delegate of its own. The `IMAAdManagerDelegate` has methods to handle ad events and errors, as well as methods to trigger play and pause on your video content.