---

layout: page_v2
title: Ad Experience Controls
description: Customization of ad expirience
sidebarType: 2

---

# Ad Experience Controls

Prebid SDK provides an API way to customize its behaviour. 

> NOTE: In the nearest future the Server Side Configuration will be supported as well. Follow this [feature request](https://github.com/prebid/prebid-server/issues/2186) for the details. 


## Rendering Controls

The following properties allow to customize the rendering of Video Interstitial Ads.

### Max Video Duration

The `maxVideoDuration` indicates the maximum available playback time in seconds.
If the value in the **Duration** tag is bigger than the given value SDK will fail to load ad, providing a respective error message.

### Application Muted

The `isMuted` property indicates whether the ad should run playback with sound or not.
Default value - **false**.

### Close Button Area

The `closeButtonArea` property indicates the percent of device screen which the close button should occupy. The possible values are from **0** to **1**.

### Close Button Position

The `closeButtonPosition` property indicates the position of the close button on the screen. The possible values are **Position.BOTTOM_LEFT** and **Position.TOP_RIGHT**. The default value is **Position.TOP_RIGHT**.

The example: 

![Close Button Position - Top Right](/assets/images/prebid-mobile/modules/rendering/ad-experience-android-close-button-possition-top-left.png){:width="250px"}

### Skip Button Area

The `skipButtonArea` property indicates the percent of device screen which the skip button should occupy. The possible values are from **0** to **1**.

### Skip Button Position

The `skipButtonPosition` property indicates the position of the close button on the screen. The possible values are **Position.BOTTOM_LEFT** and **Position.TOP_RIGHT**. The default value is **Position.BOTTOM_LEFT**.

The example: 

![Close Button Position - Top Right](/assets/images/prebid-mobile/modules/rendering/ad-experience-android-skip-button-possition-top-left.png){:width="250px"}

### Skip Delay

The `skipDelay` property indicates the number of seconds which should be passed from the start of playback until the skip or close button should be shown. The default value is **10**.

The code sample: 

``` kotlin
adUnit = MediationInterstitialAdUnit(
    activity,
    configId,
    EnumSet.of(AdUnitFormat.DISPLAY),
    mediationUtils
)

adUnit?.setMaxVideoDuration(30)
adUnit?.setCloseButtonArea(0.1)
adUnit?.setSkipDelay(5)
adUnit?.setSkipButtonArea(0.1)
adUnit?.setSkipButtonPosition(Position.TOP_RIGHT)
adUnit?.setCloseButtonPosition(Position.BOTTOM_LEFT)
```

