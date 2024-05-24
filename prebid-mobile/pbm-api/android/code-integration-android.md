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

- TOC
{:toc}

## SDK Integration

### Maven

If you are not familiar with using Maven for build management visit the [Maven website](https://maven.apache.org/index.html).

To include the Prebid Mobile SDK simply add this line to your gradle dependencies to get the latest stable release:

```bash
dependencies {
    ////
    
    // Prebid SDK
    implementation 'org.prebid:prebid-mobile-sdk:2.0.4'
}
```

{% capture warning_note %}  
Prebid is going to release beta versions of the SDK from time to time. If you don't want to update to beta versions - avoid Maven's range notation for the dependency versions.

If you still use the range notation like this:

```bash
implementation 'org.prebid:prebid-mobile-sdk:[1,2)'
```

please change it to the strict version.
{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

### Build framework from source

After [cloning the repo](https://github.com/prebid/prebid-mobile-android), use Terminal or another command line tool to change to the root directory and run:

```bash
scripts/buildPrebidMobile.sh
```

This will output the PrebidMobile framework for Android.

{% capture warning_note %}
If you see errors while building the Prebid Mobile SDK or Demo Applications, make sure that the needed Android SDK version is set up on your machine. Check the gradle build configs for the project and applications for details about the current required version.

{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

## Add the Prebid SDK

### Point to a Prebid Server

{% capture warning_note %}
All integration examples for Android are written in `Kotlin`.

The corresponding Java code can be found in the [Demo Java](https://github.com/prebid/prebid-mobile-android/tree/master/Example/PrebidDemoJava) application

{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

Once you have a [Prebid Server](/prebid-mobile/prebid-mobile-getting-started.html), you will add the 'account' info to Prebid Mobile. For example, if you're using the AppNexus Prebid Server:

```kotlin
PrebidMobile.setPrebidServerAccountId(YOUR_ACCOUNT_ID)
PrebidMobile.setPrebidServerHost(Host.APPNEXUS)
```

If you have opted to host your own Prebid Server solution you will need to store the url to the server in your app. Make sure that your URL points to the [/openrtb2/auction](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html) endpoint.

```kotlin
PrebidMobile.setPrebidServerHost(Host.createCustomHost("https://prebidserver.example.com/openrtb2/auction"))
```

#### Account Settings ID

Each mobile app may have its own "account settings ID". This is used to look up data in Prebid Server like timeout, targeting, and price granularity.

By default the Account Settings ID is set to be the same as the Account ID. i.e. the setPrebidServerAccountId() function will set both values.
If you want to define a different Account Settings ID as determined in conjunction with
your Prebid Server team, use the [arbitrary OpenRTB](/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html#arbitrary-openrtb) method like this:

```kotlin
adUnitConfiguration?.ortbConfig = "{\"ext\":{\"prebid\":{\"storedrequest\": {\"id\":\"account-settings-id\"}}}}"
```

### Initialize SDK

Once you set the account ID and the Prebid Server host, you should initialize the Prebid SDK. Use the following initialization for Prebid SDK:

```kotlin
PrebidMobile.initializeSdk(applicationContext) { status ->
    if (status == InitializationStatus.SUCCEEDED) {
        Log.d(TAG, "SDK initialized successfully!")
    } else if (status == InitializationStatus.SERVER_STATUS_WARNING) {
        Log.e(TAG, "Prebid Server status checking failed: $status\n${status.description}")
    }
    else {
        Log.e(TAG, "SDK initialization error: $status\n${status.description}")
    }
}
```

{% capture warning_note %}
Pay attention that SDK should be initialized on the main thread.
{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

During the initialization, SDK creates internal classes and performs the health check request to the [/status](https://docs.prebid.org/prebid-server/endpoints/pbs-endpoint-status.html)  endpoint. If you use a custom PBS host you should provide a custom status endpoint as well:

```kotlin
PrebidMobile.setCustomStatusEndpoint(PREBID_SERVER_STATUS_ENDPOINT)
```

If something goes wrong with the request, the status of the initialization callback will be `SERVER_STATUS_WARNING`. It doesn't affect an SDK flow and just informs you about the health check result.

### Check compatibility with your GMA SDK

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

- `ACCESS_COARSE_LOCATION` or `ACCESS_FINE_LOCATION` will automatically allow the device to send user location as First Party Data, which can help increase revenue by increasing the value of impressions to buyers.
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

## Set Global Parameters

There are several types of parameters app developers should consider providing to Prebid SDK:

- Values that control Prebid SDK behavior (timeout, etc)
- Privacy consent settings (TCF, GPP, COPPA, etc).
- First Party Data to help bidders understand the context and/or u
ser better.

See the [global parameters page](/prebid-mobile/pbm-api/android/pbm-targeting-android.html) for details.

## Supported Android versions

Prebid supports the following versions by release:

- Prebid SDK version 1.0 or 1.1 supports Android 16+
- Prebid SDK version 1.1.1+ supports Android 19+
- Prebid SDK version 2.0.0+ supporst Android 16+

## Setup SDK

Apply global settings with the `PrebidMobile` object.

### AccountId
{:.no_toc}

String containing the Prebid Server account ID.

```kotlin
PrebidMobile.setPrebidServerAccountId(YOUR_ACCOUNT_ID)
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

### Creative Factory Timeout
{:.no_toc}

Indicates how long each creative has to load before it is considered a failure.

```kotlin
PrebidMobile.setCreativeFactoryTimeout(7000);
PrebidMobile.setCreativeFactoryTimeoutPreRenderContent(25000);
```

The `creativeFactoryTimeoutPreRenderContent` controls the timeout for video and interstitial ads. The `creativeFactoryTimeout` is used for HTML banner ads.

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

### Server Side Configuration

You can pass some SDK configuration properties from PBS to the SDK using the `ext.prebid.passthrough` object, [supported](https://docs.prebid.org/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#request-passthrough) by Prebid Server, in the stored request.

For now Prebid SDK supports the following configuration properties:

- `cftbanner` - see the `Prebid.creativeFactoryTimeout`
- `cftprerender` - see the `Prebid.creativeFactoryTimeoutPreRenderContent`

An example of a stored request:

```json
{
  "app": {
    "publisher": {
      "ext": {
        "prebid": {
          
        }
      }
    }
  },
  "ext": {
    "prebid": {
      "passthrough": [
        {
          "type": "prebidmobilesdk",
          "sdkconfiguration": {
            "cftbanner": 42,
            "cftprerender": 4242
          }
        }
      ]
    }
  },
  "test": 1
}
```

All values received in the `passthrough` of the bid response will be applied to the respective `Prebid.*` properties with the highest priority. After that, the SDK will utilize new values received in the bid response.

## Integrate Ad Units

Follow the corresponding guide to integrate Prebid Mobile:

- [GAM using Original API](android-sdk-integration-gam-original-api.html)
- [No Ad Server](../../modules/rendering/android-sdk-integration-pb.html)
- [GAM using Rendering API](../../modules/rendering/android-sdk-integration-gam.html)
- [AdMob](../../modules/rendering/android-sdk-integration-admob)
- [AppLovin MAX](../../modules/rendering/android-sdk-integration-max.html)

### Test configs

In the table below, you can find Prebid's test IDs that are used in the Demo Applications and that you can utilize for SDK integration validation.

{: .table .table-bordered .table-striped }

| Config ID            | Ad Format        | Description            |
| -------------------- | ---------------- | ---------------------- |
|`https://prebid-server-test-j.prebid.org/openrtb2/auction` | **Custom Prebid Server Host**|A PBS instance that is dedicated to testing purposes.|
|`0689a263-318d-448b-a3d4-b02e8a709d9d`| **Stored Request ID**|The test account ID on the test server.|
|`prebid-demo-banner-320-50`|**HTML Banner**|Returns a stored response that contains a Banner 320x50 winning bid.|
|`prebid-demo-display-interstitial-320-480`|**HTML Interstitial**|Returns a stored response that contains a Interstitial 320x480 winning bid.|
|`prebid-demo-video-outstream-original-api`|**Outstream Video** (Original API)|Returns a stored response that contains a Video 320x50 winning bid.|
|`prebid-demo-video-outstream`|**Outstream Video** (Rendering API)|Returns a stored response that contains a Video 320x50 winning bid.|
|`prebid-demo-video-interstitial-320-480-original-api`|**Video Interstitial** (Original API)|Returns a stored response that contains a Video Interstitial 320x480 winning bid.|
|`prebid-demo-video-interstitial-320-480`|**Video Interstitial** (Rendering API)|Returns a stored response that contains a Video Interstitial 320x480 winning bid.|
|`prebid-demo-video-rewarded-320-480-original-api`|**Rewarded Video** (Original API)|Returns a stored response that contains a Rewarded Video 320x480 winning bid.|
|`prebid-demo-video-rewarded-320-480`|**Rewarded Video** (Original API)|Returns a stored response that contains a Rewarded Video 320x480 winning bid.|
|`sample_video_response`|**Instream Video**|Returns a stored response that contains a Video 320x480 winning bid. Note: on Android we have an [issue](https://github.com/prebid/prebid-mobile-android/issues/517) with Instream Video demo example. When it is fixed the config id will be updated to the new one.|
|`prebid-demo-banner-native-styles`|**Native Styles**|Returns a stored response that contains a Native winning bid.|
|`prebid-demo-banner-native-styles`|**In-App Native**|Returns a stored response that contains a Native winning bid.|
