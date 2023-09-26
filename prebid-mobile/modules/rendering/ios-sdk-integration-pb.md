---

layout: page_v2
title: Custom or No mediation
description: Integration of Prebid SDK without Primary Ad Server SDK
sidebarType: 2

---

# Custom Bidding Integration
{:.no_toc}

You can use Prebid SDK to monetize your app with a custom ad server or even without it. Use the `Transport API` to obtain the targeting keywords for following usage with the custom ad server. Use the `Rendering API` to display the winning bid without primary ad server and its SDK.

* TOC
{:toc}

## Transport API

The default ad server for Prebid's Mobile SDK is GAM. The SDK can be expanded to include support for 3rd party ad servers through the fetchDemand function. This function returns additional bid information like Prebid Server bidder key/values (targeting keys), which can then be passed to the ad server of choice. 

In this mode, the publisher will be responsible for the following actions:

* Call the `fetchDemand` method with specific callback
* Retrieve targeting keys from the `BidInfo` callback parameter
* Convert targeting keys into the format for your ad server
* Pass converted keys to your ad server
* Render ad with Prebid Universal Creative or custom renderer

This approach is available for the following ad formats:

* Display Banner via `BannerAdUnit`
* Video Banner and Instream Video via `VideoAdUnit`
* Display Interstitial via `InterstitialAdUnit`
* Video Interstitial via `VideoInterstitialAdUnit`
* Rewarded Video via `RewardedVideoAdUnit`
* Native Styles via `NativeRequest`
* Multiformat ad unit via `PrebidAdUnit`

The basic integration steps for these ad units you can find at the page for integration using [Original API](/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html). The diference is that you should use  the `fetchDemand` function with following signature:

```swift
public func fetchDemand(adObject: AnyObject, request: PrebidRequest,
                      completion: @escaping (BidInfo) -> Void)
```

Examples:

```swift
adUnit.fetchDemand(adObject: gamRequest, request: prebidRequest) { [weak self] bidInfo in
    guard let self = self else { return }
    
        //Publisher should provide support for converting keys into format of 3rd party ad server and loading ads
    let keywords = convertDictToAdServerKeywords(dict: bidInfo.targetingKeywords)
    AdServerLoadAds.loadAd(withAdUnitID: "46d2ebb3ccd340b38580b5d3581c6434", keywords: keywords)
}
```

The `BidInfo` provides the following properties: 

- `resultCode` - the object of type `ResultCode` describing the status of the bid request.
- `targetingKeywords` - the targeting keywords of the winning bid
- `exp` - the number of seconds that may elapse between the auction and the actual impression. In this case, it indicates the approximate TTL of the bid in the Prebid Cache. Note that the actual expiration time of the bid will be less than this number due to the network and operational overhead. The Prebid SDK doesn't make any adjustments to this value.
- `nativeAdCacheId` - the local cache ID of the winning bid. Applied only to the `native` ad format.

## Rendering API

The Rendering API integration and usage are similar to any other Ad SDK. In this case, Prebid SDK sends the bid requests to the Prebid Server and renders the winning bid. 

![In-App Bidding with Prebid](/assets/images/prebid-mobile/modules/rendering/Prebid-In-App-Bidding-Overview-Pure-Prebid.png)

### Banner API

Integration example:

```swift
// 1. Create an Ad View
let banner = BannerView(frame: CGRect(origin: .zero, size: adSize),
                        configID: CONFIG_ID,
                        adSize: adSize)
    
banner.delegate = self
    
// 2. Load an Ad
banner.loadAd()
```

#### Step 1: Create Ad View
{:.no_toc}

Initialize the `BannerAdView` with properties:

- `frame` - the frame rectangle for the view
- `configID` - an ID of the Stored Impression on the Prebid Server
- `size` - the size of the ad unit which will be used in the bid request.

#### Step 2: Load the Ad
{:.no_toc}

Call the method `loadAd()` which will:

- make a bid request to the Prebid Server.
- render the winning bid on display.

#### Outstream Video
{:.no_toc}

For **Banner Video** you also need to specify the ad format:

```swift
banner.adFormat = .video
```

### Interstitial API

Integration example:

```swift
// 1. Create an Interstitial Ad Unit
interstitial = InterstitialRenderingAdUnit(configID: CONFIG_ID,
                                  minSizePercentage: CGSize(width: 30, height: 30))
    
interstitial.delegate = self
    
// 2. Load an Ad
interstitial.loadAd()

// .....

// 3. Show An Ad
if interstitial.isReady {
    interstitial.show(from: self)
}

```

The **default** ad format for interstitial is **.banner**. In order to make a `multiformat bid request`, set the respective values into the `adFormats` property.

```swift
// Make bid request for video ad                                     
adUnit?.adFormats = [.video]

// Make bid request for both video and banner ads                                     
adUnit?.adFormats = [.video, .banner]

// Make bid request for banner ad (default behaviour)                                     
adUnit?.adFormats = [.banner]

```

#### Step 1: Create an Ad Unit
{:.no_toc}

Initialize the Interstitial Ad Unit with properties:
    
- `configID` - an ID of Stored Impression on the Prebid Server
- `minSizePercentage` - specifies the minimum width and height percent an ad may occupy of a device’s real estate.

> **NOTE:** minSizePercentage - plays an important role in a bidding process for banner ads. If provided space is not enough demand partners won't respond with the bids.

#### Step 2: Load the Ad
{:.no_toc}

Call the method `loadAd()` which will make a bid request to Prebid server.

#### Step 3: Show the Ad when it is ready
{:.no_toc}

Wait until the ad will be loaded and present it to the user in any suitable time.

```swift
// MARK: InterstitialRenderingAdUnitDelegate
    
func interstitialDidReceiveAd(_ interstitial: InterstitialRenderingAdUnit) {
    // Now the ad is ready for display
}
```

### Rewarded API

Integration example:

```swift
// 1. Create an Ad Unit
rewardedAd = RewardedAdUnit(configID: CONFIG_ID)
rewardedAd.delegate = self
    
// 2. Load an Ad
rewardedAd.loadAd()

/// .......

// 3. Display the Ad
if rewardedAd.isReady {
    rewardedAd.show(from: self)
}
```


#### Step 1: Create Rewarded Ad Unit
{:.no_toc}

Create the `RewardedAdUnit` object with parameter:

- `configID` - an ID of Stored Impression on the Prebid Server

#### Step 2: Load the Ad
{:.no_toc}

Call the `loadAd()` method which will make a bid request to Prebid server.

#### Step 3: Show the Ad when it is ready
{:.no_toc}

Wait until the ad will be loaded and present it to the user in any suitable time.

```swift
// MARK: RewardedAdUnitDelegate
    
func rewardedAdDidReceiveAd(_ rewardedAd: RewardedAdUnit) {
    // Now the ad is ready for display
}   
```
