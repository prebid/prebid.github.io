---

layout: page_v2
title: Prebid Mobile Rendering Modules
description: Prebid Mobile Rendering Modules architecture
sidebarType: 2

---

# MoPub Integration

The integration of Prebid Rendering API with MoPub assumes that publisher has an account on MoPub and has already integrated the MoPub SDK into the app.

If you do not have MoPub SDK in the app yet, refer the [MoPub's Documentation](https://github.com/mopub/mopub-ios-sdk).

{% capture warning_note %}
MoPub Adapters for the Prebid SDK are compatible with **MoPub 5.16** and above. The ads won't be shown with earlier versions of MoPub SDK.
{% endcapture %}
{% include /alerts/alert_important.html content=warning_note %}

## MoPub Integration Overview

The integration of Prebid Rendering API into MoPub monetization flow is based on MoPub's Mediation feature. 

![Rendering with MoPub as the Primary Ad Server](/assets/images/prebid-mobile/modules/rendering/Prebid-In-App-Bidding-Overview-MoPub.png)

**Steps 1-2** Prebid SDK makes a bid request. Prebid server runs an auction and returns the winning bid to the SDK.

**Step 3** Prebid SDK via MoPubAdapters framework sets up targeting keywords into the MoPub's ad unit.

**Step 4** MoPub SDK makes an ad request. MoPub adds the prebid's line item into the mediation chain.

**Step 5** If Prebid's creative win the waterfall then the MoPub SDK will instantiate respective Prebid Adapter which will render the winning bid. For more details about Mediation and Adapters read the [MoPub's Documentation](https://developers.mopub.com/networks/integrate/mopub-network-mediation-guidelines/).

**Step 6** The winner is displayed in the app with the respective rendering engine.

Prebid **Mediation API** supports these ad kinds:

- Display Banner
- Display Interstitial
- Video Interstitial 
- Rewarded Video

[//]: # (- Native)
[//]: # (- Native Styles)

They can be integrated using these API categories.

- [**Banner API**](#banner-api) - for *Display Banner*
- [**Interstitial API**](#interstitial-api) - for *Display* and *Video* Interstitials
- [**Rewarded API**](#rewarded-api) - for *Rewarded Video*

[//]: # (- [**Native API**](ios-sdk-integration-mopub-native.html) - for *Native* and *Native Styles* ads)

## Banner API

Integration example:

``` swift
// 1. Create an AdView
banner = MPAdView(adUnitId: MOPUB_AD_UNIT_ID)
banner.delegate = self

// 2. Create an In-App Bidding Ad Unit
adUnit = MediationBannerAdUnit( configID: CONFIG_ID, 
                                size: adSize,
                                mediationDelegate: MoPubMediationDelegate())
    
// 3. Run an Header Bidding auction on Prebid
adUnit.fetchDemand(with: banner!) { [weak self] result in
    
     // 4. Load an Ad
    self?.banner.loadAd()
}
```

#### Step 1: Create Ad View

Follow the [MoPub Instructions](https://developers.mopub.com/publishers/ios/banner/) for Banner integration.

#### Step 2: Create Ad Unit

Create the `MediationBannerAdUnit` object with parameters:

- `configID` - an ID of Stored Impression on the Prebid server
- `size` - the size of the ad unit which will be used in the bid request
- `mediationDelegate` - the object from the MoPubAdapters framework responsible for managing MoPub's ad objects. 

#### Step 3: Fetch Demand

Call the method `fetchDemand()` which performs several actions:

- Makes a bid request to Prebid Server
- Sets up the targeting keywords to the MoPub's ad unit using provided `mediationDelegate`
- Passes the winning bid to the MoPub's ad unit
- Returns the result of bid request for future processing

#### Step 4: Load the Ad

When the bid request is completed, the responsibility of making the Ad Request is passed to the publisher. You have to invoke `loadAd()` on the MoPub's Ad View explicitly in the completion handler of the `fetchDemand()`.

#### Step 5: Rendering

If the Prebid bid wins on MoPub it will be rendered by `PrebidBannerAdapter`. You shouldn't do anything for this.  Just make sure that your order has been set up correctly and Prebid MoPub adapter is added to the project.

### Migration from the original API

1. Replace the `BannerAdUnit` with `MediationBannerAdUnit`. 
5. Follow the instructions to integrate [Banner API](#banner-api).  
6. Setup the [MoPub Order](rendering-mopub-line-item-setup.html) for rendering. You should create a new order with **Network Line Items** instead of the original one. 

## Interstitial API

Integration example:

``` swift
// 1. Create an MoPub's Interstitial Controller
interstitialController = MPInterstitialAdController.init(forAdUnitId: MOPUB_AD_UNIT_ID)
interstitialController.delegate = self

// 2. Create an In-App Bidding Interstitial Ad Unit
interstitialAdUnit = MediationInterstitialAdUnit(configID: CONFIG_ID,
                                                minSizePercentage: CGSize(width: 30, height: 30),
                                                mediationDelegte: MoPubMediationDelegate() )
    
// 3. Run an Header Bidding auction on Prebid
interstitialAdUnit.fetchDemand(with: interstitialController!) { [weak self] result in
    
    // 4. Load an Ad
    self?.interstitialController.loadAd()
}

// .....

// 5. Show the ad
if interstitialController.ready {
    interstitialController.show(from: self)
}
```

The way of displaying **Video Interstitial Ad** is almost the same with two differences:

- Need customize the ad unit kind
- No need to set up `minSizePercentage`

``` swift
// 1. Create an MoPub's Interstitial Controller
interstitialController = MPInterstitialAdController.init(forAdUnitId: MOPUB_AD_UNIT_ID)
interstitialController.delegate = self

// 2. Create an In-App Bidding Interstitial Ad Unit
interstitialAdUnit = MediationInterstitialAdUnit(configID: CONFIG_ID,
                                                minSizePercentage: CGSize(width: 30, height: 30),
                                                mediationDelegate: MoPubMediationDelegate())
interstitialAdUnit.adFormat = .video
    
// 3. Run an Header Bidding auction on Prebid
interstitialAdUnit.fetchDemand(with: interstitialController!) { [weak self] result in
    
    // 4. Load an Ad
    self?.interstitialController.loadAd()
}
// .....

// 5. Show the ad
if interstitialController.ready {
        interstitialController?.show(from: self)
}
```

#### Step 1: Create Ad View

Follow the [MoPub Instructions](https://developers.mopub.com/publishers/ios/interstitial/) and intgrate Interstital ad unit. 

#### Step 2: Create Ad Unit

Create the `MediationInterstitialAdUnit` object with parameters:

- `configID` - an ID of Stored Impression on the Prebid server
- `mediationDelegate` - the object from the MoPubAdapters framework responsible for managing MoPub's ad objects. 

#### Step 3: Fetch Demand

Run the `fetchDemand()` method which performs several actions:

- Makes a bid request to Prebid
- Sets up the targeting keywords to the MoPub's ad unit
- Passes the winning bid to the MoPub's ad unit
- Returns the result of bid request for future processing

#### Step 4: Load the Ad

When the bid request is completed, the responsibility of making the Ad Request is passed to the publisher. You have to invoke `loadAd()` on the MoPub's Ad View explicitly in the completion handler of the `fetchDemand()`.

#### Step 5: Rendering

If the Prebid bid wins on MoPub it will be rendered by `MoPubInterstitialAdapter`. You shouldn't do anything for this. Just make sure that your order has been set up correctly and an adapter is added to the  project

Pay attention that due to the expiration, the ad could become invalid with time. So it is always useful to check the availability with `interstitialController?.isReady` before displaying it.

### Migration from the original API

1. Replace the `InterstitialAdUnit` with `MediationInterstitialAdUnit`. 
5. Follow the instructions to integrate [Interstitial API](#interstitial-api).  
6. Setup the [MoPub Order](rendering-mopub-line-item-setup.html) for rendering. You should create a new order with **Network Line Items** instead of the original one. 

## Rewarded API

Integration example:

``` swift
// 1. Create an In-App Bidding Interstitial Ad Unit
rewardedAdUnit = MediationRewardedAdUnit(configID: CONFIG_ID)
    
// 2. Run an Header Bidding auction on Prebid
let bidInfoWrapper = MediationBidInfoWrapper()
rewardedAdUnit.fetchDemand(with: bidInfoWrapper) { [weak self] result in
    guard let self = self else {
        return
    }
    
    // 3. Load an Ad
    MPRewardedVideo.setDelegate(self, forAdUnitId: self.MOPUB_AD_UNIT_ID)
    MPRewardedVideo.loadAd(withAdUnitID: self.MOPUB_AD_UNIT_ID,
                           keywords: bidInfoWrapper.keywords as String?,
                           userDataKeywords: nil,
                           customerId: "testCustomerId",
                           mediationSettings: [],
                           localExtras: bidInfoWrapper.localExtras)
}

/// .......

// 4. Try to Display an Ad
if MPRewardedVideo.hasAdAvailable(forAdUnitID: MOPUB_AD_UNIT_ID) {
    let rewards = MPRewardedVideo.availableRewards(forAdUnitID: MOPUB_AD_UNIT_ID)
    guard let reward = rewards?.first as? MPRewardedVideoReward else {
        return
    }
    
    // 5. Present Ad
    MPRewardedVideo.presentAd(forAdUnitID: MOPUB_AD_UNIT_ID, from: self, with: reward, customData: nil)
}
```

#### Step 1: Create an Rewarded Ad Unit

Create the `MediationRewardedAdUnit` object with parameter:

- `configID` - an ID of Stored Impression on the Prebid server

#### Step 2: Fetch Demand

Call the `fetchDemand()` method which does several things:

- Makes a bid request to Prebid Server
- Sets up the targeting keywords to auxiliary class `MediationBidInfoWrapper`
- Returns the result of bid request for the future processing

#### Step 3: Load the Ad

When the bid request is completed, the responsibility of making the Ad Request is passed to the publisher. You have to invoke `loadAd()` on the MoPub's Ad View explicitly in the completion handler of the `fetchDemand()`.

#### Step 5: Present the Rewarded Ad

If the Prebid bid wins on MoPub it will be rendered by `MoPubRewardedVideoAdapter`. You shouldn't do anything for this. Just make sure that your order has been set up correctly and an adapter is added to the project

### Migration from the original API

1. Replace the `RewardedVideoAdUnit` with `MediationRewardedAdUnit`. 
5. Follow the instructions to integrate [Rewarded Video API](#rewarded-api).  
6. Setup the [MoPub Order](rendering-mopub-line-item-setup.html) for rendering. You should create a new order with **Network Line Items** instead of the original one.