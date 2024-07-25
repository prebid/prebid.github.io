---

layout: page_v2
title: Prebid Mobile Rendering GAM Line Item Setup
description: Prebid Mobile Rendering Modules GAM line item setup
sidebarType: 2

---

# Prebid SDK Android with the GAM Prebid-Rendered Integration Method
{:.no_toc}

- TOC
{:toc}

{% include mobile/intro-prebid-rendered.md platform="android" %}

## Event Handlers

First, a little bit of setup is needed.

### Integrate Event Handlers

The Prebid SDK supples a set of classes called the 'GAM Event Handlers' that wrap the GAM Ad Units and manage them in the In-App Bidding flow. These classes are provided in the form of library that could be added to the app via Gradle:

Root build.gradle

```text
allprojects {
    repositories {
      ...
      mavenCentral()
      ...
    }
}
```

App module build.gradle:

```text
implementation('org.prebid:prebid-mobile-sdk-gam-event-handlers:x.x.x')
```

## AdUnit-Specific instructions

This section covers integration details for different ad formats. In each scenario, you'll be asked for a `configId` - this is a key worked out with your Prebid Server provider. It's used at runtime to pull in the bidders and parameters specific to this adunit. Depending on your Prebid Server partner, it may be a UUID or constructed out of parts like an account number and adunit name.

### Banners

#### Display Banners

To integrate the banner ad you need to implement three easy steps:

```kotlin
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

{% capture warning_note %}  
Pay attention that the `loadAd()` should be called on the main thread. 
{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

##### Step 1: Create Event Handler
{:.no_toc}

GAM's event handlers are special containers that wrap GAM Ad Views and help to manage collaboration between GAM and Prebid views.

**Important:** you should create and use a unique event handler for each ad view.

To create the event handler you should provide a GAM Ad Unit Id and the list of available sizes for this ad unit.

##### Step 2: Create Ad View
{:.no_toc}

**BannerView** - is the view that will display a particular ad. It should be added to the UI. To create it you should provide:

- **configId** - an ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) on the Prebid server
- **eventHandler** - the instance of the banner event handler

Also, you should add the instance of `BannerView` to the UI.

And assign the listeners for processing ad events.

##### Step 3: Load the Ad
{:.no_toc}

Call the `loadAd()` method to make a bid request.

#### Non-Instream Video
{:.no_toc}

For **Non-Instream Video** you also need to specify video placement type of the expected ad:

```kotlin
bannerView.videoPlacementType = PlacementType.IN_BANNER // or any other available type
```

#### Migrating banners from a Bidding-Only integration

GAM setup:

1. Leave the original order and ad units as is. They are not relevant for the rendering approach but they will serve ads for released applications.
2. Create new GAM ad unit.
3. Setup new [GAM Order](/adops/mobile-rendering-gam-line-item-setup.html) for rendering approach.

Integration:

1. Replace the `AdManagerAdView` with `BannerView` in the UI. 
2. Implement the interface `BannerViewListener`.
3. Remove both `AdManagerAdView` and `AdManagerAdRequest` and implement an`AdListener`.
4. Remove the original `BannerAdUnit`.
5. Follow the instructions to integrate [Banner API](#banners).

### Interstitials

To integrate an interstitial ad follow these steps:

```kotlin
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

{% capture warning_note %}  
Pay attention that the `loadAd()` should be called on the main thread. 
{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

The **default** ad format for an interstitial ad is **DISPLAY**. In order to make a `multiformat bid request`, set the respective values into the `adUnitFormats` parameter.

```kotlin
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

Call the `loadAd()` method make a bid request. The ad unit will load an ad and will wait for explicit instructions to display the Interstitial Ad.

#### Step 4: Show the Ad when it is ready
{:.no_toc}

The most convenient way to determine if the interstitial ad is ready for displaying is to listen to the listener method:

```kotlin
override fun onAdLoaded(interstitialAdUnit: InterstitialAdUnit) {
//Ad is ready for display
}
```

#### Migrating interstitials from a Bidding-Only integration

GAM setup:

1. Leave the original order and ad units as is. They are not relevant for the rendering approach but they will serve ads for released applications.
2. Create a new GAM ad unit.
3. Setup a new [GAM Order](rendering-gam-line-item-setup.html) for rendering approach. 

Integration:

1. Replace the `AdManagerInterstitialAd` with `InterstitialRenderingAdUnit`. 
2. Implement the interface for `InterstitialEventListener`.
3. Remove both `AdManagerInterstitialAd` and `AdManagerAdRequest`.
4. Remove the original `InterstitialAdUnit`.
5. Follow the instructions to integrate [Interstitial API](#interstitials).  

### Rewarded Video

To display a Rewarded Ad follow these steps:

```kotlin
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

{% capture warning_note %}  
Pay attention that the `loadAd()` should be called on the main thread. 
{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

Displaying the **Rewarded Ad** is the same as displaying an Interstitial Ad. The type of ad can be customized to:

Be notified when user earns a reward - implement `RewardedAdUnitListener` interface:

```kotlin
 fun onUserEarnedReward(rewardedAdUnit: RewardedAdUnit)
```

When the actual reward object is stored in the `RewardedAdUnit`:

```kotlin
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

Call the `loadAd()` method to make a bid request. The ad unit will load an ad and will wait for explicit instructions to display the Rewarded Ad.

#### Step 4: Display the Ad when it is ready
{:.no_toc}

The most convenient way to determine if the ad is ready for displaying is to listen for the listener method:

```kotlin
override fun onAdLoaded(rewardedAdUnit: RewardedAdUnit) {
//Ad is ready for display
}
```

### Migrating rewarded video from a Bidding-Only integration
{:.no_toc}

GAM setup:

1. Leave the original order and ad units as is. They are not relevant for the rendering approach but they will serve ads for released applications.
2. Create a new GAM ad unit.
3. Setup a new [GAM Order](rendering-gam-line-item-setup.html) for rendering approach.

Integration:

1. Replace the `RewardedAd` with `RewardedAdUnit`.
2. Implement the interface for `RewardedAdUnitListener`.
3. Remove the original `RewardedVideoAdUnit`.
4. Follow the instructions to integrate [Rewarded API](#rewarded-video).

## Additional Ad Unit Configuration

{% include mobile/adunit-config-android.md %}

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK Android Integration](/prebid-mobile/pbm-api/android/code-integration-android.html)
- [Prebid SDK Android Global Parameters](/prebid-mobile/pbm-api/android/pbm-targeting-android.html)
