---
layout: page_v2
title: Google Ad Manager Integration
description: Integration of Prebid Rendering module whith Google Ad Manager  
sidebarType: 2
---

# AdMob Integration

{:.no_toc}

The integration of Prebid Mobile with Google AdMob assumes that the publisher has an AdMob account and has already integrated the Google Mobile Ads SDK (GMA SDK) into the app.

See the [Google Integration Documentation](https://developers.google.com/admob/ios/quick-start) for the AdMob integration details.

* TOC
{:toc}

## AdMob Integration Overview

![Rendering with GAM as the Primary Ad Server](/assets/images/prebid-mobile/modules/rendering/prebid-in-app-bidding-overview-admob.png)

**Steps 1-2** Prebid SDK makes a bid request. Prebid server runs an auction and returns the winning bid.

**Step 3** GMA SDK makes an ad request. AdMob returns the mediation chain with respective ad sources.

**Step 4** For each prebid's ad source, the GMA SDK sequentially instantiates an adapter.

**Step 5** The adapter verifies the targeting keywords of the winning bid and the server properties of the given ad source. If they match the adapter will render the winning bid. Otherwise, it will immediately fail with an error of "no ad" and the next ad source will instantiate the same adapter but for another set of server params.
  
## Adapaters Integration

Prebid SDK is integrated into AdMob setup thru custom adapters. To integrate Prebid Adapters into your app, add the following line to your Podfile:

```pod
pod 'PrebidMobileAdMobAdapters'
```

## Adapters Initialization

{: .alert.alert-warning :}
**Warning:** The `GADMobileAds.sharedInstance().start()` should be called in the adapters bundle, otherwise, GMA SDK won't load the ads with error: `adView:didFailToReceiveAdWithError: SDK tried to perform a networking task before being initialized.`

To avoid the error add the following line to your app right after initialization of GMA SDK:

```swift
AdMobUtils.initializeGAD()
```

## Banner API

Integration example:

```swift
// 1. Create GADRequest and GADBannerView
gadRequest = GADRequest()

gadBanner = GADBannerView(adSize: size)
gadBanner.delegate = self
gadBanner.rootViewController = self
    
gadBanner.adUnitID = adUnitId
    
// 2. Create an AdMobMediationBannerUtils
mediationDelegate = AdMobMediationBannerUtils(gadRequest: gadRequest,
                                              bannerView: gadBanner)
    
// 3. Create the MediationBannerAdUnit
prebidAdMobMediaitonAdUnit = MediationBannerAdUnit(configID: configID,
                                                   size: CGSize(width: 320, height: 50),
                                                   mediationDelegate: mediationDelegate)
    
// 4. Make a bid request
prebidAdMobMediaitonAdUnit.fetchDemand { [weak self] result in
    
// 5. Make an ad request to AdMob
    self?.gadBanner.load(self?.gadRequest)
}
```

### Step 1: Create GADRequest and GADBannerView

{:.no_toc}

This step is the same as for the original [AdMob integration](https://developers.google.com/admob/ios/banner). You don't have to make any modifications here.

### Step 2: Create AdMobMediationBannerUtils

{:.no_toc}

The `AdMobMediationBannerUtils` is a helper class, which performs certain utilty work for the `MediationBannerAdUnit`, such as passing the targeting keywords to the adapters and checking the visibility of the ad view.

### Step 3: Create MediationBannerAdUnit

{:.no_toc}

The `MediationBannerAdUnit` is part of Prebid mediation API. This class is responsible for making a bid request and providing the winning bid and targeting keywords to mediating SDKs.  

### Step 4: Make bid request

{:.no_toc}

The `fetchDemand` method makes a bid request to a Prebid server and returns a result in a completion handler.

### Step 5: Make an Ad Request

{:.no_toc}

Make a regular AdMob's ad request. Everything else will be handled by Prebid adapters.

## Interstitial API

Integration example:

```swift
// 1. Create GADRequest
gadRequest = GADRequest()

// 2. Create AdMobMediationInterstitialUtils
mediationDelegate = AdMobMediationInterstitialUtils(gadRequest: self.gadRequest)

// 3. Create MediationInterstitialAdUnit
admobAdUnit = MediationInterstitialAdUnit(configId: configID,
                                          mediationDelegate: mediationDelegate!)

// 4. Make a bid request
admobAdUnit?.fetchDemand(completion: { [weak self]result in
    
// 5. Make an ad request to AdMob
GADInterstitialAd.load(withAdUnitID: adUnitID, request: self?.gadRequest) { [weak self] ad, error in
    guard let self = self else { return }
    if let error = error {
        PBMLog.error(error.localizedDescription)
        return
    }
        
        // 6. Present the interstitial ad
        self.interstitial = ad
        self.interstitial?.fullScreenContentDelegate = self
        self.interstitial?.present(fromRootViewController: self)
    }
})
```

The **default** ad format for interstitial is **.banner**. In order to make a `multiformat bid request`, set the respective values into the `adFormats` property.

```swift
// Make bid request for video ad                                     
adUnit?.adFormats = [.video]

// Make bid request for both video amd banner ads                                     
adUnit?.adFormats = [.video, .banner]

// Make bid request for banner ad (default behaviour)                                     
adUnit?.adFormats = [.banner]

```

### Step 1: Create GADRequest

{:.no_toc}

This step is the same as for the original [AdMob integration](https://developers.google.com/admob/ios/interstitial#swift). You don't have to make any modifications here.

### Step 2: Create AdMobMediationInterstitialUtils

{:.no_toc}

The `AdMobMediationInterstitialUtils` is a helper class, which performs certain utilty work for the `MediationInterstitialAdUnit`, such as passing the targeting keywords to adapters and checking the visibility of the ad view.

### Step 3: Create MediationInterstitialAdUnit

{:.no_toc}

The `MediationInterstitialAdUnit` is part of the Prebid mediation API. This class is responsible for making a bid request and providing a winning bid to the mediating SDKs.  

### Step 4: Make bid request

{:.no_toc}

The `fetchDemand` method makes a bid request to a Prebid server and provides a result in a completion handler.

### Step 5: Make an Ad Request

{:.no_toc}

Make a regular AdMob's ad request. Everything else will be handled by GMA SDK and prebid adapters.

### Steps 6: Display an ad

{:.no_toc}

Once you receive the ad it will be ready for display. Follow the [AdMob instructions](https://developers.google.com/admob/ios/interstitial#swift) for displaying an ad.

## Rewarded API

Integration example:

```swift
// 1. Create GADRequest
let request = GADRequest()

// 2. Create AdMobMediationInterstitialUtils
let mediationDelegate = AdMobMediationRewardedUtils(gadRequest: request)

// 3. Create MediationInterstitialAdUnit
admobRewardedAdUnit = MediationRewardedAdUnit(configId: "12f58bc2-b664-4672-8d19-638bcc96fd5c", mediationDelegate: mediationDelegate)

// 4. Make a bid request
admobRewardedAdUnit.fetchDemand { [weak self] result in
    guard let self = self else { return }

// 5. Make an ad request to AdMob
GADRewardedAd.load(withAdUnitID: self.admobPrebidAdUnitId, request: request) { [weak self] ad, error in
    guard let self = self else { return }
    if let error = error {
        PBMLog.error(error.localizedDescription)
        return
    }

    // 6. Present the interstitial ad
    self.gadRewardedAd = ad
    self.gadRewardedAd?.fullScreenContentDelegate = self
    DispatchQueue.main.asyncAfter(deadline: .now() + .seconds(3)) {
        self.gadRewardedAd?.present(fromRootViewController: self, userDidEarnRewardHandler: {
            print("Reward user")
        })
    }
    }
}
```

The process of displaying the rewarded ad is the same as for displaying an Interstitial Ad.

To be notified when a user earns a reward follow the [AdMob intructions](https://developers.google.com/admob/ios/rewarded#show_the_ad).

### Step 1: Create GADRequest

{:.no_toc}

This step is the same as for the original [AdMob integration](https://developers.google.com/admob/ios/rewarded). You don't have to make any modifications here.

### Step 2: Create MediationRewardedAdUnit

{:.no_toc}

The `AdMobMediationRewardedUtils` is a helper class, which performs certain utilty work for the `MediationRewardedAdUnit`, like passing the targeting keywords to the adapters.

### Step 3: Create MediationInterstitialAdUnit

{:.no_toc}

The `MediationRewardedAdUnit` is part of the Prebid mediation API. This class is responsible for making a bid request and providing a winning bid and targeting keywords to the adapters.  

### Step 4: Make bid request

{:.no_toc}

The `fetchDemand` method makes a bid request to the a Prebid server and provides a result in a completion handler.

### Step 5: Make an Ad Request

{:.no_toc}

Make a regular AdMob's ad request. Everything else will be handled by GMA SDK and prebid adapters.

### Steps 6: Display an ad

{:.no_toc}

Once the rewarded ad is received you can display it. Follow the [AdMob instructions](https://developers.google.com/admob/ios/rewarded#swift) for displaying an ad.

## Native Ads

{: .alert.alert-warning :}
**Warning:** If you use Native Ads you **must** integrate AdMob Adapters via the source files instead of cocoapods integration or standalone framework. The integration using framework leads to [runtime errors](https://github.com/prebid/prebid-mobile-ios/issues/516) related to the type casting.

In order to integrate AdMob adapters just add the adapters' source files to your app project.

Integration example:

```swift
// 1. Create GAD Request
gadRequest = GADRequest()

// 2. Create AdMobMediationNativeUtils
mediationDelegate = AdMobMediationNativeUtils(gadRequest: gadRequest)

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
guard let self = self else { return }

// 7. Load AdMob Native ad
self.adLoader = GADAdLoader(adUnitID: self.adMobAdUnitId!,
                            rootViewController: self.rootController,
                            adTypes: [ .native ],
                            options: nil)

self.adLoader?.delegate = self

self.adLoader?.load(self.gadRequest)
}
```

### Step 1: Create GAD Request

{:.no_toc}

Prepare the `GADRequest` object before you make a bid request. It will be needed for the Prebid mediation utils.

### Step 2: Create AdMobMediationNativeUtils

{:.no_toc}

The `AdMobMediationNativeUtils` is a helper class, which performs certain utilty work for `MediationNativeAdUnit`, like passing the targeting keywords to adapters and checking the visibility of the ad view.

### Step 3: Create and configure MediationNativeAdUnit

{:.no_toc}

The `MediationNativeAdUnit` is part of the Prebid mediation API. This class is responsible for making a bid request and providing a winning bid and targeting keywords to the adapters. For better targetting you should provide additional properties like `conteaxtType` and `placemantType`.

### Step 4: Set up assets for bid request

{:.no_toc}

The bid request for native ads should have the description of any expected assets. The full spec for the native template can be found in the [Native Ad Specification from IAB](https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf).

Example of creating the assets array:

```swift
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

### Step 5: Set up event tracker for bid request

{:.no_toc}

The bid request for mative ads may have a description of expected event trackers. The full spec for the Native template can be found in the [Native Ad Specification from IAB](https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf).

The example of creating the event trackers array:

```swift
let eventTrackers = [
    NativeEventTracker(event: EventType.Impression,
                       methods: [EventTracking.Image,EventTracking.js])
]
```

### Step 6: Make a bid request

{:.no_toc}

The `fetchDemand` method makes a bid request to Prebid server and provides a result in a completion handler.

### Step 7: Load AdMob Native ad

{:.no_toc}

Now just load a native ad from AdMob according to the [AdMob instructions](https://developers.google.com/admob/ios/native/start).
