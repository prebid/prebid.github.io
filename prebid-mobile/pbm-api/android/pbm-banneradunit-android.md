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

Create a new Banner Ad Unit associated with a Prebid Server 'configuration ID' and a banner size.

**Parameters**

- `configId`: String; Prebid Server configuration ID. Note: this is a Prebid Server [impression-level stored request ID](/prebid-server/features/pbs-storedreqs.html).
- `width`: Integer; Width of the ad unit.
- `height`: Integer; Height of the ad unit.


#### Parameters


Parameters is a sub class of BannerAdUnit. Create a new Parameters class to define the parameters of the video ad unit. Parameters contain the OpenRTB video attributes.

`api: [int]`: OpenRTB placement

**Parameters**

Array of integers or a predefined constant representing the supported [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) Frameworks. While OpenRTB allows additional API Frameworks, they were intentionally left out as constants since they do not make sense in a banner context. If there is a desire to pass API Frameworks that are not represented as a constants within Parameters, they can be passed an integer, where Prebid SDK will pass Prebid Server whatever is present:

* `3` or `Signals.Api.MRAID_1` : MRAID-1 support signal
* `5` or `Signals.Api.MRAID_2` : MRAID-2 support signal
* `6` or `Signals.Api.MRAID_3` : MRAID-3 support signal
* `7` or `Signals.Api.OMID_1` :  signals OMSDK support




## Methods

`BannerAdUnit` inherits all methods from the [AdUnit](/prebid-mobile/pbm-api/android/pbm-adunit-android.html) object. It also includes the following additional methods:

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

```java
PublisherAdView dfpAdView = new PublisherAdView(context);
dfpAdView.setAdUnitId("/12345/foo");
dfpAdView.setAdSizes(new AdSize(300, 250));
final PublisherAdRequest.Builder builder = new PublisherAdRequest.Builder();
final PublisherAdRequest request = builder.build();

BannerAdUnit bannerAdUnit = new BannerAdUnit("PREBID_SERVER_CONFIGURATION_ID", 300, 250);
bannerAdUnit.setUserKeyword("my_key", "my_value");
BannerBaseAdUnit.Parameters parameters = new BannerBaseAdUnit.Parameters();
parameters.setApi(Arrays.asList(new Signals.Api(6, 7)));
// alternate representation using an enum parameters.setApi(Arrays.asList(Signals.Api.MRAID_3, Signals.Api.OMID_1));

bannerAdUnit.setParameters(parameters);
bannerAdUnit.fetchDemand(request, new onCompleteListener() {
    @Override
    public void onComplete(ResultCode resultCode) {
        dfpAdView.loadAd(request);
    }
});
```

## Related Topics

- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
- [Ad Unit](/prebid-mobile/pbm-api/android/pbm-adunit-android.html)
- [Intersitial Ad Unit](/prebid-mobile/pbm-api/android/pbm-bannerinterstitialadunit-android.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-result-codes-android.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/android/prebidmobile-object-android.html)
- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
