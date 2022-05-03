---

layout: page_v2
title: Prebid Mobile Rendering GAM Line Item Setup
description: Prebid Mobile Rendering Modules GAM line item setup
sidebarType: 2

---

# Google Ad Manager Integration

The integration of Prebid Rendering API with Google Ad Manager (GAM) assumes that publisher has an account on GAM and has already integrated the Google Mobile Ads SDK (GMA SDK) into the app project. 


If you do not have GAM SDK in the app yet, refer the the [Google Integration Documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/android/quick-start).

Prebid Rendering API was tested with **GAM SDK 20.4.0**. 


## GAM Integration Overview

![Rendering with GAM as the Primary Ad Server](/assets/images/prebid-mobile/modules/rendering/Prebid-In-App-Bidding-Overview-GAM.png)

**Steps 1-2** Prebid SDK makes a bid request. Prebid server runs an auction and returns the winning bid.

**Step 3** Prebid Rendering Module via GAM Event Handler sets up the targeting keywords into the GAM's ad unit.

**Step 4** GMA SDK makes an ad request. GAM returns the winned line item.

**Step 5** Basing on the ad response Prebid GAM Event Handler defines which line item has won on the GAM - the Prebid's one or another ad source on GAM.

**Step 6** The winner is displayed in the app with the respective rendering engine.
  
Prebid Rendering API supports these ad formats:

- Display Banner
- Video Banner
- Display Interstitial
- Video Interstitial 
- Rewarded Video

[//]: # (- Native)
[//]: # (- Native Styles)

They can be integrated using these API categories.

- [**Banner API**](#banner-api) - for *Display Banner* and *Outstream Video*
- [**Interstitial API**](#interstitial-api) - for *Display* and *Video* Interstitials
- [**Rewarded API**](#rewarded-api) - for *Rewarded Video*

[//]: # (- [**Native API**](android-sdk-integration-gam-native.html) - for *Native Ads*)


## Init Prebid Rendering Module

To start running bid requests you have to set the Prebid Server **Host** and **Account Id** and then initilize the SDK with application context. The best place for this is the `onCreate()` method of your Application class.

```
PrebidMobile.setBidServerHost(HOST)
PrebidMobile.setAccountId(YOUR_ACCOUNT_ID)

// Init SDK
PrebidMobile.setApplicationContext(this)
```

> **NOTE:** The account ID is an identifier of the **Stored Request**.

### Event Handlers

GAM Event Handlers is a set of classes that wrap the GAM Ad Units and manage them respectively to the In-App Bidding flow. These classes are provided in the form of library that could be added to the app via Gradle:

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
implementation('org.prebid:prebid-mobile-sdk-gam-event-handlers:x.x.x')
```


## Banner API

To integrate the banner ad you need to implement three easy steps:


``` kotlin
// 1. Create banner custom event handler for GAM ad server.
val eventHandler = GamBannerEventHandler(requireContext(), GAM_AD_UNIT, GAM_AD_SIZE)

// 2. Create a bannerView instance and provide GAM event handler
bannerView = BannerView(requireContext(), configId, eventHandler)
// (Optional) set an event listener
bannerView?.setBannerListener(this)

// Add bannerView to your viewContainer
viewContainer?.addView(bannerView)

// 3. Execute ad loading
bannerView?.loadAd()
```

#### Step 1: Create Event Handler

GAM's event handlers are special containers that wrap GAM Ad Views and help to manage collaboration between GAM and Prebid views.

**Important:** you should create and use a unique event handler for each ad view.

To create the event handler you should provide a GAM Ad Unit Id and the list of available sizes for this ad unit.

#### Step 2: Create Ad View

**BannerView** - is a view that will display the particular ad. It should be added to the UI. To create it you should provide:

- **configId** - an ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) on the Prebid server
- **eventHandler** - the instance of the banner event handler

Also, you should add the instance of `BannerView` to the UI.

And assign the listeners for processing ad events.

#### Step 3: Load the Ad

Simply call the `loadAd()` method to start [In-App Bidding](../android-in-app-bidding-getting-started.html) flow. The In-App Bidding SDK starts the  bidding process right away.

### Outstream Video

For **Outstream Video** you also need to specify video placement type of the expected ad:

``` kotlin
bannerView.videoPlacementType = PlacementType.IN_BANNER // or any other available type
```

### Migration from the original API

GAM setup:
1. Leave the original order and ad units as is. They are not relevant for the rendering approach but they will serve ads for released applications.
2. Create new GAM ad unit.
3. Setup new [GAM Order](rendering-gam-line-item-setup.html) for rendering approach.

Integration:
1. Replace the `AdManagerAdView` with `BannerView` in the UI. 
3. Implement the interface `BannerViewListener`.
4. Remove usage of `AdManagerAdView`, `AdManagerAdRequest`, and implementation of the `AdListener`.
5. Remove original `BannerAdUnit`.
6. Follow the instructions to integrate [Banner API](#banner-api).  


## Interstitial API

To integrate interstitial ad you need to implement four easy steps:


``` kotlin
// 1. Create interstitial custom event handler for GAM ad server.
val eventHandler = GamInterstitialEventHandler(requireContext(), gamAdUnit)

// 2. Create interstitialAdUnit instance and provide GAM event handler
interstitialAdUnit = InterstitialAdUnit(requireContext(), configId, minSizePercentage, eventHandler)
// (Optional) set an event listener
interstitialAdUnit?.setInterstitialAdUnitListener(this)

// 3. Execute ad load
interstitialAdUnit?.loadAd()

//....

// 4. After ad is loaded you can execute `show` to trigger ad display
interstitialAdUnit?.show()

```

The **default** ad format for interstitial is **DISPLAY**. In order to make a `multiformat bid request`, set the respective values into the `adUnitFormats` parameter.

```
interstitialAdUnit = InterstitialAdUnit(
                        requireContext(), 
                        configId, 
                        EnumSet.of(AdUnitFormat.DISPLAY, AdUnitFormat.VIDEO), 
                        eventHandler)
```


#### Step 1: Create Event Handler

GAM's event handlers are special containers that wrap the GAM Ad Views and help to manage collaboration between GAM and Prebid views.

**Important:** you should create and use a unique event handler for each ad view.

To create an event handler you should provide a GAM Ad Unit.

#### Step 2: Create Interstitial Ad Unit

**InterstitialAdUnit** - is an object that will load and display the particular ad. To create it you should provide:

- **configId** - an ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) on the Prebid server
- **minSizePercentage** - specifies the minimum width and height percent an ad may occupy of a device’s real estate.
- **eventHandler** - the instance of the interstitial event handler

Also, you can assign the listeners for processing ad events.

> **NOTE:** minSizePercentage - plays an important role in a bidding process for display ads. If provided space is not enough demand partners won't respond with the bids.


#### Step 3: Load the Ad

Simply call the `loadAd()` method to start [In-App Bidding](../android-in-app-bidding-getting-started.html) flow. The ad unit will load an ad and will wait for explicit instructions to display the Interstitial Ad.


#### Step 4: Show the Ad when it is ready


The most convenient way to determine if the interstitial ad is ready for displaying is to listen to the particular listener method:

``` kotlin
override fun onAdLoaded(interstitialAdUnit: InterstitialAdUnit) {
//Ad is ready for display
}
```

### Migration from the original API

GAM setup:
1. Leave the original order and ad units as is. They are not relevant for the rendering approach but they will serve ads for released applications.
2. Create new GAM ad unit.
3. Setup new [GAM Order](rendering-gam-line-item-setup.html) for rendering approach. 

Integration:
1. Replace the `AdManagerInterstitialAd` with `InterstitialRenderingAdUnit`. 
3. Implement the interface `InterstitialEventListener`.
4. Remove usage of `AdManagerInterstitialAd`, `AdManagerAdRequest`.
5. Remove original `InterstitialAdUnit`.
6. Follow the instructions to integrate [Interstitial API](#interstitial-api).  


## Rewarded API

To display an Rewarded Ad need to implement four easy steps:


``` kotlin
// 1. Create rewarded custom event handler for GAM ad server.
val eventHandler = GamRewardedEventHandler(requireActivity(), gamAdUnitId)

// 2. Create rewardedAdUnit instance and provide GAM event handler
rewardedAdUnit = RewardedAdUnit(requireContext(), configId, eventHandler)

// (Optional) set an event listener
rewardedAdUnit?.setRewardedAdUnitListener(this)

// 3. Execute ad load
rewardedAdUnit?.loadAd()

//...

// 4. After ad is loaded you can execute `show` to trigger ad display
rewardedAdUnit?.show()
```

The way of displaying the **Rewarded Ad** is totally the same as for the Interstitial Ad. You can customize a kind of ad:


To be notified when user earns a reward - implement `RewardedAdUnitListener` interface:

``` kotlin
 fun onUserEarnedReward(rewardedAdUnit: RewardedAdUnit)
```

The actual reward object is stored in the `RewardedAdUnit`:

``` kotlin
val reward = rewardedAdUnit.getUserReward()
```

#### Step 1: Create Event Handler

GAM's event handlers are special containers that wrap the GAM Ad Views and help to manage collaboration between GAM and Prebid views.

**Important:** you should create and use a unique event handler for each ad view.

To create an event handler you should provide a GAM Ad Unit.


#### Step 2: Create Rewarded Ad Unit

**RewardedAdUnit** - is an object that will load and display the particular ad. To create it you should provide

- **configId** - an ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) on the Prebid server
- **eventHandler** - the instance of rewarded event handler

Also, you can assign the listener for processing ad events.


#### Step 3: Load the Ad

Simply call the `loadAd()` method to start an In-App Bidding flow. The ad unit will load an ad and will wait for explicit instructions to display the Rewarded Ad.


#### Step 4: Show the Ad when it is ready


The most convenient way to determine if the ad is ready for displaying is to listen for particular listener method:

``` kotlin
override fun onAdLoaded(rewardedAdUnit: RewardedAdUnit) {
//Ad is ready for display
}
```

### Migration from the original API

GAM setup:
1. Leave the original order and ad units as is. They are not relevant for the rendering approach but they will serve ads for released applications.
2. Create new GAM ad unit.
3. Setup new [GAM Order](rendering-gam-line-item-setup.html) for rendering approach.

Integration:
1. Replace the `RewardedAd` with `RewardedAdUnit`. 
2. Implement the interface `RewardedAdUnitListener`.
3. Remove original `RewardedVideoAdUnit`.
4. Follow the instructions to integrate [Rewarded API](#rewarded-api).  
