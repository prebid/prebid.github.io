---

layout: page_v2
title: Custom or No mediation
description: Integration of Prebid SDK withou primaty Ad Server
sidebarType: 2

---

# Custom Integration
{:.no_toc}

## Overview of Rendering API

The integration and usage of the Rendering API is similar to any other Ad SDK. It sends the bid requests to the Prebid Server and renders the winning bid. 

![Rendering with GAM as the Primary Ad Server](/assets/images/prebid-mobile/modules/rendering/Prebid-In-App-Bidding-Overview-Pure-Prebid.png)

* TOC
{:toc}

## Banner API

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

#### Step 1: Create Ad View
{:.no_toc}

Initialize the `BannerAdView` with properties:

- `configId` - an ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) on the Prebid server
- `size` - the size of the ad unit which will be used in the bid request.

#### Step 2: Load the Ad
{:.no_toc}

Call `loadAd()` and SDK will:

- make bid request to Prebid
- render the winning bid on display

#### Outstream Video
{:.no_toc}

For **Banner Video** you will also need to specify the `bannerView.videoPlacementType`:

``` kotlin
bannerView.videoPlacementType = PlacementType.IN_BANNER // or any other available type
```

## Interstitial API

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

The **default** ad format for interstitial is **DISPLAY**. In order to make a `multiformat bid request`, set the respective values into the `adUnitFormats` parameter.

```
interstitialAdUnit = InterstitialAdUnit(
                        requireContext(), 
                        configId, 
                        EnumSet.of(AdUnitFormat.BANNER, AdUnitFormat.VIDEO))
```

#### Step 1: Create an Ad Unit
{:.no_toc}

Initialize the `InterstitialAdUnit ` with properties:

- `configId` - an ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) on the Prebid server
- `minSizePercentage` - specifies the minimum width and height percent an ad may occupy of a device’s real estate.

You can also assign the listener for processing ad events.

> **NOTE:** the `minSizePercentage` - plays an important role in a bidding process for display ads. If the provided space is not enough demand partners won't respond with bids.

#### Step 2: Load the Ad
{:.no_toc}

Call the `loadAd()` method which will make a request to Prebid server.

#### Step 3: Show the Ad when it is ready
{:.no_toc}

Wait until the ad is loaded and present it to the user in any suitable time.

``` kotlin
override fun onAdLoaded(interstitialAdUnit: InterstitialAdUnit) {
    //Ad is ready for display
}
```

## Rewarded API

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

#### Step 1: Create a Rewarded Ad Unit
{:.no_toc}

Create the `RewardedAdUnit` object with parameters:

- `adUnitId` - an ID of Stored Impression on the Prebid server.

#### Step 2: Load the Ad
{:.no_toc}

Call the `loadAd()` method which will make a request to Prebid server.

#### Step 3: Show the Ad when it is ready
{:.no_toc}

Wait until the ad is loaded and present it to the user in any suitable time.

``` kotlin
override fun onAdLoaded(rewardedAdUnit: RewardedAdUnit) {
//Ad is ready for display
}
```
