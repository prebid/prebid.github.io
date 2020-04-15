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

`configId`: String; Prebid Server configuration ID.



## Methods

`RewardedVideoAdUnit` inherits all methods from the [AdUnit](/prebid-mobile/pbm-api/android/pbm-adunit-android.html) object.



## Example

**Google Ad Manager**

```java
//setup PB RewardedVideo
RewardedVideoAdUnit adUnit = new RewardedVideoAdUnit("configId");
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
