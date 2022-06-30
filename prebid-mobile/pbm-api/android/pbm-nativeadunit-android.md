---
layout: page_v2
title: Banner Native AdUnit - Android
description: Banner Native AdUnit for Android
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

See [AdUnit](/prebid-mobile/pbm-api/android/pbm-adunit-android.html) for additional parameters and methods.

**Parameters**

`configId (String)`: Prebid Server configuration ID. Note: this is a Prebid Server [impression-level stored request ID](/prebid-server/features/pbs-storedreqs.html).

## Examples

**Create a NativeAdUnit**

```
NativeAdUnit nativeAdUnit = new NativeAdUnit("your-config-id");
```

**Configure the NativeAdUnit**

```
// General configuration
nativeAdUnit.setContextType(NativeAdUnit.CONTEXT_TYPE.SOCIAL_CENTRIC);
nativeAdUnit.setPlacementType(NativeAdUnit.PLACEMENTTYPE.CONTENT_FEED);
nativeAdUnit.setContextSubType(NativeAdUnit.CONTEXTSUBTYPE.GENERAL_SOCIAL);

// Add event trackers requirements, this is required
ArrayList<NativeEventTracker.EVENT_TRACKING_METHOD> methods = new ArrayList<>();
methods.add(NativeEventTracker.EVENT_TRACKING_METHOD.IMAGE);
methods.add(NativeEventTracker.EVENT_TRACKING_METHOD.JS);
try {
    NativeEventTracker tracker = new NativeEventTracker(NativeEventTracker.EVENT_TYPE.IMPRESSION, methods);
    nativeAdUnit.addEventTracker(tracker);
} catch (Exception e) {
    e.printStackTrace();
}

// Require a title asset
NativeTitleAsset title = new NativeTitleAsset();
title.setLength(90);
title.setRequired(true);
nativeAdUnit.addAsset(title);

// Require an icon asset
NativeImageAsset icon = new NativeImageAsset();
icon.setImageType(NativeImageAsset.IMAGE_TYPE.ICON);
icon.setWMin(20);
icon.setHMin(20);
icon.setRequired(true);
nativeAdUnit.addAsset(icon);

// Require an main image asset
NativeImageAsset image = new NativeImageAsset();
image.setImageType(NativeImageAsset.IMAGE_TYPE.MAIN);
image.setHMin(200);
image.setWMin(200);
image.setRequired(true);
nativeAdUnit.addAsset(image);

// Require sponsored text
NativeDataAsset data = new NativeDataAsset();
data.setLen(90);
data.setDataType(NativeDataAsset.DATA_TYPE.SPONSORED);
data.setRequired(true);
nativeAdUnit.addAsset(data);

// Require main description
NativeDataAsset body = new NativeDataAsset();
body.setRequired(true);
body.setDataType(NativeDataAsset.DATA_TYPE.DESC);
nativeAdUnit.addAsset(body);

// Require call to action
NativeDataAsset cta = new NativeDataAsset();
cta.setRequired(true);
cta.setDataType(NativeDataAsset.DATA_TYPE.CTATEXT);
nativeAdUnit.addAsset(cta);
```

**Load the NativeAdUnit**
```
nativeAdUnit.fetchDemand(adView, new OnCompleteListener() {
    @Override
    public void onComplete(ResultCode resultCode) {
        // call load ad on the adView
    }
});
```

## Related Topics

- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
- [Ad Unit](/prebid-mobile/pbm-api/android/pbm-adunit-android.html)
- [Banner Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-banneradunit-android.html)
- [Intersitial Ad Unit](/prebid-mobile/pbm-api/android/pbm-bannerinterstitialadunit-android.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-result-codes-android.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/android/prebidmobile-object-android.html)
- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
