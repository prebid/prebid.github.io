---
layout: page_v2
title: Integrating Prebid SDK Android with AppLovin MAX
description: Integrating Prebid SDK Android with AppLovin MAX
sidebarType: 2
---

# Prebid SDK Android with AppLovin MAX Integration Method
{:.no_toc} 

- TOC
{:toc}

{% include mobile/intro-applovin.md platform="android" %}

## Setup

Prebid SDK is integrated into AppLovin MAX setup via custom adapters. To integrate Prebid Adapters into your app, add the following lines into your build.gradle files:

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
implementation('org.prebid:prebid-mobile-sdk-max-adapters:x.x.x')
```

## Adunit Specific Instructions

### Banners

Integration example:

```kotlin
// 1. Create MaxAdView
adView = MaxAdView(adUnitId, requireContext())
adView?.setListener(createListener())
adWrapperView.addView(adView)
        
// 2. Create MaxMediationBannerUtils
val mediationUtils = MaxMediationBannerUtils(adView)
    
// 3. Create MediationBannerAdUnit
adUnit = MediationBannerAdUnit(
    requireContext(),
    configId,
    AdSize(width, height),
    mediationUtils
)
    
// 4. Make a bid request
adUnit?.fetchDemand {
    
    // 5. Make an ad request to MAX
    adView?.loadAd()
}
```

#### Step 1: Create MaxAdView
{:.no_toc}

This step is totally the same as for original [MAX integration](https://dash.applovin.com/documentation/mediation/android/getting-started/banners#loading-and-showing-banners-programmatically). You don't have to make any modifications here.


#### Step 2: Create MaxMediationBannerUtils
{:.no_toc}

The `MaxMediationBannerUtils` is a helper class, which performs certain utilty work for the `MediationBannerAdUnit`, like passing the targeting keywords to the adapters and checking the visibility of the ad view.

#### Step 3: Create MediationBannerAdUnit
{:.no_toc}

The `MediationBannerAdUnit` is a part of Prebid mediation API. This class is responsible for making bid request and providing the winning bid and targeting keywords to mediating SDKs.  

#### Step 4: Make bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to prebid server and provides a result in a completion handler.

#### Step 5: Make an Ad Reuest
{:.no_toc}

Now you should make a regular MAX's ad request. Everything else will be handled by prebid adapters.

### Interstitials

Integration example:

```kotlin
// 1. Create MaxInterstitialAd
maxInterstitialAd = MaxInterstitialAd(adUnitId, activity)
maxInterstitialAd?.setListener(createListener())
        
// 2. Create MaxMediationInterstitialUtils
val mediationUtils = MaxMediationInterstitialUtils(maxInterstitialAd)

// 3. Create MediationInterstitialAdUnit
adUnit = MediationInterstitialAdUnit(
            activity,
            configId,
            EnumSet.of(AdUnitFormat.BANNER),
            mediationUtils
        )
        
// 4. Make a bid request
adUnit?.fetchDemand {
 
    // 5. Make an ad request to MAX
    maxInterstitialAd?.loadAd()
}

```

The **default** ad format for interstitial is **DISPLAY**. In order to make a `multiformat bid request`, set the respective values into the `adUnitFormats` parameter.

```
adUnit = MediationInterstitialAdUnit(
            activity,
            configId,
            EnumSet.of(AdUnitFormat.BANNER, AdUnitFormat.VIDEO),
            mediationUtils
        )
```

#### Step 1: Create MaxInterstitialAd 
{:.no_toc}

This step is totally the same as for original [MAX integration](https://dash.applovin.com/documentation/mediation/android/getting-started/interstitials). You don't have to make any modifications here.


#### Step 2: Create MaxMediationInterstitialUtils
{:.no_toc}

The `MaxMediationInterstitialUtils` is a helper class, which performs certain utilty work for the `MediationInterstitialAdUnit`, like passing the targeting keywords to the adapters and checking the visibility of the ad view.

#### Step 3: Create MediationInterstitialAdUnit
{:.no_toc}

The `MediationInterstitialAdUnit` is part of the prebid mediation API. This class is responsible for making a bid request and providing a winning bid to the mediating SDKs.  

#### Step 4: Make bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to prebid server and provides a result in a completion handler.

#### Step 5: Make an Ad Reuest
{:.no_toc}

Now you should make a regular MAX's ad request. Everything else will be handled by GMA SDK and prebid adapters.

#### Steps 6: Display an ad
{:.no_toc}

Once you receive the ad it will be ready for display. Folow the [MAX instructions](https://dash.applovin.com/documentation/mediation/android/getting-started/interstitials#showing-an-interstitial-ad) about how to do it. 

### Rewarded Video

Integration example:

```swift
// 1. Get an instance of MaxRewardedAd
maxRewardedAd = MaxRewardedAd.getInstance(adUnitId, activity)
maxRewardedAd?.setListener(createListener())

// 2. Create MaxMediationRewardedUtils
val mediationUtils = MaxMediationRewardedUtils(maxRewardedAd)
    
// 3. Create MediationRewardedVideoAdUnit
adUnit = MediationRewardedVideoAdUnit(
            activity,
            configId,
            mediationUtils
        )
        
// 4. Make a bid request
adUnit?.fetchDemand {

    // 5. Make an ad request to MAX
    maxRewardedAd?.loadAd()
}
```

The way of displaying the rewarded ad is the same as for the Interstitial Ad. 

To be notified when user earns a reward follow the [MAX intructions](https://dash.applovin.com/documentation/mediation/android/getting-started/rewarded-ads#accessing-the-amount-and-currency-for-a-rewarded-ad).

#### Step 1: Get an instance of MaxRewardedAd
{:.no_toc}

This step is totally the same as for original [MAX integration](https://dash.applovin.com/documentation/mediation/android/getting-started/rewarded-ads). You don't have to make any modifications here.

#### Step 2: Create MaxMediationRewardedUtils
{:.no_toc}

The `MaxMediationRewardedUtils` is a helper class, which performs certain utilty work for the `MediationRewardedVideoAdUnit`, like passing the targeting keywords to the adapters.

#### Step 3: Create MediationRewardedVideoAdUnit
{:.no_toc}

The `MediationRewardeVideoAdUnit` is part of the prebid mediation API. This class is responsible for making a bid request and providing a winning bid and targeting keywords to the adapters.  

#### Step 4: Make bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the prebid server and provides a result in a completion handler.

#### Step 5: Make an Ad Reuest
{:.no_toc}

Now you should make a regular MAX's ad request. Everything else will be handled by GMA SDK and prebid adapters.

#### Steps 6: Display an ad
{:.no_toc}

Once the rewarded ad is received you can display it. Folow the [MAX instructions](https://dash.applovin.com/documentation/mediation/android/getting-started/rewarded-ads#showing-a-rewarded-ad) for the details. 
### Native Ads

Integration example:

```
// 1. Create MaxNativeAdLoader
nativeAdLoader = MaxNativeAdLoader(adUnitId, requireActivity())
nativeAdLoader.setNativeAdListener(createNativeAdListener(viewContainer))
nativeAdLoader.setRevenueListener(createRevenueListener())

// 2. Create and configure MediationNativeAdUnit
nativeAdUnit = NativeAdUnit(configId)

nativeAdUnit.setContextType(NativeAdUnit.CONTEXT_TYPE.SOCIAL_CENTRIC)
nativeAdUnit.setPlacementType(NativeAdUnit.PLACEMENTTYPE.CONTENT_FEED)
nativeAdUnit.setContextSubType(NativeAdUnit.CONTEXTSUBTYPE.GENERAL_SOCIAL)
 
// 3. Set up assets for bid request
// See the code below

// 4. Set up event tracker for bid request
// See the code below

// 5. Make a bid request
nativeAdUnit.fetchDemand(nativeAdLoader) {
// 6. Make an ad request to MAX
    self?.nativeAdLoader?.loadAd(into: self?.createNativeAdView())
}
```

#### Step 1: Create MaxNativeAdLoader
{:.no_toc}

Prepare the `MaxNativeAdLoader` object before you make a bid request. It will be needed for prebid mediation utils. 

#### Step 2: Create and configure NativeAdUnit
{:.no_toc}

The `NativeAdUnit` class is responsible for making a bid request and providing a winning bid and targeting keywords. Fot the better targetting you should provide additional properties like `conteaxtType` and `placemantType`. 
 
#### Step 3: Set up assets for bid request
{:.no_toc}

The bid request for native ads should have the description of expected assets. The full spec for the native template you can find in the [Native Ad Specification from IAB](https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf). 

The example of creating the assets array:

```
val title = NativeTitleAsset()
title.setLength(90)
title.isRequired = true
nativeAdUnit.addAsset(title)

val icon = NativeImageAsset(20, 20, 20, 20)
icon.imageType = NativeImageAsset.IMAGE_TYPE.ICON
icon.isRequired = true
nativeAdUnit.addAsset(icon)

val image = NativeImageAsset(200, 200, 200, 200)
image.imageType = NativeImageAsset.IMAGE_TYPE.MAIN
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
```

#### Step 4: Set up event tracker for bid request
{:.no_toc}

The bid request for mative ads may have a descrition of expected event trackers. The full spec for the Native template you can find in the [Native Ad Specification from IAB](https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf). 

The example of creating the event trackers array:

```
val methods: ArrayList<NativeEventTracker.EVENT_TRACKING_METHOD> = ArrayList()
methods.add(NativeEventTracker.EVENT_TRACKING_METHOD.IMAGE)
methods.add(NativeEventTracker.EVENT_TRACKING_METHOD.JS)
try {
    val tracker = NativeEventTracker(NativeEventTracker.EVENT_TYPE.IMPRESSION, methods)
    nativeAdUnit.addEventTracker(tracker)
} catch (e: Exception) {
    e.printStackTrace()
}
```

#### Step 5: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to prebid server and provides a result in a completion handler.
    
#### Step 6: Load Native ad
{:.no_toc}

Now just load a native ad from MAX according to the [MAX instructions](https://dash.applovin.com/documentation/mediation/android/getting-started/native-manual#load-the-native-ad). 

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK Android Integration](/prebid-mobile/pbm-api/android/code-integration-android.html)
- [Prebid SDK Android Global Parameters](/prebid-mobile/pbm-api/android/pbm-targeting-android.html)
