---
layout: page_v2
title: Android Targeting Parameters
description: Add Android Targeting Parameters
sidebarType: 2
---

{% capture warningNote %}
This document describes a pre-release version of the Prebid Mobile API that has been deprecated.
{% endcapture %}

{% include alerts/alert_warning.html content=warningNote %}

# Android Targeting Parameters

## User location

By default, the Android Prebid Mobile SDK automatically sends location information.

Disable (false) or enable (true) location data:

```
TargetingParams.setLocationEnabled(true);
```

Fetch location data and pass it to Prebid Mobile:

```
TargetingParams.setLocation(location);
```

Choose the precision of location data:

```
TargetingParams.setLocationDecimalDigits(6);
```

## Age and Gender

Age and gender can be added to the targeting params directly.

```
TargetingParams.setYearOfBirth(1990);
TargetingParams.setGender(GENDER.FEMALE);
```


## Custom Keywords

Custom keywords are used to attach arbitrary key/value pairs to the ad call. Use key/value pairs to add users to segments, as shown here:

```
TargetingParams.setUserTargeting("foo", "bar");
TargetingParams.setUserTargeting("foo", "bay");
```
This will result in the following request JSON body construct:

```
"user" : {
	"keywords" : "foo=bar,foo=bay,"
}
```

## GDPR Consent

Prebid Mobile supports the [IAB GDPR recommendations](https://www.iab.com/topics/consumer-privacy/gdpr/). For a general overview of Prebid Mobile support for GDPR, see [Prebid Mobile Guide to European Ad Inventory and Providing Notice, Transparency and Choice](/prebid-mobile/privacy-regulation.html)

Enable (true) or disable (false) the ability to provide consent.
```
TargetingParams.setSubjectToGDPR(context, true);
```
Enable publishers to set the consent string.

```
TargetingParams.setGDPRConsentString(context, "consent_string");
```

Prebid mobile also checks if the values are present in the [SharedPreferences](https://developer.android.com/training/data-storage/shared-preferences) keys specified by the IAB. If the values are also set in these objects they will be passed in the OpenRTB request object.

## Other

For more information about the TargetingParams, please check the source code in [Coding Integration for Android](/prebid-mobile/legacy/android/code-integration-android.html).
