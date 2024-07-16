---
layout: page_v2
title: Android GAM Bidding-Only Integration - Multiformat Interstitial Banner+Video
description: Android GAM Bidding-Only Integration - Multiformat Interstitial Banner+Video
sidebarType: 2
---

# Android GAM Bidding-Only Integration - Multiformat Interstitial Banner+Video

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html#adunit-specific-instructions)

Integration example:

```kotlin
// 1. Create InterstitialAdUnit
adUnit = InterstitialAdUnit(configId, EnumSet.of(AdUnitFormat.BANNER, AdUnitFormat.VIDEO))
adUnit?.setMinSizePercentage(80, 60)
adUnit?.adUnitConfig.adSize = new AdSize(1, 1);
adUnit?.videoParameters = VideoParameters(listOf("video/mp4"))

// 2. Make a bid request to Prebid Server
val request = AdManagerAdRequest.Builder().build()
adUnit?.fetchDemand(request) {

    // 3. Load a GAM interstitial ad
    AdManagerInterstitialAd.load(
        this,
        AD_UNIT_ID,
        request,
        createListener()
    )
}
```

## Step 1: Create an Ad Unit
{:.no_toc}

Initialize the `InterstitialAdUnit` with the following properties:

- `configId` - an ID of Stored Impression on the Prebid Server
- `adUnitFormats` - ad unit formats for the current ad unit.

{: .alert.alert-info :}
Here's how min size percentages work. If the adunit size is 1x1, Prebid Server takes the screen width/height and the minWidthPerc/minHeightPerc as a size range, generating a list of ad sizes from a [predefined list](https://github.com/prebid/prebid-server/blob/master/config/interstitial.go). It selects the first 10 sizes that fall within the max size and minimum percentage size. All the interstitial parameters will still be passed to the bidders, allowing them to use their own size matching algorithms if they prefer. If you'd prefer to just define the size list, that's ok too - just set the sizes and don't define minWidthPerc/minHeightPerc.

## Step 2: Set ad formats
{:.no_toc}

For multiformat ad unit, you must set both banner and video ad formats.

## Step 3: Configure parameters
{:.no_toc}

### Banner parameters

{% include mobile/banner-params.md %}

### Video parameters

{% include mobile/video-params.md %}

## Step 4: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide a `GAMRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

## Step 5: Load a GAM interstitial ad
{:.no_toc}

You should now request the ad from GAM. If the `GAMRequest` contains targeting keywords. The respective Prebid line item will be returned from GAM and GMA SDK will render its creative.

Be sure that you make the ad request with the same `GAMRequest` object that you passed to the `fetchDemand` method. Otherwise the ad request won't contain targeting keywords and Prebid's ad won't ever be displayed.

## Step 6: Present the interstitial ad
{:.no_toc}

Follow the [GMA SDK guide](https://developers.google.com/ad-manager/mobile-ads-sdk/android/interstitial#display_the_ad) to display an interstitial ad right after receiving it or later in a natural pauses in the flow of an app.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK Android integration](/prebid-mobile/pbm-api/android/code-integration-android.html)
- [Prebid SDK Global Parameters - Android](/prebid-mobile/pbm-api/android/pbm-targeting-android.html)
