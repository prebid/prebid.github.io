---
layout: page_v2
title: RewardedVideoAdUnit - Android
description: RewardedVideoAdUnit - Android
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# RewardedVideoAdUnit Object
{:.no_toc}

Use the `RewardedVideoAdUnit` object to create and configure a rewarded video ad unit in your app.



* TOC
{:toc}

## Object

### RewardedVideoAdUnit

Create a new Video Rewarded Ad Unit associated with a Prebid Server configuration ID.


```java
RewardedVideoAdUnit("configId");
```

**Parameters**

`configId`: String; Prebid Server configuration ID. Note: this is a Prebid Server [impression-level stored request ID](/prebid-server/features/pbs-storedreqs.html).

### Paramaters

Parameters is a sub class of videoAdUnit.Create new Parameters class to define the parameters of the video ad unit. Parameters contain the OpenRTB video attributes.


**Parameters**

`placement: [int] or [enum]`: OpenRTB placement

`api: [int] or [enum]`: OpenRTB api frameworks

`maxBitrate: int`: OpenRTB maxBirate

`minBitrate: int`: OpenRTB minBitrate

`maxDuration:int`: OpenRTB maxDuration

`minDuration: int`: OpenRTB minDuration

`mimes: [string]`: OpenRTB mime types

`playbackMethod: [int]`: OpenRTB playbackMethod

`protocols: [int] or [enum]`: OpenRTB Protocols


### placement

[OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) Placement Type for the auction can be expressed as an integer array or can use an enum for easier readability. Option 1 (in-stream) is intentionally left out due to lack of in-stream support in Prebid SDK. 

In the context of a VideoInterstitialAdUnit, rewarded video ads are typically labled as interstitial. As such, Prebid SDK will default to value 5 if no placement value is supplied.

* `2` or `InBanner` : In-Banner placement exists within a web banner that leverages the banner space to deliver a video experience as opposed to another static or rich media format. The format relies on the existence of display ad inventory on the page for its delivery.
* `3` or `InArticle` : In-Article placement loads and plays dynamically between paragraphs of editorial content; existing as a standalone branded message.
* `4` or `InFeed` : In-Feed placement is found in content, social, or product feeds.
* `5` or `Slider` or `Floating` or `Interstitial` : Open RTB supports one of three values for option 5 as eitehr Slider, Floating or Interstitial. If an enum value is supplied in placement, bidders will recieve value 5 for placement type and assume to be interstitial with the instl flag set to 1.


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

`RewardedVideoAdUnit` inherits all methods from the [AdUnit](/prebid-mobile/pbm-api/android/pbm-adunit-android.html) object.



## Example

**Google Ad Manager**

```java
//setup PB RewardedVideo
RewardedVideoAdUnit adUnit = new RewardedVideoAdUnit("configId");

VideoAdUnit.Parameters parameters = new VideoAdUnit.Parameters();

parameters.setPlacement(5);  // or alternative enum value Signals.Placement.Interstitial
parameters.setApi(Arrays.asList(1,2));  // or alternative enum values [Signals.Api.VPAID_1, Signals.Api.VPAID_2]
parameters.setMaxBitrate(1500);
parameters.setMinBitrate(300);
parameters.setMaxDuration(30);
parameters.setMinDuration(5);
parameters.setMimes(Arrays.asList("video/x-flv", "video/mp4"));
parameters.setPlaybackMethod(1); // or alternative enum value (Signals.PlaybackMethod.AutoPlaySoundOn)
parameters.setProtocols(Arrays.asList(2,3)); // or alternative enum values (Signals.Protocols.VAST_2_0, Signals.Protocols.VAST_3_0)

adUnit.setParameters(parameters);

//setup AM RewardedVideo
RewardedAd amRewardedAd = new RewardedAd(this, "adUnitId");
//load AM RewardedVideo
PublisherAdRequest.Builder builder = new PublisherAdRequest.Builder();
PublisherAdRequest request = builder.build();
adUnit.fetchDemand(request, new OnCompleteListener() {
           @Override
           public void onComplete(ResultCode resultCode) {
               amRewardedAd.loadAd(request, new RewardedAdLoadCallback() {
                   @Override
                   public void onRewardedAdLoaded() {
                       // Ad successfully loaded.
                       if (amRewardedAd.isLoaded()) {
                           amRewardedAd.show(DemoActivity.this, new RewardedAdCallback() {
                               @Override
                               public void onRewardedAdOpened() {
                                   // Ad opened.
                               }
                               @Override
                               public void onRewardedAdClosed() {
                                   // Ad closed.
                               }
                               @Override
                               public void onUserEarnedReward(@NonNull RewardItem reward) {
                                   // User earned reward.
                               }
                               @Override
                               public void onRewardedAdFailedToShow(int errorCode) {
                                   // Ad failed to display.
                               }
                           });
                       }
                   }
                   @Override
                   public void onRewardedAdFailedToLoad(int errorCode) {
                       // Ad failed to load.
                   }
               });
}
});

```


**Mopub**

```java
//setup PB RewardedVideo
RewardedVideoAdUnit adUnit = new RewardedVideoAdUnit("configId");

VideoAdUnit.Parameters parameters = new VideoAdUnit.Parameters();

parameters.setPlacement(5);  // or alternative enum value Signals.Placement.Interstitial
parameters.setApi(Arrays.asList(1,2));  // or alternative enum values [Signals.Api.VPAID_1, Signals.Api.VPAID_2]
parameters.setMaxBitrate(1500);
parameters.setMinBitrate(300);
parameters.setMaxDuration(30);
parameters.setMinDuration(5);
parameters.setMimes(Arrays.asList("video/x-flv", "video/mp4"));
parameters.setPlaybackMethod(1); // or alternative enum value (Signals.PlaybackMethod.AutoPlaySoundOn)
parameters.setProtocols(Arrays.asList(2,3)); // or alternative enum values (Signals.Protocols.VAST_2_0, Signals.Protocols.VAST_3_0)

adUnit.setParameters(parameters);


//setup MP RewardedVideo
SdkConfiguration sdkConfiguration = new SdkConfiguration.Builder("adUnitId").build();
MoPub.initializeSdk(this, sdkConfiguration, null);
MoPubRewardedVideos.setRewardedVideoListener(this);
//loadMPRewardedVideo
final Map<String, String> keywordsMap = new HashMap<>();
adUnit.fetchDemand(keywordsMap, new OnCompleteListener() {
           @Override
           public void onComplete(ResultCode resultCode) {
               MoPubRewardedVideoManager.RequestParameters parameters = new MoPubRewardedVideoManager.RequestParameters(Util.convertMapToMoPubKeywords(keywordsMap));
               MoPubRewardedVideos.loadRewardedVideo("adUnitId", parameters, (MediationSettings) null);
           }
});
//MoPub Rewarded Video Listener
   @Override
   public void onRewardedVideoLoadSuccess(@NonNull String adUnitId) {
       if (MoPubRewardedVideos.hasRewardedVideo(MP_ADUNITID_REWARDED)) {
           MoPubRewardedVideos.showRewardedVideo(MP_ADUNITID_REWARDED);
       }
   }
   @Override
   public void onRewardedVideoLoadFailure(@NonNull String adUnitId, @NonNull MoPubErrorCode errorCode) {
       LogUtil.d("onRewardedVideoLoadFailure:" + errorCode);
   }
   @Override
   public void onRewardedVideoStarted(@NonNull String adUnitId) {
   }
   @Override
   public void onRewardedVideoPlaybackError(@NonNull String adUnitId, @NonNull MoPubErrorCode errorCode) {
   }
   @Override
   public void onRewardedVideoClicked(@NonNull String adUnitId) {
   }
   @Override
   public void onRewardedVideoClosed(@NonNull String adUnitId) {
   }
   @Override
   public void onRewardedVideoCompleted(@NonNull Set<String> adUnitIds, @NonNull MoPubReward reward) {
   }

```

## Related Topics

- [Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-adunit-android.html)
- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
- [Banner Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-banneradunit-android.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-result-codes-android.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/android/prebidmobile-object-android.html)
- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
