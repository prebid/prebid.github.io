---
layout: page_v2
title: Prebid Mobile API Result Codes
description: Prebid Mobile API Result Codes
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# Prebid Mobile API Result Codes

When you use the Prebid Mobile API to retrieve bids, you'll receive a ResultCode indicating whether the request was successful. This page provides a descriptions of each code, and where go to find more information.

## Success

- **Return Code:** SUCCESS   
- **Description:** Prebid Mobile received at least one valid bid from Prebid Server and successfully associated Prebid key-values with the appropriate ad server request.

## Prebid Server Error

- **Return Code**: PREBID_SERVER_ERROR  
- **Description**: * General result code for an unknown error returned from Prebid Server.  The actual Prebid Server error message will be exposed to the developer.  

## Invalid account ID

- **Return Code**: INVALID_ACCOUNT_ID  
- **Description**: Prebid Server did not recognize the account ID. Make sure you included an account ID and that the account ID you've set on the PrebidMobileObject is correct.   
- **More Information**: [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/ios/prebidmobile-object-ios.html)

## Invalid configuration ID

- **Return Code**: INVALID_CONFIG_ID  
- **Description**: Prebid Server did not recognize the configuration ID that was passed in on your banner or interstitial ad unit object. Be sure you've passed in a non-empty configuration ID and that the ID is correct.  
- **More Information**:  
  - [Banner Ad Unit](/prebid-mobile/pbm-api/ios/pbm-banneradunit-ios.html)  
  - [InterstitialAdUnit](/prebid-mobile/pbm-api/ios/pbm-bannerinterstitialadunit-ios.html)

## Invalid size

- **Return Code**: INVALID_SIZE  
- **Description**: Attempted to add an invalid size to a banner ad unit. This error usually occurs if you've attempted to add multiple sizes on a request to Mopub; Mopub allows only a single size.  
- **More Information**: [Banner Ad Unit](/prebid-mobile/pbm-api/ios/pbm-banneradunit-ios.html)

## Network error

- **Return Code**: NETWORK_ERROR  
- **Description**: A network error occurred during the request to Prebid Server.

## Timeout

**Return Code**: TIME_OUT   
**Description**: The ad request to Prebid Server exceeded the timeout period.

## No bids

- **Return Code**: NO_BIDS   
- **Description**: Prebid Server responded without returning any valid bids.

## Empty host URL

- **Return Code**: INVALID_HOST_URL   
- **Description**: Attempted to define a custom Prebid Server host without providing a host URL.
- **More Information**: [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/ios/prebidmobile-object-ios.html)

## Related Topics

- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
- [Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html)
- [Banner Ad Unit](/prebid-mobile/pbm-api/ios/pbm-banneradunit-ios.html)
- [Intersitial Ad Unit](/prebid-mobile/pbm-api/ios/pbm-bannerinterstitialadunit-ios.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/ios/prebidmobile-object-ios.html)
- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
