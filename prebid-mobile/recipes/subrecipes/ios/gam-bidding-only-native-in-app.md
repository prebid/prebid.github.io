---
layout: page_v2
title: iOS GAM Bidding-Only Integration - Native In-App
description: iOS GAM Bidding-Only Integration - Native In-App
sidebarType: 2
---

# iOS GAM Bidding-Only Integration - Native In-App

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html#adunit-specific-instructions)

Visit the [AdOps guide](/adops/gam-native.html#create-mobile-in-app-creative) for instructions on setting up the In-App creatives on GAM. 

At a high level, the in-app workflow follows this sequence:

1. The publisher prepares the ad layout and provides the native ad configuration to the SDK's ad unit.
2. Prebid SDK fetches native demand. However, instead of caching the native assets on the server, the assets are cached locally in the SDK.
3. Ad request are made to Google Ad Manager.
4. Upon receiving results from Google Ad Manager, the SDK determines if any of the received items are from Prebid Server.
5. If there are Prebid ads, the cached assets are then rendered.

{% capture importantNote %}
The cached assets might expire. If this occurs the publisher will receive a notification and they will have to fetch the assets again.
{% endcapture %}

Integration Example:

``` swift
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

Then integrate the native style ad using GADAdLoader

``` swift
// 1. Setup NativeRequest
nativeUnit = NativeRequest(configId: storedPrebidImpression, assets: nativeRequestAssets)
nativeUnit.context = ContextType.Social
nativeUnit.placementType = PlacementType.FeedContent
nativeUnit.contextSubType = ContextSubType.Social
nativeUnit.eventtrackers = eventTrackers

// 2. Make a bid request
nativeUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
    guard let self = self else { return }

    //3. Configure and make a GAM ad request
    self.adLoader = GADAdLoader(adUnitID: gamRenderingNativeAdUnitId,rootViewController: self,
                                adTypes: [GADAdLoaderAdType.customNative], options: [])
    self.adLoader.delegate = self
    self.adLoader.load(self.gamRequest)
}

.....

// Step 4
// MARK: GADCustomNativeAdLoaderDelegate

func customNativeAdFormatIDs(for adLoader: GADAdLoader) -> [String] {
    ["11934135"]
}

func adLoader(_ adLoader: GADAdLoader, didReceive customNativeAd: GADCustomNativeAd) {
    Utils.shared.delegate = self
    Utils.shared.findNative(adObject: customNativeAd)
}

// Step 5
// MARK: - NativeAdDelegate

func nativeAdLoaded(ad: NativeAd) {
    nativeAd = ad
    titleLabel.text = ad.title
    bodyLabel.text = ad.text

    if let iconString = ad.iconUrl {
        ImageHelper.downloadImageAsync(iconString) { result in
            if case let .success(icon) = result {
                DispatchQueue.main.async {
                    self.iconView.image = icon
                }
            }
        }
    }

    if let imageString = ad.imageUrl {
        ImageHelper.downloadImageAsync(imageString) { result in
            if case let .success(image) = result {
                DispatchQueue.main.async {
                    self.mainImageView.image = image
                }
            }
        }
    }

    callToActionButton.setTitle(ad.callToAction, for: .normal)
    sponsoredLabel.text = ad.sponsoredBy

    nativeAd.registerView(view: view, clickableViews: [callToActionButton])
}

func nativeAdNotFound() {
    PrebidDemoLogger.shared.error("Native ad not found")
}

func nativeAdNotValid() {
    PrebidDemoLogger.shared.error("Native ad not valid")
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

## Step 2: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide a `GAMRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

## Step 3: Configure and make a GAM ad request
{:.no_toc}

Prepare the `GADAdLoader` and run ad request as described in the GMA SDK docs for the [native ads](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/native/start).

If the `GAMRequest` contains targeting keywords the respective Prebid line item will be returned from GAM and GMA SDK will render its creative.

Be sure that you make the ad request with the same `GAMRequest` object that you passed to the `fetchDemand` method. Otherwise the ad request won't contain targeting keywords and Prebid's ad won't ever be displayed.

## Step 4: Implement GADCustomNativeAdLoaderDelegate protocol
{:.no_toc}

In order to capture the native ad response you need to implement [GADCustomNativeAdLoaderDelegate](GADCustomNativeAdLoaderDelegate) protocol.

In the method `-adLoader:didReceiveCustomNativeAd:` you should pass the following Prebid functions:

``` swift
Utils.shared.delegate = self
Utils.shared.findNative(adObject: customNativeAd)
```

Without it the SDK won't be able to recognize the Prebid line item.

## Step 5: Implement NativeAdDelegate
{:.no_toc}

Once the Prebid line item is recognized, the `NativeAdDelegate` will be activated. The method `nativeAdLoaded` will be invoked and provide the `NativeAd` object with a description of all ad assets that should be rendered.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK iOS integration](/prebid-mobile/pbm-api/ios/code-integration-ios.html)
- [Prebid SDK Global Parameters - iOS](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
