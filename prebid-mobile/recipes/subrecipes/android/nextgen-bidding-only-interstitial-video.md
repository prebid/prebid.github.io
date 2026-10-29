---
layout: page_v2
title: Android Next-Gen SDK Bidding-Only Integration - Interstitial Video
description: Android Next-Gen SDK Bidding-Only Integration - Interstitial Video
sidebarType: 2
---

# Android Next-Gen SDK Bidding-Only Integration - Interstitial Video

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/android/android-sdk-integration-nextgen-original-api.html#adunit-specific-instructions)

Starting with Prebid Mobile `2.1.0` you can use `InterstitialAdUnit` to bid for the banner and/or video demand. The default ad format is `BANNER`. To customize the bidding format, specify the ad formats in the `InterstitialAdUnit` constructor.

Integration Example:

```kotlin
private fun createAd() {

    // 1. Create InterstitialAdUnit with video format
    adUnit = InterstitialAdUnit(CONFIG_ID, EnumSet.of(AdUnitFormat.VIDEO))

    // 2. Configure video ad unit
    adUnit?.videoParameters = configureVideoParameters()

    // 3. Make a bid request to Prebid Server
    val requestBuilder = AdRequest.Builder(AD_UNIT_ID)
    adUnit?.fetchDemand(requestBuilder) {

        // 4. Load a Next-Gen ad
        InterstitialAd.load(
            requestBuilder.build(),
            createAdListener()
        )
    }
}
```

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

Next-Gen SDK ad listener:

```kotlin
private fun createAdListener(): AdLoadCallback<InterstitialAd> {
    return object : AdLoadCallback<InterstitialAd>() {
        override fun onAdLoaded(ad: InterstitialAd) {
            super.onAdLoaded(ad)

            // 5. Display an interstitial ad
            ad.show(this@Activity)
        }

        override fun onAdFailedToLoad(adError: LoadAdError) {
            super.onAdFailedToLoad(adError)
            Log.e(TAG, "Ad failed to load: $adError")
        }
    }
}
```

## Step 1: Create an Ad Unit
{:.no_toc}

Initialize the `InterstitialAdUnit` with the following properties:

- `configId` - an ID of Stored Impression on the Prebid Server
- `adUnitFormats` - `AdUnitFormat.VIDEO` for a video ad

## Step 2: Configure video parameters
{:.no_toc}

{% include mobile/video-params.md %}

## Step 3: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide an `AdRequest.Builder` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

## Step 4: Load a Next-Gen interstitial ad
{:.no_toc}

Now you should request the ad from the Next-Gen SDK. If the `AdRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM, and the Next-Gen SDK will render its creative.

Be sure that you make the ad request with the same `AdRequest.Builder` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

## Step 5: Present the interstitial ad
{:.no_toc}

Follow the [Next-Gen SDK guide](https://developers.google.com/admob/android/next-gen/interstitial#show_the_ad) to display an interstitial ad right after receiving it or later in natural pauses in the flow of an app.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK Android integration](/prebid-mobile/pbm-api/android/code-integration-android.html)
- [Prebid SDK Global Parameters - Android](/prebid-mobile/pbm-api/android/pbm-targeting-android.html)
