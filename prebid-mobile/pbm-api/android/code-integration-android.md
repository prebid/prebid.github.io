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

Get started with Prebid Mobile by creating a [Prebid Server account]({{site.github.url}}/prebid-mobile/prebid-mobile-pbs.html). Once your account is set up include the Prebid Mobile SDK in your app by either using Maven or by [cloning the repo](https://github.com/prebid/prebid-mobile-android) and using our included script to build the SDK. 

### Include with Maven

If you are not familar with using Maven for build management visit the [Maven website](https://maven.apache.org/index.html).

To include the Prebid Mobile SDK simply add this line to your gradle dependencies:

```
compile 'org.prebid:prebid-mobile-sdk:[0,1)'
```

### Build framework from source

After [cloning the repo](https://github.com/prebid/prebid-mobile-android), use Terminal or another command line tool, change to the root directory and run:

```
./buildprebid.sh
```

to output the PrebidMobile framework for Android.

### Integrate Ad Servers With Your App

Integrating **MoPub** with your application
1.  Go to [MoPub.com](https://app.mopub.com/account/register/) and  register for a MoPub account . If you already have an account with them, you can [log in](https://app.mopub.com/account/login/). 
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

[Banner Ad Unit](/prebid-mobile/pbm-api/android/banneradunit-android.html)  
[Interstitial Ad Unit](/prebid-mobile/pbm-api/android/interstitialadunit-android.html)

### Add Custom Keywords

Once an ad unit has been instantiated, custom keywords can be added to it to improve its targeting.  

```
bannerAdUnit.setUserKeyword("my_key", "my_value");
```
For more details on custom keywords, review the [adUnit class documention](/prebid-mobile/pbm-api/android/adunit-android.html)

## Further Reading

- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
- [Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/android/adunit-android.html)
- [Banner Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/android/banneradunit-android.html)
- [Intersitial Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/android/interstitialadunit-android.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-result-codes-android.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html)
- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)