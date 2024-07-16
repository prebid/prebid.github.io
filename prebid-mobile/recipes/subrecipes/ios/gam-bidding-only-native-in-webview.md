---
layout: page_v2
title: iOS GAM Bidding-Only Integration - Native In-Webview
description: iOS GAM Bidding-Only Integration - Native In-Webview
sidebarType: 2
---

# iOS GAM Bidding-Only Integration - Native In-Webview

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html#adunit-specific-instructions)

Integration example:

First, prepare the set of requested assets.

```swift
private var nativeRequestAssets: [NativeAsset] {
    let image = NativeAssetImage(minimumWidth: 200, minimumHeight: 50, required: true)
    image.type = ImageAsset.Main

    let icon = NativeAssetImage(minimumWidth: 20, minimumHeight: 20, required: true)
    icon.type = ImageAsset.Icon

    let title = NativeAssetTitle(length: 90, required: true)
    let body = NativeAssetData(type: DataAsset.description, required: true)
    let cta = NativeAssetData(type: DataAsset.ctatext, required: true)
    let sponsored = NativeAssetData(type: DataAsset.sponsored, required: true)

    return [title, icon, image, sponsored, body, cta]
}
```

Then integrate the native style ad using GAM Banner ad unit

``` swift
// 1. Create NativeRequest
nativeUnit = NativeRequest(configId: CONFIG_ID, assets: nativeRequestAssets)
nativeUnit.context = ContextType.Social
nativeUnit.placementType = PlacementType.FeedContent
nativeUnit.contextSubType = ContextSubType.Social
nativeUnit.eventtrackers = eventTrackers

// 2. Create GAMBannerView
gamBannerView = GAMBannerView(adSize: GADAdSizeFluid)
gamBannerView.adUnitID = storedImpNativeStyleBanner
gamBannerView.rootViewController = self
gamBannerView.delegate = self
bannerView.addSubview(gamBannerView)

// 3. Make a bid request
nativeUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
    PrebidDemoLogger.shared.info("Prebid demand fetch for GAM \(resultCode.name())")

    // 4. Load and GAM ad
    self?.gamBannerView.load(self?.gamRequest)
}
```

## Step 1: Create a NativeRequest
{:.no_toc}

Initialize the `NativeRequest` with properties:

* `configId` - an ID of the Stored Impression on the Prebid Server
* `assets` - the array of `NativeAsset` objects which describes your native ad.

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

## Step 2: Create a GAMBannerView
{:.no_toc}

Just follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/banner) to integrate a banner ad unit.

## Step 3: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide a `GAMRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

## Step 4: Load an Ad
{:.no_toc}

You should now request the ad from GAM. If the `GAMRequest` contains targeting keywords the respective Prebid line item will be returned from GAM and GMA SDK will render its creative.

Be sure that you make the ad request with the same `GAMRequest` object that you passed to the `fetchDemand` method. Otherwise the ad request won't contain targeting keywords and Prebid's ad won't ever be displayed.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK iOS integration](/prebid-mobile/pbm-api/ios/code-integration-ios.html)
- [Prebid SDK Global Parameters - iOS](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
