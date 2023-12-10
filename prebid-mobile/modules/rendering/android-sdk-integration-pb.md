---

layout: page_v2
title: Custom or No mediation
description: How to integrate the Prebid SDK without a primary Ad Server
sidebarType: 2

---



# Custom Bidding Integration
{:.no_toc}

## Before you start

Before implementing the instructions in this guide, you need to ensure that you have correctly initialized the Prebid Mobile SDK in your app. The initialization method has the following pattern:

```java
Prebid.init(context, adUnit, accountID, adServer, host);
```

To use the above code snippet, you will need to [setup a Prebid server.](https://docs.prebid.org/prebid-mobile/prebid-mobile-getting-started.html#set-up-prebid-server) You can either register with a [Prebid.org member that hosts Prebid Server](https://prebid.org/managed-services/) or [setup your own Prebid server.](https://docs.prebid.org/prebid-server/hosting/pbs-hosting.html)


* `context`: This parameter represents the Context of the Android application. It is typically obtained using `getApplicationContext()` or `this` (if called from within an Activity). The Context is essential for the SDK to interact with the Android environment.

* `adUnitId`: This is an arbitrary descriptor for the ad. You might use it as a descriptive name in targeting or for reporting.  For example you might name it "account details screen ad" or "home page ad name."

* `accountId`: The `accountId` you use to initialize the Prebid Mobile SDK is the unique identifier your Prebid Server provider assigned to you. This links requests from your app to server-side settings such as timeout, price granularity, and others.

* `adServer`: This parameter specifies the ad server you are using. It is an enum value of the type `Prebid.AdServer`. The possible values include `Prebid.AdServer.DFP` for Google Ad Manager and `Prebid.AdServer.MOPub` for MoPub.

* `host`: If you are using a managed Prebid server service, the SDK is coded with enums containing the URLs for those services, for example `Prebid.Host.RUBICON` and `Prebid.Host.APPNEXUS`. Other Prebid Server managed services exist that don't have enums linking to the URL. You can work with them by entering the appropriate URL. If you are using a self-hosted server, you should enter the URL to your server.

Here is a working example:

```java
Prebid.init(getApplicationContext(), adUnits, "INSERT-ACCOUNT-ID-HERE", Prebid.AdServer.DFP, Prebid.Host.RUBICON);
```

You can use Prebid SDK to monetize your app with a custom ad server or even without one. Use the `Transport API` to obtain the targeting keywords for following usage with the custom ad server. Use the `Rendering API` to display the winning bid without the primary ad server and its SDK.

* TOC
{:toc}

## Transport API

The default ad server for Prebid's Mobile SDK is GAM. The SDK can be expanded to include support for 3rd party ad servers through the [`fetchDemand`](https://docs.prebid.org/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html#html-banner) function. This function returns the Prebid Server bidder key/values (targeting keys), which can then be passed to the ad server of choice.

In this mode, the publisher will be responsible for the following actions:

* Call `fetchDemand` with extended `targetingDict` callback
* Retrieve targeting keys from the extended `fetchDemand` function
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

The basic integration steps for these ad units you can find on the page for integration using [Original API](/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html). The difference is that you should use  the `fetchDemand` function with the following signature:

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

* `resultCode` - the object of type `ResultCode` describing the status of the bid request.
* `targetingKeywords` - the targeting keywords of the winning bid
* `exp` - the number of seconds that may elapse between the auction and the actual impression. In this case, it indicates the approximate TTL of the bid in the Prebid Cache. Note that the actual expiration time of the bid will be less than this number due to the network and operational overhead. The Prebid SDK doesn't make any adjustments to this value.
* `nativeAdCacheId` - the local cache ID of the winning bid. Applied only to the `native` ad format.
* `events` - the map of some publically available event URLs attached to the bid. These can be used to enable Prebid Server-based analytics when the Prebid Universal Creative (PUC) is not involved in the rendering process. If the PUC is used for rendering, it will take care of hitting these events. These are the available event URLs:
  * **EVENT_WIN** - this bid was chosen by the ad server as the one to display. This is the main metric for banner and native. This returns the OpenRTB `seatbid.bid.ext.prebid.events.win` field. (requires SDK v2.1.6)
  * **EVENT_IMP** - the ad creative for this bid was actually displayed. This is often the main metric for video ads. This returns the OpenRTB `seatbid.bid.ext.prebid.events.imp` field. (requires SDK v2.1.6)

Code sample to extract the events:

``` kotlin
val win = bidInfo.events.get(BidInfo.EVENT_WIN)
val imp = bidInfo.get(BidInfo.EVENT_IMP)
```

## Rendering API

The integration and usage of the Rendering API is similar to any other Ad SDK. It sends the bid requests to the Prebid Server and renders the winning bid.

![Rendering with GAM as the Primary Ad Server](/assets/images/prebid-mobile/modules/rendering/Prebid-In-App-Bidding-Overview-Pure-Prebid.png)

### Banner API

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

#### Step 1: Create Ad View
{:.no_toc}

Initialize the `BannerView` object with the following properties:

* `configId` - this is the ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) generated on your Prebid server.
* `adSize` - this is the size of the ad unit which will be used in the bid request and returned to your application.

#### Step 2: Load the Ad
{:.no_toc}

Call `loadAd()` and the Prebid SDK will:

* make bid request to Prebid Server
* render the winning bid on display

#### Outstream Video
{:.no_toc}

For **Banner Video** you will also need to specify the `bannerView.videoPlacementType`:

``` kotlin
bannerView.videoPlacementType = PlacementType.IN_BANNER // or any other available type
```

### Interstitial API

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

#### Step 1: Create an Ad Unit
{:.no_toc}

Initialize the `InterstitialAdUnit` object with these properties:

* `configId` - this is the ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) generated on your Prebid server.
* `minSizePercentage` - this specifies the minimum width and height as a percentage of the devices screen size.

You can also assign the listener to process ad events.

> **NOTE:** the `minSizePercentage` - plays an important role in the bidding process for display ads. If the provided space is not enough demand partners won't respond with bids. Make sure you provide ample space.

#### Step 2: Load the Ad
{:.no_toc}

Call the `loadAd()` to make a bid request.

#### Step 3: Show the Ad when it is ready
{:.no_toc}

Wait until the ad is loaded and present it to the user in any suitable time.

``` kotlin
override fun onAdLoaded(interstitialAdUnit: InterstitialAdUnit) {
    //Ad is ready for display
}
```

### Rewarded API

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

#### Step 1: Create a Rewarded Ad Unit
{:.no_toc}

Create the `RewardedAdUnit` object with the parameters:

* `adUnitId` - this is an arbitrary descriptor for the ad. You might use it as a descriptive name in targeting or for reporting.  For example you might name it "account details screen ad" or "home page ad name."

#### Step 2: Load the Ad
{:.no_toc}

Call the `loadAd()` to make a bid request.

#### Step 3: Show the Ad when it is ready
{:.no_toc}

Wait until the ad is loaded and present it to the user in any suitable time.

``` kotlin
// Make an ad request 
    RewardedAd.load(activity, adUnitId, request, object : RewardedAdLoadCallback() {
        override fun onAdLoaded(ad: RewardedAd) {
            Log.d(TAG, "Ad was loaded.")
            rewardedAd = ad

            // 6. Display an ad 
            rewardedAd?.show(activity) { rewardItem ->
                val rewardAmount = rewardItem.amount
                val rewardType = rewardItem.type
                Log.d(TAG, "User earned the reward ($rewardAmount, $rewardType)")
            }
        }

        override fun onAdFailedToLoad(adError: LoadAdError) {
            Log.e(TAG, adError.message)
            rewardedAd = null
        }
    })
```
