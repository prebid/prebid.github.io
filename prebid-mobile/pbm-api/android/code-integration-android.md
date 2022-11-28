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
Prebid is going to release beta versions of SDK from time to time. So if you don't want to update to beta versions - avoid Maven's range notation for the dependency versions.

If you still use the range notation like this:

```
implementation 'org.prebid:prebid-mobile-sdk:[1,2)'
```

please change it to the strict version.  {% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

### Build framework from source

After [cloning the repo](https://github.com/prebid/prebid-mobile-android), use Terminal or another command line tool, change to the root directory and run:

```
scripts/buildPrebidMobile.sh
```

to output the PrebidMobile framework for Android.

## Initialize SDK

{% capture warning_note %}  
All integration examples for Android are written on `Kotlin`. 

The corresponding Java code you can find in the [Demo Java](https://github.com/prebid/prebid-mobile-android/tree/master/Example/PrebidDemoJava) application

{% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}

Once you have a [Prebid Server](/prebid-mobile/prebid-mobile-getting-started.html), you will add 'account' info to the Prebid Mobile. For example, if you're using the AppNexus Prebid Server:

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

If you integrate Prebid Mobile with GMA SDK, use the following method, wich checks the compatibility of Prebid SDK with GMA SDK used in the app: 

```kotlin
PrebidMobile.checkGoogleMobileAdsCompatibility(MobileAds.getVersion().toString())
```
Check the log messages of the app. If the provided GMA SDK version is not verified for compatibility, the Prebid SDK informs about it.

## Set Targeting Parameters 

Targeting parameters enable you to define the target audience for the bid request. Prebid Mobile supports the following global targeting parameters. These targeting parameters are set only once and apply to all Prebid Mobile ad units. They do not change for a given user session.

View the full list of [targeting parameters](/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html).


## Supported Android versions

Prebid supports the following versions by release:

* Prebid SDK version 1.0 or 1.1 supports Android 16+
* Prebid SDK version 1.1.1+ supports Android 19+
* Prebid SDK version 2.0.0+ supporst Android 16+

## Integrate Ad Units

Follow the coresponding guide to integrate Prebid Mobile:

- [No Ad Server]()
- [GAM using Original API]()
- [GAM using Rendering API]()
- [AdMob]()
- [AppLovin MAX]()


