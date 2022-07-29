---
layout: page_v2
title: Code Integration
description: Code Integration
pid: 1
top_nav_section: prebid-mobile
nav_section: prebid-mobile-android
sidebarType: 2
---

{% capture warningNote %}
This document describes a pre-release version of the Prebid Mobile API that has been deprecated. 
{% endcapture %}

{% include alerts/alert_warning.html content=warningNote %}


# Code Integration for Android

{:.no_toc}

Get started with Prebid Mobile by creating a [Prebid Server account]({{site.github.url}}/prebid-mobile/prebid-mobile-pbs.html).

### Use Maven?

Easily include the Prebid Mobile SDK using Maven. Simply add this line to your gradle dependencies:

```
compile 'org.prebid:prebid-mobile-sdk:[0,1)'
```

### Build framework from source

Build Prebid Mobile from source code. After cloning the repo, from the root directory run

```
./buildprebid.sh
```

to output the PrebidMobile framework for Android.

## Ad Unit Setup for Android
{:.no_toc}

Register Prebid Mobile ad units as early as possible in the application's lifecycle.  

When registering a Prebid Mobile ad unit, you must replace `"PREBID-MOBILE-SLOT-ID"` with a unique user-defined identifier.  Prebid Mobile will use this identifier to determine the unique ad unit to which bid key-values will be associated.  This identifier must be unique across all registered Prebid Mobile ad units, and does not need to map to any ad unit ID defined in your ad server.

The steps for using Prebid Mobile are as follows:

1. Create the ad units and add sizes for banner ad units.  Be sure to replace `"PREBID-MOBILE-SLOT-ID"` with a unique user-defined identifier.

   NOTE: The [fluid ad size](https://developers.google.com/android/reference/com/google/android/gms/ads/AdSize.html#FLUID) (used in Google Ad Manager) is not supported.

2. Add a server-side configuration for each ad unit to Prebid Server Adapter.
3. Set targeting parameters for the ad units. (Optional)
4. Set the primary adserver for the bid to either Google Ad Manager or MoPub. (Primary ad server is necessary to determine the caching mechanism.)
5. Set the Prebid Server host to AppNexus or Rubicon.
6. Register the ad units with the adapter to start the bid fetching process.

### User-Replaced Macros

In the code snippets below, any values that must be substituted by your developers are identified in capital letters.  These values are defined below:

{: .table .table-bordered .table-striped }
| Value | Description |
|--------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `PREBID-SERVER-ACCOUNT-ID` | Your unique account ID with your Prebid Server vendor.  |
| `PREBID-MOBILE-SLOT-ID` | User-defined identifier that must be unique across all registered Prebid Mobile ad units.  Note: this value should not map to any ad unit ID defined in your ad server, unless that ID is unique. |
| `PREBID-SERVER-CONFIGURATION-ID` | The ID of a Prebid Server demand partner configuration.  Represents the set of demand that will be fetched for a given ad unit. |
| `AD-SERVER-OBJECT-INSTANCE` | The ad server object instance to which bids will be attached.  Supported values are defined in a table below. |
| `AD-SERVER-AD-LOAD-METHOD` | The ad server API to load this ad type. |

### Ad Unit Registration

Create the ad units that represent the ad spaces in your app using following APIs:

```
ArrayList<AdUnit> adUnits = new ArrayList<AdUnit>();

/**
 * Configure a Banner Ad Unit with size 320x50.
 *
 * Replace @"PREBID-MOBILE-SLOT-ID" with the unique ad slot identifier
 * you defined when you registered the ad unit with Prebid Mobile.
 *
 * Replace @"PREBID-SERVER-CONFIGURATION-ID" with the ID of
 * your Prebid Server demand partner configuration.
 */
BannerAdUnit adUnit1 = new BannerAdUnit("PREBID-MOBILE-SLOT-ID", "PREBID-SERVER-CONFIGURATION-ID");
adUnit1.addSize(320, 50);

/**
 * Configure an Interstitial Ad Unit.
 *
 * Replace @"PREBID-MOBILE-SLOT-ID" with the unique ad slot identifier
 * you defined when you registered the ad unit with Prebid Mobile.
 *
 * Replace @"PREBID-SERVER-CONFIGURATION-ID" with the ID of
 * your Prebid Server demand partner configuration.
 */
InterstitialAdUnit adUnit2 = new InterstitialAdUnit("PREBID-MOBILE-SLOT-ID", "PREBID-SERVER-CONFIGURATION-ID");

// Add them to the list
adUnits.add(adUnit1);
adUnits.add(adUnit2);

```

### Initialize the SDK

Once configuration is done, use the following API to initialize Prebid Mobile and start fetching Prebid ads for your list of ad units.

If you're using Google Ad Manager as your primary ad server, use the API like this:
```
/**
 * Register ad units for prebid.
 *
 * Replace "PREBID-SERVER-ACCOUNT-ID" with your Prebid Server account ID.
 *
 * If you are using a Prebid Server host other than AppNexus, be sure
 * to replace 'Host.APPNEXUS'.
 */
try {
    Prebid.init(getApplicationContext(), adUnits, "PREBID-SERVER-ACCOUNT-ID", Prebid.AdServer.DFP, Host.APPNEXUS);
} catch (PrebidException e) {
    e.printStackTrace();
}
```
If you're using MoPub as your primary ad server, use the API like this:
```
/**
 * Register ad units for prebid.
 *
 * Replace "PREBID-SERVER-ACCOUNT-ID" with your Prebid Server account ID.
 *
 * If you are using a Prebid Server host other than AppNexus, be sure
 * to replace 'Host.APPNEXUS'.
 */
try {
    Prebid.init(getApplicationContext(), adUnits, "PREBID-SERVER-ACCOUNT-ID", Prebid.AdServer.MOPUB, Host.APPNEXUS);
} catch (PrebidException e) {
    e.printStackTrace();
}
```
Note that host should be the prebid server host you're using.

### Set Ad Server Targeting
{:.no_toc}

The final step for implementing Prebid Mobile is to attach bid keywords on the ad object. You can either attach bids immediately or wait for ads before attaching bids. To attach bids immediately use the following API.

```
/**
 * Replace "PREBID-MOBILE-SLOT-ID" with the unique ad slot identifier
 * you defined when you registered the ad unit with Prebid Mobile.
 *
 * Replace AD-SERVER-OBJECT-INSTANCE with the ad view instance
 * from your ad server (defined in the table below).
 */
Prebid.attachBids(AD-SERVER-OBJECT-INSTANCE, "PREBID-MOBILE-SLOT-ID", Context);
```

To wait for ads before attaching bids, implement the following listener.

```
@Override
public void onAttachComplete(Object adObj) {
	// using Google Ad Manager implementation as an example
    if (adView != null && adObj != null && adObj instanceof PublisherAdRequest) {
        adView.loadAd((PublisherAdRequest) adObj);
        Prebid.detachUsedBid(adObj);
    }
}
```

Prebid Mobile will immediately tell your app whether it has a bid or not without waiting. If it does have a bid, the code below will attach the bids to the ad request by applying keyword targeting. Use the table below to see which ad objects are supported currently.

{: .table .table-bordered .table-striped }
| Primary Ad Server | Ad Object Type | Ad Server Object Instance  | Ad Server Ad Load Method                           |
|-------------------|----------------|----------------------------|----------------------------------------------------|
| Google Ad Manager               | Banner         | `PublisherAdRequest`       | `public void loadAd(PublisherAdRequest adRequest)` |
| Google Ad Manager               | Interstitial   | `PublisherAdRequest`       | `public void loadAd(PublisherAdRequest adRequest)` |
| MoPub             | Banner         | `MoPubView`                | `public void loadAd()`                             |
| MoPub             | Interstitial   | `MoPubInterstitial`        | `public void load()`                               |

### Supporting Auto Refreshing Ad Units
Prebid Mobile Android does not update the bids automatically like iOS implementation. To enable prebid with auto refesh, the following code integration is required.

#### Primary Ad Server is MoPub
For MoPub banner, in the banner ad listener implementation, add the following API usage.
```
/**
 * MoPub Banner Listener Implementation.
 *
 * Replace "PREBID-MOBILE-SLOT-ID" with the unique ad slot identifier
 * you defined when you registered the ad unit with Prebid Mobile.
 */
@Override
public void onBannerLoaded(MoPubView banner) {
    Prebid.attachBids(banner, "PREBID-MOBILE-SLOT-ID", Context);
}

@Override
public void onBannerFailed(MoPubView banner, MoPubErrorCode errorCode) {
    Prebid.attachBids(banner, "PREBID-MOBILE-SLOT-ID", Context);
}
 ```

#### Primary Ad Server is Google Ad Manager
For Google Ad Manager banner, the `loadAd(AdRequest)` has to be called again with updated bids info. If not, same set of bids will be used repeatedly until `loadAd()` is called with a new `AdRequest`. We recommend doing client side auto refresh yourself using code like the following:
 ```
 /**
 * Replace "PREBID-MOBILE-SLOT-ID" with the unique ad slot identifier
 * you defined when you registered the ad unit with Prebid Mobile.
 */
final Handler handler = new Handler(Looper.getMainLooper());
Runnable refreshRunnable = new Runnable() {
    @Override
    public void run() {
        Prebid.attachBids(request, "PREBID-MOBILE-SLOT-ID", Context);
        adView.loadAd(request);
        handler.postDelayed(this, 30000); // load ad with new bids every 30 seconds
    }
};
handler.post(refreshRunnable);

// Assume some condition is triggered to stop the auto-refresh
boolean conditionToStopRefresh = true;
if(conditionToStopRefresh) {
    // remove refresh runnable and destroy the banner
    handler.removeCallbacks(refreshRunnable);
    adView.destroy();
}
 ```

### ProGuard Support

#### Primary Ad Server is Google Ad Manager
If ProGuard is enabled, the following lines must be added to your ProGuard file:
```
-keep class com.google.android.gms.ads.doubleclick.PublisherAdRequest {
   public *;
}
```

To avoid PrebidServerAdapter class being obfuscated and prebid not working, add the following lines to your proguard file:
```
-keep class org.prebid.mobile.prebidserver.PrebidServerAdapter {
   public *;
}

-keepnames class org.prebid.mobile.prebidserver.PrebidServerAdapter {
   public *;
}
```


