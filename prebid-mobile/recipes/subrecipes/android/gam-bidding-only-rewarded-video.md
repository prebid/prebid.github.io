---
layout: page_v2
title: Android GAM Bidding-Only Integration - Rewarded Video
description: Android GAM Bidding-Only Integration - Rewarded Video
sidebarType: 2
---

# Android GAM Bidding-Only Integration - Rewarded Video

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html#adunit-specific-instructions)

Integration example:

```kotlin
private fun createAd() {
    // 1. Create RewardedVideoAdUnit
    adUnit = RewardedVideoAdUnit(CONFIG_ID)

    // 2. Configure Video parameters
    adUnit?.videoParameters = configureVideoParameters()

    // 3. Make a bid request to Prebid Server
    val request = AdManagerAdRequest.Builder().build()
    adUnit?.fetchDemand(request) {

        // 4. Load a GAM Rewarded Ad
        RewardedAd.load(
            this,
            AD_UNIT_ID,
            request,
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
private fun createListener(): RewardedAdLoadCallback {
    return object : RewardedAdLoadCallback() {
        override fun onAdLoaded(rewardedAd: RewardedAd) {

            // 5. Display rewarded ad
            rewardedAd.show(
                this@GamOriginalApiVideoRewardedActivity
            ) { }
        }

        override fun onAdFailedToLoad(loadAdError: LoadAdError) {
            Log.e("GAM", "Ad failed to load: $loadAdError")
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

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide an `AdManagerAdRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

## Step 4: Load a GAM Rewarded Ad
{:.no_toc}

Now you should request the ad from GAM. If the `AdManagerAdRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM, and GMA SDK will render its creative.

Be sure that you make the ad request with the same `AdManagerAdRequest` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

## Step 5: Present the Rewarded Ad
{:.no_toc}

Follow the [GMA SDK guide](https://developers.google.com/ad-manager/mobile-ads-sdk/android/rewarded#show_the_ad) to display a rewarded ad right after receiving it or later in a natural pauses in the flow of an app.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK Android integration](/prebid-mobile/pbm-api/android/code-integration-android.html)
- [Prebid SDK Global Parameters - Android](/prebid-mobile/pbm-api/android/pbm-targeting-android.html)
