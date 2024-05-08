---

layout: page_v2
title: Multiformat (banner+video) - GAM Bidding Only
description: xxx
sidebarType: 2

---

# Multiformat (banner+video)

This section describes integration of an AdUnit that can display both banner and video creatives.

To integrate video banner ads into the app you need to use the `VideoAdUnit` class. It is dedicated to configure and make bid requests to Prebid Server and provide targeting keywords of the winning bid to the GMA SDK.

**Integration Example (Swift):**

```swift
// 1. Create a BannerAdUnit using Prebid Mobile SDK
adUnit = BannerAdUnit(configId: CONFIG_ID, size: adSize)
adUnit.setAutoRefreshMillis(time: 30000)

// 2. Set adFormats (Prebid Mobile SDK)
adUnit.adFormats = [.banner, .video]

// 3. Configure banner parameters (Prebid Mobile SDK)
let bannerParameters = BannerParameters()
bannerParameters.api = [Signals.Api.MRAID_2]
adUnit.bannerParameters = bannerParameters

// 4. Configure video parameters (Prebid Mobile SDK)
let videoParameters = VideoParameters(mimes: ["video/mp4"])
videoParameters.protocols = [Signals.Protocols.VAST_2_0]
videoParameters.playbackMethod = [Signals.PlaybackMethod.AutoPlaySoundOff]
videoParameters.placement = Signals.Placement.InBanner
adUnit.videoParameters = videoParameters

// 5. Create a GAMBannerView using Google Mobile Ads SDK
gamBanner = GAMBannerView(adSize: GADAdSizeFromCGSize(adSize))
gamBanner.adUnitID = gamAdUnitMultiformatBannerOriginal
gamBanner.rootViewController = self
gamBanner.delegate = self

// Add GMA SDK banner view to the app UI
bannerView?.addSubview(gamBanner)

// 6. Make a bid request to Prebid Server using Prebid Mobile SDK
let gamRequest = GAMRequest()
adUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
    PrebidDemoLogger.shared.info("Prebid demand fetch for GAM \(resultCode.name())")

    // 7. Load GAM Ad using Google Mobile Ads SDK
    self?.gamBanner.load(gamRequest)
}
```

Implement GADBannerViewDelegate:

```swift
func bannerViewDidReceiveAd(_ bannerView: GADBannerView) {
    // 8. Resize ad view if needed (Prebid Mobile SDK)
    AdViewUtils.findPrebidCreativeSize(bannerView, success: { size in
        guard let bannerView = bannerView as? GAMBannerView else { return }
        bannerView.resize(GADAdSizeFromCGSize(size))
    }, failure: { (error) in
        PrebidDemoLogger.shared.error("Error occuring during searching for Prebid creative size: \(error)")
    })
}
```

#### Step 1: Create a BannerAdUnit

Initialize the `BannerAdUnit` with properties:

- `configId` - an ID of the Ad Unit Level Stored Request on Prebid Server
- `adSize` - the size of the ad unit which will be used in the bid request.

#### Step 2: Set ad formats

For multiformat ad unit, you must set both banner and video ad formats.

#### Step 3: Configure banner parameters

Provide configuration properties for the banner ad using the BannerParameters object.

#### Step 4: Configure video parameters

Using the `VideoParameters` you can customize the bid request for `VideoAdUnit`. 

##### plcmt and/or placement
{:.no_toc}

The [OpenRTB 2.6](https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/main/2.6.md) protocol defines the `plcmt` and `placement` (deprecated) as an integer array. You may use an enum for easier readability: 

- **1** or **InStream** : In-Stream Played before, during or after the streaming video content that the consumer has requested (e.g., Pre-roll, Mid-roll, Post-roll).
- **2** or **InBanner** : In-Banner placement exists within a web banner that leverages the banner space to deliver a video experience as opposed to another static or rich media format. The format relies on the existence of display ad inventory on the page for its delivery.
- **3** or **InArticle** : In-Article placement loads and plays dynamically between paragraphs of editorial content; existing as a standalone branded message.
- **4** or **InFeed** : In-Feed placement is found in content, social, or product feeds.
- **5** or **Slider**, **Floating** or **Interstitial**: Open RTB supports one of three values for option 5 as either Slider, Floating or Interstitial. If an enum value is supplied in placement, bidders will receive value 5 for placement type and assume to be interstitial with the instl flag set to 1.

##### api
{:.no_toc}

The _api_ property may be used to add values for which API Frameworks may be used in the bid response as defined in [OpenRTB 2.6](https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/main/2.6.md). The supported values for GMA SDK integration are:

- **5** or **Signals.Api.MRAID_2** : MRAID-2 support signal
- **7** or **Signals.Api.OMID_1**  : signals OMSDK support

##### maxBitrate
{:.no_toc}

Integer representing the OpenRTB 2.6 maximum bit rate in Kbps.

##### minBitrate
{:.no_toc}

Integer representing the OpenRTB 2.6 minimum bit rate in Kbps.

##### maxDuration
{:.no_toc}

Integer representing the OpenRTB 2.6 maximum video ad duration in seconds.

##### minDuration
{:.no_toc}

Integer representing the OpenRTB 2.6 minimum video ad duration in seconds.

##### mimes
{:.no_toc}

Array of strings representing the supported OpenRTB 2.6 content MIME types (e.g., “video/x-ms-wmv”, “video/mp4”).

##### playbackMethod
{:.no_toc}

Array of OpenRTB 2.6 playback methods. If none are specified, any method may be used. Only one method is typically used in practice. It is advised to use only the first element of the array. 

- **1** or **Signals.PlaybackMethod.AutoPlaySoundOn** : Initiates on Page Load with Sound On
- **2** or **Signals.PlaybackMethod.AutoPlaySoundOff** : Initiates on Page Load with Sound Off by Default
- **3** or **Signals.PlaybackMethod.ClickToPlay** : Initiates on Click with Sound On
- **4** or **Signals.PlaybackMethod.MouseOver** : Initiates on Mouse-Over with Sound On
- **5** or **Signals.PlaybackMethod.EnterSoundOn** : Initiates on Entering Viewport with Sound On
- **6** or **Signals.PlaybackMethod.EnterSoundOff**: Initiates on Entering Viewport with Sound Off by Default

##### protocols
{:.no_toc}

Array or enum of OpenRTB 2.6 supported Protocols. GMA SDK supports all VAST versions, but not all VAST features ([details](https://developers.google.com/interactive-media-ads/docs/sdks/ios/client-side/compatibility)). So the set of protocols mostly depends on the demand partner supported formats and expected values in the request. Developers can add the following values to the request:   

- **1** or **Signals.Protocols.VAST_1_0** : VAST 1.0
- **2** or **Signals.Protocols.VAST_2_0** : VAST 2.0
- **3** or **Signals.Protocols.VAST_3_0** : VAST 3.0
- **4** or **Signals.Protocols.VAST_1_0_Wrapper** : VAST 1.0 Wrapper
- **5** or **Signals.Protocols.VAST_2_0_Wrapper** : VAST 2.0 Wrapper
- **6** or **Signals.Protocols.VAST_3_0_Wrapper** : VAST 3.0 Wrapper
- **7** or **Signals.Protocols.VAST_4_0** : VAST 4.0
- **8** or **Signals.Protocols.VAST_4_0_Wrapper** : VAST 4.0 Wrapper

#### Step 5: Create a GAMBannerView

Follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/banner) to integrate the banner ad unit. 

#### Step 6: Make the bid request

The _fetchDemand_ method makes a bid request to the Prebid Server. The `GAMRequest` object provided to this method must be the one used in the next step to make the GAM ad request.

When Prebid Server responds, Prebid SDK will set the targeting keywords of the winning bid into provided object.

#### Step 7: Call the ad server

Next, request the ad from GAM. If the `GAMRequest` object contains targeting keywords, the respective Prebid line item may be returned from GAM, and GMA SDK will render its creative. 

Ensure that you call the _load_ method with the same `GAMRequest` object that you passed to the _fetchDemand_ method on the previous step. Otherwise, the ad request won't contain targeting keywords, and Prebid bids won't be displayed.

#### Step 8: Adjust the ad view size

Once an app receives a signal that an ad is loaded, you should use the method AdViewUtils.findPrebidCreativeSize to verify whether it is a Prebid ad and resize the ad slot respectively to the creative’s properties.