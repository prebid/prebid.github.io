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

`configId(String)`: Prebid Server configuration ID.


See [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) for additional parameters and methods.

---

## Example


**Google Mobile Ads**  
Import the GoogleMobileAds from [google-mobile-sdk](https://developers.google.com/admob/ios/download).

**Swift**
```    
//setup PB RewardedVideo
let adUnit = RewardedVideoAdUnit(configId: "1001-1")
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
```    
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
