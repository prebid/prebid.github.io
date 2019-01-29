---
layout: page_v2
title: InterstitialAdUnit - iOS
description: InterstitialAdUnit - iOS
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---
# InterstitialAdUnit

The InterstitialAdUnit is a subclass of the [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) class. Use the InterstitialAdUnit object to create and configure a interstitial ad unit in your app. 

## Object

### InterstitialAdUnit

Create a new Interstitial Ad Unit associated with a Prebid Server configuration ID. 

See [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) for additional parameters and methods. 

## Examples

**Create an InterstitialAdUnit**
```    
let dfpInterstitialView = DFPInterstitial(adUnitID: "/12345/foo")
dfpInterstitialView.delegate = self
 
let interstitialAdUnit = InterstitialAdUnit(configId: "PREBID_SERVER_CONFIGURATION_ID")
interstitialAdUnit.addUserKeyword(key: "my_key", value: "my_value")
interstitialAdUnit.fetchDemand(adObject: dfpInterstitialView) { (resultCode) in
         //Load the dfp request
        interstitialAdUnit.load(GADRequest())
}
```
## Related Topics 

- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-iOS.html)
- [Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html)
- [Banner Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-bannerad-ios.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-result-codes-ios.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/ios/prebidmobile-object-ios.html)
- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)








