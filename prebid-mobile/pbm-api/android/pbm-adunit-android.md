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

The `AdUnit` object is an abstract object that cannot be instantiated. Use the [BannerAdUnit](/prebid-mobile/pbm-api/android/pbm-banneradunit-android.html) or [InterstitialAdUnit](/prebid-mobile/pbm-api/android/pbm-bannerinterstitialadunit-android.html) object to create and configure the desired type of ad unit within your app.

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

#### pbAdSlot

PB Ad Slot is an identifier tied to the placement the ad will be delivered in. The use case for PB Ad Slot is to pass to exchange an ID they can use to tie to reporting systems or use for data science driven model building to match with impressions sourced from alternate integrations. A common ID to pass is the ad server slot name.

`adUnit.pbAdSlot = "/1111111/homepage/med-rect-2"`

---

## Methods

### fetchDemand

Trigger a call to Prebid Server to retrieve demand for this Prebid Mobile ad unit.

**Parameters**

- `adObj`: This is the ad server request object (for [Google Ad Manager](https://developers.google.com/android/reference/com/google/android/gms/ads/doubleclick/PublisherAdRequest) and for [Mopub](https://developers.mopub.com/publishers/reference/android/MoPubView/)). If you do not wish to add any additional /custom key values to the ad server after the Prebid auction, pass `adObj` to the fetchDemand function, where Prebid SDK will set all the Prebid targeting keys as well as any keys added prior to auction
- As of Prebid SDK 1.7, a publisher can optionally pass the Google Ad Manager `builder` object of the [Google Ad Manager Mobile Ads SDK](https://developers.google.com/android/reference/com/google/android/gms/ads/doubleclick/PublisherAdRequest.Builder) to pass custom keys to Google Ad Manager after the Prebid Auction
- `onCompleteListener`: listener object





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

### addContextKeywords
Ad Unit context keywords object is a free form list of comma separated keywords about the app as defined in app.keyword in OpenRTB 2.5.

**Parameters**
`keyword` : a keyword of type string.

```java
void addContextKeyword(String keyword)
```

### addContextKeywords

**Parameters**
`keyword` : a keyword of type string.

```java
void addContextKeywords(Set<String> keywords)
```

### removeContextKeywords

**Parameters**
`keyword`: a keyword of type string.

```java
void removeContextKeyword(String keyword)
```

### clearContextKeywords

**Parameters**
none

```java
void clearContextKeywords()
```

### First Party Data

First Party Data (FPD) is free form data supplied by the publisher to provide additional targeting of the user or inventory context, used primarily for striking PMP (Private MarketPlace) deals with Advertisers. Data supplied in the data parameters are typically not sent to DSPs whereas information sent in non-data objects (i.e. `setYearOfBirth`, `setGender`, etc.) will be. Access to FPD can be limited to a supplied set of Prebid bidders via an access control list.

Data is broken up into two different data types:
* User
  * Global in scope only
* Inventory (context)
  * Global scope
  * Ad Unit grain

 The below first party inventory context will apply to the specic ad unit the data object is applied to. For global user or inventory context level first party data, refer to [first party data section of the Targeting](pbm-targeting-params-android#first-party-data) page.


#### addContextData

**Parameters**
`key`: string containing the key for the specific data object
`value`: String containing the value for the supplied key

```java
void addContextData(String key, String value)
```

#### updateContextData

**Parameters**
`key`: string containing the key for the specific data object
`value`: String containing the value for the supplied key

```java
void updateContextData(String key, Set<String> value)
```

#### removeContextData

**Parameters**
`key`: string containing the key

```java
void removeContextData(String key)
```

#### clearContextData

**Parameters**
none

```java
void clearContextData()
```


<div markdown="1" style="background-color: AntiqueWhite;">
{% include alerts/alert_warning.html content="Ad Unit *User* keywords will be deprecated in favor of [targeting keywords](pbm-targeting-params-android#user-keywords) for Prebid versions 1.2+. Support will continue for Ad Unit User Keywords as users migrate to targeting user keywords." %}

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
</div>

## Example

```
InterstitialAdUnit interstitialAdUnit = new InterstitialAdUnit("PREBID_SERVER_CONFIGURATION_ID");
interstitialAdUnit.setUserKeyword("my_key", "my_value"); //will be deprecated in future releases
interstitialAdUnit.addContextKeyword("adunitContextKeywordValue1");
interstitialAdUnit.addContextKeyword("adunitContextKeywordValue2");
interstitialAdUnit.addContextData("adunitContextDataKey1", "adunitContextDataValue1");
interstitialAdUnit.fetchDemand(publisherAdRequest, new onCompleteListener() {
    @Override
    public void onComplete(ResultCode resultCode) {
        dfpInterstitial.loadAd(publisherAdRequest);
    }
});

//As of Prebid SDK 1.7, the fetchDemand method supports passing a request builder object to append custom key values to the build object. See fetchDemand above for furher details. 

final PublisherAdRequest.Builder builder = new PublisherAdRequest.Builder();

adUnit.fetchDemand(builder, new OnCompleteListener() {
    @Override
    public void onComplete(ResultCode resultCode) {
        builder.addCustomTargeting("key1", "value1");
        PublisherAdRequest request = builder.build();
        amBanner.loadAd(request);
    }
});
```

## Related Topics

- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
- [Banner Ad Unit](/prebid-mobile/pbm-api/android/pbm-banneradunit-android.html)
- [Intersitial Ad Unit](/prebid-mobile/pbm-api/android/pbm-bannerinterstitialadunit-android.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-result-codes-android.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/android/prebidmobile-object-android.html)
- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
