---

layout: page_v2
title: Pure In-App Bidding Integrations
description: Integration of Prebid SDK without Primary Ad Server SDK
sidebarType: 2

---

# Pure In-App Bidding Integration

## Table of Contents

- [Mobile API](#mobile-api)
- [Banner](#banner-api)
- [Interstitial](#interstitial-api)
- [Rewarded](#rewarded-api)

## Mobile API

The Pure In-App Bidding integration is similar to integration of regular Ad SDK with Prebid in the role ofthe Ad Server.

![In-App Bidding with Prebid](/assets/images/prebid-mobile/modules/rendering/Prebid-In-App-Bidding-Overview-Pure-Prebid.png)

Prebid supports rendering of these ad formats:

- Display Banner
- Display Interstitial
- Video Interstitial
- Rewarded Video
- Outstream Video
[//]: # (- Native)

They can be integrated using these API categories:

- [**Banner API**](#banner-api) - for *Display* and *Video* Banners
- [**Interstitial API**](#interstitial-api) - for *Display* and *Video* Interstitials
- [**Rewarded API**](#rewarded-api) - for *Rewarded Video*
[//]: # (- [**Native API**](ios-sdk-integration-pb-native.html) - for *Native Ads*)

### Banner API

Integration example:

``` swift
// 1. Create an Ad View
let banner = BannerView(frame: CGRect(origin: .zero, size: adSize),
                        configID: CONFIG_ID,
                        adSize: adSize)
    
banner.delegate = self
    
// 2. Load an Ad
banner.loadAd()
```

#### Step 1: Create Ad View

Initialize the Banner Ad View with properties:

- **frame** - the frame rectangle for the view
- **configID** - an ID of Stored Impression on the Prebid server
- **size** - the size of the ad unit which will be used in the bid request.

#### Step 2: Load the Ad

Call the method `loadAd()` which will:

- make a bid request to Prebid server.
- render the winning bid on display.

#### Outstream Video

For **Outstream Video** you also need to specify the kind of expected ad:

``` swift
banner.adFormat = .video
```

### Interstitial API

Integration example:

``` swift
// 1. Create an Interstitial Ad Unit
interstitial = InterstitialAdUnit(configID: CONFIG_ID,
                                  minSizePercentage: CGSize(width: 30, height: 30))
    
interstitial.delegate = self
    
// 2. Load an Ad
interstitial.loadAd()

// .....

// 3. Show An Ad
if interstitial.isReady {
    interstitial.show(from: self)
}

```

The way of displaying **Video Interstitial Ad** is almost the same with two differences:

- Need to customize the ad unit kind
- No need to set up `minSizePercentage`

``` swift

// 1. Create an Interstitial Ad Unit
let interstitial = InterstitialAdUnit(configID: CONFIG_ID)
    
interstitial.adFormat = .video
interstitial.delegate = self
    
// 2. Load an Ad
interstitial.loadAd()

// .....

// 3. Show An Ad
if interstitial.isReady {
    interstitial.show(from: self)
}

```

#### Step 1: Create an Ad Unit


Initialize the Interstitial Ad Unit with properties:


- **configID** - an ID of Stored Impression on the Prebid server
- **minSizePercentage** - specifies the minimum width and height percent an ad may occupy of a device’s real estate.

> **NOTE:** minSizePercentage - plays an important role in a bidding process for display ads. If provided space is not enough demand partners won't respond with the bids.

#### Step 2: Load the Ad

Call the method `loadAd()` which will make a bid request to Prebid server.


#### Step 3: Show the Ad when it is ready

Wait until the ad will be loaded and present it to the user in any suitable time.

``` swift
// MARK: InterstitialAdUnitDelegate
    
func interstitialDidReceiveAd(_ interstitial: InterstitialAdUnit) {
    // Now the ad is ready for display
}
```


### Rewarded API

Integration example:

``` swift
// 1. Create an Ad Unit
rewardedAd = RewardedAdUnit(configID: CONFIG_ID)
rewardedAd.delegate = self
    
// 2. Load an Ad
rewardedAd.loadAd()

/// .......

// 3. Display the Ad
if rewardedAd.isReady {
    rewardedAd.show(from: self)
}
```


#### Step 1: Create Rewarded Ad Unit

Create the **RewardedAdUnit** object with parameter:

- **configID** - an ID of Stored Impression on the Prebid server

#### Step 2: Load the Ad

Call the `loadAd()` method which will make a bid request to Prebid server.

#### Step 3: Show the Ad when it is ready

Wait until the ad will be loaded and present it to the user in any suitable time.

``` swift
// MARK: PBMRewardedAdUnitDelegate
    
func rewardedAdDidReceiveAd(_ rewardedAd: RewardedAdUnit) {
    // Now the ad is ready for display
}   
```