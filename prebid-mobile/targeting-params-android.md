---
layout: page
title: Add Targeting Parameters
description: Add Targeting Parameters
pid: 1
top_nav_section: prebid-mobile
nav_section: prebid-mobile-android
---


<div class="bs-docs-section" markdown="1">

# Targeting Parameters

## User location

By default, the Android PBM SDK automatically send location information. 

To disable or enable location data, use the following API:

```
TargetingParams.setLocationEnabled(true);
```

Alternatively a developer could fetch the location data and pass it to PBM using the following API:

```
TargetingParams.setLocation(location);

```
To choose the precision of location data, use the following API:

```
TargetingParams.setLocationDecimalDigits(6);
```


## Age and Gender
{:.no_toc}

Age and gender can be added to the targeting params directly as shown below.

```
TargetingParams.setYearOfBirth(1990);
TargetingParams.setGender(GENDER.FEMALE);
```


## Pass Custom Keywords
{:.no_toc}

Custom keywords are used to attach arbitrary key-value pairs to the ad call. These are used for adding users to segments
On PBM, custom keywords are passed on as below:

```
TargetingParams.setUserTargeting("foo", "bar");
TargetingParams.setUserTargeting("foo", "bay");
```
will result in the request json body constructed as

```
"user" : {
	"keywords" : "foo=bar,foo=bay,"
}
```

## GDPR Support

Prebid Mobile supports the IAB's GDPR recommendations, which can be found here.

Two API's are provided to get the consent from the publisher & also the consent string.

To enable publishers to provide the consent
```
TargetingParams.setSubjectToGDPR(context, true);
```
To enable publishers to set the consent string

```
TargetingParams.setGDPRConsentString(context, "consent_string");
```

Prebid mobile also checks if the values are present in the SharedPreferences keys specified by the IAB here

if the values are set in these objects too they will be passed in the openRTB request object

## Other
For more information about the TargetingParams, please check the source code of in PBM android.


</div>
