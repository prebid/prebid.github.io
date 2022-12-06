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

It is recommended all Google Ad Manager integrations resize all ads served based on the winning Prebid creative size `findPrebidCreativeSize`. Functionally speaking the Prebid SDK resizes ad slots based on the [adViewDidReceiveAd event](https://developers.google.com/admob/ios/banner) (when an ad is received) to determine the winning Prehbid ad size to determine how to resize the ad slot.

Usage example:

```swift
func bannerViewDidReceiveAd(_ bannerView: GADBannerView) {

    // Determine the kind of winning line item
    AdViewUtils.findPrebidCreativeSize(bannerView, success: { size in
        guard let bannerView = bannerView as? GAMBannerView else { return }
        
        // In the case of Prebid's line item - resize te ad view
        bannerView.resize(GADAdSizeFromCGSize(size))
    }, failure: { (error) in
        PrebidDemoLogger.shared.error("Error occuring during searching for Prebid creative size: \(error)")
    })
}
```



