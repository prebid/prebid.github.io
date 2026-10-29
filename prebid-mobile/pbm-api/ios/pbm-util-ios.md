---
layout: page_v2
title: Prebid SDK Utilities - iOS
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

For GAM banner integrations, call `findPrebidCreativeSize` from [`bannerViewDidReceiveAd`](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/banner) after each successful banner load. The utility searches the creative’s HTML for Prebid size information. If found, use the success callback to resize the ad view accordingly. Size resolution may fail when GAM serves a non-Prebid creative or when the required size information cannot be extracted from a Prebid creative. The failure callback does not distinguish between these cases; leave the ad view’s current size unchanged.

Usage example:

{% capture gma12 %}
func bannerViewDidReceiveAd(_ bannerView: GoogleMobileAds.BannerView) {
    AdViewUtils.findPrebidCreativeSize(bannerView, success: { size in
        guard let bannerView = bannerView as? AdManagerBannerView else { return }

        // Resize the ad view using the resolved Prebid creative size.
        bannerView.resize(adSizeFor(cgSize: size))
    }, failure: { error in
        // Size resolution may fail for a non-Prebid creative served by GAM,
        // or when size information cannot be extracted from a Prebid creative.
    })
}
{% endcapture %}
{% capture gma11 %}func bannerViewDidReceiveAd(_ bannerView: GADBannerView) {

    AdViewUtils.findPrebidCreativeSize(bannerView, success: { size in
        guard let bannerView = bannerView as? GAMBannerView else { return }
        
        // Resize the ad view using the resolved Prebid creative size.
        bannerView.resize(GADAdSizeFromCGSize(size))
    }, failure: { error in
        // Size resolution may fail for a non-Prebid creative served by GAM,
        // or when size information cannot be extracted from a Prebid creative.
    })
}
{% endcapture %}

{% include code/gma-versions-tabs.html id="pbm-utils" gma11=gma11 gma12=gma12 %}
