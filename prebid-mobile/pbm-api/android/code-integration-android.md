---
layout: page_v2
title: SDK Integration - Android
description: Code Integration - Android
pid: 1
top_nav_section: prebid-mobile
nav_section: prebid-mobile-android
sidebarType: 2
---

# Integration for Android
{:.no_toc}

Get started with Prebid Mobile by creating a [Prebid Server account](/prebid-mobile/prebid-mobile-getting-started.html). Once your account is set up include the Prebid Mobile SDK in your app by either using Maven or by [cloning the repo](https://github.com/prebid/prebid-mobile-android) and using our included script to build the SDK.

* TOC
{:toc}

## SDK Integration

### Maven

If you are not familar with using Maven for build management visit the [Maven website](https://maven.apache.org/index.html).

To include the Prebid Mobile SDK simply add this line to your gradle dependencies to get the latest stable release:

```
dependencies {
    ////
    
    // Prebid SDK
    implementation 'org.prebid:prebid-mobile-sdk:2.0.4'
}
```

{% capture warning_note %}  
Prebid is going to release beta versions of the SDK from time to time. If you don't want to update to beta versions - avoid Maven's range notation for the dependency versions.

If you still use the range notation like this:

```
implementation 'org.prebid:prebid-mobile-sdk:[1,2)'
```

please change it to the strict version. 
{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

### Build framework from source

After [cloning the repo](https://github.com/prebid/prebid-mobile-android), use Terminal or another command line tool to change to the root directory and run:

```
scripts/buildPrebidMobile.sh
```

This will output the PrebidMobile framework for Android.

{% capture warning_note %}  
If you see errors while building the Prebid Mobile SDK or Demo Applications, make sure that the needed Android SDK version is set up on your machine. Check the gradle build configs for the project and applications for details about the current required version.

{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}


## Initialize SDK

{% capture warning_note %}  
All integration examples for Android are written in `Kotlin`. 

The corresponding Java code can be found in the [Demo Java](https://github.com/prebid/prebid-mobile-android/tree/master/Example/PrebidDemoJava) application

{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

Once you have a [Prebid Server](/prebid-mobile/prebid-mobile-getting-started.html), you will add the 'account' info to Prebid Mobile. For example, if you're using the AppNexus Prebid Server:

```
PrebidMobile.setPrebidServerAccountId(YOUR_ACCOUNT_ID)
PrebidMobile.setPrebidServerHost(Host.APPNEXUS)
```

If you have opted to host your own Prebid Server solution you will need to store the url to the server in your app.

```
PrebidMobile.setPrebidServerHost(Host.createCustomHost("https://prebid-server-test-j.prebid.org/openrtb2/auction"))
```

Once you set the account ID and the Prebid Server host, you should initialize the Prebid SDK. There are several options for how to do it. 

Use the following initialization for Prebid SDK: 

```kotlin
PrebidMobile.initializeSdk(applicationContext, object : SdkInitializationListener {
    override fun onSdkInit() {
        TODO("Not yet implemented")
    }

    override fun onSdkFailedToInit(error: InitError?) {
        TODO("Not yet implemented")
    }
})
```

If you integrate Prebid Mobile with GMA SDK, use the following method, which checks the compatibility of Prebid SDK with GMA SDK used in the app: 

```kotlin
PrebidMobile.checkGoogleMobileAdsCompatibility(MobileAds.getVersion().toString())
```
Check the log messages of the app. If the provided GMA SDK version is not verified for compatibility, the Prebid SDK will log a warning.

## Updating your Android manifest

{% capture warning_note %}  
This section applies only to scenarios when when Prebid SDK renders a winning bid: `No Ad Server`, `AdMob`, `MAX`, `GAM Event Handlers`. If you integrate Prebid with GAM using the original integration scenario skip this step.  
{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

Before you start, you need to integrate the SDK by updating your Android manifest.

Open your AndroidManifest.xml and add the following permissions and activity declarations according to the bundle you are integrating.

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

**Notes:** 

- `ACCESS_COARSE_LOCATION` or `ACCESS_FINE_LOCATION` will automatically allow the device to send user location for targeting, which can help increase revenue by increasing the value of impressions to buyers.
- `WRITE_EXTERNAL_STORAGE` is optional and only required for MRAID 2.0 storePicture ads.

For *banner and interstitial ads only*, include the following custom activities (even though you won't instantiate them directly). This is not necessary for video interstitial ads.

Custom Activities:

```xml
<activity
    android:name="org.prebid.mobile.rendering.views.browser.AdBrowserActivity"
    android:configChanges="orientation|screenSize|keyboardHidden"
    android:theme="@android:style/Theme.Translucent.NoTitleBar"
    android:windowSoftInputMode="adjustPan|stateHidden"
    android:launchMode="singleTop"/>  
```

**NOTE**

> Interstitial ads are implemented in a dialog. For proper interstitial workflow it is recommended to use a separate Activity with `configChanges` attribute specified to avoid any issues which may occur on orientation change.
> See above example with `configChanges` attribute.

Add this tag to your `<application>` to use Google Play Services:

``` xml
<meta-data android:name="com.google.android.gms.version" android:value="@integer/google_play_services_version" />  
```

## Set Targeting Parameters 

Targeting parameters enable you to define the target audience for the bid request. Prebid Mobile supports the following global targeting parameters. These targeting parameters are set only once and apply to all Prebid Mobile ad units. They do not change for a given user session.

View the full list of [targeting parameters](/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html).

## Supported Android versions

Prebid supports the following versions by release:

* Prebid SDK version 1.0 or 1.1 supports Android 16+
* Prebid SDK version 1.1.1+ supports Android 19+
* Prebid SDK version 2.0.0+ supporst Android 16+

## Setup SDK

Apply global settings with the `PrebidMobile` object.


### AccountId
{:.no_toc}

String containing the Prebid Server account ID.

```kotlin
PrebidMobile.setPrebidServerAccountId("123321")
var pbsAccountId = PrebidMobile.getPrebidServerAccountId()
```

### Host
{:.no_toc}

Object containing configuration for your Prebid Server host with which the Prebid SDK will communicate. Choose from the system-defined Prebid Server hosts or define your own custom Prebid Server host.

```kotlin
PrebidMobile.setPrebidServerHost(Host.RUBICON);

//or set a custom host
Host.CUSTOM.setHostUrl("https://prebid-server.bidder.com/");
PrebidMobile.setPrebidServerHost(Host.CUSTOM);
```

### Timeout
{:.no_toc}

The Prebid timeout (accessible to Prebid SDK 1.2+), set in milliseconds, will return control to the ad server SDK to fetch an ad once the expiration period is achieved. Because Prebid SDK solicits bids from Prebid Server in one payload, setting Prebid timeout too low can stymie all demand resulting in a potential negative revenue impact.

```kotlin
PrebidMobile.setTimeoutMillis(3000)

var timeout = PrebidMobile.getTimeoutMillis()
```


### ShareGeoLocation
{:.no_toc}

If this flag is True AND the app collects the user's geographical location data, Prebid Mobile will send the user's geographical location data to Prebid Server. If this flag is False OR the app does not collect the user's geographical location data, Prebid Mobile will not populate any user geographical location information in the call to Prebid Server.

```kotlin
PrebidMobile.setShareGeoLocation(true)

var isShareLocation = PrebidMobile.isShareGeoLocation()
```

### CustomHeaders
{:.no_toc}

The following methods enables the customization of the HTTP call to the Prebid server:

```kotlin
var headers = HashMap<String, String> ()
headers.put("custom-header-1", "prebid-in-action")

PrebidMobile.setCustomHeaders(headers)
        
headers = PrebidMobile.getCustomHeaders()
```

### Auction Response
{:.no_toc}

`storedAuctionResponse`: Set as type string, stored auction responses signal Prebid Server to respond with a static response matching the storedAuctionResponse found in the Prebid Server Database, useful for debugging and integration testing. No bid requests will be sent to any bidders when a matching storedAuctionResponse is found. For more information on how stored auction responses work, refer to the written [description on github issue 133](https://github.com/prebid/prebid-mobile-android/issues/133).

```kotlin
PrebidMobile.setStoredAuctionResponse("response-prebid-banner-320-50")
```

### StoredBidResponses
{:.no_toc}

Stored Bid Responses are similar to Stored Auction Responses in that they signal to Prebid Server to respond with a static pre-defined response, except Stored Bid Responses is done at the bidder level, with bid requests sent out for any bidders not specified in the bidder parameter. For more information on how stored auction responses work, refer to the written [description on github issue 133](https://github.com/prebid/prebid-mobile-android/issues/133).

```kotlin
PrebidMobile.addStoredBidResponse("appnexus", "221144");
PrebidMobile.addStoredBidResponse("rubicon", "221155");
```
To stop sending stored bid response signals use the following method:

```kotlin
void clearStoredBidResponses()
```

### Debug
{:.no_toc}

`pbsDebug`: adds the debug flag ("test":1) on the outbound http call to Prebid Server. The test:1 flag will signal to Prebid Server to emit the full resolved request (resolving any Stored Request IDs) as well as the full Bid Request and Bid Response to and from each bidder.

```kotlin
PrebidMobile.setPbsDebug(true)
```

## Integrate Ad Units

Follow the corresponding guide to integrate Prebid Mobile:

- [GAM using Original API](android-sdk-integration-gam-original-api.html)
- [No Ad Server](../../modules/rendering/android-sdk-integration-pb.html)
- [GAM using Rendering API](../../modules/rendering/android-sdk-integration-gam.html)
- [AdMob](../../modules/rendering/android-sdk-integration-admob)
- [AppLovin MAX](../../modules/rendering/android-sdk-integration-max.html)
