---
layout: page_v2
title: Prebid Mobile API - Android
description: Overview of Prebid Mobile API for Android
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# Prebid Mobile API - Android

Use the Prebid Mobile API 1.0 for Android to implement header bidding in your mobile apps. The elements in the API will allow you to participate in a header bidding auction and communicate with your ad server to display a creative. The API supports banner and interstitial creatives.

## Key Features

- The Publisher knows if the keywords are attached to the `adUnit`.  
- Implements and supports its own auto refresh, no longer supporting `adServer` refresh.   
- Clear result codes that details the response of the Prebid demand fetch request.

## Objects

The Prebid Mobile API supports instantiation of the following objects:

- [Global Settings]({{site.baseurl}}/prebid-mobile/pbm-api/android/prebidmobile-object-android.html)
- [Banner Ad Unit](/prebid-mobile/pbm-api/android/pbm-banneradunit-android.html)
- [Interstitial Ad Unit](/prebid-mobile/pbm-api/android/pbm-bannerinterstitialadunit-android.html)

## Result Codes

For a list of possible result codes, see [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-result-codes-android.html).

## Global Targeting

For general targeting information, see [Global Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html).
