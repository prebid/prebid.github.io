---

layout: page_v2
title: Ad Experience Controls
description: Customization of ad expirience
sidebarType: 2

---

# Ad Experience Controls

{:.no_toc}

If you use Prebid SDK to render the winning bid you can customize behaviour using the following API.

> NOTE: Planned future enhancements will support Server Side Configuration. Follow this [feature request](https://github.com/prebid/prebid-server/issues/2186) for the details.

* TOC
{:toc}

## Rendering Controls

The following properties enable rendering customization of Video Interstitial Ads.

### Max Video Duration

This setting determines the longest video duration allowed, measured in seconds. When using the Prebid SDK, this value is sent in the `imp.video.maxduration` object of the bid request. If the `<Duration>` in the VAST tag received is longer than this set maximum, the SDK won't load the video file, the ad won't load, and an error message will appear.

{% capture android %}
{: .table .table-bordered .table-striped }
  |**API Object**         | `InterstitialAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedVideoAdUnit` |
  |**Ad Unit Property**   | `adUnit.setMaxVideoDuration(seconds)`|
  |**Server Property**    | `maxvideoduration` *(pending for PBS implementation)*|
  |**Default Value**      | `3600 seconds`|
{% endcapture %}
{% capture ios %}
  {: .table .table-bordered .table-striped }
  |**API Object**         |`InterstitialRenderingAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedAdUnit` |
  |**Ad Unit Property**   | `adUnit.videoParameters.maxDuration`|
  |**Server Property**    | `maxvideoduration` *(pending for PBS implementation)*|
  |**Default Value**      | `3600 seconds`|
{% endcapture %}

{% include code/mobile-sdk.html id="max-video-duration" kotlin=android swift=ios %}

### Application Muted

This option lets you switch the sound on or off during playback.  

{% capture android %}
  {: .table .table-bordered .table-striped }
  |**API Object**         | `InterstitialAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedVideoAdUnit` |
  |**Ad Unit Property**   | `adUnit.setIsMuted(true)`|
  |**Server Property**    | `ismuted` *(pending for PBS implementation)*|
  |**Default Value**      | `false`|
{% endcapture %}
{% capture ios %}
  {: .table .table-bordered .table-striped }
  |**API Object**         |`InterstitialRenderingAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedAdUnit` |
  |**Ad Unit Property**   | `adUnit.isMuted`|
  |**Server Property**    | `ismuted` *(pending for PBS implementation)*|
  |**Default Value**       | `false`|
{% endcapture %}

{% include code/mobile-sdk.html id="application-muted" kotlin=android swift=ios %}

### Close Button Area

This setting determines the percentage of the device screen that the close button should cover.

{% capture android %}
  {: .table .table-bordered .table-striped }
  |**API Object**         | `InterstitialAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedVideoAdUnit` |
  |**Ad Unit Property**   | `adUnit.setCloseButtonArea(factor)`|
  |**Server Property**    | `closebuttonarea` *(pending for PBS implementation)*|
  |**Allowed Values**     | `0..1`|
  |**Default Size**       | `70dp`|

  Customization Example

  {: .table .table-bordered .table-striped }

  |**Default**|**Custom**|
  |![Close Button Area - Default](/assets/images/prebid-mobile/modules/rendering/ad-experience/android-close-button-area-default.jpg){:width="250px"}|![Close Button Area - Custom](/assets/images/prebid-mobile/modules/rendering/ad-experience/android-close-button-area-custom.jpg){:width="250px"}|
{% endcapture %}

{% capture ios %}
  {: .table .table-bordered .table-striped }
  |**API Object**         |`InterstitialRenderingAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedAdUnit` |
  |**Ad Unit Property**   | `adUnit.closeButtonArea`|
  |**Server Property**    | `closebuttonarea` *(pending for PBS implementation)*|
  |**Allowed Values**     | `0..1`|
  |**Default Value**      | `0.1`|

  Customization Example

  {: .table .table-bordered .table-striped }

  |**Default**|**Custom**|
  |![Close Button Area - Default](/assets/images/prebid-mobile/modules/rendering/ad-experience/ios-close-button-area-010.png){:width="250px"}|![Close Button Area - Custom](/assets/images/prebid-mobile/modules/rendering/ad-experience/ios-close-button-area-020.png){:width="250px"}|
{% endcapture %}

{% include code/mobile-sdk.html id="close-button-area" kotlin=android swift=ios %}

### Close Button Position

This setting controls where the close button appears on the screen.

{% capture android %}
  {: .table .table-bordered .table-striped }

  |**API Object**         |`InterstitialAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedVideoAdUnit` |
  |**Ad Unit Property**   | `adUnit.setCloseButtonPosition(Position.TOP_LEFT)`|
  |**Server Property**    | `closebuttonposition` *(pending for PBS implementation)*|
  |**Allowed Values**     | `Position.TOP_LEFT, Position.TOP_RIGHT`|
  |**Default Value**      | `Position.TOP_RIGHT`|

  Customization Example

  {: .table .table-bordered .table-striped }

  |**Default**|**Custom**|
  |![Close Button Position - Default](/assets/images/prebid-mobile/modules/rendering/ad-experience/android-close-button-position-default.jpg){:width="250px"}|![Close Button Position - Custom](/assets/images/prebid-mobile/modules/rendering/ad-experience/android-close-button-position-custom.jpg){:width="250px"}|
{% endcapture %}

{% capture ios %}
  {: .table .table-bordered .table-striped }

  |**API Object**         |`InterstitialRenderingAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedAdUnit` |
  |**Ad Unit Property**   | `adUnit.closeButtonPosition`|
  |**Server Property**    | `closebuttonposition` *(pending for PBS implementation)*|
  |**Allowed Values**     | `topLeft, topRight`|
  |**Default Value**      | `topRight`|

  Customization Example

  {: .table .table-bordered .table-striped }

  |**Default**|**Custom**|
  |![Close Button Position - Default](/assets/images/prebid-mobile/modules/rendering/ad-experience/ios-close-button-area-010.png){:width="250px"}|![Close Button Position - Custom](/assets/images/prebid-mobile/modules/rendering/ad-experience/ios-close-button-possition-top-left.png){:width="250px"}|
{% endcapture %}

{% include code/mobile-sdk.html id="close-button-position" kotlin=android swift=ios %}

### Skip Button Area

This setting determines the percentage of the device screen that the skip button should cover.

{% capture android %}
  {: .table .table-bordered .table-striped }

  |**API Object**         |`InterstitialAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedVideoAdUnit` |
  |**Ad Unit Property**   | `adUnit.setSkipButtonArea(factor)`|
  |**Server Property**    | `skipbuttonarea` *(pending for PBS implementation)*|
  |**Allowed Values**     | `0..1`|
  |**Default Value**      | `70dp`|
{% endcapture %}

{% capture ios %}
  {: .table .table-bordered .table-striped }

  |**API Object**         |`InterstitialRenderingAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedAdUnit` |
  |**Ad Unit Property**   | `adUnit.skipButtonArea`|
  |**Server Property**    | `skipbuttonarea` *(pending for PBS implementation)*|
  |**Allowed Values**     | `0..1`|
  |**Default Value**      | `0.1`|
{% endcapture %}

{% include code/mobile-sdk.html id="skip-button-area" kotlin=android swift=ios %}

Customization Example

{: .table .table-bordered .table-striped }

|**Default**|**Custom**|
|![Close Button Position - Default](/assets/images/prebid-mobile/modules/rendering/ad-experience/android-skip-button-area-default.jpg){:width="250px"}|![Close Button Position - Custom](/assets/images/prebid-mobile/modules/rendering/ad-experience/android-skip-button-area-custom.jpg){:width="250px"}|

### Skip Button Position

This control sets the position of the skip button.

{% capture android %}
  {: .table .table-bordered .table-striped }

  |**API Object**         |`InterstitialAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedVideoAdUnit` |
  |**Ad Unit Property**   | `adUnit.setSkipButtonPosition(Position.TOP_LEFT)`|
  |**Server Property**    | `skipbuttonposition` *(pending for PBS implementation)*|
  |**Allowed Values**     | `Position.TOP_LEFT, Position.TOP_RIGHT`|
  |**Default Value**      | `Position.TOP_RIGHT`|

  Customization Example

  {: .table .table-bordered .table-striped }

  |**Default**|**Custom**|
  |![Close Button Position - Default](/assets/images/prebid-mobile/modules/rendering/ad-experience/android-skip-button-position-default.jpg){:width="250px"}|![Close Button Position - Custom](/assets/images/prebid-mobile/modules/rendering/ad-experience/android-skip-button-position-custom.jpg){:width="250px"}|
{% endcapture %}

{% capture ios %}
  {: .table .table-bordered .table-striped }

  |**API Object**         |`InterstitialRenderingAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedAdUnit` |
  |**Ad Unit Property**   | `adUnit. skipButtonPosition`|
  |**Server Property**    | `skipbuttonposition` *(pending for PBS implementation)*|
  |**Allowed Values**     | `topLeft, topRight`|
  |**Default Value**      | `topLeft`|

  Customization Example

  {: .table .table-bordered .table-striped }

  |**Default**|**Custom**|
  |![Close Button Position - Default](/assets/images/prebid-mobile/modules/rendering/ad-experience/ios-skip-button-possition-top-left.png){:width="250px"}|![Close Button Position - Custom](/assets/images/prebid-mobile/modules/rendering/ad-experience/ios-skip-button-possition-top-right.png){:width="250px"}|
{% endcapture %}

{% include code/mobile-sdk.html id="skip-button-position" kotlin=android swift=ios %}

### Skip Delay

This setting determines the number of seconds after the start of playback before the skip or close button should appear.

{% capture android %}
  {: .table .table-bordered .table-striped }

  |**API Object**         |`InterstitialAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedVideoAdUnit` |
  |**Ad Unit Property**   | `adUnit.setSkipDelay(seconds)`|
  |**Server Property**    | `skipdelay` *(pending for PBS implementation)*|
  |**Default Value**      | `10 seconds`|
{% endcapture %}

{% capture ios %}
  {: .table .table-bordered .table-striped }

  |**API Object**         |`InterstitialRenderingAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedAdUnit` |
  |**Ad Unit Property**   | `adUnit.skipDelay`|
  |**Server Property**    | `skipdelay` *(pending for PBS implementation)*|
  |**Default Value**      | `10 seconds`|
{% endcapture %}

{% include code/mobile-sdk.html id="skip-delay" kotlin=android swift=ios %}

### Sound Button

This option switches on or off the visibility of the sound/mute button for users.

{% capture android %}
  {: .table .table-bordered .table-striped }

  |**API Object**         |`InterstitialAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedVideoAdUnit` |
  |**Ad Unit Property**   | `adUnit.setIsSoundButtonVisible(true)`|
  |**Server Property**    | *not supported*|
  |**Default Value**      | `false`|

  Customization Example

  {: .table .table-bordered .table-striped }

  |**Custom**|
  |![Close Button Area - Default](/assets/images/prebid-mobile/modules/rendering/ad-experience/android-sound-button.jpg){:width="250px"}|
{% endcapture %}

{% capture ios %}
  {: .table .table-bordered .table-striped }

  |**API Object**         |`InterstitialRenderingAdUnit`, `RewardedAdUnit`, <br />`MediationInterstitialAdUnit`, `MediationRewardedAdUnit` |
  |**Ad Unit Property**   | `adUnit.isSoundButtonVisible`|
  |**Server Property**    | *not supported*|
  |**Default Value**      | `false`|

  Customization Example

  {: .table .table-bordered .table-striped }

  |**Default**|**Custom**|
  |![Close Button Area - Default](/assets/images/prebid-mobile/modules/rendering/ad-experience/ios-close-button-area-010.png){:width="250px"}|![Close Button Area - Custom](/assets/images/prebid-mobile/modules/rendering/ad-experience/ios-mute-button-visible.png){:width="250px"}|
{% endcapture %}

{% include code/mobile-sdk.html id="sound-button" kotlin=android swift=ios %}

### Code Example

Here is how you can implement all the API's to customize your ad.

{% capture android %}
  ```kotlin
  adUnit = MediationInterstitialAdUnit(
      activity,
      configId,
      EnumSet.of(AdUnitFormat.BANNER),
      mediationUtils
  )

  adUnit?.setMaxVideoDuration(30)
  adUnit?.setCloseButtonArea(0.1)
  adUnit?.setSkipDelay(5)
  adUnit?.setSkipButtonArea(0.1)
  adUnit?.setSkipButtonPosition(Position.TOP_RIGHT)
  adUnit?.setCloseButtonPosition(Position.TOP_LEFT)
  ```
{% endcapture %}

{% capture ios %}
  ```swift
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
{% endcapture %}

{% include code/mobile-sdk.html id="code-example" kotlin=android swift=ios %}












