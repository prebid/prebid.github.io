---
layout: page_v2
title: Google Ad Manager Integration
description: Integration of Prebid Rendering module whith Google Ad Manager  
sidebarType: 2
---

# AdMob Integration

The integration of Prebid Mobile with AdMob assumes that publisher has an AdMob account and has already integrated the Google Mobile Ads SDK (GMA SDK) into the app project.

If you do not have GMA SDK in the app yet, refer the the [Google Integration Documentation](https://developers.google.com/admob/ios/quick-start).

{: .alert.alert-warning :}
**Warning:** GMA SDK is a proprietary library that sometimes works in an unexpected way. The `GADMobileAds.sharedInstance().start()` should be called in all bundles where it is used. Otherwise, GMA SDK won't load the ads with error: `adView:didFailToReceiveAdWithError: SDK tried to perform a networking task before being initialized.`

To avoid the error add the following line to your app right after initialization of GMA SDK:

```
GAMUtils.shared.initializeGAM()
```

 
## MoPub Integration Overview

![Rendering with GAM as the Primary Ad Server](/assets/images/prebid-mobile/modules/rendering/prebid-in-app-bidding-overview-admob.png)

**Steps 1-2** Prebid SDK makes a bid request. Prebid server runs an auction and returns the winning bid.

**Step 3** GMA SDK makes an ad request. AdMob returns the mediation chain with respective ad sources.

**Step 4** For each Prebid Ad Source, the GMA SDK instantiates an adapter. 

**Step 5** The adapter verifies the targeting keywords of the winning bid and server properties of the given Ad Source. If they match adapter will render the winning bid. If no bids or 
  
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
- [**Native API**]() - for *Native Ads*


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

The `AdMobMediationBannerUtils` is a helper class, wich performs spcific utilty work for `MediationBannerAdUnit`, like passing the targeting keywords to adapters and checking the visibility of the ad view.

#### Step 3: Create MediationBannerAdUnit

The `MediationBannerAdUnit` is part of Prebid mediation API. This class is responsible for making bid request and providing the winning bid and targeting keywords to mediating SDKs.  

#### Step 4: Make bid request

The `fetchDemand` method makes a bid request to prebid server and provide the results in the completion handler.

#### Step 5: Store the winning bid in the GADRequest extras

GMA SDK doesn't provide extras to the adapter if they were set up not in the app scope. 

That is why you must add the code for forwarding the winning bid to the adapters. In the most cases you'll just need to copy and paste the following lines inside the completion closure: 


```
let extras = GADCustomEventExtras()

extras.setExtras(self?.mediationDelegate.getEventExtras(), 
                 forLabel: AdMobConstants.PrebidAdMobEventExtrasLabel)
    
self?.gadRequest.register(extras)
```

Make sure that you use the proper label for extras - `AdMobConstants.PrebidAdMobEventExtrasLabel`. Prebid adapters will extract the winnig bid by this key.

#### Step 6: Make an Ad Reuest

Now you should just make a regulat AdMob's ad request. Evetything else will be handled by prebid adapters.

### Banner Video

For **Banner Video** you also need to specify the ad format:

``` swift
banner.adFormat = .video
```

And all the rest code will be the same as for integration of Display Banner.

### Migration from the original API

1. Replace the `GAMBannerView` with `BannerView` in the UI. 
3. Implement the protocol `BannerViewDelegate` in the View Controller.
4. Remove usage of `GAMBannerView`, `GAMRequest`, and implementation of the `GADBannerViewDelegate`.
5. Remove original `BannerAdUnit`.
5. Follow the instructions to integrate [Banner API](#banner-api).  
6. Setup the [GAM Order](rendering-gam-line-item-setup.html) for rendering. You can create a new order or just replace the code of creative in the original one and continue to use it for rendering integration.  

## Interstitial API

Integration example:

``` swift
// 1. Create Event Handler
let eventHandler = GAMInterstitialEventHandler(adUnitID: GAM_AD_UNIT_ID)
    
// 2. Create Interstitial Ad Unit
interstitial = InterstitialRenderingAdUnit  (configID: CONFIG_ID,
                                  minSizePercentage: CGSize(width: 30, height: 30),
                                  eventHandler: eventHandler)
    
interstitial.delegate = self
    
// 3. Load an Ad
interstitial.loadAd()

/// .......

// 4. Show Ad
if interstitial.isReady {
    interstitial.show(from: self)
}

```

The way of displaying **Video Interstitial Ad** is almost the same with two differences:

- Need to customize the ad format
- No need to set up `minSizePercentage`

``` swift
 // 1. Create Event Handler
let eventHandler = GAMInterstitialEventHandler(adUnitID: GAM_AD_UNIT_ID)
    
// 2. Create Interstitial Ad Unit
interstitial = InterstitialRenderingAdUnit(configID: CONFIG_ID,
                                  eventHandler: eventHandler)
    
interstitial.adFormat = .video
interstitial.delegate = self
    
// 3. Load an Ad
interstitial.loadAd()

/// .......

// 4. Show Ad
if interstitial.isReady {
    interstitial.show(from: self)
}

```

#### Step 1: Create Event Handler

To create an event handler you should provide a **GAM Ad Unit**.

#### Step 2: Create Interstitial Ad Unit

Initialize the `InterstitialRenderingAdUnit` with properties:

- `configID` - an ID of Stored Impression on the Prebid server
- `minSizePercentage` - specifies the minimum width and height percent an ad may occupy of a device’s real estate.
- `eventHandler` - the instance of the interstitial event handler

> **NOTE:** the `minSizePercentage` - plays an important role in a bidding process for display ads. If provided space is not enough demand partners won't respond with the bids.


#### Step 3: Load the Ad

Call the method `loadAd()` which will make a bid request to Prebid Server.

#### Step 4: Show the Ad when it is ready

Wait for the ad to and show it to the user in any suitable time.


``` swift
// MARK: InterstitialRenderingAdUnitDelegate
    
func interstitialDidReceiveAd(_ interstitial: InterstitialAdUnit) {
    // Now the ad is ready for display
}
```

### Migration from the original API

1. Replace the `GAMInterstitialAd` with `InterstitialRenderingAdUnit` in the View Controller. 
3. Implement the protocol `InterstitialAdUnitDelegate` in the View Controller.
4. Remove usage of `GAMInterstitialAd`, `GAMRequest`.
5. Remove original `InterstitialAdUnit`.
5. Follow the instructions to integrate [Interstitial API](#interstitial-api).  
6. Setup the [GAM Order](rendering-gam-line-item-setup.html) for rendering. **Pay Attention** that you can replace the code of creative in the original order **only for display** ads. For video interstitial you have to create a special order and remove the original one.

## Rewarded API

Integration example:

``` swift
 // 1. Create an Event Handler
let eventHandler = GAMRewardedEventHandler(adUnitID: GAM_AD_UNIT_ID)
    
// 2. Create an Ad Unit
rewardedAd = RewardedAdUnit(configID: CONFIG_ID,
                               eventHandler: eventHandler)
    
rewardedAd.delegate = self
    
// 3. Load an Ad
rewardedAd.loadAd()

/// .......

// 4. Display Ad
if rewardedAd.isReady {
    rewardedAd.show(from: self)
}

```

The way of displaying the Rewarded Ad is totally the same as for the Interstitial Ad. 

To be notified when user earns a reward - implement the method of `RewardedAdUnitDelegate`:

``` swift
- (void)rewardedAdUserDidEarnReward:(RewardedAdUnit *)rewardedAd;
```

The actual reward object is stored in the `RewardedAdUnit`:

```
if let reward = rewardedAd.reward as? GADAdReward {
    // ...
}
```

#### Step 1: Create Event Handler

To create an event handler you should provide a **GAM Ad Unit ID**.

#### Step 2: Create Rewarded Ad Unit

Create the `RewardedAdUnit` object with parameters:

- `configID` - an ID of Stored Impression on the Prebid server
- `eventHandler` - the instance of rewarded event handler

#### Step 3: Load the Ad

Call the `loadAd()` method which will make a bid request to Prebid server.

#### Step 4: Show the Ad when it is ready

Wait for the ad to load and show it to the user in any suitable time.


``` swift
// MARK: RewardedAdUnitDelegate
    
func rewardedAdDidReceiveAd(_ rewardedAd: RewardedAdUnit) {
    // Now the ad is ready for display
}
```

### Migration from the original API

1. Replace the `GADRewardedAd` with `RewardedAdUnit` in the View Controller. 
3. Implement the protocol `RewardedAdUnitDelegate` in the View Controller.
4. Remove usage of `GAMRequest`.
5. Remove original `RewardedVideoAdUnit`.
5. Follow the instructions to integrate [Rewarded API](#rewarded-api).  
6. Setup the [GAM Order](rendering-gam-line-item-setup.html) for rendering. **Pay Attention** that you have to create a new special order for rewarded video ad and remove the original one.
