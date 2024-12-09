---

layout: page_v2
title: Prebid SDK iOS with a Custom Bidding Integration
description: Integration of iOS Prebid SDK in a special scenario
sidebarType: 2

---

# Prebid SDK iOS with a Custom Bidding Integration Method
{:.no_toc}

- TOC
{:toc}

{% include mobile/intro-custom.md platform='ios' %}

## Rendering Approaches

The code implementation details depend on which rendering approach you've chosen:

- [Bidding Only](#bidding-only)
- [Prebid Rendered](#prebid-rendered)

### Bidding Only

While the default ad server for Prebid's Mobile SDK is GAM, it can be expanded to include support for 3rd party ad servers through the fetchDemand function. This function returns the Prebid Server bidder key/values (targeting keys), which can then be passed to the ad server of choice.

In this mode, the developer is responsible for the following actions:

- Call the `fetchDemand()` method with specific callback
- Retrieve targeting keys from the `BidInfo` callback parameter
- Convert targeting keys into the format for your ad server
- Pass converted keys to your ad server
- Render ad with Prebid Universal Creative or custom renderer

This approach is available for the following ad formats:

- Display Banner via `BannerAdUnit`
- Video Banner and Instream Video via `VideoAdUnit`
- Display Interstitial via `InterstitialAdUnit`
- Video Interstitial via `VideoInterstitialAdUnit`
- Rewarded Video via `RewardedVideoAdUnit`
- Native Styles via `NativeRequest`
- Multiformat ad unit via `PrebidAdUnit`

The basic steps for these ad units you can find at the page for [GAM Bidding Only integration](/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html). The diference is that you should use  the `fetchDemand` function with following signature:

``` swift
public func fetchDemand(adObject: AnyObject, request: PrebidRequest,
                      completion: @escaping (BidInfo) -> Void)
```

Examples:

``` swift
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
- `events` - the map of some publically available event URLs attached to the bid. These can be used to enable Prebid Server-based analytics when the Prebid Universal Creative (PUC) is not involved in the rendering process. If the PUC is used for rendering, it will take care of hitting these events. These are the available event URLs:
  - **EVENT_WIN** - this bid was chosen by the ad server as the one to display. This is the main metric for banner and native. This returns the OpenRTB `seatbid.bid.ext.prebid.events.win` field. (requires SDK v2.1.6)
  - **EVENT_IMP** - the ad creative for this bid was actually displayed. This is often the main metric for video ads. This returns the OpenRTB `seatbid.bid.ext.prebid.events.imp` field. (requires SDK v2.1.6)

Code sample to extract the events:

``` swift
let win = bidInfo.events[BidInfo.EVENT_WIN]
let imp = bidInfo.events[BidInfo.EVENT_IMP]
```

### Prebid Rendered

The Rendering API integration and usage are similar to any other ad SDK. In this case, Prebid SDK sends the bid requests to the Prebid Server and renders the winning bid.

![In-App Bidding with Prebid](/assets/images/prebid-mobile/modules/rendering/Prebid-In-App-Bidding-Overview-Pure-Prebid.png)

#### HTML Banner

Integration example:

``` swift
// 1. Create an Ad View
let banner = BannerView(frame: CGRect(origin: .zero, size: adSize),
                        configID: CONFIG_ID,
                        adSize: adSize)

banner.delegate = self

// 2. Load an Ad
banner.loadAd()
```

##### Step 1: Create Ad View
{:.no_toc}

Initialize the `BannerAdView` with properties:

- `frame` - the frame rectangle for the view
- `configID` - an ID of the Stored Impression on the Prebid Server
- `size` - the size of the ad unit which will be used in the bid request.

##### Step 2: Load the Ad
{:.no_toc}

Call the method `loadAd()` which will:

- make a bid request to the Prebid Server.
- render the winning bid on display.

#### Banner Video (non-instream)

**Banner Video** is the same as HTML banner, but you also need to specify the ad format:

``` swift
banner.adFormat = .video
```

#### Interstitials

Integration example:

``` swift
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

``` swift
// Make bid request for video ad
adUnit?.adFormats = [.video]

// Make bid request for both video and banner ads
adUnit?.adFormats = [.video, .banner]

// Make bid request for banner ad (default behaviour)
adUnit?.adFormats = [.banner]

```

##### Step 1: Create an Ad Unit
{:.no_toc}

Initialize the Interstitial Ad Unit with properties:

- `configID` - an ID of Stored Impression on the Prebid Server
- `minSizePercentage` - specifies the minimum width and height percent an ad may occupy of a device’s real estate.

> **NOTE:** minSizePercentage - plays an important role in a bidding process for banner ads. If provided space is not enough demand partners won't respond with the bids.

##### Step 2: Load the Ad
{:.no_toc}

Call the method `loadAd()` which will make a bid request to Prebid server.

##### Step 3: Show the Ad when it is ready
{:.no_toc}

Wait until the ad will be loaded and present it to the user in any suitable time.

``` swift
// MARK: InterstitialRenderingAdUnitDelegate

func interstitialDidReceiveAd(_ interstitial: InterstitialRenderingAdUnit) {
    // Now the ad is ready for display
}
```

#### Rewarded Video

Integration example:

``` swift
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

##### Step 1: Create Rewarded Ad Unit
{:.no_toc}

Create the `RewardedAdUnit` object with parameter:

- `configID` - an ID of Stored Impression on the Prebid Server

##### Step 2: Load the Ad
{:.no_toc}

Call the `loadAd()` method which will make a bid request to Prebid server.

##### Step 3: Show the Ad when it is ready
{:.no_toc}

Wait until the ad will be loaded and present it to the user in any suitable time.

``` swift
// MARK: RewardedAdUnitDelegate

func rewardedAdDidReceiveAd(_ rewardedAd: RewardedAdUnit) {
    // Now the ad is ready for display
}
```

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile)
- [Prebid SDK iOS Integration](/prebid-mobile/pbm-api/ios/code-integration-ios)
- [Prebid SDK iOS Global Parameters](/prebid-mobile/pbm-api/ios/pbm-targeting-ios)
