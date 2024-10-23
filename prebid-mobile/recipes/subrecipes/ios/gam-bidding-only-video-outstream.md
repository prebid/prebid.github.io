---
layout: page_v2
title: iOS GAM Bidding-Only Integration - Non-Instream Video
description: iOS GAM Bidding-Only Integration - Non-Instream Video
sidebarType: 2
---

# iOS GAM Bidding-Only Integration - Non-Instream Video

Back to [Bidding-Only Integration](/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html#adunit-specific-instructions)

{: .alert.alert-info :}
"Non-Instream" refers to the IAB video categories "Accompanying Content" and "Standalone". See [the IAB document](https://iabtechlab.com/industry-adoption-of-amended-iab-tech-lab-guidelines-is-vital-to-drive-change/) for more information.

Integration example:

``` swift
// 1. Create a BannerAdUnit
adUnit = BannerAdUnit(configId: CONFIG_ID, size: adSize)

// 2. Set ad format
adUnit.adFormats = [.video]

// 3. Configure video parameters
let parameters = VideoParameters(mimes: ["video/mp4"])
parameters.protocols = [Signals.Protocols.VAST_2_0]
parameters.playbackMethod = [Signals.PlaybackMethod.AutoPlaySoundOff]
parameters.placement = Signals.Placement.InBanner
adUnit.videoParameters = parameters

// 4. Create a GAMBannerView
gamBanner = GAMBannerView(adSize: GADAdSizeFromCGSize(adSize))
gamBanner.adUnitID = gamAdUnitVideoBannerOriginal
gamBanner.rootViewController = self
gamBanner.delegate = self

// Add GMA SDK banner view to the app UI
bannerView.addSubview(gamBanner)
bannerView.backgroundColor = .clear

// 5. Make a bid request to Prebid Server
let gamRequest = GAMRequest()
adUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
    PrebidDemoLogger.shared.info("Prebid demand fetch for GAM \(resultCode.name())")

    // 6. Load GAM Ad
    self?.gamBanner.load(gamRequest)
}
```

{: .alert.alert-warning :}
Starting from PrebidMobile `2.1.0` the `VideoAdUnit` class is deprecated. Use `BannerAdUnit` class with video ad format instead.

## Step 1: Create a BannerAdUnit
{:.no_toc}

Initialize the `BannerAdUnit` with the following properties:

- `configId` - an ID of the Stored Impression on the Prebid Server
- `adSize` - the size of the ad unit which will be used in the bid request.

## Step 2: Set ad format
{:.no_toc}

For video ad unit, you must set video ad format. Default value for `adFormats` property is `[.banner]`.

## Step 3: Configure the video parameters
{:.no_toc}

{% include mobile/video-params.md %}

## Step 4: Create a GAMBannerView
{:.no_toc}

Follow the [GMA SDK documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/banner) to integrate a banner ad unit.

## Step 5: Make a bid request
{:.no_toc}

The `fetchDemand` method makes a bid request to the Prebid Server. You should provide a `GAMRequest` object to this method so Prebid SDK sets the targeting keywords of the winning bid for future ad requests.

## Step 6: Load an Ad
{:.no_toc}

You should now request the ad from GAM. If the `GAMRequest` contains targeting keywords. The respective Prebid line item will be returned from GAM and GMA SDK will render its creative.

Be sure that you make the ad request with the same `GAMRequest` object that you passed to the `fetchDemand` method. Otherwise the ad request won't contain targeting keywords and Prebid's ad won't ever be displayed.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK iOS integration](/prebid-mobile/pbm-api/ios/code-integration-ios.html)
- [Prebid SDK Global Parameters - iOS](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
