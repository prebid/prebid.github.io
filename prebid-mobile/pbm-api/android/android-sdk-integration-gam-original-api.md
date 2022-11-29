---
layout: page_v2
title: Prebid Mobile - GAM with Original API
description: Overview of Prebid Mobile API for Android
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# Prebid Mobile with GAM (Original API)

Prebid Mobile is an open-source library that provides an end-to-end header bidding solution for mobile app publishers. 

* TOC
{:toc}

## Overview

This is the original Prebid mobile integration approach when SDK plays the transport role, and the winning bid is rendered by Primary Ad Server SDK using PUC. You can find details of how it works and other integration approaches on the [overview page](/prebid-mobile/prebid-mobile.html#with-ad-server-original-api).  

![In-App Bidding with Prebid](/assets/images/prebid-mobile/prebid-in-app-bidding-overview-prebid-original-gam.png)

## Display Banner

Integration example:

```kotlin
private fun createAd() {

    // 1. Create BannerAdUnit
    adUnit = BannerAdUnit(CONFIG_ID, WIDTH, HEIGHT)
    adUnit?.setAutoRefreshInterval(refreshTimeSeconds)

    // 2. Configure banner parameters
    val parameters = BannerBaseAdUnit.Parameters()
    parameters.api = listOf(Signals.Api.MRAID_3, Signals.Api.OMID_1)

    // 3. Create AdManagerAdView
    val adView = AdManagerAdView(this)
    adView.adUnitId = AD_UNIT_ID
    adView.setAdSizes(AdSize(WIDTH, HEIGHT))
    adView.adListener = createGAMListener(adView)

    // Add GMA SDK banner view to the app UI
    adWrapperView.addView(adView)

    // 4. Make a bid request to Prebid Server
    val request = AdManagerAdRequest.Builder().build()
    adUnit?.fetchDemand(request) {

        // 5. Load GAM Ad
        adView.loadAd(request)
    }
}
```

GAM ad view listner:

```kotlin
private fun createGAMListener(adView: AdManagerAdView): AdListener {
    return object : AdListener() {
        override fun onAdLoaded() {
            super.onAdLoaded()

            // 6. Resize ad view if needed
            AdViewUtils.findPrebidCreativeSize(adView, object : AdViewUtils.PbFindSizeListener {
                override fun success(width: Int, height: Int) {
                    adView.setAdSizes(AdSize(width, height))
                }

                override fun failure(error: PbFindSizeError) {}
            })
        }
    }
}
```

#### Step 1: Create a BannerAdUnit
{:.no_toc}

Initialize the `BannerAdUnit` with properties:

- `configId` - an ID of the Stored Impression on the Prebid Server
- `width` - the width of the ad unit which will be used in the bid request.
- `height` - the height of the ad unit which will be used in the bid request.

#### Step 2: Configure banner parameters
{:.no_toc}

Using the `BannerBaseAdUnit.Parameters()` you can customize the bid request for BannerAdUnit. 

The `api` property is dedicated to adding values for API Frameworks to bid response according to the OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) spec. The supported values for GMA SDK integration are:

* `3` or `Signals.Api.MRAID_1` : MRAID-1 support signal
* `5` or `Signals.Api.MRAID_2` : MRAID-2 support signal
* `6` or `Signals.Api.MRAID_3` : MRAID-3 support signal
* `7` or `Signals.Api.OMID_1` :  signals OMSDK support

#### Step 3: Create a AdManagerAdView
{:.no_toc}

Just follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/android/banner) to integrate a banner ad unit. 

#### Step 4: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the prebid server. You should provide a `AdManagerAdRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests. 

#### Step 5: Load an Ad
{:.no_toc}

Now you should request the ad from GAM. If the `AdManagerAdRequest` contains targeting keywords, the respective Prebid's line item will be returned from GAM, and GMA SDK will render its creative. 

Be sure that you make the ad request with the same `AdManagerAdRequest` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

#### Step 6: Adjust the ad view size
{:.no_toc}

Once an app receives a signal that an ad is loaded, you should use the method `AdViewUtils.findPrebidCreativeSize` to verify whether it's Prebid's ad and resize the ad slot respectively to the creative's properties. 

## Video Banner

// TODO:


## Display Interstitial

Integration example: 

```kotlin
private fun createAd() {
    // 1. Create InterstitialAdUnit
    adUnit = InterstitialAdUnit(CONFIG_ID, 80, 60)

    // 2. Make a bid request to Prebid Server
    val request = AdManagerAdRequest.Builder().build()
    adUnit?.fetchDemand(request) {

        // 3. Load a GAM interstitial ad
        AdManagerInterstitialAd.load(this, AD_UNIT_ID, request, createListner())
    }
}
```

Also you need to implement `AdManagerInterstitialAdLoadCallback` in order to track the ad rediness:

```kotlin
private fun createListner(): AdManagerInterstitialAdLoadCallback {
    return object : AdManagerInterstitialAdLoadCallback() {

        override fun onAdLoaded(adManagerInterstitialAd: AdManagerInterstitialAd) {
            super.onAdLoaded(adManagerInterstitialAd)

            // 4.  Present the interstitial ad
            adManagerInterstitialAd.show(this@GamOriginalApiDisplayInterstitialActivity)
        }

        override fun onAdFailedToLoad(loadAdError: LoadAdError) {
            super.onAdFailedToLoad(loadAdError)
            Log.e("GAM", "Ad failed to load: $loadAdError")
        }
    }
}
```