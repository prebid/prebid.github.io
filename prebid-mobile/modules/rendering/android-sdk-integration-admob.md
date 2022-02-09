---

layout: page_v2
title: Prebid Mobile Rendering GAM Line Item Setup
description: Prebid Mobile Rendering Modules GAM line item setup
sidebarType: 2

---

# AdMob Integration

The integration of Prebid Mobile with Google AdMob assumes that publisher has an AdMob account has already integrated the Google Mobile Ads SDK (GMA SDK) into the app project. 


If you do not have GAM SDK in the app yet, refer the the [Google Integration Documentation](https://developers.google.com/admob/android/quick-start).




## AdMob Integration Overview

![Rendering with GAM as the Primary Ad Server](/assets/images/prebid-mobile/modules/rendering/prebid-in-app-bidding-overview-admob.png)

**Steps 1-2** Prebid SDK makes a bid request. Prebid server runs an auction and returns the winning bid.

**Step 3** GMA SDK makes an ad request. AdMob returns the mediation chain with respective ad sources.

**Step 4** For each Prebid Ad Source, the GMA SDK instantiates an adapter. 

**Step 5** The adapter verifies the targeting keywords of the winning bid and server properties of the given Ad Source. If they match adapter will render the winning bid. Otherwise, it will fail with "no ad" immediately and the next ad source will instantiate the same adapter but for another set of server parpams.

They can be integrated using these API categories.

- [**Banner API**](#banner-api) - for *Display Banner* and *Outstream Video*
- [**Interstitial API**](#interstitial-api) - for *Display* and *Video* Interstitials
- [**Rewarded API**](#rewarded-api) - for *Rewarded Video*
- [**Native API**](#native-api) - for *Native Ads*)


## Init Prebid Rendering Module

To start running bid requests you should provide the Prebid Server URL and account ID:

```
PrebidRenderingSettings.setBidServerHost(HOST)
PrebidRenderingSettings.setAccountId(YOUR_ACCOUNT_ID)
```

The best place to do it is the `onCreate()` method of your Application class. The `account ID` is an identifier of the **Stored Request** on the prebid server.

### Prebid Adapters

To integrate Prebid Adapters just add the following lines in your build.gradle files:

Root build.gradle

```
allprojects {
    repositories {
      ...
      mavenCentral()
      ...
    }
}
```

App module build.gradle:

```
implementation('org.prebid:prebid-mobile-sdk-admob-adapters:x.x.x')
```

## Banner API

Integration example:


``` kotlin
// 1. Create AdView and AdRequest
bannerView = AdView(activity)
bannerView?.adSize = AdSize.BANNER
bannerView?.adUnitId = adUnitId

val extras = Bundle()
val request = AdRequest
        .Builder()
        .addCustomEventExtrasBundle(PrebidBannerAdapter::class.java, extras)
        .build()

// 2. Create AdMobBannerMediationUtils
val mediationUtils = AdMobBannerMediationUtils(extras, bannerView)

// 3. Create MediationBannerAdUnit
adUnit = MediationBannerAdUnit(
    wrapper.context,
    configId,
    org.prebid.mobile.rendering.bidding.data.AdSize(width, height),
    mediationUtils
)
adUnit?.setRefreshInterval(autoRefreshTime / 1000)

// 4. Make a bid request
adUnit?.fetchDemand { result ->
    Log.d("Prebid", "Fetch demand result: $result")
    
    // 5. Request the ad
    bannerView?.loadAd(request)
}
```

#### Step 1: Create AdView and AdRequest

This step is totally the same as for pure [AdMob integration](https://developers.google.com/admob/android/banner). You don't have to make any modifications here.


#### Step 2: Create AdMobMediationBannerUtils

The `AdMobBannerMediationUtils` is a helper class, wich performs certain utilty work for `MediationBannerAdUnit`, like passing the targeting keywords to adapters and checking the visibility of the ad view.

#### Step 3: Create MediationBannerAdUnit

The `MediationBannerAdUnit` is part of Prebid mediation API. This class is responsible for making bid request and providing the winning bid and targeting keywords to mediating SDKs.  

#### Step 4: Make bid request

The `fetchDemand` method makes a bid request to prebid server and provide the results in the completion handler.

#### Step 5: Make an Ad Reuest

Now you should just make a regular AdMob's ad request. Evetything else will be handled by GMA SDK and prebid adapters.

## Interstitial API

Integration example:

``` kotlin
// 1. Create AdRequest
val extras = Bundle()
val request = AdRequest
    .Builder()
    .addCustomEventExtrasBundle(PrebidInterstitialAdapter::class.java, extras)
    .build()

// 2. Create AdMobInterstitialMediationUtils
val mediationUtils = AdMobInterstitialMediationUtils(extras)

// 3. Create MediationInterstitialAdUnit
adUnit = MediationInterstitialAdUnit(
    activity,
    configId,
    AdUnitFormat.DISPLAY,
    mediationUtils
)

// 4. Make bid request
adUnit?.fetchDemand { result ->
    Log.d("Prebid", "Fetch demand result: $result")

    // 5. Make ad request
    InterstitialAd.load(activity, adUnitId, request, object : InterstitialAdLoadCallback() {
        override fun onAdLoaded(interstitial: InterstitialAd) {
            interstitialAd = interstitial

            // 6. Display the ad
            interstitialAd?.show(activity)
        }

        override fun onAdFailedToLoad(error: LoadAdError) {
            interstitialAd = null
        }
    })
}
```

#### Step 1: Create AdRequest

This step is totally the same as for pure [AdMob integration](https://developers.google.com/admob/android/interstitial). You don't have to make any modifications here.

#### Step 2: Create AdMobInterstitialMediationUtils

The `AdMobInterstitialMediationUtils` is a helper class, wich performs certain utilty work for `MediationInterstitialAdUnit`, like passing the targeting keywords to adapters and checking the visibility of the ad view.

#### Step 3: Create MediationInterstitialAdUnit

The `MediationInterstitialAdUnit` is part of Prebid mediation API. This class is responsible for making bid request and providing the winning bid and targeting keywords to mediating SDKs.  

If you need to make a bid request for `video` ad - provide the respective ad format `AdUnitFormat.VIDEO` to the constructor of `MediationInterstitialAdUnit`:

```
adUnit = MediationInterstitialAdUnit(
    activity,
    configId,
    AdUnitFormat.VIDEO,
    mediationUtils
)
```

#### Step 4: Make a bid request

The `fetchDemand` method makes a bid request to prebid server and provide the results in the completion handler.

#### Step 5: Make an ad reuest

Now you should just make a regular AdMob's ad request. Evetything else will be handled by GMA SDK and prebid adapters.

#### Step 6: Display an ad

Once you received the interstitial ad it is ready for display. You can do it right in the listener or later when it makes sense to your app.


## Rewarded API

Integration example:


``` kotlin
// 1. Create AsRequest
val extras = Bundle()
val request = AdRequest
    .Builder()
    .addNetworkExtrasBundle(PrebidRewardedAdapter::class.java, extras)
    .build()

// 2. Create AdMobRewardedMediationUtils
val mediationUtils = AdMobRewardedMediationUtils(extras)

// 3. Create MediationRewardedVideoAdUnit
adUnit = MediationRewardedVideoAdUnit(activity, configId, mediationUtils)

// 4. Make a bid request
adUnit?.fetchDemand { result ->
    Log.d("Prebid", "Fetch demand result: $result")

    // 5. Make an ad request 
    RewardedAd.load(activity, adUnitId, request, object : RewardedAdLoadCallback() {
        override fun onAdLoaded(ad: RewardedAd) {
            Log.d(TAG, "Ad was loaded.")
            rewardedAd = ad

            // 6. Display an ad 
            rewardedAd?.show(activity) { rewardItem ->
                val rewardAmount = rewardItem.amount
                val rewardType = rewardItem.type
                Log.d(TAG, "User earned the reward ($rewardAmount, $rewardType)")
            }
        }

        override fun onAdFailedToLoad(adError: LoadAdError) {
            Log.e(TAG, adError.message)
            rewardedAd = null
        }
    })
}
```

#### Step 1: Create AdRequest

This step is totally the same as for pure [AdMob integration](https://developers.google.com/admob/android/rewarded). You don't have to make any modifications here.

#### Step 2: Create AdMobRewardedMediationUtils

The `AdMobRewardedMediationUtils ` is a helper class, wich performs certain utilty work for `MediationInterstitialAdUnit`, like passing the targeting keywords to adapters and checking the visibility of the ad view.

#### Step 3: Create MediationRewardedVideoAdUnit

The `MediationRewardedVideoAdUnit` is part of Prebid mediation API. This class is responsible for making bid request and providing the winning bid and targeting keywords to mediating SDKs.


#### Step 4: Make a bid request

The `fetchDemand` method makes a bid request to prebid server and provide the results in the completion handler.

#### Step 5: Make an ad reuest

Now you should just make a regular AdMob's ad request. Evetything else will be handled by GMA SDK and prebid adapters.

#### Step 6: Display an ad

Once you received the rewarded ad it is ready for display. You can do it right in the listener or later when it makes sense to your app.
