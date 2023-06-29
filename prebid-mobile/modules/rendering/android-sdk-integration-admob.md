---

layout: page_v2
title: Prebid Mobile Rendering GAM Line Item Setup
description: Prebid Mobile Rendering Modules GAM line item setup
sidebarType: 2

---

# AdMob Integration

{:.no_toc}

The integration of Prebid Mobile with Google AdMob assumes that the publisher has an AdMob account and has already integrated the Google Mobile Ads SDK (GMA SDK) into the app. 

See the [Google's integration documentation](https://developers.google.com/admob/android/quick-start) for the AdMob integration details.

Prebid is integrated into the AdMob monetization via adapters.

* TOC
{:toc}

## AdMob Integration Overview

![Rendering with GAM as the Primary Ad Server](/assets/images/prebid-mobile/modules/rendering/prebid-in-app-bidding-overview-admob.png)

**Steps 1-2** Prebid SDK makes a bid request. Prebid server runs an auction and returns the winning bid.

**Step 3** GMA SDK makes an ad request. AdMob returns the mediation chain with respective ad sources.

**Step 4** For each prebid's ad source, the GMA SDK sequentially instantiates an adapter. 

**Step 5** The adapter verifies the targeting keywords of the winning bid and the server properties of the given ad source. If they match the adapter will render the winning bid. Otherwise, it will immediately fail with a "no ad" error and the next ad source will instantiate the same adapter but for another set of server params.

## Integrate Prebid Adapters

To integrate Prebid Adapters for AdMob just add the following lines into your build.gradle files:

Root build.gradle

```gradle
allprojects {
    repositories {
      ...
      mavenCentral()
      ...
    }
}
```

App module build.gradle:

```gradle
implementation('org.prebid:prebid-mobile-sdk-admob-adapters:x.x.x')
```

## Banner API

Integration example:

```kotlin
// 1. Create AdView and AdRequest
bannerView = AdView(activity)
bannerView?.adSize = AdSize.BANNER
bannerView?.adUnitId = adUnitId
adWrapperView.addView(bannerView)

val extras = Bundle()
val request = AdRequest
        .Builder()
        .addNetworkExtrasBundle(PrebidBannerAdapter::class.java, extras)
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

### Step 1: Create AdView and AdRequest

{:.no_toc}

This step is the same as for the original [AdMob integration](https://developers.google.com/admob/android/banner). You don't have to make any modifications here.

### Step 2: Create AdMobMediationBannerUtils

{:.no_toc}

The `AdMobBannerMediationUtils` is a helper class, which performs certain utilty work for the `MediationBannerAdUnit`, like passing the targeting keywords to the adapters and checking the visibility of the ad view.

### Step 3: Create MediationBannerAdUnit

{:.no_toc}

The `MediationBannerAdUnit` is part of the prebid mediation API. This class is responsible for making the bid request and providing the winning bid and targeting keywords to the mediating SDKs.  

### Step 4: Make a bid request

{:.no_toc}

The `fetchDemand` method makes a bid request to the prebid server and provides a result in a completion handler.

### Step 5: Make an Ad Request

{:.no_toc}

Now you should just make a regular AdMob's ad request. Everything else will be handled by GMA SDK and prebid adapters.

## Interstitial API

Integration example:

```kotlin
// 1. Create AdRequest
val extras = Bundle()
val request = AdRequest
    .Builder()
    .addNetworkExtrasBundle(PrebidInterstitialAdapter::class.java, extras)
    .build()

// 2. Create AdMobInterstitialMediationUtils
val mediationUtils = AdMobInterstitialMediationUtils(extras)

// 3. Create MediationInterstitialAdUnit
adUnit = MediationInterstitialAdUnit(
    activity,
    configId,
    AdUnitFormat.BANNER,
    mediationUtils
)

// 4. Make a bid request
adUnit?.fetchDemand { result ->
    Log.d("Prebid", "Fetch demand result: $result")

    // 5. Make an ad request
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

### Step 1: Create AdRequest

{:.no_toc}

This step is the same as for original [AdMob integration](https://developers.google.com/admob/android/interstitial). You don't have to make any modifications here.

### Step 2: Create AdMobInterstitialMediationUtils

{:.no_toc}

The `AdMobInterstitialMediationUtils` is a helper class, which performs certain utilty work for the `MediationInterstitialAdUnit`, like passing the targeting keywords to adapters.

### Step 3: Create MediationInterstitialAdUnit

{:.no_toc}

The `MediationInterstitialAdUnit` is part of the prebid mediation API. This class is responsible for making a bid request and providing the winning bid and targeting keywords to mediating SDKs.  

The **default** ad format for interstitial is **DISPLAY**. In order to make a `multiformat bid request`, set the respective values into the `adUnitFormats` parameter.

```kotlin
adUnit = MediationInterstitialAdUnit(
            activity,
            configId,
            EnumSet.of(AdUnitFormat.BANNER, AdUnitFormat.VIDEO),
            mediationUtils
        )
```

### Step 4: Make a bid request

{:.no_toc}

The `fetchDemand` method makes a bid request to the prebid server and provides a result in a completion handler.

### Step 5: Make an ad request

{:.no_toc}

Now you should just make a regular AdMob's ad request. Evetything else will be handled by GMA SDK and prebid adapters.

### Step 6: Display an ad

{:.no_toc}

Once you receive the ad it will be ready for display. You can show interstitial right in the listener or later according to the app logic.

## Rewarded API

Integration example:

```kotlin
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

### Step 1: Create AdRequest

{:.no_toc}

This step is the same as for the original [AdMob integration](https://developers.google.com/admob/android/rewarded). You don't have to make any modifications here.

### Step 2: Create AdMobRewardedMediationUtils

{:.no_toc}

The `AdMobRewardedMediationUtils` is a helper class, which performs certain utilty work for the `MediationInterstitialAdUnit`, like passing the targeting keywords to adapters.

### Step 3: Create MediationRewardedVideoAdUnit

{:.no_toc}

The `MediationRewardedVideoAdUnit` is part of the prebid mediation API. This class is responsible for making bid request and managing the winning bid.

### Step 4: Make a bid request

{:.no_toc}

The `fetchDemand` method makes a bid request to the prebid server and provides a result in a completion handler.

### Step 5: Make an ad request

{:.no_toc}

Now you should just make a regular AdMob's ad request. Evetything else will be handled by GMA SDK and prebid adapters.

### Step 6: Display an ad

{:.no_toc}

Once you receive the ad it will be ready for display. You can show interstitial right in the listener or later according to the app logic.

## Native API

Integration example:

```kotlin
// 1. Create AdLoader and AdRequest
val nativeAdOptions = NativeAdOptions
    .Builder()
    .build()

val adLoader = AdLoader
    .Builder(wrapper.context, adUnitId)
    .forNativeAd { ad: NativeAd ->
        nativeAd = ad
        createCustomView(wrapper, nativeAd!!)
    }
    .withAdListener(object : AdListener() {
        override fun onAdFailedToLoad(adError: LoadAdError) {
            Log.e(TAG, "Error: ${adError.message}")
        }
    })
    .withNativeAdOptions(nativeAdOptions)
    .build()

val extras = Bundle()
val adRequest = AdRequest
    .Builder()
    .addNetworkExtrasBundle(PrebidInterstitialAdapter::class.java, extras)
    .build()

// 2. Create Native AdUnit
val nativeAdUnit = NativeAdUnit(configId)

// 3. Configure NativeAdUnit
configureNativeAdUnit(nativeAdUnit)

// 4. Make a bid request
nativeAdUnit.fetchDemand(extras) { resultCode ->
    Log.d(TAG, "Fetch demand result: $resultCode")

    // 5. Make an ad request
    adLoader.loadAd(adRequest)
}
```

### Step 1: Create AdRequest

{:.no_toc}

Prepare the `AdLoader` and `AdRequest` objects before you make the bid request. They are needed for prebid mediation utils. Follow the [AdMob integration instructions](https://developers.google.com/admob/android/native/start) for this step.

### Step 2: Create NativeAdUnit

{:.no_toc}

The `NativeAdUnit` is responsible for making bid requests. Once the bid responce is received you can load an ad from AdMob.

### Step 3: Configure NativeAdUnit

{:.no_toc}

The bid request for native ad should have a description of expected assets. The full spec for the Native template can be found in the [Native Ad Specification from IAB](https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf).

Example of creating the assets array and configuring the `NativeAdUnit`:

```kotlin
private fun configureNativeAdUnit(nativeAdUnit: NativeAdUnit) {

    // Configure Ad Unit
    nativeAdUnit.setContextType(NativeAdUnit.CONTEXT_TYPE.SOCIAL_CENTRIC)
    nativeAdUnit.setPlacementType(NativeAdUnit.PLACEMENTTYPE.CONTENT_FEED)
    nativeAdUnit.setContextSubType(NativeAdUnit.CONTEXTSUBTYPE.GENERAL_SOCIAL)

    // Create the list of required assets
    val title = NativeTitleAsset()
    title.setLength(90)
    title.isRequired = true
    nativeAdUnit.addAsset(title)

    val icon = NativeImageAsset()
    icon.imageType = NativeImageAsset.IMAGE_TYPE.ICON
    icon.wMin = 20
    icon.hMin = 20
    icon.isRequired = true
    nativeAdUnit.addAsset(icon)

    val image = NativeImageAsset()
    image.imageType = NativeImageAsset.IMAGE_TYPE.MAIN
    image.hMin = 200
    image.wMin = 200
    image.isRequired = true
    nativeAdUnit.addAsset(image)

    val data = NativeDataAsset()
    data.len = 90
    data.dataType = NativeDataAsset.DATA_TYPE.SPONSORED
    data.isRequired = true
    nativeAdUnit.addAsset(data)

    val body = NativeDataAsset()
    body.isRequired = true
    body.dataType = NativeDataAsset.DATA_TYPE.DESC
    nativeAdUnit.addAsset(body)

    val cta = NativeDataAsset()
    cta.isRequired = true
    cta.dataType = NativeDataAsset.DATA_TYPE.CTATEXT
    nativeAdUnit.addAsset(cta)

    // Create the list of required event trackers
    val methods: ArrayList<NativeEventTracker.EVENT_TRACKING_METHOD> = ArrayList()
    methods.add(NativeEventTracker.EVENT_TRACKING_METHOD.IMAGE)
    methods.add(NativeEventTracker.EVENT_TRACKING_METHOD.JS)
    try {
        val tracker = NativeEventTracker(NativeEventTracker.EVENT_TYPE.IMPRESSION, methods)
        nativeAdUnit.addEventTracker(tracker)
    } catch (e: Exception) {
        e.printStackTrace()
    }
}
```

### Step 4: Make a bid request

{:.no_toc}

The `fetchDemand` method makes a bid request to the prebid server and provides a result in a completion handler.

### Step 5: make an ad request

{:.no_toc}

Now load an native ad from AdMob according to the [AdMob instructions](https://developers.google.com/admob/android/native/start). Everything else will be handled by GMA SDK and prebid adapters.
