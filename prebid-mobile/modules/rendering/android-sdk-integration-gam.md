---

layout: page_v2
title: Prebid Mobile Rendering GAM Line Item Setup
description: Prebid Mobile Rendering Modules GAM line item setup
sidebarType: 2

---

# Google Ad Manager Integration
{:.no_toc}

The integration of Prebid Rendering API with Google Ad Manager (GAM) assumes that the publisher has an account on GAM and has already integrated the Google Mobile Ads SDK (GMA SDK) into the app project. 


If you do not have the GAM SDK in the app yet, refer to the [Google Integration Documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/android/quick-start).

* TOC
{:toc}

## GAM Integration Overview

![Rendering with GAM as the Primary Ad Server](/assets/images/prebid-mobile/modules/rendering/Prebid-In-App-Bidding-Overview-GAM.png)

**Steps 1-2** Prebid SDK makes a bid request. Prebid Server runs an auction and returns the winning bid.

**Step 3** The Prebid Rendering Module, through the GAM Event Handler, sets up the targeting keywords into the GAM's ad unit.

**Step 4** The GMA SDK makes an ad request. GAM returns the winning line item.

**Step 5** Based on the ad response, Prebid GAM Event Handler defines which line item has won in GAM - Prebid's or another ad source.

**Step 6** The winner is displayed in the app with the respective rendering engine.
  

## Integrate Event Handlers

Prebid SDK provides rendering integration into GAM setup via [app events ](https://developers.google.com/ad-manager/mobile-ads-sdk/android/banner#app_events) mechanism. To integrate Prebid Event Handlers into your app, add the following line to your Podfile:

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
// 1. Create a banner custom event handler for GAM ad server.
val eventHandler = GamBannerEventHandler(requireContext(), GAM_AD_UNIT, GAM_AD_SIZE)

// 2. Create a bannerView instance and provide the GAM event handler
bannerView = BannerView(requireContext(), configId, eventHandler)
// (Optional) set an event listener
bannerView?.setBannerListener(this)

// Add bannerView to your viewContainer
viewContainer?.addView(bannerView)

// 3. Execute the loadAd function.
bannerView?.loadAd()
```

#### Step 1: Create Event Handler
{:.no_toc}

GAM's event handlers are special containers that wrap GAM Ad Views and help to manage collaboration between GAM and Prebid views.

**Important:** you should create and use a unique event handler for each ad view.

To create the event handler you should provide a GAM Ad Unit Id and the list of available sizes for this ad unit.

#### Step 2: Create Ad View
{:.no_toc}

**BannerView** - is the view that will display a particular ad. It should be added to the UI. To create it you should provide:

- **configId** - an ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) on the Prebid server
- **eventHandler** - the instance of the banner event handler

Also, you should add the instance of `BannerView` to the UI.

And assign the listeners for processing ad events.

#### Step 3: Load the Ad
{:.no_toc}

Call the `loadAd()` method to start the In-App Bidding flow. The In-App Bidding SDK starts the bidding process immediately.

### Outstream Video
{:.no_toc}

For **Outstream Video** you also need to specify video placement type of the expected ad:

``` kotlin
bannerView.videoPlacementType = PlacementType.IN_BANNER // or any other available type
```

### Migration from the original API
{:.no_toc}

GAM setup:
1. Leave the original order and ad units as is. They are not relevant for the rendering approach but they will serve ads for released applications.
2. Create new GAM ad unit.
3. Setup new [GAM Order](/adops/mobile-rendering-gam-line-item-setup.html) for rendering approach.

Integration:
1. Replace the `AdManagerAdView` with `BannerView` in the UI. 
3. Implement the interface `BannerViewListener`.
4. Remove both `AdManagerAdView` and `AdManagerAdRequest` and implement an`AdListener`.
5. Remove the original `BannerAdUnit`.
6. Follow the instructions to integrate [Banner API](#banner-api).  


## Interstitial API

To integrate interstitial ad follow these steps:


``` kotlin
// 1. Create an interstitial custom event handler for GAM ad server.
val eventHandler = GamInterstitialEventHandler(requireContext(), gamAdUnit)

// 2. Create an interstitialAdUnit instance and provide GAM event handler
interstitialAdUnit = InterstitialAdUnit(requireContext(), configId, minSizePercentage, eventHandler)
// (Optional) set an event listener
interstitialAdUnit?.setInterstitialAdUnitListener(this)

// 3. Execute the loadAd function. 
interstitialAdUnit?.loadAd()

//....

// 4. After ad is loaded you can execute the `show` function to trigger ad display
interstitialAdUnit?.show()

```

The **default** ad format for an interstitial ad is **DISPLAY**. In order to make a `multiformat bid request`, set the respective values into the `adUnitFormats` parameter.

```
interstitialAdUnit = InterstitialAdUnit(
                        requireContext(), 
                        configId, 
                        EnumSet.of(AdUnitFormat.BANNER, AdUnitFormat.VIDEO), 
                        eventHandler)
```


#### Step 1: Create Event Handler
{:.no_toc}

GAM's event handlers are special containers that wrap the GAM Ad Views and help to manage collaboration between GAM and Prebid views.

**Important:** you should create and use a unique event handler for each ad view.

To create an event handler you should provide a GAM Ad Unit.

#### Step 2: Create Interstitial Ad Unit
{:.no_toc}

**InterstitialAdUnit** - is an object that will load and display a particular ad. To create it you should provide:

- **configId** - an ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) on the Prebid server
- **minSizePercentage** - specifies the minimum width and height percent an ad may occupy of a device’s screen.
- **eventHandler** - the instance of the interstitial event handler

Also, you can assign the listeners for processing ad events.

> **NOTE:** minSizePercentage - plays an important role in a bidding process for display ads. If the provided space is too small demand partners won't respond with bids.

#### Step 3: Load the Ad
{:.no_toc}

Call the `loadAd()` method to start In-App Bidding flow. The ad unit will load an ad and will wait for explicit instructions to display the Interstitial Ad.


#### Step 4: Show the Ad when it is ready
{:.no_toc}

The most convenient way to determine if the interstitial ad is ready for displaying is to listen to the listener method:

``` kotlin
override fun onAdLoaded(interstitialAdUnit: InterstitialAdUnit) {
//Ad is ready for display
}
```

### Migration from the original API
{:.no_toc}

GAM setup:
1. Leave the original order and ad units as is. They are not relevant for the rendering approach but they will serve ads for released applications.
2. Create a new GAM ad unit.
3. Setup a new [GAM Order](rendering-gam-line-item-setup.html) for rendering approach. 

Integration:
1. Replace the `AdManagerInterstitialAd` with `InterstitialRenderingAdUnit`. 
3. Implement the interface for `InterstitialEventListener`.
4. Remove both `AdManagerInterstitialAd` and `AdManagerAdRequest`.
5. Remove the original `InterstitialAdUnit`.
6. Follow the instructions to integrate [Interstitial API](#interstitial-api).  


## Rewarded API

To display a Rewarded Ad follow these steps:


``` kotlin
// 1. Create a rewarded custom event handler for GAM ad server.
val eventHandler = GamRewardedEventHandler(requireActivity(), gamAdUnitId)

// 2. Create a rewardedAdUnit instance and provide the GAM event handler
rewardedAdUnit = RewardedAdUnit(requireContext(), configId, eventHandler)

// You can also set an event listener, this step is optional.
rewardedAdUnit?.setRewardedAdUnitListener(this)

// 3. Execute the loadAd function. 
rewardedAdUnit?.loadAd()

//...

// 4. After the ad is loaded you can execute the `show` function to display the ad. 
rewardedAdUnit?.show()
```

Displaying the **Rewarded Ad** is the same as displaying an Interstitial Ad. The type of ad can be customized to:


Be notified when user earns a reward - implement `RewardedAdUnitListener` interface:

``` kotlin
 fun onUserEarnedReward(rewardedAdUnit: RewardedAdUnit)
```

When the actual reward object is stored in the `RewardedAdUnit`:

``` kotlin
val reward = rewardedAdUnit.getUserReward()
```

#### Step 1: Create Event Handler
{:.no_toc}

GAM's event handlers are special containers that wrap the GAM Ad Views and help to manage collaboration between GAM and Prebid views.

**Important:** you should create and use a unique event handler for each ad view.

To create an event handler you should provide a GAM Ad Unit.

#### Step 2: Create Rewarded Ad Unit
{:.no_toc}

**RewardedAdUnit** - is an object that will load and display the particular ad. To create it you should provide

- **configId** - is an ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) on the Prebid server
- **eventHandler** - is the instance of the rewarded event handler

You can also assign the listener for processing ad events.

#### Step 3: Load the Ad
{:.no_toc}

Call the `loadAd()` method to start the In-App Bidding flow. The ad unit will load an ad and will wait for explicit instructions to display the Rewarded Ad.

#### Step 4: Display the Ad when it is ready
{:.no_toc}

The most convenient way to determine if the ad is ready for displaying is to listen for the listener method:

``` kotlin
override fun onAdLoaded(rewardedAdUnit: RewardedAdUnit) {
//Ad is ready for display
}
```

### Migration from the original API
{:.no_toc}

GAM setup:
1. Leave the original order and ad units as is. They are not relevant for the rendering approach but they will serve ads for released applications.
2. Create a new GAM ad unit.
3. Setup a new [GAM Order](rendering-gam-line-item-setup.html) for rendering approach.

Integration:
1. Replace the `RewardedAd` with `RewardedAdUnit`. 
2. Implement the interface for `RewardedAdUnitListener`.
3. Remove the original `RewardedVideoAdUnit`.
4. Follow the instructions to integrate [Rewarded API](#rewarded-api).  
