---
layout: page_v2
title: Android Next-Gen SDK Bidding-Only Integration - Non-Instream Video
description: Android Next-Gen SDK Bidding-Only Integration - Non-Instream Video
sidebarType: 2
---

# Android Next-Gen SDK Bidding-Only Integration - Non-Instream Video

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/android/android-sdk-integration-nextgen-original-api.html#adunit-specific-instructions)

{: .alert.alert-info :}
"Non-Instream" refers to the IAB video categories "Accompanying Content" and "Standalone". See [the IAB document](https://iabtechlab.com/industry-adoption-of-amended-iab-tech-lab-guidelines-is-vital-to-drive-change/) for more information.

Integration example:

```kotlin
private fun createAd() {
    // 1. Create BannerAdUnit with video format
    adUnit = BannerAdUnit(CONFIG_ID, WIDTH, HEIGHT, EnumSet.of(AdUnitFormat.VIDEO))

    // 2. Configure video ad unit
    adUnit?.videoParameters = configureVideoParameters()

    // 3. Create Next-Gen SDK AdView
    val adView = AdView(this)
    val adSize = AdSize(WIDTH, HEIGHT)
    adWrapperView.addView(adView)

    // 4. Build the Next-Gen SDK ad request
    val requestBuilder = BannerAdRequest.Builder(AD_UNIT_ID, adSize)
    adUnit?.fetchDemand(requestBuilder) {

        // 5. Load an ad
        adView.loadAd(requestBuilder.build(), createAdLoadCallback(adView))
    }
}
```

Configure video parameters:

```kotlin
private fun configureVideoParameters(): VideoParameters {
    return VideoParameters(listOf("video/x-flv", "video/mp4")).apply {
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

Setup ad load callback:

```kotlin
private fun createAdLoadCallback(adView: AdView): AdLoadCallback<BannerAd> {
    return object : AdLoadCallback<BannerAd>() {
        override fun onAdLoaded(ad: BannerAd) {
            super.onAdLoaded(ad)
            AdViewUtils.findPrebidCreativeSize(adView, object : AdViewUtils.PbFindSizeListener {
                override fun success(width: Int, height: Int) {
                    adView.resize(AdSize(width, height))
                }

                override fun failure(error: PbFindSizeError) {}
            })
        }

        override fun onAdFailedToLoad(adError: LoadAdError) {
            super.onAdFailedToLoad(adError)
            Log.e(TAG, "Ad failed to load: $adError")
        }
    }
}
```

## Step 1: Create a BannerAdUnit with the video ad type
{:.no_toc}

Initialize the `BannerAdUnit` with the following properties:

- `configId` - an ID of the Stored Impression on the Prebid Server
- `adSize` - the size of the ad unit which will be used in the bid request.
- `adUnitFormats` - `AdUnitFormat.VIDEO` for a video ad

## Step 2: Configure video parameters
{:.no_toc}

{% include mobile/video-params.md %}

## Step 3: Create a Next-Gen SDK AdView
{:.no_toc}

Follow the [Next-Gen SDK documentation](https://developers.google.com/admob/android/next-gen/banner) to integrate a banner ad unit.

## Step 4: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide a `BannerAdRequest.Builder` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

## Step 5: Load an Ad
{:.no_toc}

You should now request the ad from the Next-Gen SDK. If the `BannerAdRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM, and the Next-Gen SDK will render its creative.

Be sure that you make the ad request with the same `BannerAdRequest.Builder` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK Android integration](/prebid-mobile/pbm-api/android/code-integration-android.html)
- [Prebid SDK Global Parameters - Android](/prebid-mobile/pbm-api/android/pbm-targeting-android.html)
