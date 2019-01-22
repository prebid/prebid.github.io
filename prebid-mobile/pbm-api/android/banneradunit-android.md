---
layout: page_v2
title: BannerAdUnit - Android
description: BannerAdUnit - Android
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# BannerAdUnit Object
{:.no_toc}

Use the `BannerAdUnit` object to create and configure a banner ad unit in your app.

* TOC
{:toc}

## Object

### BannerAdUnit

Create a new Banner Ad Unit associated with a Prebid Server configuration ID and a banner size.

**Parameters**

- `configId`: String; Prebid Server configuration ID.
- `width`: Integer; Width of the ad unit.
- `height`: Integer; Height of the ad unit.

## Methods

`BannerAdUnit` inherits all methods from the [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/android/adunit-android.html) object. It also includes the following additional methods:

### addAdditionalSize

Add an additional banner size to the Prebid Mobile ad unit. Banner ad units must be associated with one or more sizes.

**Parameters**

`width`: integer
`height`: integer

### getSizes

Retrieve the ad unit width and height.

**Parameters**

none

## Example

```
PublisherAdView dfpAdView = new PublisherAdView(context);
dfpAdView.setAdUnitId("/12345/foo");
dfpAdView.setAdSizes(new AdSize(300, 250));
final PublisherAdRequest.Builder builder = new PublisherAdRequest.Builder();
final PublisherAdRequest request = builder.build();

BannerAdUnit bannerAdUnit = new BannerAdUnit("PREBID_SERVER_CONFIGURATION_ID", 300, 250);
bannerAdUnit.setUserKeyword("my_key", "my_value");
bannerAdUnit.fetchDemand(request, new onCompleteListener() {
    @Override
    public void onComplete(ResultCode resultCode) {
        dfpAdView.loadAd(request);
    }
});
```

## Related Topics

- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
- [Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/android/adunit-android.html)
- [Intersitial Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/android/interstitialadunit-android.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-result-codes-android.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/android/prebidmobile-object-android.html)
- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
