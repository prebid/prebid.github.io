---
layout: page_v2
title: Code Integration - Android
description: Code Integration - Android
pid: 1
top_nav_section: prebid-mobile
nav_section: prebid-mobile-android
sidebarType: 2
---

# Code Integration for Android

Get started with Prebid Mobile by getting access to a [Prebid Server](/prebid-mobile/prebid-mobile-pbs.html). Once your account is set up include the Prebid Mobile SDK in your app by either using Maven or by [cloning the repo](https://github.com/prebid/prebid-mobile-android) and using our included script to build the SDK.

### Include with Maven

If you are not familar with using Maven for build management visit the [Maven website](https://maven.apache.org/index.html).

To include the Prebid Mobile SDK simply add this line to your gradle dependencies to get the lastest stable release:

```
implementation 'org.prebid:prebid-mobile-sdk:1.12.2'
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
./buildprebid.sh
```

to output the PrebidMobile framework for Android.

### Integrate Ad Servers With Your App

Integrating **MoPub** with your application
1.  Go to [MoPub.com](https://app.mopub.com/register/) and  register for a MoPub account . If you already have an account with them, you can [log in](https://app.mopub.com/account/login/).
2.  After the registration you will be automatically prompted to set up a new MoPub application required for integrating mobile ads to your application.

Integrating **Google** with your application   

Go to Google's developer site and follow the instructions for integrating their [Mobile Ads SDK](https://developers.google.com/ad-manager/mobile-ads-sdk/android/quick-start) into your app.

### Set Targeting Parameters (Optional)

Targeting parameters enable you to define the target audience for the bid request. Prebid Mobile supports the following global targeting parameters. These targeting parameters are set only once and apply to all Prebid Mobile ad units. They do not change for a given user session.

View the full list of [targeting parameters](/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html).

### Create Ad Units
Banner and interstitial ad units can be created:

```
BannerAdUnit bannerAdUnit = new BannerAdUnit("PREBID_SERVER_CONFIGURATION_ID", 300, 250);
```

For details on creating the specific ad units and additional parameters and methods associated with each view the documentation pertaining to them:

[Banner Ad Unit](/prebid-mobile/pbm-api/android/pbm-banneradunit-android.html)  
[Interstitial Ad Unit](/prebid-mobile/pbm-api/android/pbm-bannerinterstitialadunit-android.html)

#### Using Asset Ids with In-App Native Ad Units

Setting this option to `true`, in your instance of Prebid Mobile, enables you to add an id for each asset in the assets array. The default setting is `false`

**Kotlin**
```
PrebidMobile.assignNativeAssetID(true)
```

**Java**
```
PrebidMobile.assignNativeAssetID(true);
```

### Resize ad slot

Prebid recommends app developers to resize ads slots to the Prebid rendering ad size using native code due to an unresolved bug in the Google Mobile Ads SDK (described [here](https://groups.google.com/forum/?utm_medium=email&utm_source=footer#!category-topic/google-admob-ads-sdk/ios/648jzAP2EQY)) where render failures can occur with 3rd party creatives (such as Prebid Universal Creative) using size overrides.

{% capture warning_note %}  
Failure to resize rendering Prebid ads can cause revenue loss under certain conditions. For this reason, we advise using the below resize function in all scenarios. {% endcapture %}
{% include /alerts/alert_warning.html content=warning_note %}


```
dfpAdView.setAdListener(new AdListener() {
    @Override
    public void onAdLoaded() {
        super.onAdLoaded();

        AdViewUtils.findPrebidCreativeSize(dfpAdView, new AdViewUtils.PbFindSizeListener() {
            @Override
            public void success(int width, int height) {
                dfpAdView.setAdSizes(new AdSize(width, height));
            }

            @Override
            public void failure(@NonNull PbFindSizeError error) {
                Log.d("MyTag", "error: " + error);
            }
        });

    }
});
 ```

### Supported Android versions

Prebid supports the following versions by release:

* Prebid SDK version 1.0 or 1.1 supports Android 16+
* Prebid SDK version 1.1.1+ supports Android 19+



## Further Reading

- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
- [Ad Unit](/prebid-mobile/pbm-api/android/pbm-adunit-android.html)
- [Banner Ad Unit](/prebid-mobile/pbm-api/android/pbm-banneradunit-android.html)
- [Intersitial Ad Unit](/prebid-mobile/pbm-api/android/pbm-bannerinterstitialadunit-android.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-result-codes-android.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html)
- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
- [Prebid Utilities - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-util-android.html)
