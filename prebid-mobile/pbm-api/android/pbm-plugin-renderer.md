---
layout: page_v2
title: Plugin Renderer - Android
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
  * [Go integration](prebid-server/developers/add-new-bidder-go.html)
  * [Java integration](prebid-server/developers/add-new-bidder-java.html)
* Create your implementation from the interface `PrebidMobilePluginRenderer`
* Initialise your Plugin Renderer before starting to request ads
* Take advantage of the Plugin Renderer fields

{: .alert.alert-info :}
Please notice that all implementation on mobile related to the Plugin Renderer should be provided externally, not in the PBM SDK itself. For instance, an app owner or third party SDK would implement it and initialise it on their own context. 

___

#### Create your implementation from the interface PrebidMobilePluginRenderer

```kotlin
class SampleCustomRenderer : PrebidMobilePluginRenderer {
    
    override fun getName(): String = "SamplePluginRenderer"

    override fun getVersion(): String = "1.0.0"

    override fun getData(): JSONObject? = null
    
    override fun registerEventListener(pluginEventListener: PluginEventListener?, listenerKey: String?) { }

    override fun unregisterEventListener(listenerKey: String) { }

    override fun createBannerAdView(
        context: Context,
        displayViewListener: DisplayViewListener,
        displayVideoListener: DisplayVideoListener?,
        adUnitConfiguration: AdUnitConfiguration,
        bidResponse: BidResponse
    ): View {
        TODO("Handle bid response as you want and return your ad banner view")
    }

    override fun createInterstitialController(
        context: Context,
        interstitialControllerListener: InterstitialControllerListener,
        adUnitConfiguration: AdUnitConfiguration,
        bidResponse: BidResponse
    ): PrebidMobileInterstitialControllerInterface {
        TODO("Handle bid response as you want and display your interstitial ad")
    }

    override fun isSupportRenderingFor(adUnitConfiguration: AdUnitConfiguration): Boolean {
        return when {
            adUnitConfiguration.isAdType(AdFormat.BANNER) -> true
            adUnitConfiguration.isAdType(AdFormat.INTERSTITIAL) -> true
            else -> false
        }
    }
}
```


#### Initialise your Plugin Renderer before starting to request ads

```kotlin
class PpmBannerPluginRendererFragment : AdFragment(), BannerViewListener {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Init your Plugin Renderer
        PrebidMobile.registerPluginRenderer(SampleCustomRenderer())
        
        initAdViews()
        requestAd()
    }
}
```

#### Take advantage of the Plugin Renderer fields

The fields `name`, `version` and `data` from your Plugin Renderer are added to the bid request by the Prebid Mobile SDK and can be read by your Prebid Bidder Adapter in order to better handle ad requests from a Plugin Renderer taking into account its name, version and the additional values stored on the data field.

The field `data` can be used as below or with a more complex data structure:
```kotlin
    override fun getData(): JSONObject { 
        val data = JSONObject()
        data.put("key", "extra_value")
        return data
    }
```

## Limitations

### Supported Ad Formats
Currently the interface `PrebidMobilePluginRenderer` provide the ability to render `BANNER` and `INTERSTITIAL` only. The compability with more ad formats can be supported in future releases.

It is important to notice that the compliant formats you set on `isSupportRenderingFor` implementation are taken into account to add your Plugin Renderer to the bid request or not, according to the ad unit configuration that is bid requesting.

### Original API

The Plugin Renderer feature does not work with [GAM Original API](/prebid-mobile/pbm-api/android/android-sdk-integration-gam-original-api.md) since the ad rendering does not happen in the Prebid SDK but externally. Despite that if you are using the regular GAM integration it will work fine.

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
```kotlin
interface SampleCustomRendererEventListener : PluginEventListener {
    // Ensure that the name is the same as your Plugin Renderer
    override fun getPluginRendererName(): String = "SamplePluginRenderer"
    fun onImpression()
}
```

#### Handle your plugin event listener on your Plugin Renderer
```kotlin
class SampleCustomRenderer : PrebidMobilePluginRenderer {

    // Store your listeners
    private val pluginEventListenerMap = mutableMapOf<String, SampleCustomRendererEventListener>()
    
    override fun getName(): String = "SamplePluginRenderer"

    override fun getVersion(): String = "1.0.0"

    override fun getData(): JSONObject? = null
    
    // Called whenever an ad consumer wants to subscribe to your ad lifecycle events
    override fun registerEventListener(pluginEventListener: PluginEventListener?, listenerKey: String?) {
        (pluginEventListener as? SampleCustomRendererEventListener)?.let {
            pluginEventListenerMap[listenerKey] = it
        }
    }

    // Called whenever an ad consumer wants to unsubscribe from your ad lifecycle events
    override fun unregisterEventListener(listenerKey: String) {
        pluginEventListenerMap.remove(listenerKey)
    }

    override fun createBannerAdView(
        context: Context,
        displayViewListener: DisplayViewListener,
        displayVideoListener: DisplayVideoListener?,
        adUnitConfiguration: AdUnitConfiguration,
        bidResponse: BidResponse
    ): View {
        val adView = AdManager.getAdView(bidResponse.winningBid?.adm, context)

        adView.viewTreeObserver.addOnGlobalLayoutListener(object : ViewTreeObserver.OnGlobalLayoutListener {
            override fun onGlobalLayout() {
                // Retrieve the ad listener and track your ad event once convenient
                pluginEventListenerMap[adUnitConfiguration.fingerprint]?.onImpression()
                adView.viewTreeObserver.removeOnGlobalLayoutListener(this)
            }
        })
        
        return adView
    }

    override fun createInterstitialController(
        context: Context,
        interstitialControllerListener: InterstitialControllerListener,
        adUnitConfiguration: AdUnitConfiguration,
        bidResponse: BidResponse
    ): PrebidMobileInterstitialControllerInterface { }

    override fun isSupportRenderingFor(adUnitConfiguration: AdUnitConfiguration): Boolean {
        return when {
            adUnitConfiguration.isAdType(AdFormat.BANNER) -> true
            else -> false
        }
    }
}
```

#### Implement the interface on the class you want to listen the events
```kotlin
// Implement your plugin event listener interface
class PpmBannerPluginEventListenerFragment : AdFragment(), SampleCustomRendererEventListener {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        PrebidMobile.registerPluginRenderer(SampleCustomRenderer())
    }

    override fun initAd(): Any? {
        bannerView = BannerView(
            requireContext(),
            configId,
            AdSize(width, height)
        )
        binding.viewContainer.addView(bannerView)

        // Set the plugin event listener
        bannerView?.setPluginEventListener(this)
        
        return bannerView
    }

    // Override and listen events from your plugin event listener
    override fun onImpression() {
        LogUtil.debug(TAG, "onImpression")
    }
}
```

## Resources

In addition to this documentation you have samples on hand which can be get from the Prebid Mobile SDK repository:

* [PpmBannerPluginRendererFragment](https://github.com/prebid/prebid-mobile-android/blob/master/Example/PrebidInternalTestApp/src/main/java/org/prebid/mobile/renderingtestapp/plugplay/bidding/pluginrenderer/PpmBannerPluginRendererFragment.kt)
* [PpmBannerPluginEventListenerFragment](https://github.com/prebid/prebid-mobile-android/blob/master/Example/PrebidInternalTestApp/src/main/java/org/prebid/mobile/renderingtestapp/plugplay/bidding/pluginrenderer/PpmBannerPluginEventListenerFragment.kt)
* [PpmInterstitialPluginRendererFragment](https://github.com/prebid/prebid-mobile-android/blob/master/Example/PrebidInternalTestApp/src/main/java/org/prebid/mobile/renderingtestapp/plugplay/bidding/pluginrenderer/PpmInterstitialPluginRendererFragment.kt)
* [PpmInterstitialPluginEventListenerFragment](https://github.com/prebid/prebid-mobile-android/blob/master/Example/PrebidInternalTestApp/src/main/java/org/prebid/mobile/renderingtestapp/plugplay/bidding/pluginrenderer/PpmInterstitialPluginEventListenerFragment.kt)

___

## Plugin Renderer providers

The following list contains documentation for known supported Plugin Renderer providers.

{: .table .table-bordered .table-striped }

| Company | Documentation                                                                                 |
|-------|-----------------------------------------------------------------------------------------------|
| Teads | [Teads Plugin Renderer Docs](https://support.teads.tv/support/solutions/articles/36000459747) |
