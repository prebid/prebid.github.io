---

layout: page_v2
title: Google Ad Manager Integration - Native
description: Examples of integration native ads with GAM
sidebarType: 2

---

# GAM: Native Ads Integration

## Native Ads

The general integration scenario requires these steps from publishers:

1. Prepare the ad layout.
2. Create Native Ad Unit and appropriate GAM ad loader.
3. Configure the Native Ad unit using [NativeAdConfiguration](rendering-native-ad-configuration.html).
    * Provide the list of **Native Assets** representing the ad's structure.
    * Tune other general properties of the ad.
4. Make a bid request.
5. Prepare publisherAdRequest using `GamUtils.prepare`
6. After receiving response from GAM  - check if prebid has won and find native ad using `GamUtils`
7. Bind the winner data from the native ad response with the layout.

```kotlin
val builder = AdManagerAdRequest.Builder()
val publisherAdRequest = builder.build()
nativeAdUnit?.fetchDemand { result ->
    val fetchDemandResult = result.fetchDemandResult
    if (fetchDemandResult != FetchDemandResult.SUCCESS) {
        loadGam(publisherAdRequest)
        return@fetchDemand
    }
    
    GamUtils.prepare(publisherAdRequest, result)
    loadGam(publisherAdRequest)
}
```

**NOTE:** `loadGam` method is creating GAM adLoader and executing `loadAd(publisherAdRequest)`.

Example of handling NativeAd response (the same applies to Custom):

```kotlin
private fun handleNativeAd(nativeAd: NativeAd) {
    if (GamUtils.didPrebidWin(nativeAd)) {
        GamUtils.findNativeAd(nativeAd) {
            inflateViewContentWithPrebid(it)
        }
    }
    else {
        inflateViewContentWithNative(nativeAd)
    }
}
```

## Native Styles

[See Native Ads Guideline page](rendering-native-guidelines.html) for more details about SDK integration and supported ad types.

Integration Example:

```kotlin
// 1. Create banner custom event handler for GAM ad server.
val eventHandler = GamBannerEventHandler(requireContext(), GAM_AD_UNIT, GAM_AD_SIZE)

// 2. Create a bannerView instance and provide GAM event handler
bannerView = BannerView(requireContext(), configId, eventHandler)
// (Optional) set an event listener
bannerView?.setBannerListener(this)

// 3. Provide NativeAdConfiguration
val nativeAdConfiguration = createNativeAdConfiguration()
bannerView?.setNativeAdConfiguration(nativeAdConfiguration)

// Add bannerView to your viewContainer
viewContainer?.addView(bannerView)

// 4. Execute ad loading
bannerView?.loadAd()
```

### Step 1: Create Event Handler

GAM's event handlers are special containers that wrap GAM Ad Views and help to manage collaboration between GAM and Prebid views.

**Important:** you should create and use a unique event handler for each ad view.

To create the event handler you should provide a GAM Ad Unit Id and the list of available sizes for this ad unit.

**Note:** There is a helper function `convertGamAdSize` in GamBannerEventHandler to help you convert GAM AdSize into Prebid AdSize.

### Step 2: Create Ad View

**BannerView** - is a view that will display the particular ad. It should be added to the UI. To create it you should provide:

* **configId** - an ID of a [Stored Impression](/prebid-server/features/pbs-storedreqs.html) on the Prebid server
* **eventHandler** - the instance of the banner event handler

Also, you should add the instance of `BannerView` to the UI.

### Step 3: Create and provide NativeAdConfiguration

NativeAdConfiguration creation example:

```kotlin
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

See more NativeAdConfiguration options [here](rendering-native-ad-configuration.html).

### Step 4: Load the Ad

Call the `loadAd()` method to start an In-App Bidding flow.
