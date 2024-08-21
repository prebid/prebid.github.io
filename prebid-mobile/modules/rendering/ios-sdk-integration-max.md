---
layout: page_v2
title: Integrating Prebid SDK iOS with AppLovin MAX
description: Integrating Prebid SDK iOS with AppLovin MAX
sidebarType: 2
---

# Prebid SDK iOS with AppLovin MAX Integration Method
{:.no_toc}

* TOC
{:toc}

{% include mobile/intro-applovin.md platform="ios" %}

## Setup

Prebid SDK is integrated into AppLovin MAX setup thru custom adapters. To integrate Prebid adapters into your app add the following line to your Podfile:

```
pod 'PrebidMobileMAXAdapters'
```

## Adunit Specific Instructions

### Banners

Integration example:

```swift
// 1. Create MAAdView
adBannerView = MAAdView(adUnitIdentifier: maxAdUnitId)
adBannerView?.delegate = self
        
// 2. Create MAXMediationBannerUtils
mediationDelegate = MAXMediationBannerUtils(adView: adBannerView!)
    
// 3. Create MediationBannerAdUnit
adUnit = MediationBannerAdUnit(configID: prebidConfigId,
                                       size: adUnitSize,
                                       mediationDelegate: mediationDelegate!)
    
// 4. Make a bid request
adUnit?.fetchDemand { [weak self] result in

    // 5. Make an ad request to MAX
    self?.adBannerView.loadAd()
}
```

#### Step 1: Create MAAdView
{:.no_toc}

This step is the same as for the original [MAX integration](https://dash.applovin.com/documentation/mediation/ios/getting-started/banners#loading-a-banner). You don't have to make any modifications here.


#### Step 2: Create MAXMediationBannerUtils
{:.no_toc}

The `MAXMediationBannerUtils ` is a helper class, which performs certain utilty work for the `MediationBannerAdUnit`, like passing the targeting keywords to the adapters and checking the visibility of the ad view.

#### Step 3: Create MediationBannerAdUnit
{:.no_toc}

The `MediationBannerAdUnit` is a part of the Prebid Mediation API. This class is responsible for making bid request and providing the winning bid and targeting keywords to mediating SDKs.  

#### Step 4: Make bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to Prebid Server and provides a result in a completion handler.

#### Step 5: Make an Ad Reuest
{:.no_toc}

Make a regular MAX's ad request. Everything else will be handled by prebid adapters.

### Interstitials

Integration example:

```swift
// 1. Create MAInterstitialAd
interstitial = MAInterstitialAd(adUnitIdentifier: maxAdUnitId)
interstitial.delegate = self

// 2. Create MAXMediationInterstitialUtils
mediationDelegate = MAXMediationInterstitialUtils(interstitialAd: interstitial!)

// 3. Create MediationInterstitialAdUnit
adUnit = MediationInterstitialAdUnit(configId: prebidConfigId,
                                             minSizePercentage: CGSize(width: 30, height: 30),
                                             mediationDelegate: mediationDelegate!)

// 4. Make a bid request
adUnit?.fetchDemand { [weak self] result in
    guard let self = self else { return }
            
    guard result == .prebidDemandFetchSuccess else {
        self.fetchDemandFailedButton.isEnabled = true
        return
    }
    
    // 5. Make an ad request to MAX
    self.interstitial?.load()
})
```

The **default** ad format for interstitial is **.banner**. In order to make a `multiformat bid request` set the respective values in the `adFormats` property.

```swift
// Make bid request for video ad                                     
adUnit?.adFormats = [.video]

// Make bid request for both video amd banner ads                                     
adUnit?.adFormats = [.video, .banner]

// Make bid request for banner ad (default behaviour)                                     
adUnit?.adFormats = [.banner]

```

#### Step 1: Create MAInterstitialAd 
{:.no_toc}

This step is the same as for the original [MAX integration](https://dash.applovin.com/documentation/mediation/ios/getting-started/interstitials). You don't have to make any modifications here.


#### Step 2: Create MAXMediationInterstitialUtils
{:.no_toc}

The `MAXMediationInterstitialUtils` is a helper class, which performs certain utilty work for the `MediationInterstitialAdUnit `, like passing the targeting keywords to the adapters and checking the visibility of the ad view.

#### Step 3: Create MediationInterstitialAdUnit
{:.no_toc}

The `MediationInterstitialAdUnit` is a part of the Prebid Mediation API. This class is responsible for making a bid request and providing a winning bid to the mediating SDKs.  

#### Step 4: Make bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to Prebid Server and provides a result in a completion handler.

#### Step 5: Make an Ad Reuest
{:.no_toc}

Now you should make a regular MAX's ad request. Everything else will be handled by GMA SDK and prebid adapters.

#### Steps 6: Display an ad
{:.no_toc}

Once you receive the ad it will be ready for display. Follow the [MAX instructions](https://dash.applovin.com/documentation/mediation/ios/getting-started/interstitials#showing-an-interstitial-ad) for displaying an ad. 

### Rewarded Video

Integration example:

```swift
// 1. Get an instance of MARewardedAd
rewarded = MARewardedAd.shared(withAdUnitIdentifier: maxAdUnitId)
rewarded.delegate = self

// 2. Create MAXMediationRewardedUtils
mediationDelegate = MAXMediationRewardedUtils(rewardedAd: rewarded!)
    
// 3. Create MediationRewardedAdUnit
adUnit = MediationRewardedAdUnit(configId: prebidConfigId, mediationDelegate: mediationDelegate!)
        
// 4. Make a bid request
adUnit?.fetchDemand { [weak self] result in
    guard let self = self else { return }
    
// 5. Make an ad request to MAX
self.rewarded?.load()
}
```

The process for displaying the rewarded ad is the same as for displaying the Interstitial Ad. 

To be notified when a user earns a reward follow the [MAX intructions](https://dash.applovin.com/documentation/mediation/ios/getting-started/rewarded-ads#loading-a-rewarded-ad).

#### Step 1: Get an instance of MARewardedAd
{:.no_toc}

This step is the same as for the original [MAX integration](https://dash.applovin.com/documentation/mediation/ios/getting-started/rewarded-ads). You don't have to make any modifications here.


#### Step 2: Create MAXMediationRewardedUtils
{:.no_toc}

The `MAXMediationRewardedUtils` is a helper class, which performs certain utilty work for the `MediationRewardedAdUnit`, like passing the targeting keywords to the adapters.

#### Step 3: Create MediationRewardedAdUnit
{:.no_toc}

The `MediationRewardedAdUnit` is a part of the Prebid Mediation API. This class is responsible for making a bid request and providing a winning bid and targeting keywords to the adapters.  

#### Step 4: Make bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server and provides a result in a completion handler.

#### Step 5: Make an Ad Reuest
{:.no_toc}

Make a regular MAX's ad request. Everything else will be handled by GMA SDK and prebid adapters.

#### Steps 6: Display an ad
{:.no_toc}

Once the rewarded ad is received you can display it. Follow the [MAX instructions](https://dash.applovin.com/documentation/mediation/ios/getting-started/rewarded-ads#showing-a-rewarded-ad) for the details. 

### Native Ads

Integration example:

```swift
// 1. Create MANativeAdLoader
nativeAdLoader = MANativeAdLoader(adUnitIdentifier: maxAdUnitId)
nativeAdLoader?.nativeAdDelegate = self

// 2. Create MAXMediationNativeUtils
mediationDelegate = MAXMediationNativeUtils(nativeAdLoader: nativeAdLoader!)

// 3. Create and configure MediationNativeAdUnit
nativeAdUnit = MediationNativeAdUnit(configId: prebidConfigId,
                                     mediationDelegate: mediationDelegate!)

nativeAdUnit.setContextType(ContextType.Social)
nativeAdUnit.setPlacementType(PlacementType.FeedContent)
nativeAdUnit.setContextSubType(ContextSubType.Social)
 
// 4. Set up assets for bid request
nativeAdUnit.addNativeAssets(nativeAssets)

// 5. Set up event tracker for bid request
nativeAdUnit.addEventTracker(eventTrackers)

// 6. Make a bid request
nativeAdUnit.fetchDemand { [weak self] result in

    // 7. Make an ad request to MAX
    self?.nativeAdLoader?.loadAd(into: self?.createNativeAdView())
}
```

#### Step 1: Create MANativeAdLoader
{:.no_toc}

Prepare the `MANativeAdLoader` object before you make a bid request. It will be needed for prebid mediation utils. 

#### Step 2: Create MAXMediationNativeUtils
{:.no_toc}

The `MAXMediationNativeUtils` is a helper class, which performs certain utilty work for `MediationNativeAdUnit`, like passing the targeting keywords to adapters and checking the visibility of the ad view.

#### Step 3: Create and configure MediationNativeAdUnit
{:.no_toc}

The `MediationNativeAdUnit` is a part of the Prebid Mediation API. This class is responsible for making a bid request and providing a winning bid and targeting keywords to the adapters. Fot the better targetting you should provide additional properties like `conteaxtType` and `placemantType`. 
 
#### Step 4: Set up assets for bid request
{:.no_toc}

The bid request for native ads should have the description of expected assets. The full spec for the native template can be found in the [Native Ad Specification from IAB](https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf). 

The example of creating the assets array:

```
let image = NativeAssetImage(minimumWidth: 200, minimumHeight: 50, required: true)
image.type = ImageAsset.Main

let icon = NativeAssetImage(minimumWidth: 20, minimumHeight: 20, required: true)
icon.type = ImageAsset.Icon

let title = NativeAssetTitle(length: 90, required: true)

let body = NativeAssetData(type: DataAsset.description, required: true)

let cta = NativeAssetData(type: DataAsset.ctatext, required: true)

let sponsored = NativeAssetData(type: DataAsset.sponsored, required: true)

return [icon, title, image, body, cta, sponsored]
```

#### Step 5: Set up event tracker for bid request
{:.no_toc}

The bid request for mative ads may have a descrition of expected event trackers. The full spec for the Native template can be found in the [Native Ad Specification from IAB](https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf). 

The example of creating the event trackers array:

```
let eventTrackers = [
    NativeEventTracker(event: EventType.Impression,
                       methods: [EventTracking.Image,EventTracking.js])
]
```

#### Step 6: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to Prebid Server and provides a result in a completion handler.
    
#### Step 7: Load Native ad
{:.no_toc}

Load a native ad from MAX according to the [MAX instructions](https://dash.applovin.com/documentation/mediation/ios/getting-started/native-manual#load-the-native-ad). 

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile)
- [Prebid SDK iOS Integration](/prebid-mobile/pbm-api/ios/code-integration-ios)
- [Prebid SDK iOS Global Parameters](/prebid-mobile/pbm-api/ios/pbm-targeting-ios)
