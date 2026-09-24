---
layout: page_v2
title: Android Next-Gen SDK Bidding-Only Integration - Multiformat Banner+Video+InAppNative
description: Android Next-Gen SDK Bidding-Only Integration - Multiformat Banner+Video+InAppNative
sidebarType: 2
---

# Android Next-Gen SDK Bidding-Only Integration - Multiformat Banner+Video+InAppNative

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/android/android-sdk-integration-nextgen-original-api.html#adunit-specific-instructions)

Starting with version `2.1.5` Prebid SDK supports the fully multiformat ad unit. It allows to run bid requests with any combination of `banner`, `video`, and `native` formats.

The following code demonstrates the integration of multiformat ad unit.

```kotlin
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
    val requestBuilder = NativeAdRequest.Builder(
        AD_UNIT_ID,
        listOf(NativeAd.NativeAdType.NATIVE, NativeAd.NativeAdType.CUSTOM_NATIVE, NativeAd.NativeAdType.BANNER)
    ).setCustomFormatIds(listOf(CUSTOM_FORMAT_ID))
        .setAdSizes(listOf(AdSize.BANNER, AdSize.MEDIUM_RECTANGLE))
    prebidAdUnit?.fetchDemand(requestBuilder, prebidRequest) {

        // Step 5: Load an Ad
        loadAd(requestBuilder.build())
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

    val image = NativeImageAsset(200, 200, 200, 250)
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

Load the ad and process the multiformat response using `NativeAdLoader`:

```kotlin
private fun loadAd(request: NativeAdRequest) {
    val adCallback = object : NativeAdLoaderCallback {
        override fun onBannerAdLoaded(bannerAd: BannerAd) {
            super.onBannerAdLoaded(bannerAd)
            showBannerAd(bannerAd)
        }

        override fun onNativeAdLoaded(nativeAd: NativeAd) {
            super.onNativeAdLoaded(nativeAd)
            showNativeAd(nativeAd, adWrapperView)
        }

        override fun onCustomNativeAdLoaded(customNativeAd: CustomNativeAd) {
            super.onCustomNativeAdLoaded(customNativeAd)
            showPrebidNativeAd(customNativeAd)
        }

        override fun onAdFailedToLoad(adError: LoadAdError) {
            super.onAdFailedToLoad(adError)
            Log.e(TAG, "Ad failed: $adError")
        }
    }
    NativeAdLoader.load(request, adCallback)
}
```

The methods managing the Prebid and Next-Gen SDK ads:

```kotlin
private fun showBannerAd(bannerAd: BannerAd) {
    val adView = AdView(this)
    adView.registerBannerAd(bannerAd, this)
    adWrapperView.addView(adView)
    AdViewUtils.findPrebidCreativeSize(adView, object : AdViewUtils.PbFindSizeListener {
        override fun success(width: Int, height: Int) {
            adView.resize(AdSize(width, height))
        }

        override fun failure(error: PbFindSizeError) {}
    })
}

private fun showNativeAd(ad: NativeAd, wrapper: ViewGroup) {
    val nativeContainer: NativeAdView =
        View.inflate(wrapper.context, R.layout.layout_native, null) as NativeAdView

    val icon = nativeContainer.findViewById<ImageView>(R.id.imgIcon)
    val iconUrl = ad.icon?.uri?.toString()
    if (iconUrl != null) {
        ImageUtils.download(iconUrl, icon)
    }

    val title = nativeContainer.findViewById<TextView>(R.id.tvTitle)
    title.text = ad.headline

    val image = nativeContainer.findViewById<ImageView>(R.id.imgImage)
    val imageUrl = ad.image?.uri?.toString()
    if (imageUrl != null) {
        ImageUtils.download(imageUrl, image)
    }

    val description = nativeContainer.findViewById<TextView>(R.id.tvDesc)
    description.text = ad.body

    val cta = nativeContainer.findViewById<Button>(R.id.btnCta)
    cta.text = ad.callToAction

    nativeContainer.registerNativeAd(ad, null)
    wrapper.addView(nativeContainer)
}

private fun showPrebidNativeAd(customNativeAd: CustomNativeAd) {
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

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide a `NativeAdRequest.Builder` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

## Step 5: Load an Ad
{:.no_toc}

Use `NativeAdLoader.load()` with a `NativeAdLoaderCallback` to handle the different ad types returned. The callback provides separate methods for banner ads (`onBannerAdLoaded`), unified native ads (`onNativeAdLoaded`), and custom native ads (`onCustomNativeAdLoaded`).

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK Android integration](/prebid-mobile/pbm-api/android/code-integration-android.html)
- [Prebid SDK Global Parameters - Android](/prebid-mobile/pbm-api/android/pbm-targeting-android.html)
