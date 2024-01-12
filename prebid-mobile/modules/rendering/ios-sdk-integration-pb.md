---

layout: page_v2
title: iOS SDK Custom Bidding Integration
description: This guide covers initializing the SDK, setting up various AdUnits, running auctions, and rendering results for display, video, interstitial, and rewarded ad formats. 
sidebarType: 2

---

# iOS SDK Custom Bidding Integration
* TOC

{:toc}

## Introduction

The Prebid SDK can monetize your app with or [without](https://docs.prebid.org/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html) a custom ad server.

This article guides you on using Prebid SDK with a custom ad server. We will explore how to do the following:

1. Initializing the Prebid Mobile iOS SDK.
2. Getting the targeting keys and setting up various types of adUnits.
3. Initializing the ad auction.
4. Rendering the results.

## Initializing the iOS SDK

Before implementing the instructions in this guide, you need to ensure that you have correctly initialized the Prebid Mobile SDK in your app. You can do so using the code snippet below:

```swift
import PrebidMobile

// ...

// Initialize Prebid with ad units and other parameters
Prebid.shared.prebidServerHost = .rubicon
Prebid.shared.prebidServerAccountId = "INSERT-ACCOUNT-ID-HERE"
Prebid.shared.adServer = .dfp

// Create and add an ad unit in a single statement
Prebid.shared.add(adUnit: PBAdUnit(configId: "adunit-example"))

// Make a bid request
Prebid.shared.requestBids { resultCode in
    // Handle bid response
    if resultCode == .success {
        // Bids received successfully
        // Load your ad with the received bids
    } else {
        // Handle any errors
    }
}
```

To use the above code snippet, you will need to [setup a Prebid server.](https://docs.prebid.org/prebid-mobile/prebid-mobile-getting-started.html#set-up-prebid-server) You can either register with a [Prebid.org member that hosts Prebid Server](https://prebid.org/managed-services/) or [setup your own Prebid server.](https://docs.prebid.org/prebid-server/hosting/pbs-hosting.html)

* `Prebid.shared.prebidServerAccountId`: The `prebidServerAccountId` is used to define the "account settings" used for this app in Prebid Server, which defines attributes like timeout and price granularity.

* `Prebid.shared.adServer`: This property represents the ad server that the Prebid SDK should integrate with. It's an enum value of type `PrebidAdServer`. The possible values include `.dfp` for Google Ad Manager (formerly DoubleClick for Publishers), `.moPub` for MoPub, and others. The `adServer` property is part of the `Prebid.shared` singleton instance.

* `Prebid.shared.prebidServerHost`: If you are using a managed Prebid server service, the SDK is coded with enums containing the URLs for those services, for example `.rubicon` and `.appnexus`. If you are using other Prebid Server managed services that don't have enums linking to the URL or if you are using a self-hosted server, you should enter the URL to your server. You do so using the following format:

```swift
Prebid.shared.prebidServerHost = .custom
Prebid.shared.prebidServerCustomHostURL = "https://your-prebid-server-url.com"
```

## Obtaining Prebid server targeting keys

The default ad server for Prebid's Mobile SDK is [GAM](https://docs.prebid.org/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html#html-banner).

When using a custom or 3rd-party ad server, you must first get the targeting keys using the `fetchDemand` method. This function provides the bidder key/values (targeting keys). You can then pass these targeting keys to the ad server of your choice.

You will need to perform the following actions:

* Call `fetchDemand` with extended `targetingDict` callback.
* Retrieve the targeting keys from `fetchDemand`.
* Convert targeting keys into the format used by your ad server.
* Pass the targeting keys to your ad server.
* Render the ad with the Prebid Universal Creative or custom renderer.

This approach is available for the ad formats listed below. For detailed integration steps, click on the link corresponding to the ad format:

* [Display Banner](https://docs.prebid.org/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html#banner-api)  via `BannerAdUnit`
* [Video Banner](https://docs.prebid.org/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html#video-banner-outstream-video) and Instream Video via `VideoAdUnit`
* [Display Interstitial](https://docs.prebid.org/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html#interstitial-api) via `InterstitialAdUnit`
* [Video Interstitial](https://docs.prebid.org/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html#video-interstitial) via `InterstitialAdUnit`
* [Rewarded Video](https://docs.prebid.org/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html#rewarded-video-api) via `RewardedVideoAdUnit`
* [Native Banner](https://docs.prebid.org/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html#native-api) via `NativeAdUnit`

You will also need to use the `fetchDemand` function with the following signature:

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

* `resultCode` - the object of type `ResultCode` describing the status of the bid request.
* `targetingKeywords` - the targeting keywords of the winning bid
* `exp` - the number of seconds that may elapse between the auction and the actual impression. In this case, it indicates the approximate TTL of the bid in the Prebid Cache. Note that the actual expiration time of the bid will be less than this number due to the network and operational overhead. The Prebid SDK doesn't make any adjustments to this value.
* `nativeAdCacheId` - the local cache ID of the winning bid. Applied only to the `native` ad format.
* `events` - the map of some publically available event URLs attached to the bid. These can be used to enable Prebid Server-based analytics when the Prebid Universal Creative (PUC) is not involved in the rendering process. If the PUC is used for rendering, it will take care of hitting these events. These are the available event URLs:
  * **EVENT_WIN** - this bid was chosen by the ad server as the one to display. This is the main metric for banner and native. This returns the OpenRTB `seatbid.bid.ext.prebid.events.win` field. (requires SDK v2.1.6)
  * **EVENT_IMP** - the ad creative for this bid was actually displayed. This is often the main metric for video ads. This returns the OpenRTB `seatbid.bid.ext.prebid.events.imp` field. (requires SDK v2.1.6)

Code sample to extract the events:

``` swift
let win = bidInfo.events[BidInfo.EVENT_WIN]
let imp = bidInfo.events[BidInfo.EVENT_IMP]
```

## Initializing ad auctions and Rendering ads

![Ad Rendering Illustration](/assets/images/prebid-mobile/modules/rendering/Prebid-In-App-Bidding-Overview-Pure-Prebid.png)

After you have made an ad request(1), your ad server will run an ad auction (2) and return the winning bid(3). You will then have to render the winning ad in your app(4).

Here is how you can do this for the various ad formats. 

### Banner ads

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

#### Step 1: Create Ad View
{:.no_toc}

Initialize the `BannerView` object with these properties:

* `frame` - the frame rectangle for the view.
* `configID` - this is the ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) generated on your Prebid server.
* `adSize` - this is the size of the ad unit which will be used in the bid request and returned to your application.
* `adUnitId`- this is the value of the adunit name in the ad server. e.g. for GAM, it's the adunit name. Other ad servers may call this something different, but the idea is that the buyers want to know which slot in the app is up for auction for targeting and reporting. An example would be "/home/upper-mobile-banner".

#### Step 2: Load the Ad
{:.no_toc}

Call the `loadAd()` method which will:

* make a bid request to the Prebid Server.
* render the winning bid.

#### Outstream Video
{:.no_toc}

For **video banner ads**, you will also need to specify the ad format:

``` swift
banner.adFormat = .video
```

### Interstitial ads

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

When you create an interstitial ad in Prebid iOS SDK, it is, by default, configured to request interstitial ads in the **.banner** format.

Prebid Mobile also allows you to make multiformat bid requests. Multiformat requests allow a single ad unit to request multiple ad formats, such as **.banner**, **.video**, or others. To do this, you must specify the desired formats using the `adFormats` property.

``` swift
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

* `configID` - this is the ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) generated on your Prebid server.
* `minSizePercentage` - this specifies the minimum width and height as a percentage of the devices screen size.

> **NOTE:** minSizePercentage - plays an important role in a bidding process for banner ads. If provided space is not enough demand partners won't respond with the bids. Make sure you provide ample space.

#### Step 2: Load the Ad
{:.no_toc}

Call the `loadAd()` method, which will make a bid request to the Prebid server.

#### Step 3: Show the Ad when it is ready
{:.no_toc}

Wait until the ad is loaded, then present it to the user. 

``` swift
// MARK: InterstitialRenderingAdUnitDelegate

func interstitialDidReceiveAd(_ interstitial: InterstitialRenderingAdUnit) {
    // Now the ad is ready for display
}
```

### Rewarded ads

A Rewarded ad is a specific type of advertising unit that provides users with a reward, such as virtual currency, premium content, or other incentives, in exchange for engaging with and completing the ad experience.

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

#### Step 1: Create Rewarded Ad Unit
{:.no_toc}

Create the `RewardedAdUnit` object with the parameter:

* `configID` - this is the ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) generated on your Prebid server.

#### Step 2: Load the Ad
{:.no_toc}

Call the `loadAd()` method to make a bid request.

#### Step 3: Show the Ad when it is ready
{:.no_toc}

Wait until the ad is loaded, then present it to the user. 

``` swift
// MARK: RewardedAdUnitDelegate

func rewardedAdDidReceiveAd(_ rewardedAd: RewardedAdUnit) {
    // Now the ad is ready for display
}
```
