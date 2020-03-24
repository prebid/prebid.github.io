---
layout: page_v2
title: VideoInterstitialAdUnit - iOS
description: VideoInterstitialAdUnit - iOS
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---
# VideoInterstitialAdUnit

Create a new Video Outstream Ad Unit associated with a Prebid Server configuration ID and a video size.

Video Instertital is only supported with Google Ad Manager.
{: .alert .alert-info}

`VideoInterstitialAdUnit(configId: String)`

**Parameters**

`configId(String)`: Prebid Server configuration ID.

See [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) for additional parameters and methods.

---

## Example


**Google Mobile Ads**  
Import the GoogleMobileAds from [google-mobile-sdk](https://developers.google.com/admob/ios/download) into the UIViewController displaying the VideoInterstitialAdUnit.

**Swift**
```    
    var adUnit: AdUnit!
    var amInterstitial: DFPInterstitial!

    func setupAndLoadAMInterstitialVAST() {

        setupPBInterstitialVAST()
        setupAMInterstitialVAST()

        loadInterstitial()
    }

    func setupPBInterstitialVAST() {
        Prebid.shared.prebidServerHost = .Rubicon
        Prebid.shared.prebidServerAccountId = "accountId"
        adUnit = VideoInterstitialAdUnit(configId: "configId")
    }

    func setupAMInterstitialVAST() {
        amInterstitial = DFPInterstitial(adUnitID: "/5300653/test_adunit_vast_pavliuchyk")
    }

    func loadInterstitial() {

        adUnit.fetchDemand(adObject: self.request) { (resultCode: ResultCode) in
            print("Prebid demand fetch for DFP \(resultCode.name())")
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
