---
layout: page_v2
title: Android GAM Bidding-Only Integration - Native In-App
description: Android GAM Bidding-Only Integration - Native In-App
sidebarType: 2
---

# Android GAM Bidding-Only Integration - Native In-App

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html#adunit-specific-instructions)

Visit the [AdOps guide](/adops/gam-native.html#create-mobile-in-app-creative) for instructions on setting up the In-App creatives on GAM. 

At a high level, the in-app workflow is happening the following way:

1. The publisher prepares the ad layout and provides the native ad configuration to the SDK's ad unit.
2. Prebid SDK fetches native demand. However, instead of caching the native assets on the server, the assets are cached locally in the SDK.
3. Ad request are made to Google Ad Manager.
4. Upon receiving results from Google Ad Manager, the SDK determines if any of the received items are from Prebid Server.
5. If there are Prebid ads, the cached assets are then rendered.

{% capture importantNote %}
The cached assets might expire. If this occurs the publisher will receive a notification and they will have to fetch the assets again.
{% endcapture %}

Integration Example

```kotlin
private fun createAd() {
    // 1. Create NativeAdUnit
    adUnit = NativeAdUnit(CONFIG_ID);
    adUnit?.setContextType(NativeAdUnit.CONTEXT_TYPE.SOCIAL_CENTRIC)
    adUnit?.setPlacementType(NativeAdUnit.PLACEMENTTYPE.CONTENT_FEED)
    adUnit?.setContextSubType(NativeAdUnit.CONTEXTSUBTYPE.GENERAL_SOCIAL)

    // 2. Add native assets and trackers
    addNativeAssets(adUnit)

    // 3. Make a bid request to Prebid Server
    val adRequest = AdManagerAdRequest.Builder().build()
    adUnit?.fetchDemand(adRequest) {

        // 4. Load a GAM Native Ad
        adLoader = createAdLoader(adWrapperView)
        adLoader?.loadAd(adRequest)
    }
}
```

Add native assets:

```kotlin
private fun addNativeAssets(adUnit: NativeAdUnit?)  {
    // ADD NATIVE ASSETS

    val title = NativeTitleAsset()
    title.setLength(90)
    title.isRequired = true
    adUnit?.addAsset(title)

    val icon = NativeImageAsset(20, 20, 20, 20)
    icon.imageType = NativeImageAsset.IMAGE_TYPE.ICON
    icon.isRequired = true
    adUnit?.addAsset(icon)

    val image = NativeImageAsset(200, 200, 200, 200)
    image.imageType = NativeImageAsset.IMAGE_TYPE.MAIN
    image.isRequired = true
    adUnit?.addAsset(image)

    val data = NativeDataAsset()
    data.len = 90
    data.dataType = NativeDataAsset.DATA_TYPE.SPONSORED
    data.isRequired = true
    adUnit?.addAsset(data)

    val body = NativeDataAsset()
    body.isRequired = true
    body.dataType = NativeDataAsset.DATA_TYPE.DESC
    adUnit?.addAsset(body)

    val cta = NativeDataAsset()
    cta.isRequired = true
    cta.dataType = NativeDataAsset.DATA_TYPE.CTATEXT
    adUnit?.addAsset(cta)

    // ADD NATIVE EVENT TRACKERS
    val methods = ArrayList<EVENT_TRACKING_METHOD>()
    methods.add(EVENT_TRACKING_METHOD.IMAGE)
    methods.add(EVENT_TRACKING_METHOD.JS)
    try {
        val tracker = NativeEventTracker(NativeEventTracker.EVENT_TYPE.IMPRESSION, methods)
        adUnit?.addEventTracker(tracker)
    } catch (e: Exception) {
        e.printStackTrace()
    }
}
```

Prepare Native Ad Loader

```kotlin
private fun createAdLoader(wrapper: ViewGroup): AdLoader? {
    val onGamAdLoaded = OnAdManagerAdViewLoadedListener { adManagerAdView: AdManagerAdView ->
        Log.d(TAG, "Gam loaded")
        adView = adManagerAdView
        wrapper.addView(adManagerAdView)
    }

    val onUnifiedAdLoaded = OnNativeAdLoadedListener { unifiedNativeAd: NativeAd? ->
        Log.d(TAG, "Unified native loaded")
        this.unifiedNativeAd = unifiedNativeAd
    }

    val onCustomAdLoaded = OnCustomFormatAdLoadedListener { nativeCustomTemplateAd: NativeCustomFormatAd? ->
        Log.d(TAG, "Custom ad loaded")

        // 5. Find Prebid Native Ad
        AdViewUtils.findNative(nativeCustomTemplateAd!!, object : PrebidNativeAdListener {
            override fun onPrebidNativeLoaded(ad: PrebidNativeAd) {

                // 6. Render native ad
                inflatePrebidNativeAd(ad, wrapper)
            }

            override fun onPrebidNativeNotFound() {
                Log.e(TAG, "onPrebidNativeNotFound")
            }

            override fun onPrebidNativeNotValid() {
                Log.e(TAG, "onPrebidNativeNotValid")
            }
        })
    }

    return AdLoader.Builder(wrapper.context, AD_UNIT_ID)
        .forAdManagerAdView(onGamAdLoaded, AdSize.BANNER)
        .forNativeAd(onUnifiedAdLoaded)
        .forCustomFormatAd(
            CUSTOM_FORMAT_ID, onCustomAdLoaded
        ) { customAd: NativeCustomFormatAd?, s: String? -> }
        .withAdListener(object : AdListener() {
            override fun onAdFailedToLoad(loadAdError: LoadAdError) {
                super.onAdFailedToLoad(loadAdError)
                Log.e(TAG, "DFP onAdFailedToLoad")
            }
        })
        .build()
}
```

Render a native ad:

```kotlin
private fun inflatePrebidNativeAd(ad: PrebidNativeAd, wrapper: ViewGroup) {
  val nativeContainer = View.inflate(wrapper.context, R.layout.layout_native, null)

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

  ad.registerView(nativeContainer, Lists.newArrayList(icon, title, image, description, cta), SafeNativeListener())

  wrapper.addView(nativeContainer)
}
```

The listener that you put in registerView() method must not contain any references to View or Activity to prevent memory leak because this listener can remain in the memory for a long time. It's okay to put null listener if you don't need it. It's better to use class implementation with WeakReferences instead of anonymous objects. In Java inner class implementation must be static.

```kotlin
private class SafeNativeListener : PrebidNativeAdEventListener {
  override fun onAdClicked() {}
  override fun onAdImpression() {}
  override fun onAdExpired() {}
}
```

## Step 1: Create a NativeAdUnit
{:.no_toc}

Initialize the `NativeAdUnit` with the following properties:

- `configId` - an ID of the Stored Impression on the Prebid Server

## Step 2: Add Native Assets and Event Trackers
{:.no_toc}

In order to make a bid request for the native ads you should provide a description of native assets that should be present in the native bid response. Prebid SDK supports the following set of assets to request.

- `NativeImageAsset`
- `NativeDataAsset`
- `NativeTitleAsset`

### Asset Types
{:.no_toc}

#### NativeAssetImage
{:.no_toc}

{: .table .table-bordered .table-striped }
| Type | Scope | Description |
|-------|--------|---------|
| Main | Optional | The image that will be displayed in the native ad. Include a value for `minimumWidth` and `minimumHeight`. Ensure that the `NativeAssetImage.type` is set to ImageAsset.Main |
| Icon | Optional | The icon that will be displayed with the native ad. Include a value for `minimumWidth` and `minimumHeight`. Ensure that the `NativeAssetImage.type` is set to ImageAsset.Icon. |

#### NativeAssetData
{:.no_toc}

{: .table .table-bordered .table-striped }
| Type | Scope | Description |
|-------|--------|---------|
| Description | Optional | The content to appear with the ad. Ensure that the type is set to `DataAsset.description`. |
| ctatext | Optional | The text for the call to action button of the native ad. Ensure that the type is set to `DataAsset.ctatext`. |
| Sponsored | Optional | The sponsor (brand) of the native ad. Ensure that the type is set to `DataAsset.sponsored`. |

#### NativeAssetTitle
{:.no_toc}

{: .table .table-bordered .table-striped }
| Type | Scope | Description |
|-------|--------|---------|
| Title | Optional | The title of the native ad. |

### Other Native parameters

{% include mobile/native-params.md %}

## Step 3: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide an `AdManagerAdRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

## Step 4: Configure and make a GAM ad request
{:.no_toc}

Prepare the `AdManagerAdRequest` and run an ad request as described in the GMA SDK docs for the [native ads](https://developers.google.com/ad-manager/mobile-ads-sdk/android/native/start).

If the `AdManagerAdRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM, and GMA SDK will render its creative. Be sure that you make the ad request with the same `AdManagerAdRequest` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

## Step 5: Implement OnCustomFormatAdLoadedListener protocol
{:.no_toc}

In order to capture the native ad response, you will need to implement [OnCustomFormatAdLoadedListener](https://developers.google.com/android/reference/com/google/android/gms/ads/nativead/NativeCustomFormatAd.OnCustomFormatAdLoadedListener) protocol.

You should use the following Prebid function to determine whether the Prebid line item should be rendered:

```kotlin
 AdViewUtils.findNative(...)
```

Without it, the SDK won't be able to recognize the Prebid line item.

## Step 6: Inflate the native layout
{:.no_toc}

Once the Prebid line item is recognized you should extract the ad from the winning bid and init the view properties with native assets data.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK Android integration](/prebid-mobile/pbm-api/android/code-integration-android.html)
- [Prebid SDK Global Parameters - Android](/prebid-mobile/pbm-api/android/pbm-targeting-android.html)
