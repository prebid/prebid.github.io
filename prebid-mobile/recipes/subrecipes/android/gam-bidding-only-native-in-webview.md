---
layout: page_v2
title: Android GAM Bidding-Only Integration - Native In-Webview
description: Android GAM Bidding-Only Integration - Native In-Webview
sidebarType: 2
---

# Android GAM Bidding-Only Integration - Native In-Webview

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html#adunit-specific-instructions)

Integration example:

```kotlin
private fun createAd() {
    // 1. Create Ad unit
    nativeAdUnit = NativeAdUnit(CONFIG_ID)
    nativeAdUnit?.setContextType(NativeAdUnit.CONTEXT_TYPE.SOCIAL_CENTRIC)
    nativeAdUnit?.setPlacementType(NativeAdUnit.PLACEMENTTYPE.CONTENT_FEED)
    nativeAdUnit?.setContextSubType(NativeAdUnit.CONTEXTSUBTYPE.GENERAL_SOCIAL)

    // 2. Configure Native Assets and Trackers
    addNativeAssets(nativeAdUnit)

    // 3. Create GAM Ad View
    val gamView = AdManagerAdView(this)
    gamView.adUnitId = AD_UNIT_ID
    gamView.setAdSizes(AdSize.FLUID)
    adWrapperView.addView(gamView)

    // 4. Make a bid request to Prebid Server
    val request = AdManagerAdRequest.Builder().build()
    nativeAdUnit?.fetchDemand(request) {

        // 5. Load a GAM Ad
        gamView.loadAd(request)
    }
}
```

Add native assets:

```kotlin
private fun addNativeAssets(adUnit: NativeAdUnit?)  {
    // ADD ASSETS

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

    // ADD EVENT TRACKERS

    val methods = ArrayList<NativeEventTracker.EVENT_TRACKING_METHOD>()
    methods.add(NativeEventTracker.EVENT_TRACKING_METHOD.IMAGE)

    try {
        val tracker = NativeEventTracker(NativeEventTracker.EVENT_TYPE.IMPRESSION, methods)
        adUnit?.addEventTracker(tracker)
    } catch (e: Exception) {
        e.printStackTrace()
    }
}
```

## Step 1: Create a NativeAdUnit
{:.no_toc}

Initialize the `NativeAdUnit` with properties:

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

## Step 3: Create an AdManagerAdView
{:.no_toc}

Follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/android/banner) to integrate a banner ad unit.

## Step 3: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide an `AdManagerAdRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

## Step 4: Load an Ad
{:.no_toc}

Now you should request the ad from GAM. If the `AdManagerAdRequest` contains targeting keywords, the respective Prebid line item will be returned from GAM, and GMA SDK will render its creative.

Be sure that you make the ad request with the same `AdManagerAdRequest` object that you passed to the `fetchDemand` method. Otherwise, the ad request won't contain targeting keywords, and Prebid's ad won't ever be displayed.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK Android integration](/prebid-mobile/pbm-api/android/code-integration-android.html)
- [Prebid SDK Global Parameters - Android](/prebid-mobile/pbm-api/android/pbm-targeting-android.html)
