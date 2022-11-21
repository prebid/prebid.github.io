---

layout: page_v2
title: GAM Original API integration
description: Integration of Prebid SDK With Google Ad Manager using the original API
sidebarType: 2

---

# GAM Original API integration
{:.no_toc}

Prebid Mobile is an open-source library that provides an end-to-end header bidding solution for mobile app publishers. 

Prebid Mobile libraries are available for iOS and Android.

* TOC
{:toc}

## Overview

This is the original Prebid mobile integration approach when SDK plays the transport role, and the winning bid is rendered by Primary Ad Server SDK using PUC. You can find details of how it works and other integration approaches on the [overview page](/prebid-mobile/prebid-mobile.html#with-ad-server-original-api).  

![In-App Bidding with Prebid](/assets/images/prebid-mobile/prebid-in-app-bidding-overview-prebid-original-gam.png)

## Display Banner

Integration example:

``` swift
// 1. Create a BannerAdUnit 
adUnit = BannerAdUnit(configId: CONFIG_ID, size: adSize)
adUnit.setAutoRefreshMillis(time: 30000)

// 2. Configure banner parameters
let parameters = BannerParameters()
parameters.api = [Signals.Api.MRAID_2]
adUnit.parameters = parameters

// 3. Create a GAMBannerView
gamBanner = GAMBannerView(adSize: GADAdSizeFromCGSize(adSize))
gamBanner.adUnitID = gamAdUnitDisplayBannerOriginal
gamBanner.rootViewController = self
gamBanner.delegate = self

// Add GMA SDK banner view to the app UI
bannerView?.addSubview(gamBanner)

// 4. Make a bid request to Prebid Server
let gamRequest = GAMRequest()
adUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
    PrebidDemoLogger.shared.info("Prebid demand fetch for GAM \(resultCode.name())")
    
    // 5. Load GAM Ad
    self?.gamBanner.load(gamRequest)
}
```

### Step 1: Create a BannerAdUnit
{:.no_toc}

Initialize the `BannerAdUnit` with properties:

- `configId` - an ID of the Stored Impression on the Prebid Server
- `adSize` - the size of the ad unit which will be used in the bid request.

### Step 2: Configure banner parameters
{:.no_toc}

Using the `BannerParameters` you can customize the bid request for BannerAdUnit. The `api` property is dedicated to adding values for API Frameworks to bid response according to the OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) spec. The supported values for GMA SDK integration are:

* `3` or `Signals.Api.MRAID_1` : MRAID-1 support signal
* `5` or `Signals.Api.MRAID_2` : MRAID-2 support signal
* `6` or `Signals.Api.MRAID_3` : MRAID-3 support signal
* `7` or `Signals.Api.OMID_1` :  signals OMSDK support

### Step 3: Create a GAMBannerView
{:.no_toc}

Just follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/banner) to integrate a banner ad unit. 

### Step 4: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the prebid server. You should provide a `GAMRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests. 

### Step 5: Load an Ad
{:.no_toc}

Now you should request the ad from GAM. If the `GAMRequest` contains targeting keywords, the respective Prebid's line item will be returned from GAM, and GMA SDK will render its creative. 

Be sure that you make the ad request with the same `GAMRequest` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

## Video Banner

Integration example:

``` swift
// 1. Create a BannerAdUnit
adUnit = VideoAdUnit(configId: storedImpVideoBanner, size: adSize)
    
// 2. Configure video parameters
let parameters = VideoParameters()
parameters.mimes = ["video/mp4"]
parameters.protocols = [Signals.Protocols.VAST_2_0]
parameters.playbackMethod = [Signals.PlaybackMethod.AutoPlaySoundOff]
parameters.placement = Signals.Placement.InBanner
adUnit.parameters = parameters
    
// 3. Create a GAMBannerView
gamBanner = GAMBannerView(adSize: GADAdSizeFromCGSize(adSize))
gamBanner.adUnitID = gamAdUnitVideoBannerOriginal
gamBanner.rootViewController = self
gamBanner.delegate = self
    
// Add GMA SDK banner view to the app UI
bannerView.addSubview(gamBanner)
bannerView.backgroundColor = .clear
    
// 4. Make a bid request to Prebid Server
let gamRequest = GAMRequest()
adUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
    PrebidDemoLogger.shared.info("Prebid demand fetch for GAM \(resultCode.name())")
        
    // 5. Load GAM Ad
    self?.gamBanner.load(gamRequest)
}
```

### Step 1: Create a VideoAdUnit
{:.no_toc}

Initialize the `VideoAdUnit` with properties:

- `configId` - an ID of the Stored Impression on the Prebid Server
- `adSize` - the size of the ad unit which will be used in the bid request.

### Step 2: Configure banner parameters
{:.no_toc}

Using the `VideoParameters` you can customize the bid request for VideoAdUnit. 

#### api
{:.no_toc}

The `api` property is dedicated to adding values for API Frameworks to bid response according to the OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) spec. The supported values for GMA SDK integration are:

* `1` or `Signals.Api.VPAID_1` : VPAID 1.0  
* `2` or `Signals.Api.VPAID_2` : VPAID 2.0  
* `3` or `Signals.Api.MRAID_1` : MRAID-1 support signal
* `5` or `Signals.Api.MRAID_2` : MRAID-2 support signal
* `6` or `Signals.Api.MRAID_3` : MRAID-3 support signal
* `7` or `Signals.Api.OMID_1`  : signals OMSDK support


#### maxBitrate
{:.no_toc}

Integer representing the OpenRTB 2.5 maximum bit rate in Kbps.

#### minBitrate
{:.no_toc}

Integer representing the OpenRTB 2.5 minimum bit rate in Kbps.

#### maxDuration
{:.no_toc}

Integer representing the OpenRTB 2.5 maximum video ad duration in seconds.

#### minDuration
{:.no_toc}

Integer representing the OpenRTB 2.5 minimum video ad duration in seconds.

#### mimes
{:.no_toc}

Array of strings representing the supported OpenRTB 2.5 content MIME types (e.g., “video/x-ms-wmv”, “video/mp4”).

#### playbackMethod
{:.no_toc}

Array of OpenRTB 2.5 playback methods. If none are specified, any method may be used. Only one method is typically used in practice. It is strongly advised to use only the first element of the array.
  
  - `1` or `Signals.PlaybackMethod.AutoPlaySoundOn` : Initiates on Page Load with Sound On
  - `2` or `Signals.PlaybackMethod.AutoPlaySoundOff` : Initiates on Page Load with Sound Off by Default
  - `3` or `Signals.PlaybackMethod.ClickToPlay` : Initiates on Click with Sound On
  - `4` or `Signals.PlaybackMethod.MouseOver` : Initiates on Mouse-Over with Sound On
  - `5` or `Signals.PlaybackMethod.EnterSoundOn` : Initiates on Entering Viewport with Sound On
  - `6` or `Signals.PlaybackMethod.EnterSoundOff`: Initiates on Entering Viewport with Sound Off by Default

#### protocols
{:.no_toc}

  Array or enum of OpenRTB 2.5 supported Protocols. Values can be one of:
  
  - `1` or `Signals.Protocols.VAST_1_0` : VAST 1.0
  - `2` or `Signals.Protocols.VAST_2_0` : VAST 2.0
  - `3` or `Signals.Protocols.VAST_3_0` : VAST 3.0
  - `4` or `Signals.Protocols.VAST_1_0_Wrapper` : VAST 1.0 Wrapper
  - `5` or `Signals.Protocols.VAST_2_0_Wrapper` : VAST 2.0 Wrapper
  - `6` or `Signals.Protocols.VAST_3_0_Wrapper` : VAST 3.0 Wrapper
  - `7` or `Signals.Protocols.VAST_4_0` : VAST 4.0
  - `8` or `Signals.Protocols.VAST_4_0_Wrapper` : VAST 4.0 Wrapper

See our documentation on [AdUnit](/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) for more details.

### Step 3: Create a GAMBannerView
{:.no_toc}

Just follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/banner) to integrate a banner ad unit. 

### Step 4: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the prebid server. You should provide a `GAMRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests. 

### Step 5: Load an Ad
{:.no_toc}

Now you should request the ad from GAM. If the `GAMRequest` contains targeting keywords, the respective Prebid's line item will be returned from GAM, and GMA SDK will render its creative. 

Be sure that you make the ad request with the same `GAMRequest` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

## Display Interstitial

Integration example:

``` swift
// 1. Create an Interstitial Ad Unit
adUnit = InterstitialAdUnit(configId: storedImpDisplayInterstitial)

// 2. Make a bid request to Prebid Server 
let gamRequest = GAMRequest()
adUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
    PrebidDemoLogger.shared.info("Prebid demand fetch for GAM \(resultCode.name())")
    
    // 3. Load a GAM interstitial ad
    GAMInterstitialAd.load(withAdManagerAdUnitID: gamAdUnitDisplayInterstitialOriginal, request: gamRequest) { ad, error in
        guard let self = self else { return }
        if let error = error {
            PrebidDemoLogger.shared.error("Failed to load interstitial ad with error: \(error.localizedDescription)")
        } else if let ad = ad {
            ad.fullScreenContentDelegate = self
            
            // 4. Present the interstitial ad
            ad.present(fromRootViewController: self)
        }
    }
}
```

#### Step 1: Create an Ad Unit
{:.no_toc}

Initialize the Interstitial Ad Unit with properties:
    
- `configId` - an ID of Stored Impression on the Prebid Server
- `minWidthPerc`: Optional parameter to specify the minimum width percent an ad may occuy of a device's real estate. Support in SDK version 1.2+
- `minHeightPrec`: Optional parameter to specify the minimum height percent an ad may occuy of a device's real estate. Support in SDK version 1.2+

> **NOTE:** As of version 1.2+, Prebid SDK has extended the functionality of Interstitial ad monetization by using a smart ad size selection process to monetize sizes smaller than full screen ads. App developers can speicify a minimun width and minimum height percentage an ad can occupy of a devices real state, with Prebid Server (PBS) deriving a limited set of ad sizes (max 10) as eligible for the auction.

PBS will take the AdUnit's size (width and height) as the max size for the interstitial as size, generating a list of ad sizes, selecting the first 10 sizes that fall within the imp's max size and minimum percentage size. All the interstitial parameters will still be passed to the bidders, allowing them to use their own size matching algorithms if they prefer.

Prebid Server will send the eligible size list to each bidder to solicit a bid. For a full description of the Prebid Server logic, please refer to the [Prebid Server PR 797](https://github.com/prebid/prebid-server/pull/797/files).

### Step 2: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the prebid server. You should provide a `GAMRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests. 

### Step 3: Load a GAM interstitial ad
{:.no_toc}

Now you should request the ad from GAM. If the `GAMRequest` contains targeting keywords, the respective Prebid's line item will be returned from GAM, and GMA SDK will render its creative. 

Be sure that you make the ad request with the same `GAMRequest` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

## Video Interstitial

Integration Example:

```swift
// 1. Create an Interstitial Ad Unit
adUnit = VideoInterstitialAdUnit(configId: storedImpVideoInterstitial)

// 2. Configure video parameters
let parameters = VideoParameters()
parameters.mimes = ["video/mp4"]
parameters.protocols = [Signals.Protocols.VAST_2_0]
parameters.playbackMethod = [Signals.PlaybackMethod.AutoPlaySoundOff]
adUnit.parameters = parameters

// 3. Make a bid request to Prebid Server
let gamRequest = GAMRequest()
adUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
    PrebidDemoLogger.shared.info("Prebid demand fetch for GAM \(resultCode.name())")
   
    // 4. Load a GAM interstitial ad
    GAMInterstitialAd.load(withAdManagerAdUnitID: gamAdUnitVideoInterstitialOriginal, request: gamRequest) { ad, error in
        guard let self = self else { return }
        if let error = error {
            PrebidDemoLogger.shared.error("Failed to load interstitial ad with error: \(error.localizedDescription)")
        } else if let ad = ad {
            
            // 5. Present the interstitial ad
            ad.present(fromRootViewController: self)
            ad.fullScreenContentDelegate = self
        }
    }
}
```


### Rewarded API
{:.no_toc}

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
{:.no_toc}

Create the `RewardedAdUnit` object with parameter:

- **configID** - an ID of Stored Impression on the Prebid Server

#### Step 2: Load the Ad
{:.no_toc}

Call the `loadAd()` method which will make a bid request to Prebid server.

#### Step 3: Show the Ad when it is ready
{:.no_toc}

Wait until the ad will be loaded and present it to the user in any suitable time.

``` swift
// MARK: RewardedAdUnitDelegate
    
func rewardedAdDidReceiveAd(_ rewardedAd: RewardedAdUnit) {
    // Now the ad is ready for display
}   
```

