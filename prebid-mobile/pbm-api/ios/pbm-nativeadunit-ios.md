---
layout: page_v2
title: Banner Native AdUnit
description: Banner Native AdUnit
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# NativeAdUnit: AdUnit
{: .notoc}

The NativeAdUnit is a subclass of the AdUnit class. Use the NativeAdUnit object to create and configure a native ad unit in your app.

- TOC
 {:toc}

## Object
### NativeAdUnit
Create a new `NativeAdUnit` associated with a Prebid Server configuration ID.

See [AdUnit](/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) for additional parameters and methods.

**Parameters**

`configId (String)`: Prebid Server configuration ID. Note: this is a Prebid Server [impression-level stored request ID](/prebid-server/features/pbs-storedreqs.html).

## Examples

**Create a NativeAdUnit**

```
let nativeUnit = NativeRequest(configId: your-config-id)
```
**Configure the NativeAdUnit**

To configure the `NativeAdUnit` create the following objects and set the value of `NativeAdUnit.assets` to an array containing these items.

NativeAssetImage

{: .table .table-bordered .table-striped }
| Type | Scope | Description |
|-------|--------|---------|
| Main | Optional | The image that will be displayed in the native ad. Include a value for `minimumWidth` and `minimumHeight`. Ensure that the `NativeAssetImage.type` is set to ImageAsset.Main |
| Icon | Optional | The icon that will be displayed with the native ad. Include a value for `minimumWidth` and `minimumHeight`. Ensure that the `NativeAssetImage.type` is set to ImageAsset.Icon. |

NativeAssetData

{: .table .table-bordered .table-striped }
| Type | Scope | Description |
|-------|--------|---------|
| Description | Optional | The content to appear with the ad. Ensure that the type is set to `DataAsset.description`. |
| ctatext | Optional | The text for the call to action button of the native ad. Ensure that the type is set to `DataAsset.ctatext`. |
| Sponsored | Optional | The sponsor (brand) of the native ad. Ensure that the type is set to `DataAsset.sponsored`. |

NativeAssetTitle

{: .table .table-bordered .table-striped }
| Type | Scope | Description |
|-------|--------|---------|
| Title | Optional | The title of the native ad. |


### Example
```
let image = NativeAssetImage(minimumWidth: 200, minimumHeight: 200, required: true)

image.type = ImageAsset.Main


let icon = NativeAssetImage(minimumWidth: 20, minimumHeight: 20, required: true)

icon.type = ImageAsset.Icon


let title = NativeAssetTitle(length: 90, required: true)


let body = NativeAssetData(type: DataAsset.description, required: true)


let cta = NativeAssetData(type: DataAsset.ctatext, required: true)


let sponsored = NativeAssetData(type: DataAsset.sponsored, required: true)


nativeUnit.assets = [icon,title,image,body,cta,sponsored]


let event1 = EventType.Impression

eventTrackers = NativeEventTracker(event: event1, methods: [EventTracking.Image,EventTracking.js])

nativeUnit.eventtrackers = [eventTrackers]
```

**Load the NativeAdUnit**
```
nativeUnit.fetchDemand(adObject: self.request) { [weak self] (resultCode: ResultCode) in

    print("Prebid demand fetch successful \(resultCode.name())")

    // call loadAd to load the view

}
```

## Related Topics

- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
- [Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html)
- [Banner Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-banneradunit-ios.html)
- [Interstitial Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-bannerinterstitialadunit-ios.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-result-codes-ios.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/ios/prebidmobile-object-ios.html)
- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
