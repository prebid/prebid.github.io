---

layout: page_v2
title: Prebid Mobile Rendering Modules
description: Prebid Mobile Rendering Modules architecture
sidebarType: 2

---

# Customization Controls

Prebid SDK provides an API way to customize its behaviour. 

> NOTE: In the nearest future the Server Side Configuration will be supported as well. Follow this [feature request](https://github.com/prebid/prebid-server/issues/2186) for the details. 


## Rendering Controls

The following properties allow to customize the rendering of Video Interstitial Ads.

### Max Video Duration

The `videoParameters.maxDuration` indicates the maximum available playback time in seconds.
If the value in the **Duration** tag is bigger than the given value SDK will fail to load ad, providing a respective error message.

### Application Muted

The `isMuted` property indicates whether the ad should run playback with sound or not.
Default value - **false**.

### Close Button Area

The `closeButtonArea` property indicates the percent of device screen which the close button should occupy. The possible values are from **0** to **1**.

### Close Button Possition

The `closeButtonPosition` property indicates the position of the close button on the screen. The possible values are **TopLeft** and **TopRight**. The default value is **TopRight**.

### Skip Button Areaa

The `skipButtonArea` property indicates the percent of device screen which the skip button should occupy. The possible values are from **0** to **1**.

### Skip Button Possition

The `skipButtonPossition` property indicates the position of the close button on the screen. The possible values are **TopLeft** and **TopRight**. The default value is **TopLeft**.

### Skip Delay

The `skipDelay` property indicates the number of seconds which should be passed from the start of playback until the skip or close button should be shown. The default value is **10**.

The code sample: 

``` swift
interstitialController = InterstitialRenderingAdUnit(configID: prebidConfigId,
                                                       minSizePercentage: CGSize(width: 30, height: 30))
interstitialController?.delegate = self
interstitialController?.videoParameters.maxDuration = SingleContainerInt(integerLiteral: 30)
interstitialController?.closeButtonArea = 0.1
interstitialController?.skipDelay = 5
interstitialController?.skipButtonArea = 0.1
interstitialController?.skipButtonPosition = .topRight
interstitialController?.closeButtonPosition = .topRight
```

