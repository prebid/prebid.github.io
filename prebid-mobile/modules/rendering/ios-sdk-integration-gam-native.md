---

layout: page_v2
title: Native Ads Integration
description: Integration of Prebid Rendering module whith Google Ad Manager for Native Ads 
sidebarType: 2
---

# GAM: Native Ads Integration

## Unified Native Ads

The general integration scenario requires these steps from publishers:

1. Prepare the ad layout.
2. Create Native Ad Unit and appropriate GAM ad loader.
3. Configure the Native Ad unit using [NativeAdConfiguration](rendering-native-ad-configuration.md).
    * Provide the list of [Native Assets](../../info-modules/rendering-native-guidelines#components) representing the ad's structure.
    * Tune other general properties of the ad.
4. Make a bid request.
5. Prepare publisherAdRequest using `GAMUtils.shared.prepareRequest`
6. After receiving response from GAM  - check if prebid has won and find native ad using `GAMUtils`
7. Bind the winner data from the native ad response with the layout.

```swift
func loadAd() {
    guard let nativeAdConfig = nativeAdConfig else {
        return
    }
    adUnit = NativeAdUnit(configID: prebidconfigID, nativeAdConfiguration: nativeAdConfig)
        
    adUnit?.fetchDemand { [weak self] demandResponseInfo in
        guard let self = self else {
            return
        }
        
        let dfpRequest = GAMRequest()
        GAMUtils.shared.prepareRequest(dfpRequest, demandResponseInfo: demandResponseInfo)
        
        self.adLoader = GADAdLoader(adUnitID: self.gamAdUnitId,
                                    rootViewController: self.rootController,
                                    adTypes: self.adTypes,
                                    options: [])
                                    
        self.adLoader?.delegate = self
        self.adLoader?.load(dfpRequest)
    }
}
```

Example of handling NativeAd response (the same applies to Custom Native Ads):

```swift
func adLoader(_ adLoader: GADAdLoader, didReceive nativeAd: GADNativeAd) {
    unifiedAdRequestSuccessful.isEnabled = true
    customTemplateAd = nil
    
    let nativeAdDetectionListener = NativeAdDetectionListener { [weak self] prebidNativeAd in
        guard let self = self else {
            return
        }
        self.nativeAdLoadedButton.isEnabled = true
        self.nativeAdViewBox.renderNativeAd(prebidNativeAd)
        self.nativeAdViewBox.registerViews(prebidNativeAd)
        self.theNativeAd = prebidNativeAd // Note: RETAIN! or the tracking will not occur!
        prebidNativeAd.trackingDelegate = self
        prebidNativeAd.uiDelegate = self
    } onPrimaryAdWin: { [weak self] in
        guard let self = self else {
            return
        }
        self.unifiedAdWinButton.isEnabled = true
        
        self.nativeAdView?.removeFromSuperview()
        
        guard
            let nibObjects = Bundle.main.loadNibNamed("UnifiedNativeAdView", owner: nil, options: nil),
            let adView = nibObjects.first as? UnifiedNativeAdView
        else {
            assert(false, "Could not load nib file for adView")
        }
        
        self.setAdView(adView)
        
        adView.renderUnifiedNativeAd(nativeAd)
    } onNativeAdInvalid: { [weak self] error in
        self?.nativeAdInvalidButton.isEnabled = true
    }

    GAMUtils.shared.findNativeAd(for: nativeAd,
                           nativeAdDetectionListener:nativeAdDetectionListener)
}
```

## Native Styles

The Native Styles ads are integrated with Baner API.

Integration Example:

```swift
// 1. Create an Event Handler
let eventHandler = BannerEventHandler(adUnitID: GAM_AD_UNIT_ID,
                                            validGADAdSizes: [NSValueFromGADAdSize(adSize)])
       
// 2. Create a Banner View
let banner = BannerView(configID: CONFIG_ID,
                        eventHandler: eventHandler)
banner.delegate = self

// 3. Setup Native Ad Configuration
banner.nativeAdConfig = NativeAdConfiguration(testConfigWithAssets: assets)
        
// 4. Load an Ad
banner.loadAd()
```

### Step 1: Create Event Handler

To create the event handler you should provide a GAM Ad Unit Id and the list of available sizes for this ad unit.

#### Step 2: Create Ad View

**BannerView** - is a view that will display the particular ad. It should be added to the UI. To create it you should provide:

* **configID** - an ID of Stored Impression on the Prebid server
* **eventHandler** - the instance of the banner event handler

Also, you should add the instance of `BannerView` to the UI.

### Step 3: Create and provide Native Assets

To make a proper bid request publishers should provide the needed assets to the NativeAdConfiguration class. Each asset describes the UI element of the ad according to the [OpenRTB standarts](https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf).

```swift
let assets = [
    {
        let title = NativeAssetTitle(length: 90)
        title.required = true
        return title
    }(),
    {
        let icon = NativeAssetImage()
        icon.widthMin = 50
        icon.heightMin = 50
        icon.required = true
        icon.imageType = NSNumber(value: PBMImageAssetType.icon.rawValue)
        return icon
    }(),
    {
        let image = NativeAssetImage()
        image.widthMin = 150
        image.heightMin = 50
        image.required = true
        image.imageType = NSNumber(value: PBMImageAssetType.main.rawValue)
        return image
    }(),
    {
        let desc = NativeAssetData(dataType: .desc)
        desc.required = true
        return desc
    }(),
    {
        let cta = NativeAssetData(dataType: .ctaText)
        cta.required = true
        return cta
    }(),
    {
        let sponsored = NativeAssetData(dataType: .sponsored)
        sponsored.required = true
        return sponsored
    }(),
]
```

See the full description of NativeAdConfiguration options [here](rendering-native-ad-configuration.md).

### Step 4: Load the Ad

Call the `loadAd()` method in order to make bid request and render the winning bid.
