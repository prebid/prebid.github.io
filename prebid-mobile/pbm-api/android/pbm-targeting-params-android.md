---
layout: page_v2
title: Global Targeting Parameters - Android
description: Prebid Mobile API global targeting parameters for Android
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# Global Targeting Parameters
{:.no_toc}

Prebid Mobile supports the following global targeting parameters. These targeting parameters are set only once and apply to all Prebid Mobile ad units. They do not change for a given user session.

* TOC
{:toc}

## Global User Targeting

### Year of Birth

You can retrieve and set the year of birth for targeting:

```
yob = TargetingParams.getYearOfBirth();
```

```
TargetingParams.setYearOfBirth(1990);
```

### Gender

You can retrieve and set the following values for gender:

- `FEMALE`
- `MALE`
- `UNKNOWN`

```
gender = TargetingParams.getGender();
```

```
TargetingParams.setGender(FEMALE);
```

## Global Application Targeting

### Bundle ID

Use the following code to retrieve the platform-specific bundle/package name:

```
bundleName = TargetingParams.getBundleName();
```

Pass in the platform-specific identifier - the bundle/package name - to set the bundle ID:

```
TargetingParams.setBundleName(bundleName);
```

### Domain

Retrieve and set the domain of your app with the following commands:

```
domain = TargetingParams.getDomain();
```

```
TargetingParams.setDomain(domain);
```

### Store URL

Retrieve and set your app's store URL:

```
storeUrl = TargetingParams.getStoreUrl();
```

```
TargetingParams.etStoreUrl(storeUrl);
```

## Global GDPR Targeting

Prebid Mobile supports the [IAB GDPR recommendations](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/Mobile%20In-App%20Consent%20APIs%20v1.0%20Draft%20for%20Public%20Comment.md). For a general overview of Prebid Mobile support for GDPR, see [Prebid Mobile Guide to European Ad Inventory and Providing Notice, Transparency and Choice]({{site.github.url}}/prebid-mobile/gdpr.html)

Enable (true) or disable (false) the ability to provide consent.

```
TargetingParams.setSubjectToGDPR(context, true);
```

Retrieve the consent string.

```
context = TargetingParams.getGDPRConsentString();
```

Enable publishers to set the consent string.

```
TargetingParams.setGDPRConsentString(context, "consent_string");
```

Prebid mobile also checks if the values are present in the [SharedPreferences](https://developer.android.com/training/data-storage/shared-preferences) keys specified by the IAB. If the values are also set in these objects they will be passed in the OpenRTB request object.

## Further Reading

- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
