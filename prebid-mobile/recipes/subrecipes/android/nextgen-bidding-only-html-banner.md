---
layout: page_v2
title: Android Next-Gen SDK Bidding-Only Integration - HTML Banner
description: Android Next-Gen SDK Bidding-Only Integration - HTML Banner
sidebarType: 2
---

# Android Next-Gen SDK Bidding-Only Integration - HTML Banner

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/android/android-sdk-integration-nextgen-original-api.html#adunit-specific-instructions)

Starting with Prebid Mobile `2.1.0` you can use `BannerAdUnit` to bid over the banner and/or video demand. The default ad format is `BANNER`. To customize the bidding format, specify the ad formats in the `BannerAdUnit` constructor.

Integration example:

```kotlin
private fun createAd() {
    // 1. Create BannerAdUnit
    adUnit = BannerAdUnit(CONFIG_ID, WIDTH, HEIGHT)
    adUnit?.setAutoRefreshInterval(refreshTimeSeconds)

    // 2. Configure banner parameters
    val parameters = BannerParameters()
    parameters.api = listOf(Signals.Api.MRAID_3, Signals.Api.OMID_1)
    adUnit?.bannerParameters = parameters

    // 3. Create Next-Gen SDK AdView
    val adView = AdView(this)
    val adSize = AdSize(WIDTH, HEIGHT)
    adWrapperView.addView(adView)

    // 4. Build the Next-Gen SDK ad request
    val adRequestBuilder = BannerAdRequest.Builder(AD_UNIT_ID, adSize)

    // 5. Make a bid request to Prebid Server
    adUnit?.fetchDemand(adRequestBuilder) {

        // 6. Load Next-Gen Ad
        adView.loadAd(adRequestBuilder.build(), createAdLoadCallback(adView))
    }
}
```

Prebid SDK can be thought of an OpenRTB request synthesizer.  OpenRTB does not have a notion of adaptive banners, but it has a notion of several banner sizes / formats in one request.  So an adaptive banner may be represented as a request containing several banner sizes, e.g. a fixed width that equals the size of the screen and several different heights.  The examples here deal with a single ad size, but more can be added via BannerParameters.adSizes array.

It may be necessary to resize the banner view according to the creative size when multiple ad sizes are supported.  This logic is not needed for a single-size banner:

Next-Gen SDK ad load callback:

```kotlin
private fun createAdLoadCallback(adView: AdView): AdLoadCallback<BannerAd> {
    return object : AdLoadCallback<BannerAd>() {
        override fun onAdLoaded(ad: BannerAd) {
            super.onAdLoaded(ad)

            // 7. Resize ad view if needed
            AdViewUtils.findPrebidCreativeSize(adView, object : AdViewUtils.PbFindSizeListener {
                override fun success(width: Int, height: Int) {
                    adView.resize(AdSize(width, height))
                }

                override fun failure(error: PbFindSizeError) {}
            })

            ad.adEventCallback = object : BannerAdEventCallback {
                override fun onAdClicked() {
                    super.onAdClicked()
                }
                override fun onAdImpression() {
                    super.onAdImpression()
                }
            }
        }

        override fun onAdFailedToLoad(adError: LoadAdError) {
            super.onAdFailedToLoad(adError)
            Log.e(TAG, "Ad failed to load: $adError")
        }
    }
}
```

Notes:

1. In case you use a single-size banner (as opposed to multi-size), i.e. 300x250 - you don't need to call `AdViewUtils.findPrebidCreativeSize` because you already know the size of the creative. However you still need to call `adView.resize()` because the creative has a 1x1 size by default and without this call it will be rendered as a pixel.
2. Make sure you properly process all possible cases in the `AdViewUtils.findPrebidCreativeSize` callbacks (both success and failure). Sometimes you might not get the size of the creative (or a failure callback) - it simply means that this is not a Prebid creative. It means that you still need to render the creative, but you most likely don't need to resize it.

## Step 1: Create a BannerAdUnit
{:.no_toc}

Initialize the `BannerAdUnit` with properties:

- `configId` - an ID of the Stored Impression on the Prebid Server
- `width` - the width of the ad unit which will be used in the bid request.
- `height` - the height of the ad unit which will be used in the bid request.

## Step 2: Configure banner parameters
{:.no_toc}

{% include mobile/banner-params.md %}

## Step 3: Create a Next-Gen SDK AdView
{:.no_toc}

Follow the [Next-Gen SDK documentation](https://developers.google.com/admob/android/next-gen/banner) to integrate a banner ad unit.

## Step 4: Build the Ad Request
{:.no_toc}

Create a `BannerAdRequest.Builder` with the Next-Gen SDK Ad Unit ID and the desired `AdSize`.

## Step 5: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide a `BannerAdRequest.Builder` object to this method. Prebid SDK will set the targeting keywords of the winning bid into the provided object. Eventually you should use this object to make an ad request to the Next-Gen SDK.

## Step 6: Load an Ad
{:.no_toc}

You should now request the ad from the Next-Gen SDK. If the `BannerAdRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM, and the Next-Gen SDK will render its creative.

Be sure that you make the ad request with the same `BannerAdRequest.Builder` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain the targeting keywords, and Prebid's ad won't ever be displayed.

## Step 7: Adjust the ad view size
{:.no_toc}

Once an app receives a signal that an ad is loaded, you should use the method `AdViewUtils.findPrebidCreativeSize` to verify whether it's Prebid's ad and resize the ad slot respectively to the creative's properties.

Notes:

1. In case you use a single-size banner (as opposed to multi-size), e.g. 300x250 - you don't need to call `AdViewUtils.findPrebidCreativeSize` because you already know the size of the creative. However you still need to call `adView.resize()` because the creative has a 1x1 size by default and without this call it will be rendered as a pixel.
2. Make sure you properly process all possible cases in the `AdViewUtils.findPrebidCreativeSize` callbacks (both success and failure). Sometimes you might not get the size of the creative (or a failure callback) - it simply means that this is not a Prebid creative. It means that you still need to render the creative, but you most likely don't need to resize it.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK Android integration](/prebid-mobile/pbm-api/android/code-integration-android.html)
- [Prebid SDK Global Parameters - Android](/prebid-mobile/pbm-api/android/pbm-targeting-android.html)
