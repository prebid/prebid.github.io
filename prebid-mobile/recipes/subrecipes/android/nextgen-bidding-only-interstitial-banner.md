---
layout: page_v2
title: Android Next-Gen SDK Bidding-Only Integration - Interstitial Banner
description: Android Next-Gen SDK Bidding-Only Integration - Interstitial Banner
sidebarType: 2
---

# Android Next-Gen SDK Bidding-Only Integration - Interstitial Banner

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/android/android-sdk-integration-nextgen-original-api.html#adunit-specific-instructions)

Starting with Prebid Mobile `2.1.0` you can use `InterstitialAdUnit` to bid over the banner and/or video demand. The default ad format is `BANNER`. To customize the bidding format, specify the ad formats in the `InterstitialAdUnit` constructor.

Integration example:

```kotlin
private fun createAd() {
    // 1. Create InterstitialAdUnit
    //    minWidthPercent=80, minHeightPercent=60
    adUnit = InterstitialAdUnit(CONFIG_ID, 80, 60)

    // 2. Build the Next-Gen SDK ad request
    val request = AdRequest.Builder(AD_UNIT_ID)
    adUnit?.fetchDemand(request) {

        // 3. Load a Next-Gen interstitial ad
        InterstitialAd.load(
            request.build(),
            createListener()
        )
    }
}
```

You also need to implement `AdLoadCallback<InterstitialAd>` in order to track the ad readiness:

```kotlin
private fun createListener(): AdLoadCallback<InterstitialAd> {
    return object : AdLoadCallback<InterstitialAd>() {
        override fun onAdLoaded(ad: InterstitialAd) {
            super.onAdLoaded(ad)

            // 4. Present the interstitial ad
            ad.show(this@Activity)
        }

        override fun onAdFailedToLoad(adError: LoadAdError) {
            super.onAdFailedToLoad(adError)
            Log.e(TAG, "Ad failed to load: $adError")
        }
    }
}
```

## Step 1: Create an InterstitialAdUnit
{:.no_toc}

Initialize the Interstitial Ad Unit with properties:

- `configId` - an ID of Stored Impression on the Prebid Server
- `minWidthPerc`: Optional parameter to specify the minimum width percent an ad may occupy of a device's screen. Support in SDK version 1.2+
- `minHeightPrec`: Optional parameter to specify the minimum height percent an ad may occupy of a device's screen. Support in SDK version 1.2+

{: .alert.alert-info :}
Here's how min size percentages work. If the adunit size is 1x1, Prebid Server uses the screen width/height and the minWidthPerc/minHeightPerc to generate a list of ad sizes from a [predefined list](https://github.com/prebid/prebid-server/blob/master/config/interstitial.go). It selects the first 10 sizes that fall within the max size and minimum percentage size. All the interstitial parameters will still be passed to the bidders, allowing them to use their own size matching algorithms if they prefer. If you'd prefer to just define the size list, that's ok too - just set the sizes and don't define minWidthPerc/minHeightPerc.

## Step 2: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide an `AdRequest.Builder` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

## Step 3: Load a Next-Gen interstitial ad
{:.no_toc}

You should now request the ad from the Next-Gen SDK. If the `AdRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM, and the Next-Gen SDK will render its creative.

Be sure that you make the ad request with the same `AdRequest.Builder` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

## Step 4: Present the interstitial ad
{:.no_toc}

Follow the [Next-Gen SDK guide](https://developers.google.com/ad-manager/mobile-ads-sdk/android/interstitial#display_the_ad) to display an interstitial ad right after receiving it or later in natural pauses in the flow of an app.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK Android integration](/prebid-mobile/pbm-api/android/code-integration-android.html)
- [Prebid SDK Global Parameters - Android](/prebid-mobile/pbm-api/android/pbm-targeting-android.html)
