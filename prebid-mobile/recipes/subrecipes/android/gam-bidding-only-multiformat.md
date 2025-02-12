---
layout: page_v2
title: Android GAM Bidding-Only Integration - Multiformat Banner+Video+InAppNative
description: Android GAM Bidding-Only Integration - Multiformat Banner+Video+InAppNative
sidebarType: 2
---

# Android GAM Bidding-Only Integration - Multiformat Banner+Video+InAppNative

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html#adunit-specific-instructions)

Starting with version `2.1.5` Prebid SDK supports the fully multiformat ad unit. It allows to run bid requests with any combination of `banner`, `video`, and `native` formats.

The following code demonstrates the integration of multiformat ad unit.

``` kotlin
private fun createAd() {
    // random() only for test cases, in production use only one config id
    val configId = listOf(CONFIG_ID_BANNER, CONFIG_ID_VIDEO, CONFIG_ID_NATIVE).random()

    // Step 1: Create a PrebidAdUnit
    prebidAdUnit = PrebidAdUnit(configId)

    // Step 2: Create PrebidRequest
    val prebidRequest = PrebidRequest()

    // Step 3: Setup the parameters
    prebidRequest.setBannerParameters(createBannerParameters())
    prebidRequest.setVideoParameters(createVideoParameters())
    prebidRequest.setNativeParameters(createNativeParameters())

    // Step 4: Make a bid request
    val gamRequest = AdManagerAdRequest.Builder().build()
    prebidAdUnit?.fetchDemand(prebidRequest, gamRequest) {
        // Step 5: Load an Ad

        loadGam(gamRequest)
    }
}

private fun createBannerParameters(): BannerParameters {
    val parameters = BannerParameters()
    parameters.api = listOf(Signals.Api.MRAID_3, Signals.Api.OMID_1)

    return parameters
}

private fun createVideoParameters(): VideoParameters {
    return VideoParameters(listOf("video/mp4"))
}

private fun createNativeParameters(): NativeParameters {
    val assets = mutableListOf<NativeAsset>()

    val title = NativeTitleAsset()
    title.setLength(90)
    title.isRequired = true
    assets.add(title)

    val icon = NativeImageAsset(20, 20, 20, 20)
    icon.imageType = NativeImageAsset.IMAGE_TYPE.ICON
    icon.isRequired = true
    assets.add(icon)

    val image = NativeImageAsset(200, 200, 200, 200)
    image.imageType = NativeImageAsset.IMAGE_TYPE.MAIN
    image.isRequired = true
    assets.add(image)

    val data = NativeDataAsset()
    data.len = 90
    data.dataType = NativeDataAsset.DATA_TYPE.SPONSORED
    data.isRequired = true
    assets.add(data)

    val body = NativeDataAsset()
    body.isRequired = true
    body.dataType = NativeDataAsset.DATA_TYPE.DESC
    assets.add(body)

    val cta = NativeDataAsset()
    cta.isRequired = true
    cta.dataType = NativeDataAsset.DATA_TYPE.CTATEXT
    assets.add(cta)

    val nativeParameters = NativeParameters(assets)
    nativeParameters.addEventTracker(
        NativeEventTracker(
            NativeEventTracker.EVENT_TYPE.IMPRESSION,
            arrayListOf(NativeEventTracker.EVENT_TRACKING_METHOD.IMAGE)
        )
    )
    nativeParameters.setContextType(NativeAdUnit.CONTEXT_TYPE.SOCIAL_CENTRIC)
    nativeParameters.setPlacementType(NativeAdUnit.PLACEMENTTYPE.CONTENT_FEED)
    nativeParameters.setContextSubType(NativeAdUnit.CONTEXTSUBTYPE.GENERAL_SOCIAL)

    return nativeParameters
}
```

If you use Custom Native Ads follow the [guide](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/native-banner) on how to implement processing of the ad response of the respective type. The following code snipet demonstrates how you can process the banner, video and in-banner native (Native Styles) ad resposnse:

``` kotlin
private fun loadGam(gamRequest: AdManagerAdRequest) {
    val onBannerLoaded = OnAdManagerAdViewLoadedListener { adView ->
        showBannerAd(adView)
    }

    val onNativeLoaded = OnNativeAdLoadedListener { nativeAd ->
        showNativeAd(nativeAd, adWrapperView)
    }

    val onPrebidNativeAdLoaded = OnCustomFormatAdLoadedListener { customNativeAd ->
        showPrebidNativeAd(customNativeAd)
    }

    // Prepare the lisners for multiformat Ad Response
    val adLoader = AdLoader.Builder(this, AD_UNIT_ID)
        .forAdManagerAdView(onBannerLoaded, AdSize.BANNER, AdSize.MEDIUM_RECTANGLE)
        .forNativeAd(onNativeLoaded)
        .forCustomFormatAd(CUSTOM_FORMAT_ID, onPrebidNativeAdLoaded, null)
        .withAdListener(AdListenerWithToast(this))
        .withAdManagerAdViewOptions(AdManagerAdViewOptions.Builder().build())
        .build()

    adLoader.loadAd(gamRequest)
}
```

The methods managing the prebid and GAM ads:

``` kotlin
private fun showBannerAd(adView: AdManagerAdView) {
    adWrapperView.addView(adView)
    AdViewUtils.findPrebidCreativeSize(adView, object : AdViewUtils.PbFindSizeListener {
        override fun success(width: Int, height: Int) {
            adView.setAdSizes(AdSize(width, height))
        }

        override fun failure(error: PbFindSizeError) {}
    })
}

private fun showNativeAd(ad: NativeAd, wrapper: ViewGroup) {
    val nativeContainer = View.inflate(wrapper.context, R.layout.layout_native, null)

    val icon = nativeContainer.findViewById<ImageView>(R.id.imgIcon)
    val iconUrl = ad.icon?.uri?.toString()
    if (iconUrl != null) {
        ImageUtils.download(iconUrl, icon)
    }

    val title = nativeContainer.findViewById<TextView>(R.id.tvTitle)
    title.text = ad.headline

    val image = nativeContainer.findViewById<ImageView>(R.id.imgImage)
    val imageUrl = ad.images.getOrNull(0)?.uri?.toString()
    if (imageUrl != null) {
        ImageUtils.download(imageUrl, image)
    }

    val description = nativeContainer.findViewById<TextView>(R.id.tvDesc)
    description.text = ad.body

    val cta = nativeContainer.findViewById<Button>(R.id.btnCta)
    cta.text = ad.callToAction

    wrapper.addView(nativeContainer)
}

private fun showPrebidNativeAd(customNativeAd: NativeCustomFormatAd) {
    AdViewUtils.findNative(customNativeAd, object : PrebidNativeAdListener {
        override fun onPrebidNativeLoaded(ad: PrebidNativeAd) {
            inflatePrebidNativeAd(ad)
        }

        override fun onPrebidNativeNotFound() {
            Log.e("PrebidAdViewUtils", "Find native failed: native not found")
        }

        override fun onPrebidNativeNotValid() {
            Log.e("PrebidAdViewUtils", "Find native failed: native not valid")
        }
    })
}

private fun inflatePrebidNativeAd(ad: PrebidNativeAd) {
    val nativeContainer = View.inflate(this, R.layout.layout_native, null)

    val icon = nativeContainer.findViewById<ImageView>(R.id.imgIcon)
    ImageUtils.download(ad.iconUrl, icon)

    val title = nativeContainer.findViewById<TextView>(R.id.tvTitle)
    title.text = ad.title

    val image = nativeContainer.findViewById<ImageView>(R.id.imgImage)
    ImageUtils.download(ad.imageUrl, image)

    val description = nativeContainer.findViewById<TextView>(R.id.tvDesc)
    description.text = ad.description

    val cta = nativeContainer.findViewById<Button>(R.id.btnCta)
    cta.text = ad.callToAction

    ad.registerView(nativeContainer, Lists.newArrayList(icon, title, image, description, cta), null)

    adWrapperView.addView(nativeContainer)
}
```

## Step 1: Create a PrebidAdUnit
{:.no_toc}

Initialize the `PrebidAdUnit` with the following properties:

- `configId` - an ID of the Stored Impression on the Prebid Server

## Step 2: Create a PrebidRequest
{:.no_toc}

Create the instance of `PrebidRequest` initializing it with respective ad format parameters.

In addition you can set the following properties of the `PrebidRequest`.

## Step 3: Setup the parameters
{:.no_toc}

For each ad format you should create a respective configuration parameter:

### BannerParameters
{:.no_toc}

{% include mobile/banner-params.md %}

### VideoParameters
{:.no_toc}

{% include mobile/video-params.md %}

### NativeParameters
{:.no_toc}

{% include mobile/native-params.md %}

## Step 4: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide a `GAMRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

## Step 5: Load and Ad
{:.no_toc}

Follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/android/native-banner) to combine the a banner and custom native ads int the app.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK Android integration](/prebid-mobile/pbm-api/android/code-integration-android.html)
- [Prebid SDK Global Parameters - Android](/prebid-mobile/pbm-api/android/pbm-targeting-android.html)
