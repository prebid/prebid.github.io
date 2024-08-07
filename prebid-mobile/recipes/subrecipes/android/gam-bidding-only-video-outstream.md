---
layout: page_v2
title: Android GAM Bidding-Only Integration - Non-Instream Video
description: Android GAM Bidding-Only Integration - Non-Instream Video
sidebarType: 2
---

# Android GAM Bidding-Only Integration - Non-Instream Video

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html#adunit-specific-instructions)

{: .alert.alert-info :}
"Non-Instream" refers to the IAB video categories "Accompanying Content" and "Standalone".

Integration example:

```kotlin
private fun createAd() {
    // 1. Create VideoAdUnit
    adUnit = BannerAdUnit(CONFIG_ID, WIDTH, HEIGHT, EnumSet.of(AdUnitFormat.VIDEO))

    // 2. Configure video ad unit
    adUnit?.videoParameters = configureVideoParameters()

    // 3. Create AdManagerAdView
    val gamView = AdManagerAdView(this)
    gamView.adUnitId = AD_UNIT_ID
    gamView.setAdSizes(AdSize(WIDTH, HEIGHT))
    gamView.adListener = createListener(gamView)

    adWrapperView.addView(gamView)

    // 4. Make an ad request
    val request = AdManagerAdRequest.Builder().build()
    adUnit?.fetchDemand(request) {
        gamView.loadAd(request)
    }
}
```

{: .alert.alert-warning :}
Starting from PrebidMobile `2.1.0` the `VideoAdUnit` class is deprecated. Use `BannerAdUnit` class with video ad format instead.

Configure Video parameters:

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

Setup ad listener:

```kotlin
private fun createListener(gamView: AdManagerAdView): AdListener {
    return object : AdListener() {
        override fun onAdLoaded() {
            AdViewUtils.findPrebidCreativeSize(gamView, object : PbFindSizeListener {
                override fun success(width: Int, height: Int) {
                    gamView.setAdSizes(AdSize(width, height))
                }

                override fun failure(error: PbFindSizeError) {}
            })
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

## Step 3: Create an AdManagerAdView
{:.no_toc}

Just follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/android/banner) to integrate a banner ad unit.

## Step 4: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide an `AdManagerAdRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

## Step 5: Load an Ad
{:.no_toc}

You should now request the ad from GAM. If the `AdManagerAdRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM, and GMA SDK will render its creative.

Be sure that you make the ad request with the same `AdManagerAdRequest` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK Android integration](/prebid-mobile/pbm-api/android/code-integration-android.html)
- [Prebid SDK Global Parameters - Android](/prebid-mobile/pbm-api/android/pbm-targeting-android.html)
