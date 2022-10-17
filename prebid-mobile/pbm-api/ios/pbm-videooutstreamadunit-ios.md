---
layout: page_v2
title: VideoAdUnit AdUnit:Outstream
description: VideoAdUnit AdUnit:Outstream
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# Outstream VideoAdUnit: AdUnit
{: .notoc}

This page describes how to implement a `VideoAdUnit` for the display of outstream videos.

The VideoAdUnit is a subclass of the [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) class. Use the VideoAdUnit object to create and configure a video outstream ad unit in your app.

Video Outstream is only supported with Google Ad Manager.
{: .alert .alert-info}

- TOC
 {:toc}

## VideoAdUnit

Create a new Video Outstream Ad Unit associated with a Prebid Server configuration ID and a video size.  

See [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) for additional parameters and methods.

`VideoAdUnit(configId: String, size: CGSize(width: Int, height: Int), type:Enum)`

**Parameters**

`configId(String)`: Prebid Server configuration ID. Note: this is a Prebid Server [impression-level stored request ID](/prebid-server/features/pbs-storedreqs.html).

`size(CGSize)`: Width and height of the video ad unit.

`type:Enum`: OpenRTB Placement Type. This field is being deprecated in favor of parameters.type

### CGSize

Size of video ad unit.

**Parameters**

`width`: Width of video ad unit in DIPs.

`height`: Height of video ad unit in DIPs.


### type

{% capture deprecate %}
VideoAdUnit type will be deprecated in future releases. Use parameters.placement below for future usage of type.
{% endcapture %}
{% include /alerts/alert_important.html content=deprecate %}

OpenRTB Placement Type represented as an enumeration of values:

* inBanner is transformed into OpenRTB value 2 to bid adapters
* inArticle is transformed into OpenRTB value 3 to bid adapters
* inFeed is transformed into OpenRTB value 4 to bid adapters


### Parameters

Parameters is a sub class of videoAdUnit. Create new Parameters class to define the parameters of the video ad unit. Parameters contain the OpenRTB video attributes.


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


#### placement

[OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) Placement Type for the auction can be expressed as an integer array or can use an enum for easier readability. Option 1 (in-stream) is intentionally left out due to lack of in-stream support in Prebid SDK.

* `2` or `InBanner` : In-Banner placement exists within a web banner that leverages the banner space to deliver a video experience as opposed to another static or rich media format. The format relies on the existence of display ad inventory on the page for its delivery.
* `3` or `InArticle` : In-Article placement loads and plays dynamically between paragraphs of editorial content; existing as a standalone branded message.
* `4` or `InFeed` : In-Feed placement is found in content, social, or product feeds.
* `5` or `Slider` or `Floating` : While OpenRTB uses "5" to also designate interstitial as a placement type, interstitial is not used in the standard outsream format. For Interstital, use the videointerstital or RewardedVideoAdUnit ad unit


#### api

Array of integers or enum representing the supported [OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) Frameworks:

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




See [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) for additional parameters and methods.

---

## Example



**Google Mobile Ads**

Import the GoogleMobileAds from [google-mobile-sdk](https://developers.google.com/admob/ios/download) into the UIViewController displaying the VideoAdUnit.

**Swift**
```swift
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

        adUnit = VideoAdUnit(configId: "configId", size: CGSize(width: 300, height: 250))

        let parameters = VideoBaseAdUnit.Parameters()
        parameters.mimes = ["video/mp4"]
        parameters.protocols = [2,3,7]    // or alternative enum values [Protocols.VAST_2_0, Protocols.VAST_3_0]
        parameters.playbackMethod = [1]   // or alternative enum value [PlaybackMethod.AutoPlaySoundOn]
        parameters.api = [1,2]            // or alternative enum values [Api.VPAID_1, Api.VPAID_2]
        parameters.maxBitrate = 1500
        parameters.minBitrate = 300
        parameters.maxDuration = 30
        parameters.minDuration = 5
        parameters.placement = 2          // or alternative enum value Signals.Placement.InBanner

        adUnit.parameters = parameters
    }

    func setupAMBannerVAST() {
        setupAMBanner(id: "/networkID/adUnit")
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

- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
- [Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html)
- [Interstitial Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-bannerinterstitialadunit-ios.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-result-codes-ios.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-targeting-ios.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/ios/prebidmobile-object-ios.html)
- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
