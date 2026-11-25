---
layout: page_v2
title: Prebid Mobile Flutter Integration
description: Integrate Prebid Mobile in Flutter applications on Android and iOS.
sidebarType: 2
---

# Prebid Mobile Flutter Integration
{:.no_toc}

The [Prebid Mobile Flutter plugin](https://github.com/prebid/prebid-mobile-flutter) provides a Flutter API for the native Prebid Mobile SDKs on Android and iOS. It supports two integration approaches:

- **Prebid Rendering:** Prebid runs the auction and renders the winning creative in the app.
- **Original API (Bidding-Only):** Prebid runs the auction and returns targeting keywords. The publisher passes those keywords to its ad server, which selects and renders the ad.

Choose Prebid Rendering when the app wants Prebid to manage ad rendering. Choose the Original API when the app already uses an ad server SDK and wants Prebid demand to compete in its ad server auction.

## Requirements

- Flutter and Dart versions supported by the selected plugin release. The current release requires Flutter 3.44 or later and Dart 3.12 or later.
- Android `minSdk` 24 or later.
- iOS deployment target 15.0 or later.
- A Prebid Server host and an impression-level stored request for each ad placement. The stored request ID is the `configId` used by the Flutter API.

See [Getting Started with Prebid Mobile](/prebid-mobile/prebid-mobile-getting-started.html) for information about Prebid Server accounts, account settings and stored requests.

## Install and initialize

Add the core package to the Flutter application:

```bash
flutter pub add prebid_mobile_sdk
```

Initialize Prebid once at application startup, and await initialization before loading ads:

```dart
import 'package:flutter/widgets.dart';
import 'package:prebid_mobile_sdk/prebid_mobile_sdk.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await PrebidMobile.initializeSdk(
    prebidServerUrl: 'https://YOUR_PREBID_SERVER/openrtb2/auction',
    accountId: 'YOUR_ACCOUNT_ID',
    completion: (status, error) {
      if (status != PrebidInitializationStatus.succeeded) {
        debugPrint('Prebid initialization: $status ($error)');
      }
    },
  );

  runApp(const PublisherApp());
}
```

Replace the URL and account ID with the values supplied by the Prebid Server host. If the host does not use an account ID, follow the configuration agreed with the host. Each ad placement must use the corresponding impression-level stored request ID as its `configId`.

## Prebid Rendering

With Prebid Rendering, the plugin requests demand and renders the winning creative. The publisher adds banner widgets to the widget tree and controls when fullscreen ads are loaded and shown.

### Banner

Add `PrebidBannerAd` where the banner should appear. Its width and height are in logical pixels and should match a size configured for the placement.

```dart
import 'package:flutter/foundation.dart';
import 'package:prebid_mobile_sdk/prebid_mobile_sdk.dart';

Widget buildBanner() {
  return PrebidBannerAd(
    configId: 'YOUR_BANNER_CONFIG_ID',
    width: 320,
    height: 50,
    listener: PrebidBannerAdListener(
      onAdLoaded: () => debugPrint('Banner loaded'),
      onAdFailed: (error) => debugPrint('Banner failed: $error'),
    ),
  );
}
```

The listener reports load, display, click, close and failure events. Banner auto-refresh is disabled by default; set `refreshIntervalSeconds` when automatic refresh is required.

### Interstitial

Create an interstitial, load it before the presentation point, and show it after `onAdLoaded` fires. Destroy it when it is no longer needed.

```dart
import 'package:flutter/foundation.dart';
import 'package:prebid_mobile_sdk/prebid_mobile_sdk.dart';

Future<void> loadInterstitial() async {
  late final PrebidInterstitialAd interstitial;
  interstitial = PrebidInterstitialAd(
    configId: 'YOUR_INTERSTITIAL_CONFIG_ID',
    listener: PrebidInterstitialAdListener(
      onAdLoaded: () => interstitial.show(),
      onAdFailed: (error) => debugPrint('Interstitial failed: $error'),
      onAdClosed: () => interstitial.destroy(),
    ),
  );

  await interstitial.loadAd();
}
```

## Original API (Bidding-Only)

The Original API runs the Prebid auction and returns a `PrebidBidResponse`. It does not render the ad. Pass `targetingKeywords` from the response to the ad server request, then let the ad server's SDK load and render the selected creative.

The following banner example uses Google Ad Manager through [`google_mobile_ads`](https://pub.dev/packages/google_mobile_ads):

```dart
import 'dart:ui' show Size;

import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:prebid_mobile_sdk/prebid_mobile_sdk.dart';

Future<AdManagerBannerAd> requestBanner() async {
  final unit = PrebidBannerAdUnit(
    configId: 'YOUR_BANNER_CONFIG_ID',
    sizes: const [Size(320, 50)],
  );

  final response = await unit.fetchDemand();
  final banner = AdManagerBannerAd(
    adUnitId: '/1234567/your-banner',
    sizes: [AdSize.banner],
    request: AdManagerAdRequest(
      customTargeting: response.targetingKeywords ?? const {},
    ),
    listener: AdManagerBannerAdListener(
      onAdLoaded: (_) => unit.activateImpressionTracker(),
      onAdFailedToLoad: (ad, error) => ad.dispose(),
    ),
  );

  await banner.load();
  return banner; // Display with AdWidget(ad: banner) in the widget tree.
}
```

Send the ad server request when `targetingKeywords` is empty or null as well, so other ad server demand can compete. `activateImpressionTracker()` enables Prebid to track an impression when its creative is rendered by the ad server. The Original API also provides `PrebidInterstitialAdUnit`; provide a display size and/or video parameters, call `fetchDemand()`, and pass the returned keywords to the ad server's interstitial request before loading it.

For more details about ad server handoff, see the [Original API guide](https://github.com/prebid/prebid-mobile-flutter/blob/main/docs/guides/original-api.md).

## Ad server integrations

The Flutter project also provides companion packages for common ad server integrations:

- [`prebid_mobile_sdk_gam`](https://pub.dev/packages/prebid_mobile_sdk_gam) integrates Google Ad Manager rendering through Prebid's GAM event handlers.
- [`prebid_mobile_sdk_admob`](https://pub.dev/packages/prebid_mobile_sdk_admob) integrates Prebid demand in the AdMob mediation waterfall.
- [`prebid_mobile_sdk_max`](https://pub.dev/packages/prebid_mobile_sdk_max) integrates Prebid demand with AppLovin MAX.

These packages provide ad server specific widgets and setup. Follow their package documentation for required native app IDs, ad server configuration and compatible SDK versions.

## Further reading

- [Prebid Mobile overview](/prebid-mobile/prebid-mobile.html)
- [Getting Started with Prebid Mobile](/prebid-mobile/prebid-mobile-getting-started.html)
- [Prebid Mobile Flutter source and examples](https://github.com/prebid/prebid-mobile-flutter)
