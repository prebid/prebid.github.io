---
layout: page_v2
title: Android GAM Bidding-Only Integration - Interstitial Video
description: Android GAM Bidding-Only Integration - Interstitial Video
sidebarType: 2
---

# Android GAM Bidding-Only Integration - Interstitial Video

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html#adunit-specific-instructions)

Starting with Prebid Mobile `2.1.0` you can use `InterstitialAdUnit` to bid for the banner and/or video demand. The default ad format is `BANNER`. To customize the bidding format, specify the ad formats in the `InterstitialAdUnit` constructor.

Integration Example:

```kotlin
private fun createAd() {

    // 1. Create InterstitialAdUnit
    adUnit = InterstitialAdUnit(CONFIG_ID, EnumSet.of(AdUnitFormat.VIDEO))

    // 2. Configure video ad unit
    adUnit?.videoParameters = configureVideoParameters()

    // 3. Make a bid request to Prebid Server
    val request = AdManagerAdRequest.Builder().build()
    adUnit?.fetchDemand(request) {

        // 4. Load a GAM ad
        AdManagerInterstitialAd.load(
            this@GamOriginalApiVideoInterstitialActivity,
            AD_UNIT_ID,
            request,
            createAdListener()
        )
    }
}
```

{: .alert.alert-warning :}
Starting from PrebidMobile `2.1.0` the `VideoInterstitialAdUnit` class is deprecated. Use `InterstitialAdUnit` class with video ad format instead.

Configuration function:

```kotlin
private fun configureVideoParameters(): VideoParameters {
    return VideoParameters(listOf("video/x-flv", "video/mp4")).apply {
        placement = Signals.Placement.Interstitial

        api = listOf(
            Signals.Api.VPAID_1,
            Signals.Api.VPAID_2
        )

        maxBitrate = 1500
        minBitrate = 300
        maxDuration = 30
        minDuration = 5
        playbackMethod = listOf(Signals.PlaybackMethod.AutoPlaySoundOn)
        protocols = listOf(
            Signals.Protocols.VAST_2_0
        )
    }
}
```

GAM Ad Listener:

```kotlin
private fun createAdListener(): AdManagerInterstitialAdLoadCallback {
    return object : AdManagerInterstitialAdLoadCallback() {
        override fun onAdLoaded(interstitialAd: AdManagerInterstitialAd) {
            super.onAdLoaded(interstitialAd)

            // 5. Display an interstitial ad
            interstitialAd.show(this@GamOriginalApiVideoInterstitialActivity)
        }

        override fun onAdFailedToLoad(loadAdError: LoadAdError) {
            super.onAdFailedToLoad(loadAdError)
            Log.e("GAM", "Ad failed to load: $loadAdError")
        }
    }
}
```

## Step 1: Create an Ad Unit
{:.no_toc}

Initialize the `InterstitialAdUnit` with the following properties:

- `configId` - an ID of Stored Impression on the Prebid Server
- `adUnitFormats` - AdUnitFormat.VIDEO for a video ad

## Step 2: Configure video parameters
{:.no_toc}

{% include mobile/video-params.md %}

## Step 3: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide an `AdManagerAdRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

## Step 4: Load a GAM interstitial ad
{:.no_toc}

Now you should request the ad from GAM. If the `AdManagerAdRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM, and GMA SDK will render its creative.

Be sure that you make the ad request with the same `AdManagerAdRequest` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

## Step 5: Present the interstitial ad
{:.no_toc}

Follow the [GMA SDK guide](https://developers.google.com/ad-manager/mobile-ads-sdk/android/interstitial#display_the_ad) to display an interstitial ad right after receiving it or later in a natural pauses in the flow of an app.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK Android integration](/prebid-mobile/pbm-api/android/code-integration-android.html)
- [Prebid SDK Global Parameters - Android](/prebid-mobile/pbm-api/android/pbm-targeting-android.html)
