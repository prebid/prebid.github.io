---

layout: page_v2
title: Native Ads Integration
description: Integration of Prebid SDK without Primary Ad Server SDK
sidebarType: 2

---

# Native Ads Integration

## Unified Native Ads

The general integration scenario requires these steps from publishers:

1. Prepare the ad layout.
2. Create Native Ad Unit.
3. Configure the Native Ad unit using [NativeAdConfiguration](rendering-native-ad-configuration.html).
    * Provide the list of [Native Assets](rendering-native-guidelines.html#components) representing the ad's structure.
    * Tune other general properties of the ad.
4. Make a bid request.
5. Extract NativeAd using `NativeUtils.findNativeAd`
7. Bind the data from the native ad with the layout.


``` swift
func loadAd() {
    guard let nativeAdConfig = nativeAdConfig else {
        return
    }
    adUnit = NativeAdUnit(configID: prebidConfigId, nativeAdConfiguration: nativeAdConfig)
        
    adUnit?.fetchDemand { [weak self] demandResponseInfo in
        guard let self = self,
              demandResponseInfo.fetchDemandResult == .ok else {
            return
        }
        
        demandResponseInfo.getNativeAd { [weak self] nativeAd in
            guard let self = self,
                  let nativeAd = nativeAd else {
                return
            }
                            
            self?.renderNativeAd(nativeAd)

            self.theNativeAd = nativeAd // Note: RETAIN! or the tracking will not occur!
            nativeAd.trackingDelegate = self
            nativeAd.uiDelegate = self
            
            if let _ = nativeAd.videoAd?.mediaData {
                self.nativeAdViewBox?.mediaViewDelegate = self
                self.setupMediaPlaybackTrackers(isVisible: true)
            }
        }
    }
}
```

## Native Styles

[See Native Ads Guidelines page](rendering-native-guidelines.html) for more details about SDK integration and supported ad types.

To display an ad using Native Styles you'll need to implement these easy steps:

``` swift
// 1. Create an Ad View
let banner = BannerView(configId: CONFIG_ID,
                           adSize: adSize)
    
banner.delegate = self

// 2. Set the Native Ad Configurations
let nativeAdConfig = NativeAdConfiguration(testConfigWithAssets: assets)
nativeAdConfig.nativeStylesCreative = nativeStylesCreative

banner.nativeStylesCreative = nativeAdConfig
    
// 3. Load an Ad
banner.loadAd()
```

#### Step 1: Create Ad View

In the Pure In-App Bidding scenario you just need to initialize the Banner Ad View using correct properties:

- **configID** - an ID of Stored Impression on the Apollo server.
- **size** - the size of the ad unit which will be used in the bid request.


{% capture warning_note %}
You should add HTML and CSS to define your native ad template with universal creative and provide it via the nativeStylesCreative  property of NativeAdConfiguration.
{% endcapture %}
{% include /alerts/alert_important.html content=warning_note %}

#### Step 2: Create and provide Native Assets

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
        icon.imageType = NSNumber(value: ImageAssetType.icon.rawValue)
        return icon
    }(),
    {
        let image = NativeAssetImage()
        image.widthMin = 150
        image.heightMin = 50
        image.required = true
        image.imageType = NSNumber(value: ImageAssetType.main.rawValue)
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

Native Styles creative example:

``` html
<div class="sponsored-post">
    <div class="thumbnail">
        <img src="hb_native_icon" alt="hb_native_icon" width="50" height="50"></div>
    <div class="content">
        <h1><p>hb_native_title</p></h1>
        <p>hb_native_body</p>
        <a target="_blank" href="hb_native_linkurl" class="pb-click">hb_native_cta</a>
        <div class="attribution">hb_native_brand</div>
    </div>
    <img src="hb_native_image" alt="hb_native_image" width="320" height="50">
</div>
<script src="https://cdn.jsdelivr.net/npm/prebid-universal-creative@latest/dist/native-trk.js"></script>
<script>
  let pbNativeTagData = {};
  pbNativeTagData.targetingMap = %%PATTERN:TARGETINGMAP%%;

  window.pbNativeTag.startTrackers(pbNativeTagData);
</script>
```


See the full description of NativeAdConfiguration options [here](rendering-native-ad-configuration.html).

#### Step 3: Load the Ad

Call `loadAd()` and SDK will:

- make a bid request to Prebid server
- render the winning bid on display


