---
layout: page_v2
title: Plugin Renderer - iOS
description: Guide to implement a Plugin Renderer
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# Prebid Plugin Renderer
{:.no_toc}

* TOC
{:toc}

## Overview
Plugin Renderer is a feature that enables the ability to delegate the ad rendering to a component of yours. Such feature turn possible, for instance, the rendering of non-standard ad responses that Prebid Mobile SDK can not render by itself. This integration require from you, in first place, to have a Bidder Adapter implemented in order to handle bid requests from the Prebid Mobile SDK that include your Plugin Renderer.

![Plugin Renderer big picture](/assets/images/prebid-mobile/prebid-plugin-renderer.png)

### Ad view transposing

Everytime that a bid response is received and it reaches the rendering stage, Prebid SDK will delegate the ad view rendering to an existing Plugin Renderer, such as a custom one if this is elected or the default one in any other case.

Take the example on the image below where a BannerView will have its ad view transposed accordingly to the Plugin Renderer status. The inner ad view is handled totally under the hood from the app owner point of view, what makes unnecessary any change on the BannerView loading or initialization.

{: .alert.alert-info :}
In case of Interstitial ad this is just inflated in the foreground regardless the view hierarchy.

![Plugin Renderer big picture](/assets/images/prebid-mobile/prebid-plugin-renderer-ad-view-injection.png)

### Setup

* Provide your Prebid Bidder Adapter
  * [Go integration](/prebid-server/developers/add-new-bidder-go.html)
  * [Java integration](/prebid-server/developers/add-new-bidder-java.html)
* Create your implementation from the interface `PrebidMobilePluginRenderer`
* Initialise your Plugin Renderer before starting to request ads
* Take advantage of the Plugin Renderer fields

{: .alert.alert-info :}
Please notice that all implementation on mobile related to the Plugin Renderer should be provided externally, not in the PBM SDK itself. For instance, an app owner or third party SDK would implement it and initialise it on their own context.

___

#### Create your implementation from the interface PrebidMobilePluginRenderer

```swift
public class SampleCustomRenderer: NSObject, PrebidMobilePluginRenderer {
    
    public let name = "SampleCustomRenderer"
    
    public let version = "1.0.0"
    
    public var data: [AnyHashable: Any]? = nil
    
    private var adViewManager: PBMAdViewManager?
    
    public func isSupportRendering(for format: AdFormat?) -> Bool {}
   
    public func setupBid(_ bid: Bid, adConfiguration: AdUnitConfig, connection: PrebidServerConnectionProtocol) {}
    
    public func createBannerAdView(with frame: CGRect, bid: Bid, adConfiguration: AdUnitConfig,
                                   connection: PrebidServerConnectionProtocol, adViewDelegate: (any PBMAdViewDelegate)?) {
        // TODO "Handle bid response as you want and display your banner ad"
    }

    public func createInterstitialController(bid: Bid, adConfiguration: AdUnitConfig, connection: PrebidServerConnectionProtocol,
                                             adViewManagerDelegate adViewDelegate: InterstitialController?, videoControlsConfig: VideoControlsConfiguration?) {
        // TODO "Handle bid response as you want and display your interstitial ad"
    }
}

```

#### Initialise your Plugin Renderer before starting to request ads and unregister your plugin once it is done

```swift
class CustomRendererBannerController: NSObject, AdaptedController, PrebidConfigurableBannerController, BannerViewDelegate {
    
    required init(rootController: AdapterViewController) {
        super.init()
        self.rootController = rootController
        Prebid.registerPluginRenderer(sampleCustomRenderer)
        setupAdapterController()
    }
    
    deinit {
        Prebid.unregisterPluginRenderer(sampleCustomRenderer)
    }
}
```

## Limitations

### Supported Ad Formats
Currently the interface `PrebidMobilePluginRenderer` provide the ability to render `BANNER` and `INTERSTITIAL` only. The compability with more ad formats can be supported in future releases.

It is important to notice that the compliant formats you set on `isSupportRenderingFor` implementation are taken into account to add your Plugin Renderer to the bid request or not, according to the ad unit configuration that is bid requesting.

### Original API

The Plugin Renderer feature does not work with [GAM Original API](/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.html) since the ad rendering does not happen in the Prebid SDK but externally. Despite that if you are using the regular GAM integration it will work fine.

## Ad Event Listeners
An optional dedicated generic ad event listener is offered in case of the existing event listeners are insufficient to keep your ad consumer fully aware of your ad lifecycle.

![Plugin Event Listener big picture](/assets/images/prebid-mobile/prebid-plugin-renderer-event-listeners.png)

### Setup

* Create your implementation from the interface `PluginEventListener`
* Handle your plugin event listener on your Plugin Renderer
* Implement the interface on the class you want to listen the events
* Set your listener on your `BannerView` instance or `InterstitialAdUnit` instance

___

#### Create your implementation from the interface PluginEventListener

```swift
@objc class SampleCustomRendererEventDelegate: NSObject, PluginEventDelegate {
    func getPluginName() -> String {
        return "SamplePluginRenderer"
    }
    
    func onImpression() {
        // TODO on impressions
    }
}

```

#### Handle your plugin event listener on your Plugin Renderer

```swift
public class SampleCustomRenderer: NSObject, PrebidMobilePluginRenderer {
    
    // Store your listeners
    private var pluginEventListenerMap = [String: SampleCustomRendererEventListener]()

    public let name = "SampleCustomRenderer"
    
    public let version = "1.0.0"
    
    public var data: [AnyHashable: Any]? = nil
    
    private var adViewManager: PBMAdViewManager?
    
    public func isSupportRendering(for format: AdFormat?) -> Bool {}
   
    public func registerEventDelegate(pluginEventDelegate: any PluginEventDelegate, adUnitConfigFingerprint: String) {
        //TODO register event from list
    }
    
    public func unregisterEventDelegate(pluginEventDelegate: any PluginEventDelegate, adUnitConfigFingerprint: String) {
        //TODO unregister from list
    }

    public func setupBid(_ bid: Bid, adConfiguration: AdUnitConfig, connection: PrebidServerConnectionProtocol) {}
    
    public func createBannerAdView(with frame: CGRect, bid: Bid, adConfiguration: AdUnitConfig,
                                   connection: PrebidServerConnectionProtocol, adViewDelegate: (any PBMAdViewDelegate)?) {
    }

    public func createInterstitialController(bid: Bid, adConfiguration: AdUnitConfig, connection: PrebidServerConnectionProtocol,
                                             adViewManagerDelegate adViewDelegate: InterstitialController?, videoControlsConfig: VideoControlsConfiguration?) {
    }
}
```

## Resources

In addition to this documentation you have samples on hand which can be get from the Prebid Mobile SDK repository:

* [PrebidMobilePluginRenderer](https://github.com/prebid/prebid-mobile-ios/blob/master/PrebidMobile/PrebidMobileRendering/PluginRenderer/PrebidMobilePluginRenderer.swift)
* [PluginEventDelegate](https://github.com/prebid/prebid-mobile-ios/blob/master/PrebidMobile/PrebidMobileRendering/PluginRenderer/PluginEventListener.swift)

___

## Plugin Renderer providers

The following list contains documentation for known supported Plugin Renderer providers.

{: .table .table-bordered .table-striped }

| Company | Documentation                                                                                 |
|-------|-----------------------------------------------------------------------------------------------|
<!-- | Teads | [Teads Plugin Renderer Docs](https://support.teads.tv/support/solutions/articles/36000459747) | -->
