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
Prebid SDK provides a function `findPrebidCreativeSize` to address a bug in the Google Ad Manager ad server (described [here](https://groups.google.com/forum/?utm_medium=email&utm_source=footer#!category-topic/google-admob-ads-sdk/ios/648jzAP2EQY)) where under certain situations ads fail to render. 

It is recommended all Google Ad Manager integrations resize all ads served based on the winning Prebid creative size `findPrebidCreativeSize`. Functionally speaking the Prebid SDK resizes ad slots based on the [onAdLoaded](https://developers.google.com/android/reference/com/google/android/gms/ads/AdListener.html#onAdLoaded()) (when an ad is received) to determine the winning Prehbid ad size to determine how to resize the ad slot.


{% include alerts/alert_note.html content="`findPrebidCreativeSize` is supported on Android API versions 19+. Using on earlier versions is safe to use, however the resizing would not function." %}

Usage example:

```kotlin
adView.adListener = object : AdListener() {
    override fun onAdLoaded() {
        super.onAdLoaded()

        // Determine the kind of winning line item
        AdViewUtils.findPrebidCreativeSize(adView, object : AdViewUtils.PbFindSizeListener {
            override fun success(width: Int, height: Int) {

                // In the case of Prebid's line item - resize te ad view
                adView.setAdSizes(AdSize(width, height))
            }

            override fun failure(error: PbFindSizeError) {}
        })
    }
}
```

