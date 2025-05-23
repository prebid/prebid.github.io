---
layout: page_v2
title: GAM with Prebid Rendering
description: Integration of Prebid Rendering module whith Google Ad Manager  
sidebarType: 2
---

<!-- markdownlint-disable-file MD046 -->

# Prebid SDK iOS with the GAM Prebid-Rendered Integration Method
{:.no_toc}

- TOC
{:toc}

{% include mobile/intro-prebid-rendered.md platform="ios" %}

## Event Handlers

First, a little bit of setup is needed.

### Integrate Event Handlers

Prebid SDK provides rendering integration into the GMA SDK setup with the [app events](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/banner#app_events) mechanism. To integrate Prebid Event Handlers into your app, add the following line to your Podfile:

```pod
pod 'PrebidMobileGAMEventHandlers'
```

### Event Handlers Initialization

{: .alert.alert-warning :}
**Warning:** GMA SDK is a closed library that sometimes works in unexpected ways. The `GADMobileAds.sharedInstance().start()` should be called in all bundles where it is used. Otherwise, GMA SDK won't load the ads with an error of: `adView:didFailToReceiveAdWithError: SDK tried to perform a networking task before being initialized.`

To avoid this error add the following line to your app right after initialization of GMA SDK:

```swift
GAMUtils.shared.initializeGAM()
```

## AdUnit-Specific instructions

This section covers integration details for different ad formats. In each scenario, you'll be asked for a `configId` - this is a key worked out with your Prebid Server provider. It's used at runtime to pull in the bidders and parameters specific to this adunit. Depending on your Prebid Server partner, it may be a UUID or constructed out of parts like an account number and adunit name.

### Banners

#### Display Banners

Integration example:

```swift
// 1. Create an Event Handler
let eventHandler = GAMBannerEventHandler(adUnitID: GAM_AD_UNIT_ID,
                                         validGADAdSizes: [NSValueFromGADAdSize(adSize)])
       
// 2. Create a Banner View
let banner = BannerView(configID: CONFIG_ID,
                        eventHandler: eventHandler)

banner.delegate = self

addBannerToUI(banner: banner)
        
// 3. Load an Ad
banner.loadAd()
```

##### Step 1: Create Event Handler
{:.no_toc}

To create the `GAMBannerEventHandler` you should provide:

- a **GAM Ad Unit Id** 
- the list of available **sizes** for this ad unit.

##### Step 2: Create Ad View
{:.no_toc}

`BannerView` - is a view that will display the particular ad. It should be added to the UI. To create a BannerView you should provide:

- `configID` - an ID of Stored Impression on the Prebid server
- `eventHandler` - the instance of the banner event handler

You should also add the instance of `BannerView` to the UI.

##### Step 3: Load the Ad
{:.no_toc}

Call the method `loadAd()` which will:

- make a bid request to Prebid Server.
- render the winning bid on display.

#### Banner Video (non-instream)

For non-instream **Banner Video** you also need to specify the ad format:

```swift
banner.adFormat = .video
```

The rest of the code will be the same as for integration of Display Banner.

#### Migrating banners from a Bidding-Only integration

GAM setup:

1. Leave the original order and ad units as is. They are not relevant for the rendering approach but they will serve ads for released applications.
2. Create new GAM ad unit.
3. Setup new [GAM Order](/adops/mobile-rendering-gam-line-item-setup.html) for rendering approach.

Integration:

1. Replace the `AdManagerBannerView` with `BannerView` in the UI. 
2. Implement the protocol `BannerViewDelegate` in the ViewController.
3. Remove usage of `AdManagerBannerView`, `AdManagerRequest`, and implementation of the `GoogleMobileAds.BannerViewDelegate`.
4. Remove original `BannerAdUnit`.
5. Follow the instructions to integrate [Banner API](#banners).

### Interstitials

Integration example:

```swift
// 1. Create Event Handler
let eventHandler = GAMInterstitialEventHandler(adUnitID: GAM_AD_UNIT_ID)
    
// 2. Create Interstitial Ad Unit
interstitial = InterstitialRenderingAdUnit(configID: CONFIG_ID,
                                           minSizePercentage: MIN_SIZE_PERC,
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

The **default** ad format for interstitial is **.banner**. In order to make a `multiformat bid request`, set the respective values in the `adFormats` property.

```swift
// Make bid request for video ad                                     
adUnit?.adFormats = [.video]

// Make bid request for both video amd disply ads                                     
adUnit?.adFormats = [.video, .banner]

// Make bid request for banner ad (default behaviour)                                     
adUnit?.adFormats = [.banner]

```

#### Step 1: Create Event Handler
{:.no_toc}

To create an event handler you should provide a **GAM Ad Unit**.

#### Step 2: Create Interstitial Ad Unit
{:.no_toc}

Initialize the `InterstitialRenderingAdUnit` with properties:

- `configID` - an ID of Stored Impression on the Prebid server
- `minSizePercentage` - specifies the minimum width and height percent an ad may occupy of a device’s real estate.
- `eventHandler` - the instance of the interstitial event handler

> **NOTE:** the `minSizePercentage` - plays an important role in the bidding process for display ads. If provided space is not enough demand partners won't respond with bids.

#### Step 3: Load the Ad
{:.no_toc}

Call the method `loadAd()` which will make a bid request to Prebid Server.

#### Step 4: Show the Ad when it is ready
{:.no_toc}

Wait for the Prebid Server to return an ad and show it to the user in any suitable time.

```swift
// MARK: InterstitialAdUnitDelegate
    
func interstitialDidReceiveAd(_ interstitial: InterstitialAdUnit) {
    // Now the ad is ready for display
}
```

#### Migrating interstitials from a Bidding-Only integration

GAM setup:

1. Leave the original order and ad units as is. They are not relevant for the rendering approach but they will serve ads for released applications.
2. Create a new GAM ad unit.
3. Setup the new [GAM Order](/prebid-mobile/modules/rendering/ios-sdk-integration-gam.html) for rendering approach.

Integration:

1. Replace the `AdManagerInterstitialAd` with `InterstitialRenderingAdUnit` in the View Controller. 
2. Implement the protocol `InterstitialAdUnitDelegate` in the View Controller.
3. Remove usage of `AdManagerInterstitialAd`, `AdManagerRequest`.
4. Remove original `InterstitialAdUnit`.
5. Follow the instructions to integrate [Interstitial API](#interstitials).

### Rewarded

{% include mobile/rewarded-server-side-configuration.md %}

#### Integration example

```swift
 // 1. Create an Event Handler
let eventHandler = GAMRewardedEventHandler(adUnitID: GAM_AD_UNIT_ID)
    
// 2. Create an Ad Unit
rewardedAd = RewardedAdUnit(configID: CONFIG_ID, eventHandler: eventHandler)
    
rewardedAd.delegate = self
    
// 3. Load an Ad
rewardedAd.loadAd()

/// .......

// 4. Display Ad
if rewardedAd.isReady {
    rewardedAd.show(from: self)
}

```

The proccess for displaying the Rewarded Ad is the same as for the Interstitial Ad. 

To be notified when a user earns a reward - implement the method of `RewardedAdUnitDelegate`:

```swift
func rewardedAdUserDidEarnReward(_ rewardedAd: RewardedAdUnit, reward: PrebidReward) {}
```

##### Step 1: Create Event Handler
{:.no_toc}

The reward object is stored in the `RewardedAdUnit`:

{% capture gma12 %}if let reward = rewardedAd.reward as? GoogleMobileAds.AdReward {
    // ...
}
{% endcapture %}
{% capture gma11 %}if let reward = rewardedAd.reward as? GADAdReward {
    // ...
}
{% endcapture %}

{% include code/gma-versions-tabs.html id="gam-reward" gma11=gma11 gma12=gma12 %}

To create an event handler you should provide a **GAM Ad Unit ID**.

##### Step 2: Create Rewarded Ad Unit
{:.no_toc}

Create the `RewardedAdUnit` object with parameters:

- `configID` - an ID of Stored Impression on the Prebid server
- `eventHandler` - the instance of rewarded event handler

##### Step 3: Load the Ad
{:.no_toc}

Call the `loadAd()` method which will make a bid request to Prebid server.

##### Step 4: Show the Ad when it is ready
{:.no_toc}

Wait for the ad to load and display it to the user in any suitable time.

```swift
// MARK: RewardedAdUnitDelegate
    
func rewardedAdDidReceiveAd(_ rewardedAd: RewardedAdUnit) {
    // Now the ad is ready for display
}
```

###### Step 4: Handle the reward
{:.no_toc}

Handle the reward in the appropriate method. 

``` swift
// MARK: RewardedAdUnitDelegate

func rewardedAdUserDidEarnReward(_ rewardedAd: RewardedAdUnit, reward: PrebidReward) {
    let type = reward.type
    let count = reward.count
    let ext = reward.ext
        
    // Process the reward
}
```

#### Migrating Rewarded Video from a Bidding-Only integration

GAM setup:

1. Leave the original order and ad units as is. They are not relevant for the rendering approach but they will serve ads for released applications.
2. Create a new GAM ad unit.
3. Setup the new [GAM Order](/prebid-mobile/modules/rendering/ios-sdk-integration-gam.html) for rendering approach.

Integration:

1. Replace the `RewardedAd` with `RewardedAdUnit` in the View Controller. 
2. Implement the protocol `RewardedAdUnitDelegate` in the View Controller.
3. Remove usage of `AdManagerRequest`.
4. Remove original `RewardedVideoAdUnit`.
5. Follow the instructions to integrate [Rewarded API](#rewarded).

## Additional Ad Unit Configuration

{% include mobile/rendering-adunit-config-ios.md %}

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK iOS Integration](/prebid-mobile/pbm-api/ios/code-integration-ios.html)
- [Prebid SDK iOS Global Parameters](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
