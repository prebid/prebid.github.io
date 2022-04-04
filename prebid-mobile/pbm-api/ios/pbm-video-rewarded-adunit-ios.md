---
layout: page_v2
title: VideoRewardedAdUnit - iOS
description: VideoRewardedAdUnit - iOS
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---
# RewardedVideoAdUnit

Create a new Video Rewarded Ad Unit associated with a Prebid Server configuration ID and a video size.



`RewardedVideoAdUnit(configId: String)`


**Parameters**

`configId(String)`: Prebid Server configuration ID. Note: this is a Prebid Server [impression-level stored request ID](/prebid-server/features/pbs-storedreqs.html).



# Parameters

Parameters is a sub class of RewardedVideoAdUnit.Create new Parameters class to define the parameters of the video ad unit. Parameters contain the OpenRTB video attributes.


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

In the context of a RewardedVideoAdUnit, rewarded video ads are typically labled as interstitial. As such, Prebid SDK will default to value 5 if no placement value is supplied.

* `2` or `InBanner` : In-Banner placement exists within a web banner that leverages the banner space to deliver a video experience as opposed to another static or rich media format. The format relies on the existence of display ad inventory on the page for its delivery.
* `3` or `InArticle` : In-Article placement loads and plays dynamically between paragraphs of editorial content; existing as a standalone branded message.
* `4` or `InFeed` : In-Feed placement is found in content, social, or product feeds.
* `5` or `Slider`, `Floating` or `Interstitial` : Open RTB supports one of three values for option 5 as eitehr Slider, Floating or Interstitial. If an enum value is supplied in placement, bidders will recieve value 5 for placement type and assume to be interstitial with the instl flag set to 1.


### api

Array of integers or enum representing the supported [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) Frameworks:

* `1` or `Signals.Api.VPAID_1` : VPAID 1.0
* `2` or `Signals.Api.VPAID_2` : VPAID 2.0
* `3` or `Signals.Api.MRAID_1` : MRAID-1
* `4` or `Signals.Api.ORMMA` : ORMMA
* `5` or `Signals.Api.MARAID_2` : MRAID-2
* `6` or `Signals.Api.MARAID_3` : MRAID-3


### maxBitrate

Integer representing the [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) maximum bit rate in Kbps. 


### minBitrate

Integer representing the [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) minimum bit rate in Kbps.


### maxDuration

Integer representing the [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) maximum video ad duration in seconds.


### minDuration

Integer representing the [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) minimum video ad duration in seconds.


### mimes

Array of string representing the supported [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) content MIME types (e.g., “video/x-ms-wmv”, “video/mp4”).


### playbackMethod

Array of [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) playback methods. If none are specified, any method may be used. Only one method is typically used in practice. It is strongly advised to use only the first element of the array.

* `1` or `Signals.PlaybackMethod.AutoPlaySoundOn` : Initiates on Page Load with Sound On
* `2` or `Signals.PlaybackMethod.AutoPlaySoundOff` : Initiates on Page Load with Sound Off by Default
* `3` or `Signals.PlaybackMethod.ClickToPlay` : Initiates on Click with Sound On
* `4` or `Signals.PlaybackMethod.MouseOver` : Initiates on Mouse-Over with Sound On
* `5` or `Signals.PlaybackMethod.EnterSoundOn` : Initiates on Entering Viewport with Sound On
* `6` or `Signals.PlaybackMethod.EnterSoundOff`: Initiates on Entering Viewport with Sound Off by Default


### protocols

Array or enum of [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) supported Protocols. Values can be one of: 

* `1` or `Signals.Protocols.VAST_1_0` : VAST 1.0
* `2` or `Signals.Protocols.VAST_2_0` : VAST 2.0
* `3` or `Signals.Protocols.VAST_3_0` : VAST 3.0
* `4` or `Signals.Protocols.VAST_1_0_Wrapper` : VAST 1.0 Wrapper
* `5` or `Signals.Protocols.VAST_2_0_Wrapper` : VAST 2.0 Wrapper
* `6` or `Signals.Protocols.VAST_3_0_Wrapper` : VAST 3.0 Wrapper
* `7` or `Signals.Protocols.VAST_4_0` : VAST 4.0
* `8` or `Signals.Protocols.VAST_4_0_Wrapper` : VAST 4.0 Wrapper


See [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) for additional parameters and methods.

---

## Example


**Google Mobile Ads**  
Import the GoogleMobileAds from [google-mobile-sdk](https://developers.google.com/admob/ios/download).

**Swift**
```swift   
//setup PB RewardedVideo
let adUnit = RewardedVideoAdUnit(configId: "1001-1")

//video parameters
parameters.mimes = ["video/mp4"]
parameters.protocols = [2,3,7]    // or alternative enum values [Protocols.VAST_2_0, Protocols.VAST_3_0]
parameters.playbackMethod = [1]   // or alternative enum value [PlaybackMethod.AutoPlaySoundOn]
parameters.api = [1,2]            // or alternative enum values [Api.VPAID_1, Api.VPAID_2]
parameters.maxBitrate = 1500
parameters.minBitrate = 300
parameters.maxDuration = 30
parameters.minDuration = 5

adUnit.parameters = parameters

//setup AM RewardedVideo
let amRewardedAd = GADRewardedAd(adUnitID: "adUnitId")
//load AM RewardedVideo
let amRequest = GADRequest()
let adUnit.fetchDemand(adObject: amRequest) { (resultCode: ResultCode) in
           amRewardedAd.load(amRequest) { error in
               if let error = error {
                   print("loadAMRewardedVideo failed:\(error)")
               } else {
                   if amRewardedAd?.isReady == true {
                       amRewardedAd?.present(fromRootViewController: self, delegate:self)
                   }
               }
           }
       }

```

**Mopub**  
Import the Mopub SDK from [Mopub](https://developers.mopub.com/publishers/ios/integrate/).

**Swift**
```swift    
//setup PB RewardedVideo
let adUnit = RewardedVideoAdUnit(configId: "1001-1")
//setup MP RewardedVideo
MPRewardedVideo.setDelegate(self, forAdUnitId: "adUnitId")
//load MP RewardedVideo
let targetingDict = NSMutableDictionary()
adUnit.fetchDemand(adObject: targetingDict) { (resultCode: ResultCode) in
           print("Prebid demand fetch for mopub \(resultCode.name())")
           if let targetingDict = targetingDict as? Dictionary<String, String> {
               let keywords = Utils.shared.convertDictToMoPubKeywords(dict: targetingDict)
               MPRewardedVideo.loadAd(withAdUnitID: "adUnitId", keywords: keywords, userDataKeywords: nil, location: nil, mediationSettings: nil)
           }
}


```


## Related Topics

- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
- [Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html)
- [Banner Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-banneradunit-ios.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-result-codes-ios.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/ios/prebidmobile-object-ios.html)
- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
