---

layout: page_v2
title: Integrating the Android SDK
description: Prebid Android Rendering SDK Integration
sidebarType: 2

---

# Integrating the Android SDK with your project

## Gradle Integration


To add the dependency, open your project and update the app module’s build.gradle to have the following repositories and dependencies:

```
allprojects {
    repositories {
      ...
      google()
      mavenCentral()
      ...
    }
}

// ...

dependencies {
    ...
    implementation('org.prebid:prebid-mobile-sdk:2.0.0')
    ...
}
```

## Updating your Android manifest


Before you start, you need to integrate the SDK by updating your Android manifest.

1.  Open your AndroidManifest.xml and add the following permissions and activity declarations according to the bundle you are integrating.

``` xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

    **Notes:**

    -   `ACCESS_COARSE_LOCATION` or `ACCESS_FINE_LOCATION` will
        automatically allow the device to send user location for
        targeting, which can help increase revenue by increasing the
        value of impressions to buyers.
    -   `WRITE_EXTERNAL_STORAGE` is optional and only required for MRAID
        2.0 storePicture ads.

2.  For *banner and interstitial ads only*, include the following custom activities (even though you won't instantiate them directly). This is not necessary for video interstitial ads.

    Custom Activities:

``` xml
<activity
    android:name="org.prebid.mobile.rendering.views.browser.AdBrowserActivity"
    android:configChanges="orientation|screenSize|keyboardHidden"
    android:theme="@android:style/Theme.Translucent.NoTitleBar"
    android:windowSoftInputMode="adjustPan|stateHidden"
    android:launchMode="singleTop"/>  
```

**NOTE**
>Interstitial ads are implemented in a dialog. For proper interstitial workflow it is recommended to use a separate Activity with `configChanges` attribute specified to avoid any issues which may occur on orientation change.
> See above example with `configChanges` attribute.

3.  Add this tag to your `<application>` to use Google Play Services:

 ``` xml
<meta-data android:name="com.google.android.gms.version" android:value="@integer/google_play_services_version" />  
```
