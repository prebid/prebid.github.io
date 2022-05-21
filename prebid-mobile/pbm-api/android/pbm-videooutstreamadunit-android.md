---
layout: page_v2
title: VideoAdUnit - Android
description: VideoAdUnit - Android
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# VideoAdUnit Object
{:.no_toc}

Use the `VideoAdUnit` object to create and configure an outstream video ad unit in your app.

Video Outstream is only supported with Google Ad Manager.
{: .alert .alert-info}

* TOC
{:toc}

## Object

### VideoAdUnit

Create a new Outstream Video Ad Unit associated with a Prebid Server configuration ID and a video player size.

```java
VideoAdUnit("configID", width, height, VideoAdUnit.PlacementType.placement); //placement to be deprecated in favor of parameters.placement)
```

**Parameters**

* `configId`: String; Prebid Server configuration ID. Note: this is a Prebid Server [impression-level stored request ID](/prebid-server/features/pbs-storedreqs.html).
* `width`: Integer; Width of the video player.
* `height`: Integer; Height of the video player.
* `placement` (DEPRECATED FIELD) Enumeration. Possible values:
	* IN_BANNER
	* IN_ARTICLE
	* IN_FEED


### Parameters

Parameters is a sub class of videoAdUnit. Create new Parameters class to define the parameters of the video ad unit. Parameters contain the OpenRTB video attributes.

**Parameters**

`placement: [int] or [enum]`: OpenRTB placement

`protocols: [int] or [enum]`: OpenRTB Protocols

`api: [int] or [enum]`: OpenRTB api frameworks

`maxBitrate: int`: OpenRTB maxBirate

`minBitrate: int`: OpenRTB minBitrate

`maxDuration:int`: OpenRTB maxDuration

`minDuration: int`: OpenRTB minDuration

`mimes: [string]`: OpenRTB mime types

`playbackMethod: [int]`: OpenRTB playbackMethod


#### placement

[OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) Placement Type for the auction can be expressed as an integer array or can use an enum for easier readability. Option 1 (in-stream) is intentionally left out due to lack of in-stream support in Prebid SDK.

* `2` or `IN_BANNER` : In-Banner placement exists within a web banner that leverages the banner space to deliver a video experience as opposed to another static or rich media format. The format relies on the existence of display ad inventory on the page for its delivery.
* `3` or `IN_ARTICLE` : In-Article placement loads and plays dynamically between paragraphs of editorial content; existing as a standalone branded message.
* `4` or `IN_FEED` : In-Feed placement is found in content, social, or product feeds.
* `5` : `Slider` / `Floater` While OpenRTB uses "5" to also designate interstitial as a placement type, interstitial is not used in the standard outsream format. For Interstital, use the videointerstital or RewardedVideoAdUnit ad unit

#### api

Array of integers or enum representing the supported OpenRTB Frameworks:

* `1` or `Signals.Api.VPAID_1` : VPAID 1.0
* `2` or `Signals.Api.VPAID_2` : VPAID 2.0
* `3` or `Signals.Api.MRAID_1` : MRAID-1
* `4` or `Signals.Api.ORMMA` : ORMMA
* `5` or `Signals.Api.MARAID_2` : MRAID-2
* `6` or `Signals.Api.MARAID_3` : MRAID-3

#### maxBitrate

Integer representing the [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) maximum bit rate in Kbps.

#### minBitrate

Integer representing the [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) minimum bit rate in Kbps.

#### maxDuration

Integer representing the [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) maximum video ad duration in seconds.

#### minDuration

Integer representing the [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) minimum video ad duration in seconds.

#### mimes

Array of string representing the supported [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) content MIME types (e.g., “video/x-ms-wmv”, “video/mp4”).

#### playbackMethod

Array of [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) playback methods. If none are specified, any method may be used. Only one method is typically used in practice. It is strongly advised to use only the first element of the array.

* `1` or `Signals.PlaybackMethod.AutoPlaySoundOn` : Initiates on Page Load with Sound On
* `2` or `Signals.PlaybackMethod.AutoPlaySoundOff` : Initiates on Page Load with Sound Off by Default
* `3` or `Signals.PlaybackMethod.ClickToPlay` : Initiates on Click with Sound On
* `4` or `Signals.PlaybackMethod.MouseOver` : Initiates on Mouse-Over with Sound On
* `5` or `Signals.PlaybackMethod.EnterSoundOn` : Initiates on Entering Viewport with Sound On
* `6` or `Signals.PlaybackMethod.EnterSoundOff`: Initiates on Entering Viewport with Sound Off by Default

#### protocols

Array or enum of [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) supported Protocols. Values can be one of:

* `1` or `Signals.Protocols.VAST_1_0` : VAST 1.0
* `2` or `Signals.Protocols.VAST_2_0` : VAST 2.0
* `3` or `Signals.Protocols.VAST_3_0` : VAST 3.0
* `4` or `Signals.Protocols.VAST_1_0_Wrapper` : VAST 1.0 Wrapper
* `5` or `Signals.Protocols.VAST_2_0_Wrapper` : VAST 2.0 Wrapper
* `6` or `Signals.Protocols.VAST_3_0_Wrapper` : VAST 3.0 Wrapper
* `7` or `Signals.Protocols.VAST_4_0` : VAST 4.0
* `8` or `Signals.Protocols.VAST_4_0_Wrapper` : VAST 4.0 Wrapper


## Methods

`VideoAdUnit` inherits all methods from the [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-adunit-android.html) object.

## Example

```java
private PublisherAdView amBanner;
AdUnit adUnit;

void setupAndLoadAMBannerVAST() {
   setupPBBannerVAST();
   setupAMBannerVAST();
   loadBanner();
}

private void setupPBBannerVAST() {
   PrebidMobile.setPrebidServerHost(Host.RUBICON);
   PrebidMobile.setPrebidServerAccountId("AccountID");
   adUnit = new VideoAdUnit("configId", 300, 250);

   VideoInterstitialAdUnit adUnit = new VideoInterstitialAdUnit("1001-1");         

  VideoAdUnit.Parameters parameters = new VideoAdUnit.Parameters();

    parameters.setPlacement(2);  // or alternative enum value Signals.Placement.InBanner
    parameters.setApi(Arrays.asList(1,2));  // or alternative enum values [Signals.Api.VPAID_1, Signals.Api.VPAID_2]
    parameters.setMaxBitrate(1500);
    parameters.setMinBitrate(300);
    parameters.setMaxDuration(30);
    parameters.setMinDuration(5);
    parameters.setMimes(Arrays.asList("video/x-flv", "video/mp4"));
    parameters.setPlaybackMethod(1); // or alternative enum value (Signals.PlaybackMethod.AutoPlaySoundOn)
    parameters.setProtocols(Arrays.asList(2,3)); // or alternative enum values (Signals.Protocols.VAST_2_0, Signals.Protocols.VAST_3_0)

  adUnit.setParameters(parameters);
}

private void setupAMBannerVAST() {
   setupAMBanner(300, 250, "/networkId/adUnit");
}

private void setupAMBanner(int width, int height, String id) {
   amBanner = new PublisherAdView(this);
   amBanner.setAdUnitId(id);
   amBanner.setAdSizes(new AdSize(width, height));
}

private void loadBanner() {
   final PublisherAdRequest.Builder builder = new PublisherAdRequest.Builder();
   final PublisherAdRequest request = builder.build();
   adUnit.fetchDemand(request, new OnCompleteListener() {
       @Override
       public void onComplete(ResultCode resultCode) {
           DemoActivity.this.resultCode = resultCode;
       }
   });
}

```

## Related Topics

- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
- [Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-adunit-android.html)
- [Intersitial Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-bannerinterstitialadunit-android.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-result-codes-android.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/android/prebidmobile-object-android.html)
- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
