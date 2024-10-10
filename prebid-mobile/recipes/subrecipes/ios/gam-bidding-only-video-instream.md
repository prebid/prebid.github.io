---
layout: page_v2
title: iOS GAM Bidding-Only Integration - Instream Video
description: iOS GAM Bidding-Only Integration - Instream Video
sidebarType: 2
---

# iOS GAM Bidding-Only Integration - Instream Video

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html#adunit-specific-instructions)

Ads within video content are often called 'in-stream' video ads. See the [IAB's format guidelines](https://iabtechlab.com/standards/iab-digital-video-in-stream-ad-format-guidelines/) for more information and the precise definition.

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

## Step 1: Create an InstreamVideoAdUnit
{:.no_toc}

Initialize the Instream Video Ad Unit with properties:

- `configId` - an ID of Stored Impression on the Prebid Server
- `size` - Width and height of the video ad unit.

## Step 2: Configure video parameters
{:.no_toc}

Provide configuration properties for the video ad using the VideoParameters object.

{% include mobile/video-params.md %}

## Step 3: Prepare IMAAdsLoader
{:.no_toc}

Prepare the in-stream setup according to the [Google's docs](https://developers.google.com/interactive-media-ads/docs/sdks/ios/client-side).

## Step 4: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should use the version of the `fetchDemand` which returns the targeting keywords in the callback. Later you will construct the IMA ad request using these keywords.

## Step 5: Generate GAM Instream URI
{:.no_toc}

Using Prebid util method, generate Google IMA URI for downloading the cached creative from the winning bid.

## Step 6: Load IMA ad request
{:.no_toc}

Create an ad display container for ad rendering. Then create an ad request with our ad tag, display container, and optional user context. Load the ad. Follow the [in-stream video guide](https://developers.google.com/interactive-media-ads/docs/sdks/ios/client-side#6_initialize_the_ads_loader_and_make_an_ads_request) for additional details.

## Step 7: Set up an ads loader delegate
{:.no_toc}

On a successful load event, the `IMAAdsLoader` calls the adsLoadedWithData method of its assigned delegate, passing it an instance of `IMAAdsManager`. You can then initialize the ads manager, which loads the individual ads as defined by the response to the ad tag URL.

## Step 8: Set up an ads manager delegate
{:.no_toc}

Lastly, to manage events and state changes, the ads manager needs a delegate of its own. The `IMAAdManagerDelegate` has methods to handle ad events and errors, as well as methods to trigger play and pause on your video content.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK iOS integration](/prebid-mobile/pbm-api/ios/code-integration-ios.html)
- [Prebid SDK Global Parameters - iOS](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
