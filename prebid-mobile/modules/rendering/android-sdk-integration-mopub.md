---

layout: page_v2
title: MoPub Integration
description: Integration the Rendering Module with MoPub on Android
sidebarType: 2

---

# MoPub Integration

The integration of Prebid Rendering API with MoPub assumes that publisher has an account on MoPub and has already integrated the MoPub SDK into the app project.

If you do not have MoPub SDK in the app yet, refer the [MoPub's Documentation](https://github.com/mopub/mopub-android-sdk).


## MoPub Integration Overview

The integration of header bidding into MoPub monetization is based on MoPub's Mediation feature. 

![Rendering with GAM as the Primary Ad Server](/assets/images/prebid-mobile/modules/rendering/Prebid-In-App-Bidding-Overview-MoPub.png)

**Steps 1-2** Prebid SDK makes a bid request. Prebid server runs an auction and returns the winning bid.

**Step 3** Prebid SDK via MoPub Adapters Framework sets up targeting keywords into the MoPub's ad unit.

**Step 4** MoPub SDK makes an ad request. MoPub returns the mediation chain.

**Step 5** If Prebid's creative wins in the waterfall then the MoPub SDK will instantiate respective Prebid Adapter which will render the winning bid.

**Step 6** The winner is displayed in the App with the respective rendering engine.

Prebid Rendering API provides ability to integrate header bidding for these ad kinds:

- Display Banner
- Display Interstitial
- Video Interstitial 
- Rewarded Video

[//]: # (- Native)
[//]: # (- Native Styles)

They can be integrated using these API categories.

- [**Banner API**](#banner-api) - for **Display Banner**
- [**Interstitial API**](#interstitial-api) - for **Display** and **Video** Interstitials
- [**Rewarded API**](#rewarded-api) - for **Rewarded Video**

[//]: # (- [**Native API**](android-sdk-integration-mopub-native.html))


## Init Prebid Rendering Module

Set up a Prebid Server host amd provide an **Account Id** of your organization first.

```
PrebidRenderingSettings.setBidServerHost(HOST)
PrebidRenderingSettings.setAccountId(YOUR_ACCOUNT_ID)
```

The best place to do it is the `onCreate()` method of your Application class.

The account ID is an identifier of the **Stored Request**.

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
implementation('org.prebid:prebid-mobile-sdk-mopub-adapters:x.x.x')
```

For more details about Adapters read the [MoPub's Documentation](https://developers.mopub.com/networks/integrate/mopub-network-mediation-guidelines/).


## Banner API

Integration example:


``` kotlin
private fun initBanner() {
    // 1. Create and initialize MoPubView instance
    bannerView = MoPubView(requireContext())
    bannerView?.setAdUnitId(moPubAdUnit)
    bannerView?.bannerAdListener = this

    // Add moPubView to your viewContainer
    viewContainer?.addView(bannerView)

    val builder = SdkConfiguration.Builder(moPubAdUnit)
    MoPub.initializeSdk(requireContext(), builder.build()) {
        fetchAdUnit(configId, AdSize(320, 50))
    }
}

private fun fetchAdUnit(configId: String, size: AdSize) {
    if (bannerAdUnit == null) {
        // 2. initialize MoPubBannerAdUnit
        bannerAdUnit = MediationBannerAdUnit(requireContext(), configId, size, MoPubMediationDelegate() )
    }
    // 3. Run an Header Bidding auction on Prebid and provide MoPubView as parameter. It is important to execute this method after MoPub SDK initialization.
    bannerAdUnit?.fetchDemand(bannerView!!) {
        // 4. execute MoPubView `loadAd` when receiving a valid demand result
        bannerView?.loadAd()
    }
}
```

#### Step 1: Create Ad View

Follow the [MoPub Instructions](https://developers.mopub.com/publishers/android/banner/) for Banner integration.

#### Step 2: Create Ad Unit

Create the `MediationBannerAdUnit` object with parameters:

- `configId` - an ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) on the Prebid server
- `size` - the size of the ad unit which will be used in the bid request.
- `mediationDelegate` - the object from the MoPubAdapters framework responsible for managing MoPub’s ad objects.

#### Step 3: Fetch Demand

To run an auction on Prebid run the `fetchDemand()` method which performs several actions:

- Makes a bid request to Prebid Server
- Sets up the targeting keywords to the MoPub's ad unit
- Passes the winning bid to the MoPub's ad unit
- Returns the result of bid request for future processing

#### Step 4: Load the Ad

When the bid request is completed, the responsibility of making the Ad Request is passed to the publisher. Call the `loadAd()` method on the MoPub's Ad View explicitly in the completion handler of the `fetchDemand()`.

#### Step 5: Rendering

If the Prebid Line Item is processed in the waterfall the winning bid will be rendered by `PrebidBannerAdapter`. You shouldn't do anything for this.  Just make sure that your order has been set up correctly and an adapter has been added to the project.

### Migration from the original API

1. Replace the `BannerAdUnit` with `MediationBannerlAdUnit`. 
5. Follow the instructions to integrate [Banner API](#banner-api).  
6. Setup the [MoPub Order](rendering-mopub-line-item-setup.html) for rendering. You should create a new order with **Network Line Items** instead of the original one. 

## Interstitial API

To display an ad you need to implement these easy steps:

``` kotlin
private fun initInterstitial() {
    // 1. Create and initialize MoPubInterstitial instance
    moPubInterstitial = MoPubInterstitial(requireActivity(), adUnit)
    moPubInterstitial?.interstitialAdListener = this

    // 2. Initialize MoPubInterstitialAdUnit
    moPubInterstitialAdUnit = MediationInterstitialAdUnit(requireContext(), configId, minSizePercentage. MoPubMediationAdUnit())

    val builder = SdkConfiguration.Builder(adUnit)
    MoPub.initializeSdk(requireContext(), builder.build()) {
        fetchInterstitial()
    }
}

private fun fetchInterstitial() {
    // 3. Execute `fetchDemand` method and provide MoPubInterstitial as parameter. It is important to execute this method after MoPub SDK initialization.
    moPubInterstitialAdUnit?.fetchDemand(moPubInterstitial!!) {
        // 4. Execute MoPubInterstitial `load` when receiving a valid demand result
        moPubInterstitial?.load()
    }
}
    
    
//...
// After ad is loaded you can execute `show` to trigger ad display
moPubInterstitial?.show()
```

The way of displaying **Video Interstitial Ad** is almost the same with two differences:

- Need customize the ad format
- No need to set up `minSizePercentage`

``` kotlin
private fun initInterstitial() {
    // 1. Create and initialize MoPubInterstitial instance
    moPubInterstitial = MoPubInterstitial(requireActivity(), adUnit)
    moPubInterstitial?.interstitialAdListener = this

    // 2. Initialize MoPubInterstitialAdUnit and provide VIDEO AdUnitFormat
    moPubInterstitialAdUnit = MediationInterstitialAdUnit(requireContext(), configId, AdUnitFormat.VIDEO, MoPubMediationAdUnit())

    val builder = SdkConfiguration.Builder(adUnit)
    MoPub.initializeSdk(requireContext(), builder.build()) {
        fetchInterstitial()
    }
}

private fun fetchInterstitial() {
    // 3. Execute `fetchDemand` method and provide MoPubInterstitial as parameter. It is important to execute this method after MoPub SDK initialization.
    moPubInterstitialAdUnit?.fetchDemand(moPubInterstitial!!) {
        // 4. Execute MoPubInterstitial `load` when receiving a valid demand result
        moPubInterstitial?.load()
    }
}

//...
// After ad is loaded you can execute `show` to trigger ad display
moPubInterstitial?.show()
```

#### Step 1: Integrate interstitial ad

Follow the [MoPub Instructions](https://developers.mopub.com/publishers/android/interstitial/) and intgrate Interstital ad unit.


#### Step 2: Create prebid Ad Unit

Create the `MediationInterstitialAdUnit` object with parameters:

- `configId` - an ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) on the Prebid server
- `mediationDelegate` - the object from the MoPubAdapters framework responsible for managing MoPub’s ad objects.

#### Step 3: Fetch Demand

To run an auction on Prebid run the`fetchDemand()` method which performs several actions:

- Makes a bid request to Prebid Server
- Sets up the targeting keywords to the MoPub's ad unit
- Passes the winning bid to the MoPub's ad unit
- Returns the result of bid request for future processing

#### Step 4: Load the Ad

Call the `loadAd()` on the MoPub Interstitial Ad explicitly in the completion handler of the `fetchDemand()`.

#### Step 5: Rendering

If the Prebid bid wins on MoPub it will be rendered by `PrebidInterstitialAdapter`. You shouldn't do anything for this.  Just make sure that your order has been set up correctly and an adapter has been added to the project.


However, due to the expiration, the ad could become invalid with time. So it is always useful to check it with `interstitial?.isReady` before display.

### Migration from the original API

1. Replace the `InterstitialAdUnit` with `MediationInterstitialAdUnit`. 
5. Follow the instructions to integrate [Interstitial API](#interstitial-api).  
6. Setup the [MoPub Order](rendering-mopub-line-item-setup.html) for rendering. You should create a new order with **Network Line Items** instead of the original one. 

## Rewarded API

Integration Example:

``` kotlin
private fun initRewarded() {
    // 1. Create MoPubRewardedVideoAdUnit instance
    rewardedAdUnit = MediationRewardedAdUnit(requireContext(), adUnitId, configId)
    
    // 2. Initialize MoPub SDK and MoPubRewardedVideoManager.
    val builder = SdkConfiguration.Builder(adUnitId)
    MoPubRewardedVideoManager.init(requireActivity())
    MoPubRewardedVideoManager.updateActivity(requireActivity())
    MoPubRewardedVideos.setRewardedVideoListener(this)
    MoPub.initializeSdk(requireContext(), builder.build()) {
        fetchRewarded(adUnitId)
    }
}

private fun fetchRewarded(adUnitId: String) {
    // 3. Execute `fetchDemand` method and keywords Map as parameter. It is important to execute this method after MoPub SDK initialization.
    rewardedAdUnit?.fetchDemand(keywordsMap) {
        val keywordsString = convertMapToMoPubKeywords(keywordsMap)
        val params = MoPubRewardedVideoManager.RequestParameters(keywordsString)

        // 4. After creating RequestParameters from keywordsMap you can execute rewardedVideo loading
        MoPubRewardedVideos.loadRewardedVideo(adUnitId, params, null)
    }
}

//...
// After ad is loaded you can execute `show` to trigger ad display
MoPubRewardedVideos.showRewardedVideo(adUnitId)
```

#### Step 1: Create an Rewarded Ad Unit

Create the `MediationRewardedVideoAdUnit` object with parameters:

- `configId` - an ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) on the Prebid server

#### Step 2: Fetch Demand

To run an auction on Prebid run the `fetchDemand()` method which does several things:

- Makes a bid request to Prebid Server
- Sets up the targeting keywords
- Returns the result of bid request for future processing

#### Step 3: Load the Ad

Call the `loadAd()` of the MoPub's Ad View explicitly in the completion handler of the `fetchDemand()`.


#### Step 5: Rendering

If the Prebid bid wins on MoPub it will be rendered by ``. You do not have to do anything for this.  Just make sure that your order had been set up correctly and an adapter is added.

If the Prebid Line Item is processed in the waterfall the winning bid will be rendered by `PrebidRewardedVideoAdapter `. You shouldn't do anything for this.  Just make sure that your order has been set up correctly and an adapter has been added to the project.

1. Replace the `RewardedVideoAdUnit` with `MediationRewardedAdUnit`. 
5. Follow the instructions to integrate [Rewarded Video API](#rewarded-api).  
6. Setup the [MoPub Order](rendering-mopub-line-item-setup.html) for rendering. You should create a new order with **Network Line Items** instead of the original one.





