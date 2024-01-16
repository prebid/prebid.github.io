---
layout: page_v2
title: Android SDK Custom Bidding Integration
description: This guide covers initializing the SDK, setting up various AdUnits, running auctions, and rendering results for display, video, interstitial, and rewarded ad formats. 
sidebarType: 2
---

# Android SDK Custom Bidding Integration
{:.no_toc}

* TOC
{:toc}

## Introduction

The Prebid SDK can monetize your app with an ad server other than [GAM](/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html).

This article guides you on using Prebid SDK with a custom ad server. We will explore how to do the following:

1. Initialize the Prebid Mobile Android SDK.
2. Define first party data and set up adUnits.
3. Initialize the ad auction.
4. Render the results.

## Initializing the Prebid SDK

Before implementing the instructions in this guide, you need to ensure that you have correctly initialized the Prebid Mobile SDK in your app. The initialization method has the following pattern:

```java
Prebid.init(context, accountID, adServer, host);
```

To use the above code snippet, you will need to [setup a Prebid server.](/prebid-mobile/prebid-mobile-getting-started.html#set-up-prebid-server) You can either register with a [Prebid.org member that hosts Prebid Server](https://prebid.org/managed-services/) or [setup your own Prebid server.](/prebid-server/hosting/pbs-hosting.html)

* `context`: This parameter represents the Context of the Android application. It is typically obtained using `getApplicationContext()` or `this` (if called from within an Activity). The Context is essential for the SDK to interact with the Android environment.

* `adUnitId`: This is the value of the adunit name in the ad server. e.g. for GAM, it's the adunit name. Other ad servers may call this something different, but the idea is that the buyers want to know which slot in the app is up for auction for targeting and reporting. An example would be "/home/upper-mobile-banner".

* `accountId`: The accountId is used to define the accountID and the "account settings" used for this app in Prebid Server. These allow your Prebid Server to lookup account details and attributes like timeout and price granularity.

* `adServer`: This parameter specifies the ad server you are using. It is an enum value of the type `Prebid.AdServer`. The possible values include `Prebid.AdServer.DFP` for Google Ad Manager and `Prebid.AdServer.MOPub` for MoPub.

* `host`: If you are using a managed Prebid server service, the SDK is coded with enums containing the URLs for those services, for example `Prebid.Host.RUBICON` and `Prebid.Host.APPNEXUS`. Other Prebid Server managed services exist that don't have enum values. You can work with them by entering the appropriate URL. If you are using a self-hosted server, you should enter the URL to your server.

For example:

```java
Prebid.init(getApplicationContext(), adUnits, "INSERT-ACCOUNT-ID-HERE", Prebid.AdServer.DFP, "https://mypbs.example.org");
```

## Define first party data and set up adUnits

When using a custom or 3rd-party ad server, you must first get the targeting keys using the `fetchDemand` method. This function provides the bidder key/values (targeting keys). You can then pass these targeting keys to the ad server of your choice.

You will need to perform the following actions:

* Call `fetchDemand` with extended `targetingDict` callback.
* Retrieve the targeting keys from `fetchDemand`.
* Convert targeting keys into the format used by your ad server.
* Pass the targeting keys to your ad server.
* Render the ad with the Prebid Universal Creative or custom renderer.

This approach is available for the ad formats listed below. For detailed integration steps, click on the link corresponding to the ad format:

* [Display Banner](https://docs.prebid.org/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html#banner-api)  via `BannerAdUnit`
* [Video Banner](https://docs.prebid.org/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html#video-banner-outstream-video) and Instream Video via `VideoAdUnit`
* [Display Interstitial](https://docs.prebid.org/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html#interstitial-api) via `InterstitialAdUnit`
* [Video Interstitial](https://docs.prebid.org/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html#video-interstitial) via `InterstitialAdUnit`
* [Rewarded Video](https://docs.prebid.org/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html#rewarded-video-api) via `RewardedVideoAdUnit`
* [Native Banner](https://docs.prebid.org/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html#native-api) via `NativeAdUnit`

You will also need to use the `fetchDemand` function with the following signature:

```java
public void fetchDemand(OnFetchDemandResult listener) { ... }

public interface OnFetchDemandResult {
    void onComplete(@NonNull BidInfo bidInfo);
}
```

Example:

```java
adUnit?.fetchDemand { bidInfo ->
    if(bidInfo.getResultCode() == ResultCode.SUCCESS) {
        val keywords = bidInfo.targetingKeywords

        makeAdRequest(keywords)
    }
}
```

The `bidInfo` object provides the following properties:

* `resultCode` - an object of type `ResultCode` describing the status of the bid request.
* `targetingKeywords` - the targeting keywords of the winning bid
* `exp` - the number of seconds that may elapse between the auction and the actual impression. In this case, it indicates the approximate TTL of the bid in the Prebid Cache. Note that the actual expiration time of the bid will be less than this number due to the network and operational overhead. The Prebid SDK doesn't make any adjustments to this value.
* `nativeAdCacheId` - is the local cache ID of the winning bid. Applied only to the `native` ad format.
* `events` - the map of publically available event URLs attached to the bid. These can be used to enable Prebid Server-based analytics when the Prebid Universal Creative (PUC) is not involved in the rendering process. If the PUC is used for rendering, it will take care of hitting these events. These are the available event URLs:

  * **EVENT_WIN** - this bid was chosen by the ad server as the one to display. This is the main metric for banner and native. This returns the OpenRTB `seatbid.bid.ext.prebid.events.win` field. (requires SDK v2.1.6)
  * **EVENT_IMP** - the ad creative for this bid was actually displayed. This is often the main metric for video ads. This returns the OpenRTB `seatbid.bid.ext.prebid.events.imp` field. (requires SDK v2.1.6)

Code sample to extract the events:

```kotlin
val win = bidInfo.events.get(BidInfo.EVENT_WIN)
val imp = bidInfo.get(BidInfo.EVENT_IMP)
```

## Initializing ad auctions and rendering ads

![Ad Rendering Illustration](/assets/images/prebid-mobile/modules/rendering/Prebid-In-App-Bidding-Overview-Pure-Prebid.png)

After you have made an ad request(1), your ad server will run an ad auction (2) and return the winning bid(3). You will then have to render the winning ad in your app(4).

Here is how you can do this for the various ad formats. 

### Banner ads

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
The `loadAd()` method should be called on the main thread.
{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

#### Step 1: Create Ad View
{:.no_toc}

Initialize the `BannerView` object with the following properties:

* `configId` - this is the ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) generated on your Prebid server.
* `adSize` - this is the size of the ad unit which will be used in the bid request and returned to your application.

Then add the `BannerView` object to your view Container

#### Step 2: Load the Ad
{:.no_toc}

Call `loadAd()` and the Prebid SDK will:

* make bid request to Prebid Server.
* render the winning bid.

#### Outstream Video
{:.no_toc}

For **video banner ads** you will also need to specify the `bannerView.videoPlacementType`:

``` kotlin
bannerView.videoPlacementType = PlacementType.IN_BANNER // or any other available type
```

### Interstitial ads

Integration example:

```kotlin
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
The `loadAd()` method should be called on the main thread.
{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

When you create an `InterstitialAdUnit` in Prebid Android SDK, it is, by default, configured to request interstitial ads in the **DISPLAY** format.

Prebid Mobile also allows you to make multiformat bid requests. Multiformat requests allow a single ad unit to request multiple ad formats, such as **BANNER**, **VIDEO**, or others. To do this, you must specify the desired formats using the `adUnitFormats` property.

For example:

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

Call the `loadAd()` method to make a bid request.

#### Step 3: Show the Ad when it is ready
{:.no_toc}

Wait until the ad is loaded, then present it to the user. 

``` kotlin
override fun onAdLoaded(interstitialAdUnit: InterstitialAdUnit) {
    //Ad is ready for display
}
```

### Rewarded ads

A Rewarded ad is a specific type of advertising unit that provides users with a reward, such as virtual currency, premium content, or other incentives, in exchange for engaging with and completing the ad experience.

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
The `loadAd()` method should be called on the main thread.
{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

#### Step 1: Create a Rewarded Ad Unit
{:.no_toc}

Create the `RewardedAdUnit` object with the parameters:

* `adUnitId` - this is the value of the adunit name in the ad server. e.g. for GAM, it's the adunit name. Other ad servers may call this something different, but the idea is that the buyers want to know which slot in the app is up for auction for targeting and reporting. An example would be "/home/upper-mobile-banner".

#### Step 2: Load the Ad
{:.no_toc}

Call the `loadAd()` method to make a bid request.

#### Step 3: Show the Ad when it is ready
{:.no_toc}

Wait until the ad is loaded, then present it to the user. 

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
