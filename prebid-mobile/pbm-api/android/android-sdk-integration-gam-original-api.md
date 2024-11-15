---
layout: page_v2
title: Prebid Mobile - GAM Bidding-Only Integration - Android
description: Integration of Prebid SDK Android With Google Ad Manager using the 'Bidding-Only' integration
sidebarType: 2
---

# Prebid SDK Android with the GAM Bidding-Only Integration Method
{:.no_toc}

- TOC
{:toc}

{% include mobile/intro-bidding-only.md platform='android' %}

## AdUnit-Specific instructions

This section describes the integration details for different ad formats. In each scenario, you'll be asked for a `configId` - this is a key established in conjunction with your Prebid Server provider. It's used at runtime to pull in the bidders and parameters specific to this adunit. Depending on your Prebid Server partner, it may be a UUID or constructed out of parts like an account number and adunit name.

### [Format: HTML Banner](/prebid-mobile/recipes/subrecipes/android/gam-bidding-only-html-banner.html)

### [Format: Interstitial Banner](/prebid-mobile/recipes/subrecipes/android/gam-bidding-only-interstitial-banner.html)

### [Format: Instream Video](/prebid-mobile/recipes/subrecipes/android/gam-bidding-only-video-instream.html)

### [Format: Non-Instream Video](/prebid-mobile/recipes/subrecipes/android/gam-bidding-only-video-outstream.html)

### [Format: Interstitial Video](/prebid-mobile/recipes/subrecipes/android/gam-bidding-only-interstitial-video.html)

### [Format: Rewarded Video Ad](/prebid-mobile/recipes/subrecipes/android/gam-bidding-only-rewarded-video.html)

### [Format: Native In-App](/prebid-mobile/recipes/subrecipes/android/gam-bidding-only-native-in-app.html)

### [Format: Native In-Webview](/prebid-mobile/recipes/subrecipes/android/gam-bidding-only-native-in-webview.html)

### [Format: Multiformat (Banner+Video+InApp Native)](/prebid-mobile/recipes/subrecipes/android/gam-bidding-only-multiformat.html)

### [Format: Multiformat Interstitial (Banner+Video)](/prebid-mobile/recipes/subrecipes/android/gam-bidding-only-multiformat-interstitial.html)

## Additional Ad Unit Configuration

{% include mobile/adunit-config-android.md %}

### Impression tracking

The SDK supports the native impression tracking. It triggers the `burl` impression URL. It tracks the visibility of view and trigger the event when the view is on the screen and at least 1x1 px in size.

For activation for the banner ad units you should use `fetchDemand()` with the ad view parameter (f.e. AdManagerAdView):

```java
adUnit.fetchDemand(builder, adView, resultCode -> { ... })
```

For activation for the interstitial ad unit you should set `activatePrebidImpressionTracker()` flag:

```java
Interstitial adUnit = InterstitialAdUnit(CONFIG_ID, WIDTH, HEIGTH);
adUnit.activatePrebidImpressionTracker(true);
```

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Prebid SDK Android Integration](/prebid-mobile/pbm-api/android/code-integration-android.html)
- [Prebid SDK Android Global Parameters](/prebid-mobile/pbm-api/android/pbm-targeting-android.html)
