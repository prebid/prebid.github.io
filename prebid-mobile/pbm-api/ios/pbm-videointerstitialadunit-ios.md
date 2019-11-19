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

Currently Google Ad Manager is the only supported ad server. Subsequent releases will provide support for additional ad servers.
{: .alert .alert-info}

See [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) for additional parameters and methods.

```VideoInterstitialAdUnit(configId: String, size: CGSize(width: Int, height: Int), type:Enum)```

**Parameters**

`configId(String)`: Prebid Server configuration ID

`size (CGSize)`: Width and height of the video ad unit

`type:Enum`: OpenRTB Placement Type


#### CGSize

Size of video ad unit

**Parameters**

`width`: Width of video ad unit in DIPs

`height`: Height of video ad unit in DIPs


#### type

OpenRTB Placement Type represented as an enumeration of values:

**Parameters**

* `inBanner` is transformed into OpenRTB value 2 to bid adapters
* `inArticle` is transformed into OpenRTB value 3 to bid adapters
* `inFeed` is transformed into OpenRTB value 4 to bid adapters




See [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) for addtional parameters and methods.

---

## Example


**Google Mobile Ads**
Import the GoogleMobileAds from the [google-mobile-sdk](https://developers.google.com/admob/ios/download) into the UIViewController displaying the VideoAdUnit

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
        adUnit = VideoInterstitialAdUnit(configId: "configId", size: CGSize(width: 300, height: 250), type: .inBanner)
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

- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-iOS.html)
- [Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html)
- [Banner Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-bannerad-ios.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-result-codes-ios.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/ios/prebidmobile-object-ios.html)
- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
