---

layout: page_v2
title: Prebid Mobile Rendering Modules
description: Prebid Mobile Rendering Modules architecture
sidebarType: 2

---

# MoPub: Native Ads Integration

## Native Ads

There are two ways to integrate Native ads with MoPub:

 - using custom native ad renderer from MoPub adapters
 - bind the UI components with data from the winning bid manualy in the app

### Antive Ad Renderer

The integration with native ad renere is the same as wi any other adpater. See the [MoPub docs](https://developers.mopub.com/publishers/mediation/integrate-android/#set-up-ad-renderers-for-native-ads) for the details. 

### Manual binding

Integration Example: 

```swift

func loadAd() {
    guard let nativeAdConfig = nativeAdConfig, let adRenderingViewClass = adRenderingViewClass else {
        return
    }
    
    adUnit = MoPubNativeAdUnit(configID: prebidConfigId, nativeAdConfiguration: nativeAdConfig)
    
    let targeting = MPNativeAdRequestTargeting()
    
    adUnit?.fetchDemand(with: targeting!) { [weak self] result in
        guard let self = self else {
            return
        }
                    
        let settings = MPStaticNativeAdRendererSettings();
        settings.renderingViewClass = adRenderingViewClass
        let prebidConfig = PrebidMoPubNativeAdRenderer.rendererConfiguration(with: settings);
        let mopubConfig = MPStaticNativeAdRenderer.rendererConfiguration(with: settings);
        
        PrebidMoPubAdaptersUtils.shared.prepareAdObject(targeting!)
        
        let adRequest = MPNativeAdRequest.init(adUnitIdentifier: self.moPubAdUnitId, rendererConfigurations: [prebidConfig, mopubConfig!])
        adRequest?.targeting = targeting
        
        adRequest?.start { [weak self] request, response , error in
            guard let self = self else {
                return
            }
            
            guard error == nil else {
                return
            }
            
            guard let moPubNativeAd = response else {
                return
            }
                            
            let nativeAdDetectionListener = NativeAdDetectionListener { [weak self] nativeAd in
                guard let self = self else {
                    return
                }
                self.setupPrebidNativeAd(nativeAd)
            } onPrimaryAdWin: { [weak self] in
                guard let self = self else {
                    return
                }
                self.setupMoPubNativeAd(moPubNativeAd)
            } onNativeAdInvalid: { [weak self] error in
                self?.nativeAdInvalidButton.isEnabled = true
            }
            
            PrebidMoPubAdaptersUtils.shared.find(nativeAd: moPubNativeAd,
                                   nativeAdDetectionListener: nativeAdDetectionListener)
        }
    }
}

```

## Native Styles 

The Native Styles ads are integrated with Baner API.

Integration Example:

``` swift
// 1. Create a MoPub AdView
banner = MPAdView(adUnitId: MOPUB_AD_UNIT_ID)
banner.delegate = self

// 2. Create an Prebid Ad Unit
adUnit = MoPubBannerAdUnit(configID: CONFIG_ID, size: adSize)

// 3. Provide NativeAdConfiguration
adUnit.nativeAdConfig = NativeAdConfiguration(testConfigWithAssets: assets)
    
// 4. Run a Header Bidding auction on Prebid
adUnit.fetchDemand(with: banner!) { [weak self] result in
    
// 5. Load an Ad
self?.banner.loadAd()
}
```

#### Step 1: Create Ad View

You have to create and place MoPub's Ad View into the app page.


#### Step 2: Create Ad Unit

Create the **MoPubBannerAdUnit** object with parameters:

- **configID** - an ID of Stored Impression on the Prebid server
- **size** - the size of the ad unit which will be used in the bid request.


#### Step 3: Create and provide Native Assets

To make a proper bid request publishers should provide the needed assets to the NativeAdConfiguration class. Each asset describes the UI element of the ad according to the [OpenRTB standarts](https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf).

``` swift
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

### Step 4: Fetch Demand

To run an auction on Prebid run the `fetchDemand()` method which performs several actions:

- Makes a bid request to Prebid
- Sets up the targeting keywords to the MoPub's ad unit
- Passes the winning bid to the MoPub's ad unit
- Returns the result of bid request for future processing

### Step 5: Load the Ad

When the bid request has completed, the responsibility of making the Ad Request is passed to the publisher. That is why you have to invoke `loadAd()` on the MoPub's Ad View explicitly in the completion handler of `fetchDemand()`.

