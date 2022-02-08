---

layout: page_v2
title: Prebid Mobile Rendering GAM Line Item Setup
description: Prebid Mobile Rendering Modules GAM line item setup
sidebarType: 2

---

# AdMob Integration

The integration of Prebid Mobile with Google AdMob assumes that publisher has an AdMob account has already integrated the Google Mobile Ads SDK (GMA SDK) into the app project. 


If you do not have GAM SDK in the app yet, refer the the [Google Integration Documentation](https://developers.google.com/admob/android/quick-start).




## AdMob Integration Overview

![Rendering with GAM as the Primary Ad Server](/assets/images/prebid-mobile/modules/rendering/prebid-in-app-bidding-overview-admob.png)

**Steps 1-2** Prebid SDK makes a bid request. Prebid server runs an auction and returns the winning bid.

**Step 3** GMA SDK makes an ad request. AdMob returns the mediation chain with respective ad sources.

**Step 4** For each Prebid Ad Source, the GMA SDK instantiates an adapter. 

**Step 5** The adapter verifies the targeting keywords of the winning bid and server properties of the given Ad Source. If they match adapter will render the winning bid. Otherwise, it will fail with "no ad" immediately and the next ad source will instantiate the same adapter but for another set of server parpams.

They can be integrated using these API categories.

- [**Banner API**](#banner-api) - for *Display Banner* and *Outstream Video*
- [**Interstitial API**](#interstitial-api) - for *Display* and *Video* Interstitials
- [**Rewarded API**](#rewarded-api) - for *Rewarded Video*
- [**Native API**](#native-api) - for *Native Ads*)


## Init Prebid Rendering Module

To start running bid requests you should provide the Prebid Server URL and account ID:

```
PrebidRenderingSettings.setBidServerHost(HOST)
PrebidRenderingSettings.setAccountId(YOUR_ACCOUNT_ID)
```

The best place to do it is the `onCreate()` method of your Application class. The `account ID` is an identifier of the **Stored Request** on the prebid server.

### Prebid Adapters

To integrate Prebid Adapters just add the following lines in your build.gradle files:

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
implementation('org.prebid:prebid-mobile-sdk-admob-adapters:x.x.x')
```

## Banner API

Integration example:


``` kotlin
// 1. Create AdView and AdRequest
bannerView = AdView(activity)
bannerView?.adSize = AdSize.BANNER
bannerView?.adUnitId = adUnitId

val extras = Bundle()
val request = AdRequest
        .Builder()
        .addCustomEventExtrasBundle(PrebidBannerAdapter::class.java, extras)
        .build()

// 2. Create AdMobBannerMediationUtils
val mediationUtils = AdMobBannerMediationUtils(extras, bannerView)

// 3. Create MediationBannerAdUnit
adUnit = MediationBannerAdUnit(
    wrapper.context,
    configId,
    org.prebid.mobile.rendering.bidding.data.AdSize(width, height),
    mediationUtils
)
adUnit?.setRefreshInterval(autoRefreshTime / 1000)

// 4. Make a bid request
adUnit?.fetchDemand { result ->
    Log.d("Prebid", "Fetch demand result: $result")
    
    // 5. Request the ad
    bannerView?.loadAd(request)
}
```

#### Step 1: Create AdMob activity 

This step is totally the same as for pure [AdMob integration](https://developers.google.com/admob/android/banner). You don't have to make any modifications here.


#### Step 2: Create AdMobMediationBannerUtils

The `AdMobBannerMediationUtils` is a helper class, wich performs spcific utilty work for `MediationBannerAdUnit`, like passing the targeting keywords to adapters and checking the visibility of the ad view.

#### Step 3: Create MediationBannerAdUnit

The `MediationBannerAdUnit` is part of Prebid mediation API. This class is responsible for making bid request and providing the winning bid and targeting keywords to mediating SDKs.  

#### Step 4: Make bid request

The `fetchDemand` method makes a bid request to prebid server and provide the results in the completion handler.

#### Step 5: Make an Ad Reuest

Now you should just make a regular AdMob's ad request. Evetything else will be handled by GMA SDK and prebid adapters.

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

The way of displaying **Video Interstitial Ad** is almost the same with two differences:

- Need to customize the ad unit format
- No need to set up `minSizePercentage`

``` kotlin
// 1. Create interstitial custom event handler for GAM ad server.
val eventHandler = GamInterstitialEventHandler(requireContext(), gamAdUnit)

// 2. Create interstitialAdUnit instance and provide GAM event handler
interstitialAdUnit = InterstitialAdUnit(requireContext(), configId, AdUnitFormat.VIDEO, eventHandler)

// (Optional) set an event listener
interstitialAdUnit?.setInterstitialAdUnitListener(this)

// 3. Execute ad load
interstitialAdUnit?.loadAd()

//....

// 4. After ad is loaded you can execute `show` to trigger ad display
interstitialAdUnit?.show()

```


#### Step 1: Create Event Handler

GAM's event handlers are special containers that wrap the GAM Ad Views and help to manage collaboration between GAM and Prebid views.

**Important:** you should create and use a unique event handler for each ad view.

To create an event handler you should provide a GAM Ad Unit.

#### Step 2: Create Interstitial Ad Unit

**InterstitialAdUnit** - is an object that will load and display the particular ad. To create it you should provide:

- **configId** - an ID of Stored Impression on the Prebid server
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

1. Replace the `AdManagerInterstitialAd` with `InterstitialRenderingAdUnit`. 
3. Implement the interface `InterstitialEventListener`.
4. Remove usage of `AdManagerInterstitialAd`, `AdManagerAdRequest`.
5. Remove original `InterstitialAdUnit`.
5. Follow the instructions to integrate [Interstitial API](#interstitial-api).  
6. Setup the [GAM Order](rendering-gam-line-item-setup.html) for rendering. **Pay Attention** that you can replace the code of creative in the original order **only for display** ads. For video interstitial you have to create a special order and remove the original one.


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

- **configId** - an ID of Stored Impression on the Prebid server
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

1. Replace the `RewardedAd` with `RewardedAdUnit`. 
3. Implement the interface `RewardedAdUnitListener`.
5. Remove original `RewardedVideoAdUnit`.
5. Follow the instructions to integrate [Rewarded API](#rewarded-api).  
6. Setup the [GAM Order](rendering-gam-line-item-setup.html) for rendering. **Pay Attention** that you have to create a new special order for rewarded video ad and remove the original one.
