---
layout: page_v2
title: AdUnit - Android
description: AdUnit - Android
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# AdUnit Object
{:.no_toc}

The `AdUnit` object is an abstract object that cannot be instantiated. Use the [BannerAdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/android/banneradunit-android.html) or [InterstitialAdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/android/interstitialadunit-android.html) object to create and configure the desired type of ad unit within your app.

* TOC
{:toc}

## Object

### AdUnit

`AdUnit` properties and methods are inherited by `BannerAdUnit` and `InterstitialAdUnit`.

**Parameters**

- `configId`: String containing the Prebid Server configuration ID.
- `adType`: `BANNER` or `INTERSITIAL`. This value will be set by the object based on which type of ad unit object you create.

**Properties**

- `configId`: Prebid Server configuration ID.
- `adType`: `BANNER` or `INTERSITIAL`.
- `periodMillis`: Integer defining the refresh time in milliseconds. Default = 0, meaning no auto refresh.
- `keywords`: ArrayList containing keys and values.

## Methods

### fetchDemand

Trigger a call to Prebid Server to retrieve demand for this Prebid Mobile ad unit.

**Parameters**

- `adObj`: bid request object
- `onCompleteListener`: listener object

### setUserKeyword

Set a single key-value pair.

**Parameters**

- `key`: String containing the key.
- `value`: String containing the value.

### setUserKeywords

Define multiple values for a single key.

**Parameters**

- `key`: String containing the key.
- `values`: String array containing the list of values for the key.

### removeUserKeyword

Remove a key and all its associated values from a given Prebid Mobile ad unit.

**Parameters**

- `key`: String containing the key you want to remove.

### removeUserKeywords

Clear all key-value combinations from the Prebid Mobile ad unit.

**Parameters**

none

### setAutoRefreshPeriodMillis

If set on a given Prebid Mobile ad unit, the `fetchDemand` function will be called every `periodMillis` until `stopAutoRefresh` is called. Each call to `fetchDemand` will invoke the `onComplete` function. This refresh only pertains to Prebid Mobile and not to any ad server refresh processes. It is suggested that the adServers refresh be turned off. 

**Parameters**

- `periodMillis`: Integer defining the refresh time in milliseconds.

### startAutoRefresh

Starts the auto-refresh behavior for a given Prebid Mobile ad unit.

### stopAutoRefresh

Halts the auto-refresh behavior for a given Prebid Mobile ad unit. If no auto-refresh behavior has been set, `stopAutoRefresh` will be ignored.

**Parameters**

none

## Example

```
InterstitialAdUnit interstitialAdUnit = new InterstitialAdUnit("PREBID_SERVER_CONFIGURATION_ID");
interstitialAdUnit.setUserKeyword("my_key", "my_value");
interstitialAdUnit.fetchDemand(publisherAdRequest, new onCompleteListener() {
    @Override
    public void onComplete(ResultCode resultCode) {
        dfpInterstitial.loadAd(publisherAdRequest);
    }
});
```

## Related Topics

- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
- [Banner Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/android/banneradunit-android.html)
- [Intersitial Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/android/interstitialadunit-android.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-result-codes-android.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/android/prebidmobile-object-android.html)
- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
