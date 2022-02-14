---
layout: page_v2
title: Google Ad Manager Integration
description: Integration of Prebid Rendering module whith Google Ad Manager  
sidebarType: 2
---

# AdMob Integration

The integration of Prebid Mobile with Google AdMob assumes that publisher has an AdMob account and has already integrated the Google Mobile Ads SDK (GMA SDK) into the app project.

If you do not have GMA SDK in the app yet, refer the the [Google Integration Documentation](https://developers.google.com/admob/ios/quick-start).

{: .alert.alert-warning :}
**Warning:** GMA SDK is a proprietary library that sometimes works in an unexpected way. The `GADMobileAds.sharedInstance().start()` should be called in all bundles where it is used. Otherwise, GMA SDK won't load the ads with error: `adView:didFailToReceiveAdWithError: SDK tried to perform a networking task before being initialized.`

To avoid the error add the following line to your app right after initialization of GMA SDK:

```
GAMUtils.shared.initializeGAM()
```
 
## AdMob Integration Overview

![Rendering with GAM as the Primary Ad Server](/assets/images/prebid-mobile/modules/rendering/prebid-in-app-bidding-overview-admob.png)

**Steps 1-2** Prebid SDK makes a bid request. Prebid server runs an auction and returns the winning bid.

**Step 3** GMA SDK makes an ad request. AdMob returns the mediation chain with respective ad sources.

**Step 4** For each Prebid Ad Source, the GMA SDK instantiates an adapter. 

**Step 5** The adapter verifies the targeting keywords of the winning bid and server properties of the given Ad Source. If they match adapter will render the winning bid. Otherwise, it will fail with "no ad" immediately and the next ad source will instantiate the same adapter but for another set of server parpams. 
  
Prebid Mobile supports these ad formats:

- Display Banner
- Video Banner
- Display Interstitial
- Video Interstitial 
- Rewarded Video
- Native

They can be integrated using these API categories:

- [**Banner API**](#banner-api) - for *Display* and *Video* Banner
- [**Interstitial API**](#interstitial-api) - for *Display* and *Video* Interstitials
- [**Rewarded API**](#rewarded-api) - for *Rewarded Video*
- [**Native API**](#native-ads) - for *Native Ads*


## Banner API

Integration example:

``` swift
// 1. Create GADRequest and GADBannerView
gadRequest = GADRequest()

gadBanner = GADBannerView(adSize: size)
gadBanner.delegate = self
gadBanner.rootViewController = self
    
gadBanner.adUnitID = adUnitId
    
// 2. Create AdMobMediationBannerUtils
mediationDelegate = AdMobMediationBannerUtils(gadRequest: gadRequest,
                                              bannerView: gadBanner)
    
// 3. Create MediationBannerAdUnit
prebidAdMobMediaitonAdUnit = MediationBannerAdUnit(configID: configID,
                                                   size: CGSize(width: 320, height: 50),
                                                   mediationDelegate: mediationDelegate)
    
// 4. Make a bid request
prebidAdMobMediaitonAdUnit.fetchDemand { [weak self] result in
    
    // 5. Store the winning bid in the GADRequest extras
    // You must provide a winning bid via extras to the GADRequest here.
    // Prebid SDK can't do it internally.
    // Otherwise, the Prebid adapter won't be able to retrieve and render the winning bid.
    let extras = GADCustomEventExtras()
    extras.setExtras(self?.mediationDelegate.getEventExtras(), 
                     forLabel: AdMobConstants.PrebidAdMobEventExtrasLabel)
    
    self?.gadRequest.register(extras)
    
    // 6. Make an ad request to AdMob
    self?.gadBanner.load(self?.gadRequest)
}
```

#### Step 1: Create GADRequest and GADBannerView

This step is totally the same as for pure [AdMob integration](https://developers.google.com/admob/ios/banner). You don't have to make any modifications here.


#### Step 2: Create AdMobMediationBannerUtils

The `AdMobMediationBannerUtils` is a helper class, wich performs certain utilty work for `MediationBannerAdUnit`, like passing the targeting keywords to adapters and checking the visibility of the ad view.

#### Step 3: Create MediationBannerAdUnit

The `MediationBannerAdUnit` is part of Prebid mediation API. This class is responsible for making bid request and providing the winning bid and targeting keywords to mediating SDKs.  

#### Step 4: Make bid request

The `fetchDemand` method makes a bid request to prebid server and provide the results in the completion handler.

#### Step 5: Store the winning bid in the GADRequest extras

GMA SDK doesn't provide extras to the adapter if they were set not in the app scope. 

That is why you must add the code for forwarding the winning bid to the adapters. In the most cases you'll just need to copy and paste the following lines inside the completion closure: 


```
let extras = GADCustomEventExtras()

extras.setExtras(self?.mediationDelegate.getEventExtras(), 
                 forLabel: AdMobConstants.PrebidAdMobEventExtrasLabel)
    
self?.gadRequest.register(extras)
```

Make sure that you use the proper label for extras - `AdMobConstants.PrebidAdMobEventExtrasLabel`. Prebid adapters will extract the winnig bid by this key.

#### Step 6: Make an Ad Reuest

Now you should just make a regular AdMob's ad request. Evetything else will be handled by prebid adapters.

### Banner Video

For **Banner Video** you also need to specify the ad format:

``` swift
banner.adFormat = .video
```

And all the rest code will be the same as for integration of Display Banner.  

## Interstitial API

Integration example:

``` swift
// 1. Create GADRequest
gadRequest = GADRequest()

// 2. Create AdMobMediationInterstitialUtils
mediationDelegate = AdMobMediationInterstitialUtils(gadRequest: self.gadRequest)

// 3. Create MediationInterstitialAdUnit
admobAdUnit = MediationInterstitialAdUnit(configId: configID,
                                          mediationDelegate: mediationDelegate!)

// 4. Make a bid request
admobAdUnit?.fetchDemand(completion: { [weak self]result in
    
    // 5. Store the winning bid in the GADRequest extras
    // You must provide a winning bid via extras to the GADRequest here.
    // Prebid SDK can't do it internally.
    // Otherwise, the Prebid adapter won't be able to retrieve and render the winning bid.
    let extras = GADCustomEventExtras()
    let prebidExtras = self?.mediationDelegate!.getEventExtras()
    extras.setExtras(prebidExtras, forLabel: AdMobConstants.PrebidAdMobEventExtrasLabel)
    
    self?.gadRequest.register(extras)
    
    // 6. Make an ad request to AdMob
    GADInterstitialAd.load(withAdUnitID: adUnitID, request: self?.gadRequest) { [weak self] ad, error in
        guard let self = self else { return }
        if let error = error {
            PBMLog.error(error.localizedDescription)
            return
        }
        
        // 7. Present the interstitial ad
        self.interstitial = ad
        self.interstitial?.fullScreenContentDelegate = self
        self.interstitial?.present(fromRootViewController: self)
    }
})
```

The way of displaying **Video Interstitial Ad** is almost the same but you have to customize the ad format.

``` swift
// 1. Create GADRequest
gadRequest = GADRequest()

// 2. Create AdMobMediationInterstitialUtils
mediationDelegate = AdMobMediationInterstitialUtils(gadRequest: self.gadRequest)

// 3. Create MediationInterstitialAdUnit
admobAdUnit = MediationInterstitialAdUnit(configId: configID,
                                          mediationDelegate: mediationDelegate!)
                                          
                                                   admobAdUnit.adFormat = .video


// 4. Make a bid request
admobAdUnit?.fetchDemand(completion: { [weak self]result in
    
    // The same as for display interstitial 
    // ...
    
    }
})
```

#### Step 1: Create GADRequest 

This step is totally the same as for pure [AdMob integration](https://developers.google.com/admob/ios/interstitial#swift). You don't have to make any modifications here.


#### Step 2: Create AdMobMediationInterstitialUtils

The `AdMobMediationInterstitialUtils ` is a helper class, wich performs certain utilty work for `MediationInterstitialAdUnit `, like passing the targeting keywords to adapters and checking the visibility of the ad view.

#### Step 3: Create MediationInterstitialAdUnit

The `MediationInterstitialAdUnit` is part of Prebid mediation API. This class is responsible for making bid request and providing the winning bid and targeting keywords to mediating SDKs.  

#### Step 4: Make bid request

The `fetchDemand` method makes a bid request to prebid server and provide the results in the completion handler.

#### Step 5: Store the winning bid in the GADRequest extras

GMA SDK doesn't provide extras to the adapter if they were set not in the app scope. 

That is why you must add the code for forwarding the winning bid to the adapters. In the most cases you'll just need to copy and paste the following lines inside the completion closure: 


```
let extras = GADCustomEventExtras()
let prebidExtras = self?.mediationDelegate!.getEventExtras()
extras.setExtras(prebidExtras, forLabel: AdMobConstants.PrebidAdMobEventExtrasLabel)

self?.gadRequest.register(extras)
```

Make sure that you use the proper label for extras - `AdMobConstants.PrebidAdMobEventExtrasLabel`. Prebid adapters will extract the winnig bid by this key.

#### Step 6: Make an Ad Reuest

Now you should just make a regular AdMob's ad request. Evetything else will be handled by prebid adapters.

#### Steps 7: Display an ad

Once the interstitial ad is recieved you can display it. Folow the [AdMob instructions](https://developers.google.com/admob/ios/interstitial#swift) about how to do it. 

## Rewarded API

Integration example:

``` swift
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

The way of displaying the Rewarded Ad is totally the same as for the Interstitial Ad. 

To be notified when user earns a reward follow the [AdMob intructions](https://developers.google.com/admob/ios/rewarded#show_the_ad).

#### Step 1: Create GADRequest 

This step is totally the same as for pure [AdMob integration](https://developers.google.com/admob/ios/rewarded). You don't have to make any modifications here.


#### Step 2: Create MediationRewardedAdUnit

The `AdMobMediationRewardedUtils` is a helper class, wich performs certain utilty work for `MediationRewardedAdUnit `, like passing the targeting keywords to adapters and checking the visibility of the ad view.

#### Step 3: Create MediationInterstitialAdUnit

The `MediationRewardedAdUnit` is part of Prebid mediation API. This class is responsible for making bid request and providing the winning bid and targeting keywords to mediating SDKs.  

#### Step 4: Make bid request

The `fetchDemand` method makes a bid request to prebid server and provide the results in the completion handler.

#### Step 5: Make an Ad Reuest

Now you should just make a regular AdMob's ad request. Evetything else will be handled by prebid adapters.

#### Steps 6: Display an ad

Once the rewarded ad is recieved you can display it. Folow the [AdMob instructions](https://developers.google.com/admob/ios/rewarded#swift) about how to do it. 

## Native Ads

{: .alert.alert-warning :}
**Warning:** If you use Native Ads you **must** integrate AdMob Adapters via the source files instead of cocoapods integration. The integration using framework leads to [runtime errors](https://github.com/prebid/prebid-mobile-ios/issues/516) related to the type casting. 

In order to integrate AdMob adapters just add the adapters' source files to your app project.

Integration example:

``` swift
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

// 5. Make a bid request
nativeAdUnit.fetchDemand { [weak self] result in
    guard let self = self else { return }
    
    // 6. Store the winning bid in the GADRequest extras
    // You must provide a winning bid via extras to the GADRequest here.
    // Prebid SDK can't do it internally.
    // Otherwise, the Prebid adapter won't be able to retrieve and render the winning bid
    let extras = GADCustomEventExtras()
    let prebidExtras = self.mediationDelegate?.getEventExtras()
    extras.setExtras(prebidExtras, forLabel: AdMobConstants.PrebidAdMobEventExtrasLabel)
    self.gadRequest.register(extras)
    
    // 7. Load AdMob Native ad
    self.adLoader = GADAdLoader(adUnitID: self.adMobAdUnitId!,
                                rootViewController: self.rootController,
                                adTypes: [ .native ],
                                options: nil)
    
    self.adLoader?.delegate = self
    
    // 8. Make an ad request
    self.adLoader?.load(self.gadRequest)
}
```

#### Step 1: Create GAD Request

Prepare the `GADRequest` object before you make the bid request. It will be needed for prebid mediation utils. 

#### Step 2: Create AdMobMediationNativeUtils

The `AdMobMediationNativeUtils` is a helper class, wich performs certain utilty work for `MediationNativeAdUnit`, like passing the targeting keywords to adapters and checking the visibility of the ad view.

#### Step 3: Create and configure MediationNativeAdUnit

The `MediationNativeAdUnit` is part of Prebid mediation API. This class is responsible for making bid requests and providing the winning bid and targeting keywords to the mediating SDKs. Fot the better targetting you should provide additional properties like `conteaxtType` and `placemantType`. 
 
#### Step 4: Set up assets for bid request

The bid request for Native Ads should have the descrition of expected asstes. The full spec for the Native template you can find in the [Native Ad Specification from IAB](https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf). 

The example of creating the asstes array:

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

The bid request for Native Ads may have the descrition of expected event trackers. The full spec for the Native template you can find in the [Native Ad Specification from IAB](https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf). 

The example of creating the event trackers array:

```
let eventTrackers = [
    NativeEventTracker(event: EventType.Impression,
                       methods: [EventTracking.Image,EventTracking.js])
]
```

#### Step 6: Make a bid request

The fetchDemand method makes a bid request to prebid server and provide the results in the completion handler.
    
#### Step 7: Store the winning bid in the GADRequest extras

GMA SDK doesn't provide extras to the adapter if they were set not in the app scope.

That is why you must add the code for forwarding the winning bid to the adapters. In the most cases you'll just need to copy and paste the following lines inside the completion closure of the `fetchDemand`:

```
let extras = GADCustomEventExtras()
let prebidExtras = self?.mediationDelegate!.getEventExtras()
extras.setExtras(prebidExtras, forLabel: AdMobConstants.PrebidAdMobEventExtrasLabel)

self?.gadRequest.register(extras)
```

Make sure that you use the proper label for extras - AdMobConstants.PrebidAdMobEventExtrasLabel. Prebid adapters will extract the winnig bid by this key.
    
#### Step 8: Load AdMob Native ad
    
Now just load a Native ad from AdMob according to the [AdMob instructions](https://developers.google.com/admob/ios/native/start). 
