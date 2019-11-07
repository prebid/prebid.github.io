---
layout: page_v2
title: VideoAdUnit AdUnit
description: VideoAdUnit AdUnit
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# VideoAdUnit: AdUnit
{: .notoc}

The VideoAdUnit is a subclass of the [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) class. Use the VideoAdUnit object to create and configure a video outstream ad unit in your app.

Currently Google Ad Manager is the only supported ad server. Subsequent releases will provide support for additional ad servers.
{: .alert .alert-info}

- TOC
 {:toc}

## Object

### VideoAdUnit

Create a new Video Outstream Ad Unit associated with a Prebid Server configuration ID and a video size.

See [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) for additional parameters and methods.

```VideoAdUnit(configId: String, size: CGSize(width: Int, height: Int), type:Enum)```

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



# videoAd: Video Events

## videoAd

* Video event listeners

`videoAd (event: PBVideoAdEvent)`: event to listen to

**Parameters**

Events: one of the below event types
* AdLoadSuccess
* AdLoadFail
* AdClicked
* AdStarted
* AdDidReachEnd



See [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) for addtional parameters and methods.

---

## Example



**Google Mobile Ads**

Import the GoogleMobileAds from the [google-mobile-sdk](https://developers.google.com/admob/ios/download) into the UIViewController displaying the VideoAdUnit

**Swift**
```
    var amBanner: DFPBannerView!
    var adUnit: AdUnit!

    func setupAndLoadAMBannerVAST() {
        
        setupPBBannerVAST()
        
        setupAMBannerVAST()

        loadBanner()
    }
    
    func setupPBBannerVAST() {
        
        Prebid.shared.prebidServerHost = .Rubicon
        Prebid.shared.prebidServerAccountId = "accountId"
        
        adUnit = VideoAdUnit(configId: "configId", size: CGSize(width: 300, height: 250), type: .inBanner)
    }

    func setupAMBannerVAST() {
        setupAMBanner(id: "/5300653/test_adunit_vast_pavliuchyk")
    }

    func setupAMBanner(id: String) {
        amBanner = DFPBannerView(adSize: kGADAdSizeMediumRectangle)
        amBanner.adUnitID = id
    }

    func loadBanner() {

        adUnit.fetchDemand(adObject: self.request) { [weak self] (resultCode: ResultCode) in
            print("Prebid demand fetch for DFP \(resultCode.name())")
        }
    }

```




## Related Topics

- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-iOS.html)
- [Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html)
- [Intersitial Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-interstitialadunit-ios.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-result-codes-ios.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/ios/prebidmobile-object-ios.html)
- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
