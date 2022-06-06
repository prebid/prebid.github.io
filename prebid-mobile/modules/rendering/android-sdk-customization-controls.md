---

layout: page_v2
title: Ad Experience Controls
description: Customization of ad expirience
sidebarType: 2

---

# Ad Experience Controls
{:.no_toc}

Prebid SDK provides an API way to customize its behaviour. 

> NOTE: In the nearest future the Server Side Configuration will be supported as well. Follow this [feature request](https://github.com/prebid/prebid-server/issues/2186) for the details. 

* TOC
{:toc}


## Rendering Controls


The following properties allow to customize the rendering of Video Interstitial Ads.

### Max Video Duration

This control allows setting the maximum available video duration in seconds. Prebid SDK sends the value of this property in the  `imp.video.maxduration` object of the bid request. And, in addition, if the value in the received VAST tag `<Duration>` is bigger than the given number then SDK doesn't load a media file and fails the ad loading, providing a respective error message.


{: .table .table-bordered .table-striped }

|**API Object**         | `InterstitialAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedVideoAdUnit` |
|**Ad Unit Property**   | `adUnit.setMaxVideoDuration(seconds)`|
|**Server Property**    | `maxvideoduration` *(pending for PBS implementation)*|
|**Default Value**     | `3600 seconds`|

### Application Muted

This control allows to run playback with sound or not.

{: .table .table-bordered .table-striped }

|**API Object**         | `InterstitialAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedVideoAdUnit` |
|**Ad Unit Property**   | `adUnit.setIsMuted(true)`|
|**Server Property**    | `ismuted` *(pending for PBS implementation)*|
|**Default Value**     | `false`|

### Close Button Area

This control allows to set the percent of device screen which the close button should occupy.

{: .table .table-bordered .table-striped }

|**API Object**         | `InterstitialAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedVideoAdUnit` |
|**Ad Unit Property**   | `adUnit.setCloseButtonArea(factor) `|
|**Server Property**    | `closebuttonarea` *(pending for PBS implementation)*|
|**Allowed Values**     | `0..1`|
|**Default Size**       | `70dp`|

Customization Example

{: .table .table-bordered .table-striped }

|**Default**|**Custom**|
|![Close Button Area - Default](/assets/images/prebid-mobile/modules/rendering/ad-experience/android-close-button-area-default.jpg){:width="250px"}|![Close Button Area - Custom](/assets/images/prebid-mobile/modules/rendering/ad-experience/android-close-button-area-custom.jpg){:width="250px"}|


### Close Button Position

This control allows to set the position of the close button on the screen.

{: .table .table-bordered .table-striped }

|**API Object**         `InterstitialAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedVideoAdUnit` |
|**Ad Unit Property**   | `adUnit.setCloseButtonPosition(Position.TOP_LEFT)`|
|**Server Property**    | `closebuttonposition` *(pending for PBS implementation)*|
|**Allowed Values**     | `Position.TOP_LEFT, Position.TOP_RIGHT`|
|**Default Value**      | `Position.TOP_RIGHT`|


Customization Example

{: .table .table-bordered .table-striped }

|**Default**|**Custom**|
|![Close Button Position - Default](/assets/images/prebid-mobile/modules/rendering/ad-experience/android-close-button-position-default.jpg){:width="250px"}|![Close Button Position - Custom](/assets/images/prebid-mobile/modules/rendering/ad-experience/android-close-button-position-custom.jpg){:width="250px"}|


### Skip Button Area

This control allows to set the percent of device screen which the skip button should occupy.

{: .table .table-bordered .table-striped }

|**API Object**         `InterstitialAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedVideoAdUnit` |
|**Ad Unit Property**   | `adUnit.setSkipButtonArea(factor)`|
|**Server Property**    | `skipbuttonarea` *(pending for PBS implementation)*|
|**Allowed Values**     | `0..1`|
|**Default Value**      | `70dp`|

Customization Example

{: .table .table-bordered .table-striped }

|**Default**|**Custom**|
|![Close Button Position - Default](/assets/images/prebid-mobile/modules/rendering/ad-experience/android-skip-button-area-default.jpg){:width="250px"}|![Close Button Position - Custom](/assets/images/prebid-mobile/modules/rendering/ad-experience/android-skip-button-area-custom.jpg){:width="250px"}|


### Skip Button Position

This control allows to set the position of the skip button on the screen.

{: .table .table-bordered .table-striped }

|**API Object**         `InterstitialAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedVideoAdUnit` |
|**Ad Unit Property**   | `adUnit.setSkipButtonPosition(Position.TOP_LEFT)`|
|**Server Property**    | `skipbuttonposition` *(pending for PBS implementation)*|
|**Allowed Values**     | `Position.TOP_LEFT, Position.TOP_RIGHT`|
|**Default Value**      | `Position.TOP_RIGHT`|

Customization Example

{: .table .table-bordered .table-striped }

|**Default**|**Custom**|
|![Close Button Position - Default](/assets/images/prebid-mobile/modules/rendering/ad-experience/android-skip-button-position-default.jpg){:width="250px"}|![Close Button Position - Custom](/assets/images/prebid-mobile/modules/rendering/ad-experience/android-skip-button-position-custom.jpg){:width="250px"}|

### Sound Button

This control allows to display or hide the sound/mute button to users.

{: .table .table-bordered .table-striped }

|**API Object**         `InterstitialAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedVideoAdUnit` |
|**Ad Unit Property**   | `adUnit.setIsSoundButtonVisible(true)`|
|**Server Property**    | *not supported*|
|**Default Value**      | `false`|

Customization Example

{: .table .table-bordered .table-striped }

|**Custom**|
|![Close Button Area - Default](/assets/images/prebid-mobile/modules/rendering/ad-experience/android-sound-button.jpg){:width="250px"}|


### Skip Delay

This control allows to set number of seconds which should be passed from the start of playback until the skip or close button should be shown.

{: .table .table-bordered .table-striped }

|**API Object**         `InterstitialAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedVideoAdUnit` |
|**Ad Unit Property**   | `adUnit.setSkipDelay(seconds)`|
|**Server Property**    | `skipdelay` *(pending for PBS implementation)*|
|**Default Value**      | `10 seconds`|


### Customization examples

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
adUnit?.setCloseButtonPosition(Position.TOP_LEFT)
```

