---
layout: page_v2
title: Android Next-Gen SDK Bidding-Only Integration - Rewarded Video
description: Android Next-Gen SDK Bidding-Only Integration - Rewarded Video
sidebarType: 2
---

# Android Next-Gen SDK Bidding-Only Integration - Rewarded Video

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/android/android-sdk-integration-nextgen-original-api.html#adunit-specific-instructions)

Integration example:

```kotlin
private fun createAd() {
    // 1. Create RewardedVideoAdUnit
    adUnit = RewardedVideoAdUnit(CONFIG_ID)

    // 2. Configure Video parameters
    adUnit?.videoParameters = configureVideoParameters()

    // 3. Build the Next-Gen SDK ad request
    val request = AdRequest.Builder(AD_UNIT_ID)
    adUnit?.fetchDemand(request) {

        // 4. Load a Next-Gen Rewarded Ad
        RewardedAd.load(
            request.build(),
            createListener()
        )
    }
}
```

Configure video ad unit:

```kotlin
private fun configureVideoParameters(): VideoParameters {
    return VideoParameters(listOf("video/mp4")).apply {
        protocols = listOf(Signals.Protocols.VAST_2_0)
        playbackMethod = listOf(Signals.PlaybackMethod.AutoPlaySoundOff)
    }
}
```

Implement Rewarded ad listener:

```kotlin
private fun createListener(): AdLoadCallback<RewardedAd> {
    return object : AdLoadCallback<RewardedAd>() {
        override fun onAdLoaded(rewardedAd: RewardedAd) {
            super.onAdLoaded(rewardedAd)

            // 5. Display rewarded ad
            rewardedAd.show(
                this@Activity
            ) { _ -> }
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

Initialize the Rewarded Video Ad Unit with the following properties:

- `configId` - an ID of Stored Impression on the Prebid Server

## Step 2: Configure video parameters
{:.no_toc}

Provide configuration properties for the video ad using the [VideoParameters](#step-2-configure-video-parameters) object.

## Step 3: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide an `AdRequest.Builder` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

## Step 4: Load a Next-Gen Rewarded Ad
{:.no_toc}

Now you should request the ad from the Next-Gen SDK. If the `AdRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM, and the Next-Gen SDK will render its creative.

Be sure that you make the ad request with the same `AdRequest.Builder` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

## Step 5: Present the Rewarded Ad
{:.no_toc}

Follow the [Next-Gen SDK guide](https://developers.google.com/admob/android/next-gen/rewarded#show_the_ad_2) to display a rewarded ad right after receiving it or later in natural pauses in the flow of an app.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK Android integration](/prebid-mobile/pbm-api/android/code-integration-android.html)
- [Prebid SDK Global Parameters - Android](/prebid-mobile/pbm-api/android/pbm-targeting-android.html)
