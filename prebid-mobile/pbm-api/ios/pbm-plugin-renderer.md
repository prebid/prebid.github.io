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

#### Create your implementation of the `PrebidMobilePluginRenderer`

The `PrebidMobilePluginRenderer` protocol is designed to provide a standardized way for developers to implement custom ad rendering solutions within the Prebid Mobile framework. It provides a unified interface for managing ad rendering, event handling, and metadata integration. 

Below is the sample implementation of the renderer:

```swift
public class SampleRenderer: NSObject, PrebidMobilePluginRenderer {
    
    public let name = "SampleRenderer"
    public let version = "1.0.0"
    public var data: [String: Any]?
    
    /// This method creates an instance of `SampleAdView`, which is a custom view used to display the ad. 
    public func createBannerView(
        with frame: CGRect,
        bid: Bid,
        adConfiguration: AdUnitConfig,
        loadingDelegate: DisplayViewLoadingDelegate,
        interactionDelegate: DisplayViewInteractionDelegate
    ) -> (UIView & PrebidMobileDisplayViewProtocol)? {
        let adView = SampleAdView(frame: frame)
        
        adView.interactionDelegate = interactionDelegate
        adView.loadingDelegate = loadingDelegate
        adView.bid = bid
        
        return adView
    }
    
    /// This method creates an instance of `SampleInterstitialController`,
    /// a custom controller used to display interstitial ads.
    public func createInterstitialController(
        bid: Bid,
        adConfiguration: AdUnitConfig,
        loadingDelegate: InterstitialControllerLoadingDelegate,
        interactionDelegate: InterstitialControllerInteractionDelegate
    ) -> PrebidMobileInterstitialControllerProtocol? {
        let interstitialController = SampleInterstitialController()
        
        interstitialController.loadingDelegate = loadingDelegate
        interstitialController.interactionDelegate = interactionDelegate
        interstitialController.bid = bid
        
        return interstitialController
    }
}

class SampleAdView: UIView, PrebidMobileDisplayViewProtocol {
    
    weak var interactionDelegate: DisplayViewInteractionDelegate?
    weak var loadingDelegate: DisplayViewLoadingDelegate?
    
    var bid: Bid?

    // ...
    // Setup view
    // ...
    
    func loadAd() {
        DispatchQueue.main.async {
            if let adm = self.bid?.adm {
                self.webView.loadHTMLString(adm, baseURL: nil)
                self.loadingDelegate?.displayViewDidLoadAd(self)
            } else {
                self.loadingDelegate?.displayView(self, didFailWithError: SampleError.noAdm)
            }
        }
    }
}

class SampleInterstitialController: NSObject, PrebidMobileInterstitialControllerProtocol {
    
    weak var loadingDelegate: InterstitialControllerLoadingDelegate?
    weak var interactionDelegate: InterstitialControllerInteractionDelegate?
    
    var bid: Bid?

    // ...
    // Setup view
    // ...

    func loadAd() {
        DispatchQueue.main.async {
            guard let adm = self.bid?.adm else {
                self.loadingDelegate?.interstitialController(self, didFailWithError: SampleError.noAdm)
                return
            }
            
            self.webView.loadHTMLString(adm, baseURL: nil)
            self.loadingDelegate?.interstitialControllerDidLoadAd(self)
        }
    }
    
    func show() {
        DispatchQueue.main.async {
            guard let presentingController = UIApplication.shared.topViewController else {
                self.loadingDelegate?.interstitialController(
                    self,
                    didFailWithError: SampleError.noAvailableController
                )
                return
            }
            
            presentingController.present(
                self.interstitialViewController,
                animated: true
            )
        }
    }
}
```

#### Global Initialization of Plugin Renderer

It is recommended to register your Plugin Renderer globally during the app launch, right after the Prebid SDK initialization. This way, you avoid registering the plugin in each part of the app where it is needed.

For example, in your `AppDelegate`:

```swift
import PrebidMobile

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    let sampleCustomRenderer = SampleRenderer()

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Initialize the Prebid SDK
        Prebid.shared.initializeSDK()

        // Register the Plugin Renderer globally
        Prebid.registerPluginRenderer(sampleCustomRenderer)
        
        return true
    }
}
```

Don't forget to unregister the plugin when it's no longer needed:

```swift
func applicationWillTerminate(_ application: UIApplication) {
    Prebid.unregisterPluginRenderer(sampleCustomRenderer)
}
```

#### Controller-Level Registration (for specific use cases)

If you need to handle plugin registration in a specific view or controller for more granular control, you can still register the Plugin Renderer at that level:

```swift
class CustomRendererBannerController: UIViewController {
    
    override init() {
        super.init()
        Prebid.registerPluginRenderer(sampleCustomRenderer)
    }
    
    deinit {
        Prebid.unregisterPluginRenderer(sampleCustomRenderer)
    }
}
```

## Limitations

### Supported Ad Formats

Currently the interface `PrebidMobilePluginRenderer` provides the ability to render `BANNER` and `INTERSTITIAL` only. The compability with more ad formats can be supported in future releases.

### Original API

The Plugin Renderer feature does not work with [GAM Original API](/prebid-mobile/pbm-api/ios/ios-sdk-integration-gam-original-api.html) since the ad rendering does not happen in the Prebid SDK but externally. Despite that if you are using the regular GAM integration it will work fine.

## Ad Event Listeners

An optional dedicated generic ad event listener is offered in case of the existing event listeners are insufficient to keep your ad consumer fully aware of your ad lifecycle.

![Plugin Event Listener big picture](/assets/images/prebid-mobile/prebid-plugin-renderer-event-listeners.png)

### Setup

* Create your implementation from the interface `PluginEventDelegate`
* Handle your plugin event listener on your Plugin Renderer
* Implement the interface on the class you want to listen the events
* Set your listener on your `BannerView` instance or `InterstitialAdUnit` instance

___

#### Create your implementation from the interface PluginEventDelegate

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

#### Handle your plugin event delegate on your Plugin Renderer

```swift
public class SampleRenderer: NSObject, PrebidMobilePluginRenderer {
    
    // Store your listeners
    private var pluginEventDelegateMap = [String: SampleCustomRendererEventDelegate]()

    public let name = "SampleRenderer"
    public let version = "1.0.0"
    public var data: [AnyHashable: Any]? = nil
   
    public func registerEventDelegate(pluginEventDelegate: any PluginEventDelegate, adUnitConfigFingerprint: String) {
        pluginEventDelegateMap[adUnitConfigFingerprint] = pluginEventDelegate as? SampleCustomRendererEventDelegate
    }
    
    public func unregisterEventDelegate(pluginEventDelegate: any PluginEventDelegate, adUnitConfigFingerprint: String) {
        pluginEventDelegateMap.removeValue(forKey: adUnitConfigFingerprint)
    }
    
    public func createAdView(
        with frame: CGRect,
        bid: Bid,
        adConfiguration: AdUnitConfig,
        loadingDelegate: DisplayViewLoadingDelegate,
        interactionDelegate: DisplayViewInteractionDelegate
    ) -> (UIView & PrebidMobileDisplayViewProtocol)? {
        // .......
    }

    public func createInterstitialController(
        bid: Bid,
        adConfiguration: AdUnitConfig,
        loadingDelegate: InterstitialControllerLoadingDelegate,
        interactionDelegate: InterstitialControllerInteractionDelegate
    ) -> PrebidMobileInterstitialControllerProtocol? {
        // .......
    }
}
```

## Resources

In addition to this documentation you have samples on hand which can be get from the Prebid Mobile SDK repository:

* [PrebidMobilePluginRenderer](https://github.com/prebid/prebid-mobile-ios/blob/master/PrebidMobile/PrebidMobileRendering/PluginRenderer/PrebidMobilePluginRenderer.swift)
* [PluginEventDelegate](https://github.com/prebid/prebid-mobile-ios/blob/master/PrebidMobile/PrebidMobileRendering/PluginRenderer/PluginEventDelegate.swift)
