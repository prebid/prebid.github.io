---
layout: page_v2
title: Prebid Mobile API Result Codes - Android
description: Prebid Mobile API Result Codes for Android
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# Prebid Mobile API Result Codes

When you use the Prebid Mobile API to retrieve bids, you'll receive a `ResultCode` indicating whether the request was successful. This page provides a descriptions of each code, and where go to find more information.

## Success

- **Return Code**: SUCCESS
- **Description**: Prebid Mobile received at least one valid bid from Prebid Server and successfully associated Prebid key-values with the appropriate ad server request.

## No banner size provided

- **Return Code**: NO_SIZE_FOR_BANNER
- **Description**: Attempted to fetch demand on a banner ad unit without at least one valid size. Size is required for banner ad units.
- **More Information**: [BannerAdUnit]({{site.github.url}}/prebid-mobile/pbm-api/android/banneradunit-android.html)

## Invalid account ID

- **Return Code**: INVALID_ACCOUNT_ID
- **Description**: Prebid Server did not recognize the account ID. Make sure you included an account ID and that the account ID you've set on the PrebidMobileObject is correct.
- **More Information**: [PrebidMobileObject]({{site.github.url}}/prebid-mobile/pbm-api/android/prebidmobile-object-android.html)

## Invalid configuration ID

- **Return Code**: INVALID_CONFIG_ID
- **Description**: Prebid Server did not recognize the configuration ID that was passed in on your banner or interstitial ad unit object. Be sure you've passed in a non-empty configuration ID and that the ID is correct.
- **More Information**:  
  - [BannerAdUnit]({{site.github.url}}/prebid-mobile/pbm-api/android/banneradunit-android.html)  
  - [InterstitialAdUnit]({{site.github.url}}/prebid-mobile/pbm-api/android/interstitialadunit-android.html)

## Invalid size

- **Return Code**: INVALID_SIZE
- **Description**: Attempted to add an invalid size to a banner ad unit. This error usually occurs if you've attempted to add multiple sizes on a request to Mopub; Mopub allows only a single size.
- **More Information**: [BannerAdUnit]({{site.github.url}}/prebid-mobile/pbm-api/android/banneradunit-android.html)

## Network error

- **Return Code**: NETWORK_ERROR
- **Description**: A network error occurred during the request to Prebid Server.

## Timeout

- **Return Code**: TIME_OUT
- **Description**: The ad request to Prebid Server exceeded the timeout period.

## No bids

- **Return Code**: NO_BIDS
- **Description**: Prebid Server responded without returning any valid bids.

## Empty host URL

- **Return Code**: INVALID_HOST_URL
- **Description**: Attempted to define a custom Prebid Server host without providing a host URL.
- **More Information**: [PrebidMobileObject]({{site.github.url}}/prebid-mobile/pbm-api/android/prebidmobile-object-android.html)
