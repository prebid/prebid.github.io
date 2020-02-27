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

As of version 1.2+, Prebid SDK has extended the functionality of Interstitial ad monetization by using a smart ad size selection process. App developers can speicify a minimun width and minimum height percentage an ad can occupy of a devices real state, with Prebid Server (PBS) deriving a limited set of ad sizes (max 10) as eligible for the auction.

PBS will take the AdUnit's size (width and height) as the max size for the interstitial as size. If that size is 1x1, it will look up the device's size and use that as the max size. If the wdith and height are not present, it will also use the device size as the max size. (1x1 support so that you don't have to omit size as a parameter to use the device size).

PBS with interstitial support will come preconfigured with a list of common ad sizes, preferentially organized by weighing the larger and more common sizes first. No guarantees to the ordering will be made. PBS will generate a list of ad sizes, selecting the first 10 sizes that fall within the imp's max size and minimum percentage size. All the interstitial parameters will still be passed to the bidders, allowing them to use their own size matching algorithms if they prefer.

Prebid Server will send the eligible size list to each bidder to solicit a bid. For a full description of the Prebid Server logic, please refer to the [Prebid Server PR 797](https://github.com/prebid/prebid-server/pull/797/files).

**Parameters**

`configId`: Prebid Server configuration ID.

`minWidthPerc`: Optional parameter to specify the minimum width percent an ad may occuy of a device's real estate. Support in SDK version 1.2+

`minHeightPrec`: Optional parameter to specify the minimum height percent an ad may occuy of a device's real estate. Support in SDK version 1.2+

```java
InterstitialAdUnit(@NonNull String configId, int minWidthPerc, int minHeightPerc)
```

## Methods

`InterstitialAdUnit` inherits all methods from the [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/android/adunit-android.html) object.

## Example

```java
AdUnit interstitialAdUnit = new InterstitialAdUnit("12345", 50, 70);
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
