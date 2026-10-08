---
layout: page_v2
title: Prebid SDK Utilities - Android
description: Utilities used in conjuntion with the Prebid SDK
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# Prebid SDK Utility functions
{:.no_toc}

This page will store any utilities that can used in conjuntion with the Prebid SDK.

* TOC
{:toc}

## Find Prebid Creative Size
Prebid SDK provides a function `findPrebidCreativeSize` to address a bug in the Google Ad Manager ad server (described in [this Google forum thread](https://groups.google.com/forum/?utm_medium=email&utm_source=footer#!category-topic/google-admob-ads-sdk/ios/648jzAP2EQY)) where under certain situations ads fail to render.

For GAM banner integrations, call `findPrebidCreativeSize` from [`onAdLoaded`](https://developers.google.com/android/reference/com/google/android/gms/ads/AdListener.html#onAdLoaded()) after each successful banner load. The utility searches the creative’s HTML for Prebid size information. If found, use the success callback to resize the ad view accordingly. Size resolution may fail when GAM serves a non-Prebid creative or when the required size information cannot be extracted from a Prebid creative. The failure callback does not distinguish between these cases; leave the ad view’s current size unchanged.

{% include alerts/alert_note.html content="`findPrebidCreativeSize` is supported on Android API versions 19+. Using on earlier versions is safe to use, however the resizing would not function." %}

Usage example:

```kotlin
adView.adListener = object : AdListener() {
    override fun onAdLoaded() {
        super.onAdLoaded()

        AdViewUtils.findPrebidCreativeSize(adView, object : AdViewUtils.PbFindSizeListener {
            override fun success(width: Int, height: Int) {

                // Resize the ad view using the resolved Prebid creative size.
                adView.setAdSizes(AdSize(width, height))
            }

            override fun failure(error: PbFindSizeError) {
                // Size resolution may fail for a non-Prebid creative served by GAM,
                // or when size information cannot be extracted from a Prebid creative.
            }
        })
    }
}
```
