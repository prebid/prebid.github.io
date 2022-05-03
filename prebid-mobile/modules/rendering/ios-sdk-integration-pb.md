---

layout: page_v2
title: Custom or No mediation
description: Integration of Prebid SDK without Primary Ad Server SDK
sidebarType: 2

---

# Custom Bidding Integration

## Table of Contents

- [Mobile API](#mobile-api)
- [Banner](#banner-api)
- [Interstitial](#interstitial-api)
- [Rewarded](#rewarded-api)

## Mobile API

The integration and usage of the Rendering API are similar to any other Ad SDK. It sends the bid requests to the Prebid Server and renders the winning bid. 

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

Initialize the `BannerAdView` with properties:

- `frame` - the frame rectangle for the view
- `configID` - an ID of the Stored Impression on the Prebid Server
- `size` - the size of the ad unit which will be used in the bid request.

#### Step 2: Load the Ad

Call the method `loadAd()` which will:

- make a bid request to the Prebid Server.
- render the winning bid on display.

#### Outstream Video

For **Banner Video** you also need to specify the ad format:

``` swift
banner.adFormat = .video
```

### Interstitial API

Integration example:

``` swift
// 1. Create an Interstitial Ad Unit
interstitial = InterstitialRenderingAdUnit(configID: CONFIG_ID,
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

The **default** ad format for interstitial is **.display**. In order to make a `multiformat bid request`, set the respective values into the `adFormats` property.

``` swift
// Make bid request for video ad                                     
adUnit?.adFormats = [.video]

// Make bid request for both video amd disply ads                                     
adUnit?.adFormats = [.video, .display]

// Make bid request for disply ad (default behaviour)                                     
adUnit?.adFormats = [.display]

```

#### Step 1: Create an Ad Unit


Initialize the Interstitial Ad Unit with properties:
    
- `configID` - an ID of Stored Impression on the Prebid Server
- `minSizePercentage` - specifies the minimum width and height percent an ad may occupy of a device’s real estate.

> **NOTE:** minSizePercentage - plays an important role in a bidding process for display ads. If provided space is not enough demand partners won't respond with the bids.

#### Step 2: Load the Ad

Call the method `loadAd()` which will make a bid request to Prebid server.


#### Step 3: Show the Ad when it is ready

Wait until the ad will be loaded and present it to the user in any suitable time.

``` swift
// MARK: InterstitialRenderingAdUnitDelegate
    
func interstitialDidReceiveAd(_ interstitial: InterstitialRenderingAdUnit) {
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

Create the `RewardedAdUnit` object with parameter:

- **configID** - an ID of Stored Impression on the Prebid Server

#### Step 2: Load the Ad

Call the `loadAd()` method which will make a bid request to Prebid server.

#### Step 3: Show the Ad when it is ready

Wait until the ad will be loaded and present it to the user in any suitable time.

``` swift
// MARK: RewardedAdUnitDelegate
    
func rewardedAdDidReceiveAd(_ rewardedAd: RewardedAdUnit) {
    // Now the ad is ready for display
}   
```