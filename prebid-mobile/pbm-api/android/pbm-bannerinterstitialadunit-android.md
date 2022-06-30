---
layout: page_v2
title: InterstitialAdUnit - Android
description: InterstitialAdUnit - Android
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# InterstitialAdUnit Object (Banner)
{:.no_toc}

Use the `InterstitialAdUnit` object to create and configure an interstitial ad unit in your app.

* TOC
{:toc}

## Object

### InterstitialAdUnit

Create a new Interstitial Ad Unit associated with a Prebid Server configuration ID.

As of version 1.2+, Prebid SDK has extended the functionality of Interstitial ad monetization by using a smart ad size selection process to monetize sizes smaller than full screen ads. App developers can speicify a minimun width and minimum height percentage an ad can occupy of a devices real state, with Prebid Server (PBS) deriving a limited set of ad sizes (max 10) as eligible for the auction.

PBS will take the AdUnit's size (width and height) as the max size for the interstitial as size, generating a list of ad sizes, selecting the first 10 sizes that fall within the imp's max size and minimum percentage size. All the interstitial parameters will still be passed to the bidders, allowing them to use their own size matching algorithms if they prefer.

Prebid Server will send the eligible size list to each bidder to solicit a bid. For a full description of the Prebid Server logic, please refer to the [Prebid Server PR 797](https://github.com/prebid/prebid-server/pull/797/files).

**Parameters**

`configId`: Prebid Server configuration ID. Note: this is a Prebid Server [impression-level stored request ID](/prebid-server/features/pbs-storedreqs.html).

`minWidthPerc`: Optional parameter to specify the minimum width percent an ad may occuy of a device's real estate. Support in SDK version 1.2+

`minHeightPrec`: Optional parameter to specify the minimum height percent an ad may occuy of a device's real estate. Support in SDK version 1.2+

```java
InterstitialAdUnit(@NonNull String configId, int minWidthPerc, int minHeightPerc)
```

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

`InterstitialAdUnit` inherits all methods from the [AdUnit](/prebid-mobile/pbm-api/android/pbm-adunit-android.html) object.

## Example

```java
AdUnit interstitialAdUnit = new InterstitialAdUnit("12345", 50, 70);
BannerBaseAdUnit.Parameters parameters = new BannerBaseAdUnit.Parameters();
parameters.setApi(Arrays.asList(new Signals.Api(6, 7)));
// alternate representation using an enum parameters.setApi(Arrays.asList(Signals.Api.MRAID_3, Signals.Api.OMID_1));
interstitialAdUnit.setParameters(parameters);
interstitialAdUnit.fetchDemand(publisherAdRequest, new onCompleteListener() {
    @Override
    public void onComplete(ResultCode resultCode) {
        dfpInterstitial.loadAd(publisherAdRequest);
    }
});
```

## Related Topics

- [Ad Unit](/prebid-mobile/pbm-api/android/pbm-adunit-android.html)
- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
- [Banner Ad Unit](/prebid-mobile/pbm-api/android/pbm-banneradunit-android.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-result-codes-android.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/android/prebidmobile-object-android.html)
- [Prebid Mobile API - android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
