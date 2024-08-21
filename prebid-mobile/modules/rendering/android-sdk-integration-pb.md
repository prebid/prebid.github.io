---

layout: page_v2
title: Prebid SDK Android with a Custom Bidding Integration
description: Integration of Android Prebid SDK in a special scenario
sidebarType: 2

---

# Prebid SDK Android with a Custom Bidding Integration Method
{:.no_toc}

- TOC
{:toc}

{% include mobile/intro-custom.md platform='android' %}

## Rendering Approaches

The code implementation details depend on which rendering approach you've chosen:

- [Bidding Only](#bidding-only)
- [Prebid Rendered](#prebid-rendered)

### Bidding Only

While the default ad server for Prebid's Mobile SDK is GAM, it can be expanded to include support for 3rd party ad servers through the fetchDemand function. This function returns the Prebid Server bidder key/values (targeting keys), which can then be passed to the ad server of choice.

In this mode, the developer is responsible for the following actions:

- Call `fetchDemand()` with extended targetingDict callback
- Retrieve targeting keys from the extended fetchDemand function
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

The basic steps for these ad units you can find on the page for [GAM Bidding Only integration](/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html). The difference is that you should use  the `fetchDemand` function with the following signature:

```kotlin
public void fetchDemand(OnFetchDemandResult listener) { ... }

public interface OnFetchDemandResult {
    void onComplete(@NonNull BidInfo bidInfo);
}
```

Examples:

``` kotlin
adUnit?.fetchDemand { bidInfo ->
    if(bidInfo.getResultCode() == ResultCode.SUCCESS) {
        val keywords = bidInfo.targetingKeywords

        makeAdRequest(keywords)
    }
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

``` kotlin
val win = bidInfo.events.get(BidInfo.EVENT_WIN)
val imp = bidInfo.get(BidInfo.EVENT_IMP)
```

### Prebid Rendered

The integration and usage of the Rendering API is similar to any other ad SDK. It sends the bid requests to the Prebid Server and renders the winning bid.

![Rendering with GAM as the Primary Ad Server](/assets/images/prebid-mobile/modules/rendering/Prebid-In-App-Bidding-Overview-Pure-Prebid.png)

#### HTML Banner

Integration example:

``` kotlin
// 1. Create an Ad View
bannerView = BannerView(requireContext(), configId, adSize)
bannerView?.setBannerListener(this)

// Add view to viewContainer
viewContainer?.addView(bannerView)

// 2. Load ad
bannerView?.loadAd()
```

{% capture warning_note %}
Pay attention that the `loadAd()` should be called on the main thread.
{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

##### Step 1: Create Ad View
{:.no_toc}

Initialize the `BannerAdView` with properties:

- `configId` - an ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) on the Prebid server
- `size` - the size of the ad unit which will be used in the bid request.

##### Step 2: Load the Ad
{:.no_toc}

Call `loadAd()` and SDK will:

- make bid request to Prebid
- render the winning bid on display

#### Banner Video (non-instream)

**Banner Video** is the same as HTML banner, but you will also need to specify the `bannerView.videoPlacementType`:

``` kotlin
bannerView.videoPlacementType = PlacementType.IN_BANNER // or any other available type
```

#### Interstitials

Integration example:

``` kotlin
// 1. Create an Interstitial Ad Unit
interstitialAdUnit = InterstitialAdUnit(requireContext(), configId, minSizePercentage)
interstitialAdUnit?.setInterstitialAdUnitListener(this)

// 2. Load Ad
interstitialAdUnit?.loadAd()
// .....

// 3. Show the ad
interstitialAdUnit?.show()
```

{% capture warning_note %}
Pay attention that the `loadAd()` should be called on the main thread.
{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

The **default** ad format for interstitial is **DISPLAY**. In order to make a `multiformat bid request`, set the respective values into the `adUnitFormats` parameter.

``` kotlin
interstitialAdUnit = InterstitialAdUnit(
                        requireContext(),
                        configId,
                        EnumSet.of(AdUnitFormat.BANNER, AdUnitFormat.VIDEO))
```

##### Step 1: Create an Ad Unit
{:.no_toc}

Initialize the `InterstitialAdUnit` with properties:

- `configId` - an ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) on the Prebid server
- `minSizePercentage` - specifies the minimum width and height percent an ad may occupy of a device’s real estate.

You can also assign the listener to process ad events.

> **NOTE:** the `minSizePercentage` - plays an important role in the bidding process for display ads. If the provided space is not enough demand partners won't respond with bids.

##### Step 2: Load the Ad
{:.no_toc}

Call the `loadAd()` to make a bid request.

##### Step 3: Show the Ad when it is ready
{:.no_toc}

Wait until the ad is loaded and present it to the user in any suitable time.

``` kotlin
override fun onAdLoaded(interstitialAdUnit: InterstitialAdUnit) {
    //Ad is ready for display
}
```

#### Rewarded Video

Integration example:

``` kotlin
// 1. Create an Ad Unit
rewardedAdUnit = RewardedAdUnit(requireContext(), configId)
rewardedAdUnit?.setRewardedAdUnitListener(this)

// 2. Execute the loadAd function
rewardedAdUnit?.loadAd()

/// .......

// After the ad is loaded you can execute `show` to trigger ad display
rewardedAdUnit?.show()
```

{% capture warning_note %}
Pay attention that the `loadAd()` should be called on the main thread.
{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

##### Step 1: Create a Rewarded Ad Unit
{:.no_toc}

Create the `RewardedAdUnit` object with parameters:

- `adUnitId` - an ID of Stored Impression on the Prebid server.

##### Step 2: Load the Ad
{:.no_toc}

Call the `loadAd()` to make a bid request.

##### Step 3: Show the Ad when it is ready
{:.no_toc}

Wait until the ad is loaded and present it to the user in any suitable time.

``` kotlin
override fun onAdLoaded(rewardedAdUnit: RewardedAdUnit) {
//Ad is ready for display
}
```

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile)
- [Prebid SDK Android Integration](/prebid-mobile/pbm-api/android/code-integration-android)
- [Prebid SDK Android Global Parameters](/prebid-mobile/pbm-api/android/pbm-targeting-android)
