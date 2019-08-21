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

Functionally speaking the Prebid SDK resizes ad slots based on the [adViewDidReceiveAd event](https://developers.google.com/admob/ios/banner) (when an ad is recieved) to determine the winning Prehbid ad size to determine how to resize the ad slot.

### Util

Supported in Prebid SDK version 1.1.

```swift
func findPrebidCreativeSize(_ adView: UIView, completion: @escaping (CGSize?) -> Void)
```

Exmple:
```swift
func adViewDidReceiveAd(_ bannerView: GADBannerView) {
    print("adViewDidReceiveAd")
        
    Utils.shared.findPrebidCreativeSize(bannerView) { (size) in
        if let bannerView = bannerView as? DFPBannerView, let size = size {
            bannerView.resize(GADAdSizeFromCGSize(size))
        }
     }
}
```

### AdViewUtils

Improved `findPrebidCreativeSize` solution supported in Prebid SDK version 1.2+.


```swift
func findPrebidCreativeSize(_ adView: UIView, success: @escaping (CGSize) -> Void, failure: @escaping (Error) -> Void)
```

Examples:

Swift
```swift
func adViewDidReceiveAd(_ bannerView: GADBannerView) {

    AdViewUtils.findPrebidCreativeSize(bannerView,
                                            success: { (size) in
                                                guard let bannerView = bannerView as? DFPBannerView else {
                                                    return
                                                }

                                                bannerView.resize(GADAdSizeFromCGSize(size))

        },
                                            failure: { (error) in
                                                print("error: \(error)");

        })
}
```

Objective C
```objective_c
-(void) adViewDidReceiveAd:(GADBannerView *)bannerView {
    NSLog(@"Ad received");
    [AdViewUtils findPrebidCreativeSize:bannerView
                                   success:^(CGSize size) {
                                       if ([bannerView isKindOfClass:[DFPBannerView class]]) {
                                           DFPBannerView *dfpBannerView = (DFPBannerView *)bannerView;
                                           
                                           [dfpBannerView resize:GADAdSizeFromCGSize(size)];
                                       }
                                   } failure:^(NSError * _Nonnull error) {
                                       NSLog(@"error: %@", error);
                                   }];
}
```

