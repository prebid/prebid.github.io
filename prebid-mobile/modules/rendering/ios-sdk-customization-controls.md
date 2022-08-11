---

layout: page_v2
title: Ad Experience Controls
description: Approaches for changing the ad expirience 
sidebarType: 2

---

# Ad Experience Controls
{:.no_toc}

Prebid SDK provides an API way to customize its behaviour. 

>NOTE: Planned future enhancements will support Server Side Configuration. Follow this [feature request](https://github.com/prebid/prebid-server/issues/2186) for the details. 

* TOC
{:toc}


## Rendering Controls

The following properties enable rendering customization of Video Interstitial Ads.

### Max Video Duration

This control sets the maximum available video duration in seconds. Prebid SDK sends the value of this property in the  `imp.video.maxduration` object of the bid request. If the value in the received VAST tag `<Duration>` is larger than the given number the SDK will not load the media file, the ad load will fail and an error message will be generated.


{: .table .table-bordered .table-striped }

|**API Object**         |`InterstitialRenderingAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedAdUnit` |
|**Ad Unit Property**   | `adUnit.videoParameters.maxDuration`|
|**Server Property**    | `maxvideoduration` *(pending for PBS implementation)*|
|**Default Value**     | `3600 seconds`|

### Application Muted

This control enables playback to toggle sound on or off.

{: .table .table-bordered .table-striped }

|**API Object**         |`InterstitialRenderingAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedAdUnit` |
|**Ad Unit Property**   | `adUnit.isMuted`|
|**Server Property**    | `ismuted` *(pending for PBS implementation)*|
|**Default Value**     | `false`|

### Close Button Area

This control sets the percent of device screen which the close button should occupy.

{: .table .table-bordered .table-striped }

|**API Object**         |`InterstitialRenderingAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedAdUnit` |
|**Ad Unit Property**   | `adUnit.closeButtonArea `|
|**Server Property**    | `closebuttonarea` *(pending for PBS implementation)*|
|**Allowed Values**     | `0..1`|
|**Default Value**     | `0.1`|

Customization Example

{: .table .table-bordered .table-striped }

|**Default**|**Custom**|
|![Close Button Area - Default](/assets/images/prebid-mobile/modules/rendering/ad-experience/ios-close-button-area-010.png){:width="250px"}|![Close Button Area - Custom](/assets/images/prebid-mobile/modules/rendering/ad-experience/ios-close-button-area-020.png){:width="250px"}|


### Close Button Position

This control sets the position of the close button on the screen. 

{: .table .table-bordered .table-striped }

|**API Object**         |`InterstitialRenderingAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedAdUnit` |
|**Ad Unit Property**   | `adUnit.closeButtonPosition`|
|**Server Property**    | `closebuttonposition` *(pending for PBS implementation)*|
|**Allowed Values**     | `topLeft, topRight`|
|**Default Value**     | `topRight`|


Customization Example

{: .table .table-bordered .table-striped }

|**Default**|**Custom**|
|![Close Button Position - Default](/assets/images/prebid-mobile/modules/rendering/ad-experience/ios-close-button-area-010.png){:width="250px"}|![Close Button Position - Custom](/assets/images/prebid-mobile/modules/rendering/ad-experience/ios-close-button-possition-top-left.png){:width="250px"}| 


### Skip Button Area

This control set the percent of device screen which the skip button should occupy. 

{: .table .table-bordered .table-striped }

|**API Object**         |`InterstitialRenderingAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedAdUnit` |
|**Ad Unit Property**   | `adUnit.skipButtonArea`|
|**Server Property**    | `skipbuttonarea` *(pending for PBS implementation)*|
|**Allowed Values**     | `0..1`|
|**Default Value**     | `0.1`|

### Skip Button Position

This control sets the position of the skip button on the screen. 

{: .table .table-bordered .table-striped }

|**API Object**         |`InterstitialRenderingAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedAdUnit` |
|**Ad Unit Property**   | `adUnit. skipButtonPosition`|
|**Server Property**    | `skipbuttonposition` *(pending for PBS implementation)*|
|**Allowed Values**     | `topLeft, topRight`|
|**Default Value**     | `topLeft`|

Customization Example

{: .table .table-bordered .table-striped }

|**Default**|**Custom**|
|![Close Button Position - Default](/assets/images/prebid-mobile/modules/rendering/ad-experience/ios-skip-button-possition-top-left.png){:width="250px"}|![Close Button Position - Custom](/assets/images/prebid-mobile/modules/rendering/ad-experience/ios-skip-button-possition-top-right.png){:width="250px"}| 

### Skip Delay

This control sets number of seconds which should be passed from the start of playback until the skip or close button should be shown. 

{: .table .table-bordered .table-striped }

|**API Object**         |`InterstitialRenderingAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedAdUnit` |
|**Ad Unit Property**   | `adUnit.skipDelay`|
|**Server Property**    | `skipdelay` *(pending for PBS implementation)*|
|**Default Value**     | `10 seconds`|

### Sound Button

isSoundButtonVisible

This control toggles the display of the sound/mute button to users.

{: .table .table-bordered .table-striped }

|**API Object**         |`InterstitialRenderingAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedAdUnit` |
|**Ad Unit Property**   | `adUnit.isSoundButtonVisible`|
|**Server Property**    | *not supported*|
|**Default Value**     | `false`|

Customization Example

{: .table .table-bordered .table-striped }

|**Default**|**Custom**|
|![Close Button Area - Default](/assets/images/prebid-mobile/modules/rendering/ad-experience/ios-close-button-area-010.png){:width="250px"}|![Close Button Area - Custom](/assets/images/prebid-mobile/modules/rendering/ad-experience/ios-mute-button-visible.png){:width="250px"}|

### Customization examples

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

