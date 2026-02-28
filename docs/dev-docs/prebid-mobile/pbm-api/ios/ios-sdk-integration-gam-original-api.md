---
title: Prebid Mobile iOS - GAM Bidding-Only Integration
description: Integration of Prebid SDK iOS With Google Ad Manager using the 'Bidding-Only' integration
---

# Prebid SDK iOS with the GAM Bidding-Only Integration Method

## Overview

This how-to guide covers the original approach for integrating the Prebid SDK into your app with the GMA SDK. It utilizes:

- **Prebid SDK** and **Prebid server** to handle the bidding and auction process.
- **GAM** and the **Google Mobile Ads (GMA) SDK** manage the ad inventory and select the winning ad to display.
- **Prebid Universal Creative** renders display ads when a Prebid bid wins.
- **GMA SDK** renders banner and non-instream ads when a Prebid bid wins.
- **GMA IMA SDK** renders instream ads when a Prebid bid wins.

If you do not have GMA SDK in the app, refer to the [Google Integration Documentation](https://developers.google.com/ad-manager/mobile-ads-sdk/ios/quick-start).

### Alternative Approaches

Another way to integrate GAM into your app is with the [Prebid-Rendered Integration](/dev-docs/prebid-mobile/modules/rendering/ios-sdk-integration-gam).

Tradeoffs between these integration approaches:

| Aspect | Bidding-Only Integration | Prebid-Rendered Integration |
| --- |:---:|:---:|
| App code has direct access to bids | ![check](/images/icons/icon-check-green.png) | |
| Support for MRAID 3.0 | | ![check](/images/icons/icon-check-green.png) |
| Support for SKAdnetwork | | ![check](/images/icons/icon-check-green.png) |
| Loads data from Prebid Cache | ![check](/images/icons/icon-check-green.png) | |
| Supports instream video | ![check](/images/icons/icon-check-green.png) | |
| Triggers billing and Notice URLs | ![check](/images/icons/icon-check-green.png) | |
| Supports Third Party Rendering libraries | | ![check](/images/icons/icon-check-green.png) |

**Notes:**

- On one hand, using Prebid Cache reduces the amount of data that must be sent to the mobile device -- the body of the creative does not need to be transmitted for bids. On the other hand, though, when a bid wins in the ad server, the body of the creative must be retrieved from the cache.
- It is possible to mix-and-match implementations within an app. e.g. you could implement instream video with the Bidding-Only approach and other adunits with Prebid-Rendered.

### Prerequisites

The GAM Bidding-Only Integration method assumes that you have the following components:

- **Google Ad Manager Account** - A GAM account allows you to manage and serve ads within your mobile app. Within this account you'll need to configure your inventory and create orders for serving ads within your app. This involves defining ad units (spaces within your app where ads will be displayed) and setting up orders and line items to deliver ads to those units. See [Prebid's AdOps Guide](/adops/before-you-start) for more information.
- **Google Mobile Ads (GMA) SDK** - This refers to the software development kit provided by Google. You need to ensure that you have the latest version of the GMA SDK supported by Prebid SDK. This SDK integration is necessary to communicate with the ad server and display ads in your app.
- **Prebid SDK** - You will need the latest version of the Prebid Mobile SDK for either [Android](/dev-docs/prebid-mobile/pbm-api/android/code-integration-android) or [iOS](/dev-docs/prebid-mobile/pbm-api/ios/code-integration-ios).
- **Prebid Universal Creative** - This needs to be hosted on a CDN and loaded from the creative in GAM as detailed in the [AdOps GAM creative reference](/adops/gam-creative-banner-sbs#prebid-universal-creative).
- **Prebid Server** - You will need a cluster of servers running [Prebid Server](/prebid-server/use-cases/pbs-sdk). You can set up your own Prebid Server or work with a [Prebid Server managed service](https://prebid.org/managed-services/). Prebid Server provides you with the following:
  - Configuration storage - rather than hardcoding all the details of your current business arrangements in the app, Prebid Server stores which bidders you're currently working with, their inventory details, and other settings that can be changed without updating your app.
  - Server-side auction - the server will make the connections to multiple auction bidding partners so the app doesn't have to.
  - Creative caching - Prebid Cache stores the creatives until the app needs to render them, reducing the auction response bandwidth.
  - Privacy regulation tools - the server can help your legal team meet different regulatory needs in different jurisdictions by configuring various protocols and anonyimization activities.

## How it Works

Here's how the ad bidding-auction-rendering process works in this integration scenario.

![GAM Bidding Only Integration Details](/images/prebid-mobile/mobile-details-gam-bidding-only.png)

1. Prebid SDK calls Prebid Server which supplies one or more bids.
1. PBSDK adds targeting values to GMA SDK.
1. GMA SDK calls GAM, which makes the ad decision.
1. If a 3rd party HTML creative is chosen (banner or interstitial):
    1. GMA SDK writes the HTML to a webview, loading the Prebid Universal Creative (PUC).
    1. The PUC loads the winning creative from Prebid Cache.
    1. The PUC writes this creative into an iframe and hits all the tracking strings: Prebid win URL, billing url (burl), and notice url (nurl).
        1. If MRAID is available, it is used to consider the view state before hitting the burl.
1. If a video VastUrl creative is chosen:
    1. The GMA SDK uses the platform video player which loads the VAST from Prebid Cache.
    1. It then starts playing the VAST, hitting the embedded Impression tags when appropriate.
1. If an In-App Native format is chosen:
    1. GMA SDK delegates the rendering of native to the App and PBSDK when a special signal is specified.
    1. The app code gets the native assets from PBSDK. The app is coded to render the ad.
        1. PBSDK fires the eventtrackers when appropriate.
        1. The PBS win event is fired.
1. The GMA SDK handles Open Measurement SDK interactions.

## Major Integration Steps

Assuming your app already has AdUnits integrated with the GMA SDK, the technical implementation of Prebid mobile into your app will involve these major steps:

1. [Initialize the Prebid SDK](/dev-docs/prebid-mobile/pbm-api/ios/code-integration-ios) - create a connection to your Prebid Server.
2. [Set Global Parameters](/dev-docs/prebid-mobile/pbm-api/ios/pbm-targeting-ios) - let bidders know important data about the page, privacy consent, and other settings.
3. Work with your Prebid Server team to create the adunit configIds that will be used in the app.
4. Set up GAM orders, line items, and creatives. See [AdOps guidance](#ad-operations-guidance)
5. Link Prebid AdUnit code to your GMA AdUnits - for any adunits that your business team wants to connect to Prebid with the configIds generated in Step 3. See the [adunit-specific instructions](#adunit-specific-instructions) below.

## Ad Operations Guidance

The Ad Operations team will need to create line items in GAM. The creatives used depend on which media formats your adunits utilize.

| AdUnit Format | Line Item Targeting | Creative Type | Prebid Cache? | Ad Ops Details |
| --- | --- | --- | --- | --- |
| HTML banner, interstitial banner | hb_pb<br />hb_format=banner | 3rd party HTML that loads the [PUC](/overview/prebid-universal-creative) | yes | [link](/adops/gam-creative-banner-sbs) |
| Video (instream, non-instream, interstitial) | hb_pb<br />hb_format=video<br />inventoryType in (instream, mobile app) | VastUrl pointing to Prebid Cache | yes | [link](/adops/setting-up-prebid-video-in-dfp) |
| Rewarded Video | hb_pb<br />hb_format=video<br />inventoryType in (instream, mobile app)<br />rewarded adunits | VastUrl pointing to Prebid Cache | yes | [link](/adops/setting-up-prebid-video-in-dfp) |
| In-app native | hb_pb<br />hb_format=native | GAM native | no | [link](/adops/gam-native#create-a-new-native-creative) |
| In-Webview native | hb_pb<br />hb_format=native | 3rd party HTML that loads the native-trk script. | yes | [link](/adops/gam-native) |

Notes:

- You may need up to 4 sets of line items to support Prebid Mobile depending on adunit types. If you also run Prebid.js or AMP, please see [line item considerations](/adops/line-item-creation) for more information.
- Discuss the Prebid Cache column with the Prebid Server team. They can set up the "top-level stored request" for your account to cache or not cache requests as needed.

### Rendering and Tracking

This information may be useful when comparing data across various reporting systems:

| Scenario | PUC | VastUrl Creative | GAM Native Creative |
| --- | --- | --- | --- |
| Rendering Method | PUC in iframe | GMA SDK player | App code with data from PBSDK |
| Fires Prebid win event | always | never | always |
| Fires Prebid imp event | never | VAST impression tag | never |
| Fires OpenRTB burl | when in view | n/a | never (1) |
| Fires OpenRTB nurl | always |  n/a | always |
| Fires OpenMeasurement events | GMA SDK |  n/a | PB SDK |

Notes:

1. OpenRTB burl and nurl will be utilized in a future release.

## AdUnit-Specific instructions

This section describes the integration details for different ad formats. In each scenario, you'll be asked for a `configId` - this is a key established in conjunction with your Prebid Server provider. It's used at runtime to pull in the bidders and parameters specific to this adunit. Depending on your Prebid Server partner, it may be a UUID or constructed out of parts like an account number and adunit name.

### [Format: HTML Banner](/dev-docs/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-html-banner)

### [Format: Interstitial Banner](/dev-docs/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-interstitial-banner)

### [Format: Instream Video](/dev-docs/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-video-instream)

### [Format: Non-Instream Video](/dev-docs/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-video-outstream)

### [Format: Interstitial Video](/dev-docs/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-interstitial-video)

### [Format: Rewarded Video Ad](/dev-docs/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-rewarded-video)

### [Format: Native In-App](/dev-docs/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-native-in-app)

### [Format: Native In-Webview](/dev-docs/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-native-in-webview)

### [Format: Multiformat (Banner+Video+InApp Native)](/dev-docs/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-multiformat)

### [Format: Multiformat Interstitial (Banner+Video)](/dev-docs/prebid-mobile/recipes/subrecipes/ios/gam-bidding-only-multiformat-interstitial)

## Additional Ad Unit Configuration

Each ad unit in the original integration method is a subclass of the `AdUnit` class, which provides the following properties and methods for the additional configuration.

### Arbitrary OpenRTB

(requires SDK v2.3.1)

Prebid SDK allows the customization of the OpenRTB request on the ad unit level using the `setImpORTBConfig()` function:

``` swift
adUnit.setImpORTBConfig("{\"bidfloor\":0.01,\"banner\":{\"battr\":[1,2,3,4]}}")
```

The parameter passed to `setImpORTBConfig()` will be merged into the respective `imp` object for this Ad Unit. For instance, the above example will add the `$.imp[0].bidfloor` and `$.imp[0].banner.battr` parameters to the bid request.

To empty out a previously provided impression config, just set it to the empty string:

``` swift
adUnit.setImpORTBConfig("")
```

### Autorefresh

#### setAutoRefreshMillis

If set on a given banner ad unit, the `fetchDemand` function will be called every `periodMillis` until `stopAutoRefresh` is called. Each call to `fetchDemand` will invoke the `onComplete` function. This refresh only pertains to Prebid Mobile and not to any ad server refresh processes. It is suggested that the adServes refresh be turned off.

#### stopAutoRefresh

Halts the auto-refresh behavior for a given Prebid Mobile ad unit. If no auto-refresh behavior has been set, `stopAutoRefresh` will be ignored.

#### resumeAutoRefresh

Resumes a stopped autorefresh for the ad unit with the previously-defined autorefresh value.

### GPID

(requires SDK v2.1.6)

The Global Placement ID (GPID) is a key that uniquely identifies a specific instance of an adunit. Some bidders require this value. An important scenario is "infinite scroll" -- if your app creates instances
of an adunit dynamically as the user scrolls through content, the the GPID must be different for each by appending some kind of sequence or ID. e.g. "/newsfeed#7"

Using the following method, you can set the impression-level [GPID](https://docs.prebid.org/features/pbAdSlot.html#the-gpid) value to the bid request:

``` swift
adUnit.setGPID("/36117602/hnp-sfgate.com/Homepage/AP300")
```

### Ad Position

The `adPosition` property allows developers to specify the position of the ad within the publisher's content. This property maps to the `pos` field in the OpenRTB specification under the `imp[].banner` or `imp[].video` objects, depending on the ad format. The possible values for this field could be found in the [respective specification](https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/main/AdCOM%20v1.0%20FINAL.md#list--placement-positions-).

You can set `adPosition` by using the following property:

```swift
adUnit.adPosition = .footer
```

### Native Impression Tracking

The SDK offers an API that enables impression tracking for the following ad unit types: `BannerAdUnit`, `InterstitialAdUnit`, and `PrebidAdUnit`. An example implementation is provided below:

`BannerAdUnit`:

```swift
let adUnit = BannerAdUnit(configId: CONFIG_ID, size: AD_SIZE)
let gamBanner = GAMBannerView(adSize: GADAdSizeFromCGSize(AD_SIZE))
adUnit.activatePrebidImpressionTracker(adView: gamBanner)
```

`InterstitialAdUnit`:

```swift
let adUnit = InterstitialAdUnit(configId: CONFIG_ID, minWidthPerc: 50, minHeightPerc: 70)
adUnit.activatePrebidImpressionTracker()
```

`PrebidAdUnit`:

```swift
let adUnit = PrebidAdUnit(configId: CONFIG_ID)

// Use this method for intersitials
adUnit.activatePrebidInterstitialImpressionTracker()

// Use this method for banners
let gamBanner = GAMBannerView(adSize: GADAdSizeFromCGSize(AD_SIZE))
adUnit.activatePrebidAdViewImpressionTracker(adView: gamBanner)
```

**NOTE**: The SDK support only `seatbid[].bid[].burl` as impression tracking URL for now.

### SKAdNetwork

The SDK supports two SKAdNetwork methods for ad networks to deliver ads in a bidding-only scenario, specifically for **banner** and **native** ad formats:

- View-through ads
- StoreKit-rendered ads

Both methods are automatically enabled for the **native** ad format, with no additional configuration required. The support of view-through ads is also automatically enabled for the **banner** ad format. However, in order to activate StoreKit-rendered ads flow, you must call a method appropriate to the case:

`BannerAdUnit`:

```swift
let gamBanner = GAMBannerView(adSize: GADAdSizeFromCGSize(AD_SIZE))
adUnit.activatePrebidSKAdNetworkStoreKitAdsFlow(adView: gamBanner)
```

`InterstitialAdUnit`:

```swift
adUnit.activatePrebidSKAdNetworkStoreKitAdsFlow()
```

`PrebidAdUnit`:

```swift
let adUnit = PrebidAdUnit(configId: CONFIG_ID)

// Use this method for intersitials
adUnit.activatePrebidInterstitialSKAdNetworkStoreKitAdsFlow()

// Use this method for banners
let gamBanner = GAMBannerView(adSize: GADAdSizeFromCGSize(AD_SIZE))
adUnit.activatePrebidBannerSKAdNetworkStoreKitAdsFlow(adView: gamBanner)
```

#### SKOverlay

The SDK also provides support of SKOverlay for interstitials. In order to activate it, set `supportSKOverlay` to `true`:

```swift
adUnit.supportSKOverlay = true
```

You should also call the method below when you are about to show the ad:

```swift
// Present SKOverlay if available
adUnit.activateSKOverlayIfAvailable()
// Present the interstitial
gamInterstitial.present(from: controller)
```

In order to dismiss SKOverlay, use the method below:

```swift
adUnit.dismissSKOverlayIfAvailable()
```

### Impression tracking

In the Bidding Only integration scenario, PUC is responsible for tracking events for banner ads, like `burl`, `imp`, and `win`. The disadvantage of this approach is that PUC doesn't have reliable information about the viewability of the WebView. As a result, impression tracking happens at the rendering stage of the ad. Or, if MRAID is supported, once the `viewableChange` event is fired. It leads to big discrepancies since the "1 pixel in view" requirement is not met.

Starting with version `2.4.0`, Prebid SDK introduced the API to track the viewability of the ad and track impression event, respectively. 

To activate impression tracking for the banner ad unit - use the `activatePrebidImpressionTracker(adView)` method. The `adView` parameter should be an instance of AdManagerAdView:

```swift
adUnit.activatePrebidImpressionTracker(adView: gamBanner)
adUnit.fetchDemand(adObject: gamRequest) { [weak self] resultCode in
    // ...
}
```

For activation for the interstitial ad unit, you should set `activatePrebidImpressionTracker()` flag:

```swift
let adUnit = InterstitialAdUnit(configId: CONFIG_ID, minWidthPerc: WIDTH_PERC, minHeightPerc: HEIGTH_PERC)
adUnit.activatePrebidImpressionTracker()
```

After the invocation of `activatePrebidImpressionTracker(),` the Prebid SDK will start analyzing the View Hierarchy and track the viewability of the ad view. Once the ad view is viewable for the user for at least 1 pixel for 1 second, the SDK will track an impression event for the presented ad. The SDK will stop analyzing the View Hierarchy once the caller object of `activatePrebidImpressionTracker()` is destroyed. 

## Further Reading

- [Prebid Mobile Overview](/dev-docs/prebid-mobile/prebid-mobile)
- [Prebid SDK iOS integration](/dev-docs/prebid-mobile/pbm-api/ios/code-integration-ios)
- [Prebid SDK iOS Global Parameters](/dev-docs/prebid-mobile/pbm-api/ios/pbm-targeting-ios)
