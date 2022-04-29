---

layout: page_v2
title: Custom or No mediation
description: Integration of Prebid SDK withou primaty Ad Server
sidebarType: 2

---

# Custom Integration

## Table of Contents

- [Overview of Rendering API](#mobile-api)
- [Banner](#banner-api)
- [Interstitial](#interstitial-api)
- [Rewarded](#rewarded-api)

[//]: # (- [Native](android-sdk-integration-pb-native.html))

## Overview of Rendering API

The integration and usage of the Rendering API are similar to any other Ad SDK. It sends the bid requests to the Prebid Server and renders the winning bid. 

![Rendering with GAM as the Primary Ad Server](/assets/images/prebid-mobile/modules/rendering/Prebid-In-App-Bidding-Overview-Pure-Prebid.png)

Prebid's Rendering API provides the ability to integrate these ad formats:

- Display Banner
- Display Interstitial
- Video Interstitial 
- Rewarded Video
- Outstream Video

[//]: # (- [Native](android-sdk-integration-pb-native.html))

The Rendering API ad formats are accessible through the following API classes:

- **Banner API** - for **Display** and **Video**  Banners
- **Interstitial API** - for **Display** and **Video** Interstitials
- **Rewarded API** - for **Rewarded Video**

### Init Prebid Rendering Module

To start running bid requests you have to set the Prebid Server **Host** and **Account Id** and then initilize the SDK with application context. The best place for this is the `onCreate()` method of your Application class.

```
PrebidMobile.setBidServerHost(HOST)
PrebidMobile.setAccountId(YOUR_ACCOUNT_ID)

// Init SDK
PrebidMobile.setApplicationContext(this)
```

> **NOTE:** The account ID is an identifier of the **Stored Request**.

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

#### Step 1: Create Ad View

Initialize the `BannerAdView` with properties:

- `configId` - an ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) on the Prebid server
- `size` - the size of the ad unit which will be used in the bid request.

#### Step 2: Load the Ad

Call `loadAd()` and SDK will:

- make bid request to Prebid
- render the winning bid on display

#### Outstream Video

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

The **default** ad format for interstitial is **DISPLAY**. In order to make a `multiformat bid request`, set the respective values into the `adUnitFormats` parameter.

```
interstitialAdUnit = InterstitialAdUnit(
                        requireContext(), 
                        configId, 
                        EnumSet.of(AdUnitFormat.DISPLAY, AdUnitFormat.VIDEO))
```

#### Step 1: Create an Ad Unit

Initialize the `InterstitialAdUnit ` with properties:

- `configId` - an ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) on the Prebid server
- `minSizePercentage` - specifies the minimum width and height percent an ad may occupy of a device’s real estate.

You can also assign the listener for processing ad events.

> **NOTE:** the `minSizePercentage` - plays an important role in a bidding process for display ads. If provided space is not enough demand partners won't respond with the bids.

#### Step 2: Load the Ad

Call the `loadAd()` method which will make a request to Prebid server.


#### Step 3: Show the Ad when it is ready

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
    
// 2. Execute ad load
rewardedAdUnit?.loadAd()

/// .......

// After ad is loaded you can execute `show` to trigger ad display
rewardedAdUnit?.show()
```

#### Step 1: Create Rewarded Ad Unit

Create the `RewardedAdUnit` object with parameters:

- `adUnitId` - an ID of Stored Impression on the Prebid server.

#### Step 2: Load the Ad

Call the `loadAd()` method which will make a request to Prebid server.


#### Step 3: Show the Ad when it is ready


Wait until the ad is loaded and present it to the user in any suitable time.

``` kotlin
override fun onAdLoaded(rewardedAdUnit: RewardedAdUnit) {
//Ad is ready for display
}
```
