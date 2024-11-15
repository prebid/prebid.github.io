---
layout: page_v2
title: Prebid Mobile iOS - GAM Bidding-Only Integration
description: Integration of Prebid SDK iOS With Google Ad Manager using the 'Bidding-Only' integration
sidebarType: 2
---

# Prebid SDK iOS with the GAM Bidding-Only Integration Method
{:.no_toc}

- TOC
{:toc}

{% include mobile/intro-bidding-only.md platform='ios'%}

## AdUnit-Specific instructions

This section describes the integration details for different ad formats. In each scenario, you'll be asked for a `configId` - this is a key established in conjunction with your Prebid Server provider. It's used at runtime to pull in the bidders and parameters specific to this adunit. Depending on your Prebid Server partner, it may be a UUID or constructed out of parts like an account number and adunit name.

### [Format: HTML Banner](/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-html-banner.html)

### [Format: Interstitial Banner](/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-interstitial-banner.html)

### [Format: Instream Video](/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-video-instream.html)

### [Format: Non-Instream Video](/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-video-outstream.html)

### [Format: Interstitial Video](/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-interstitial-video.html)

### [Format: Rewarded Video Ad](/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-rewarded-video.html)

### [Format: Native In-App](/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-native-in-app.html)

### [Format: Native In-Webview](/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-native-in-webview.html)

### [Format: Multiformat (Banner+Video+InApp Native)](/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-multiformat.html)

### [Format: Multiformat Interstitial (Banner+Video)](/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-multiformat-interstitial.html)

## Additional Ad Unit Configuration

{% include mobile/adunit-config-ios.md %}

### Impression tracking

The SDK supports the native impression tracking. It triggers the `burl` impression URL. It tracks the visibility of view and trigger the event when the view is on the screen and at least 1x1 px in size.

For activation for the banner ad units you should use `fetchDemand()` with the ad view parameter (f.e. GAMBannerView):

```swift
adUnit.fetchDemand(adObject: gamRequest, adView: gamBanner) { [weak self] resultCode in
    // ...
}
```

For activation for the interstitial ad unit you should set `activatePrebidImpressionTracker` flag:

```swift
let adUnit = InterstitialAdUnit(configId: CONFIG_ID, minWidthPerc: WIDTH_PERC, minHeightPerc: HEIGTH_PERC)
adUnit.activatePrebidImpressionTracker = true
```

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK iOS integration](/prebid-mobile/pbm-api/ios/code-integration-ios.html)
- [Prebid SDK iOS Global Parameters](/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
