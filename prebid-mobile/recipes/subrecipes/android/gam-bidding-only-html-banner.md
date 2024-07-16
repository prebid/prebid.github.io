---
layout: page_v2
title: Android GAM Bidding-Only Integration - HTML Banner
description: Android GAM Bidding-Only Integration - HTML Banner
sidebarType: 2
---

# Android GAM Bidding-Only Integration - HTML Banner

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html#adunit-specific-instructions)

Starting with Prebid Mobile `2.1.0` you can use `BannerAdUnit` to bid over the banner and/or video demand. The default ad format is `BANNER`. To customize the bidding format, specify the ad formats in the `BannerAdUnit` constructor.

Integration example:

```kotlin
private fun createAd() {
    // 1. Create BannerAdUnit
    adUnit = BannerAdUnit(CONFIG_ID, WIDTH, HEIGHT)
    adUnit?.setAutoRefreshInterval(refreshTimeSeconds)

    // 2. Configure banner parameters
    val parameters = BannerBaseAdUnit.Parameters()
    parameters.api = listOf(Signals.Api.MRAID_3, Signals.Api.OMID_1)
    adUnit?.parameters = parameters

   // For multi-size request
   adUnit?.addAdditionalSize(728, 90)

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

It may be necessary to implement AdListener to adjust banner view size according to the creative size, for the case where there are several ad sizes supported. This logic is not needed for a single size banner: 

Prebid SDK can be thought of an OpenRTB request synthesizer.  OpenRTB does not have a notion of adaptive banners, but it has a notion of several banner sizes / formats in one request.  So an adaptive banner may be represented as a request containing several banner sizes, e.g. a fixed width that equals the size of the screen and several different heights.  The examples here deal with a single ad size, but more can be added via BannerParameters.adSizes array.

GAM ad view listener:

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

Notes:

1. in case you use a single-size banner (as opposed to multi-size), i.e. 300x250 - you don’t need to make a call to the AdViewUtils.findPrebidCreativeSize routine - because you already know the size of the creative (it is 300x250), however you still need to make a call to bannerView.resize because the creative has the 1x1 size by default and without this call it will be rendered, but as a pixel.
2. Make sure you properly process all possible cases in the  AdViewUtils.findPrebidCreativeSize callbacks (both success and failure).  Sometimes you might not get the size of the creative (or a failure callback) - it simply means that this is not a Prebid creative.  It means that you still need to render the creative, but you most likely don’t need to resize it - at least Prebid knows nothing about it.

## Step 1: Create a BannerAdUnit
{:.no_toc}

Initialize the `BannerAdUnit` with properties:

- `configId` - an ID of the Stored Impression on the Prebid Server
- `width` - the width of the ad unit which will be used in the bid request.
- `height` - the height of the ad unit which will be used in the bid request.

## Step 2: Configure banner parameters
{:.no_toc}

{% include mobile/banner-params.md %}

## Step 3: Create an AdManagerAdView
{:.no_toc}

Follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/android/banner) to integrate a banner ad unit.

## Step 4: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Demand Manager. You should provide an `AdManagerAdRequest` object to this method. Prebid SDK will set the targeting keywords of the winning bid into provided object. Eventually you should use this object to make an ad request  to GAM.


## Step 5: Load an Ad
{:.no_toc}

You should now request the ad from GAM. If the `AdManagerAdRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM, and GMA SDK will render its creative.

Be sure that you make the ad request with the same `AdManagerAdRequest` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain the targeting keywords, and Prebid's ad won't ever be displayed.

## Step 6: Adjust the ad view size
{:.no_toc}

Once an app receives a signal that an ad is loaded, you should use the method `AdViewUtils.findPrebidCreativeSize` to verify whether it's Prebid's ad and resize the ad slot respectively to the creative's properties.

Notes:

1. In case you use a single-size banner (as opposed to multi-size), f.e. 300x250 - you don’t need to make a call to the AdViewUtils.findPrebidCreativeSize routine - because you already know the size of the creative (it is 300x250), however you still need to make a call to bannerView.resize(<size>) because the creative has the 1x1 size by default and without this call it will be rendered, but as a pixel. 
2. Make sure you properly process all possible cases in the  AdViewUtils.findPrebidCreativeSize callbacks (both success and failure).  Sometimes you might not get the size of the creative (or a failure callback) - it simply means that this is not a Prebid creative.  It means that you still need to render the creative, but you most likely don’t need to resize it - at least Prebid knows nothing about it.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK Android integration](/prebid-mobile/pbm-api/android/code-integration-android.html)
- [Prebid SDK Global Parameters - Android](/prebid-mobile/pbm-api/android/pbm-targeting-android.html)
