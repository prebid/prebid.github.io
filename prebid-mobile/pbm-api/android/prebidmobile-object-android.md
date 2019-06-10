---
layout: page_v2
title: PrebidMobileObject - Android
description: PrebidMobileObject - Android
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# PrebidMobile Object
{:.no_toc}

Apply global settings with the `PrebidMobile` object.

* TOC
{:toc}

## Methods

### setAccountId

Define the Prebid Server account ID provided by your Prebid Server host.

**Parameters**

`accountId`: String containing the Prebid Server account ID.

### getAccountId

Retrieve the Prebid Server account ID.

**Parameters**

none

### setHost

Define the Prebid Server host with which Prebid Mobile will communicate. Choose from system-defined Prebid Server hosts or define your own custom Prebid Server host.

**Parameters**

`host`: Object containing configuration server host. Default = `Host.APPNEXUS`.

### getHost

Retrieve the Prebid Server host with which Prebid Mobile will communicate.

**Parameters**

none

### setShareGeoLocation

If this flag is True AND the app collects the user's geographical location data, Prebid Mobile will send the user's geographical location data to Prebid Server. If this flag is False OR the app does not collect the user's geographical location data, Prebid Mobile will not populate any user geographical location information in the call to Prebid Server.

**Parameters**

`share`: Boolean value. Default = `false`.

### isShareGeoLocation

Returns a boolean value specifying whether geographic location is shared.

**Parameters**

none

### setApplicationContext

Prebid Mobile will use the application context to retrieve metadata needed for targeting, such as user agent, location, device information, and connectivity information.

**Parameters**

`context`: Context object (can be retrieved by calling `getApplicationContext`).

### getApplicationContext

**Parameters**

none

## Examples

```
PrebidMobile.setHost(Prebid.Host.APPNEXUS);
PrebidMobile.setAccountId("PREBID_SERVER_ACCOUNT_ID");
PrebidMobile.setShareGeoLocation(true);
PrebidMobile.setApplicationContext(getApplicationContext());
```

## Related Topics

- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
- [Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/android/adunit-android.html)
- [Banner Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/android/banneradunit-android.html)
- [Intersitial Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/android/interstitialadunit-android.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-result-codes-android.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html)
- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
