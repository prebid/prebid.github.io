---

layout: page_v2
title: Prebid Mobile Rendering Pure In-App Bidding Native Ads Integration
description: Integration of native ads for pure In-App Bidding scenario
sidebarType: 2

---

# Prebid Rendering: Native Ads Integration

## Native Ads

The general integration scenario requires these steps from publishers:

1. Prepare the ad layout.
2. Create Native Ad Unit.
3. Configure the Native Ad unit using [NativeAdConfiguration](rendering-native-ad-configuration.html).
    * Provide the list of **[Native Assets](rendering-native-guidelines.html#components)** representing the ad's structure.
    * Tune other general properties of the ad.
4. Make a bid request.
5. Extract NativeAd using `NativeUtils.findNativeAd`
7. Bind the data from the native ad with the layout.

``` kotlin
nativeAdUnit?.fetchDemand {
   if (it.fetchDemandResult != FetchDemandResult.SUCCESS) {
       return@fetchDemand
   }
   NativeUtils.findNativeAd(it) { nativeAd ->
       if (nativeAd == null) {
           return@findNativeAd
       }
       inflateViewContentWithPrebid(nativeAd)
   }
}
```

## Native Styles

[See Native Ads Guidelines page](rendering-native-guidelines.html) for more details about SDK integration and supported ad types.

To display an ad using Native Styles you'll need to implement these easy steps:

``` kotlin
// 1. Create an Ad View
bannerView = BannerView(requireContext(), configId, adSize)
bannerView?.setBannerListener(this)

// 2. Provide NativeAdConfiguration
val nativeAdConfiguration = createNativeAdConfiguration()
bannerView?.setNativeAdConfiguration(nativeAdConfiguration)

// Add view to viewContainer
viewContainer?.addView(bannerView)

// 3. Load ad
bannerView?.loadAd()
```

#### Step 1: Create Ad View

In the Pure In-App Bidding scenario you just need to initialize the Banner Ad View using correct properties:

- **configId** - an ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) on the Prebid server
- **size** - the size of the ad unit which will be used in the bid request.

#### Step 2: Create and provide NativeAdConfiguration

NativeAdConfiguration creation example:

``` kotlin
private fun createNativeAdConfiguration(): NativeAdConfiguration {
    val nativeAdConfiguration = NativeAdConfiguration()
    nativeAdConfiguration.contextType = NativeAdConfiguration.ContextType.SOCIAL_CENTRIC
    nativeAdConfiguration.placementType = NativeAdConfiguration.PlacementType.CONTENT_FEED
    nativeAdConfiguration.contextSubType = NativeAdConfiguration.ContextSubType.GENERAL_SOCIAL

    val methods = ArrayList<NativeEventTracker.EventTrackingMethod>()
    methods.add(NativeEventTracker.EventTrackingMethod.IMAGE)
    methods.add(NativeEventTracker.EventTrackingMethod.JS)
    val eventTracker = NativeEventTracker(NativeEventTracker.EventType.IMPRESSION, methods)
    nativeAdConfiguration.addTracker(eventTracker)

    val assetTitle = NativeAssetTitle()
    assetTitle.len = 90
    assetTitle.isRequired = true
    nativeAdConfiguration.addAsset(assetTitle)

    val assetIcon = NativeAssetImage()
    assetIcon.type = NativeAssetImage.ImageType.ICON
    assetIcon.wMin = 20
    assetIcon.hMin = 20
    assetIcon.isRequired = true
    nativeAdConfiguration.addAsset(assetIcon)

    val assetImage = NativeAssetImage()
    assetImage.hMin = 20
    assetImage.wMin = 200
    assetImage.isRequired = true
    nativeAdConfiguration.addAsset(assetImage)

    val assetData = NativeAssetData()
    assetData.len = 90
    assetData.type = NativeAssetData.DataType.SPONSORED
    assetData.isRequired = true
    nativeAdConfiguration.addAsset(assetData)

    val assetBody = NativeAssetData()
    assetBody.isRequired = true
    assetBody.type = NativeAssetData.DataType.DESC
    nativeAdConfiguration.addAsset(assetBody)

    val assetCta = NativeAssetData()
    assetCta.isRequired = true
    assetCta.type = NativeAssetData.DataType.CTA_TEXT
    nativeAdConfiguration.addAsset(assetCta)
    
    nativeAdConfiguration.nativeStylesCreative = nativeStylesCreative

    return nativeAdConfiguration
}
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

See more NativeAdConfiguration options [here](rendering-native-ad-configuration.html).

**IMPORTANT:**

You should add HTML and CSS to define your native ad template with universal creative and provide it via NativeAdConfiguration.

#### Step 3: Load the Ad

Call `loadAd()` and SDK will:

- make bid request to Prebid server
- render the winning bid on display
