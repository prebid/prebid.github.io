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
Prebid created `findPrebidCreativeSize` to address a bug in the Google Ad Manager ad server (described [here](https://groups.google.com/forum/?utm_medium=email&utm_source=footer#!category-topic/google-admob-ads-sdk/ios/648jzAP2EQY)) where under certain situations ads fail to render. It is recommended all Google Ad Manager integrations resize all ads served based on the winning Prebid creative size `findPrebidCreativeSize`.

Functionally speaking a Google Ad Manager listener is created to listen for the [onAdLoaded](https://developers.google.com/android/reference/com/google/android/gms/ads/AdListener.html#onAdLoaded()) event (when an ad is recieved) to determine the winning Prehbid ad size to determine how to resize the ad slot.

{% include alerts/alert_note.html content="`findPrebidCreativeSize` is supported on Android API versions 19+. Using on earlier versions is safe to use, however the resizing would not function." %}

### Util

Supported in Prebid SDK version 1.1.2.

```java
void findPrebidCreativeSize(@Nullable View adView, final CreativeSizeCompletionHandler completionHandler)
```

Exmple:
```java
dfpAdView.setAdListener(new AdListener() {
    @Override
    public void onAdLoaded() {
        super.onAdLoaded();

        Util.findPrebidCreativeSize(dfpAdView, new Util.CreativeSizeCompletionHandler() {
            @Override
            public void onSize(final Util.CreativeSize size) {
                if (size != null) {
                    dfpAdView.setAdSizes(new AdSize(size.getWidth(), size.getHeight()));
                }
            }
        });
    }
});
```

### AdViewUtils

Improved `findPrebidCreativeSize` solution supported in Prebid SDK version 1.2+.


```java
void findPrebidCreativeSize(@Nullable View adView, final PbFindSizeListener handler)
```

Example:
```java
dfpAdView.setAdListener(new AdListener() {
    @Override
    public void onAdLoaded() {
        super.onAdLoaded();

        AdViewUtils.findPrebidCreativeSize(dfpAdView, new AdViewUtils.PbFindSizeListener() {
            @Override
            public void success(int width, int height) {
                dfpAdView.setAdSizes(new AdSize(width, height));
            }

            @Override
            public void failure(@NonNull PbFindSizeError error) {
                Log.d("MyTag", "error: " + error);
            }
        });

    }
});
```

