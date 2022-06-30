---
layout: page_v2
title: VideoAdUnit AdUnit:Instream
description: VideoAdUnit AdUnit:Instream
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# VideoAdUnit AdUnit:Instream
{: .notoc}

This page describes how to implement a `VideoAdUnit` for the display of instream videos.

The VideoAdUnit is a subclass of the [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) class. Use the VideoAdUnit object to create and configure a video instream ad unit in your app.

Video instream is only supported with Google Ad Manager.
{: .alert .alert-info}

- TOC
 {:toc}

## VideoAdUnit

 Create a new Video Instream Ad Unit associated with a Prebid Server configuration ID and a video size.  

 See [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) for additional parameters and methods.

 `VideoAdUnit(configId: String, size: CGSize(width: Int, height: Int))`

 **Parameters**

 `configId(String)`: Prebid Server configuration ID. Note: this is a Prebid Server [impression-level stored request ID](/prebid-server/features/pbs-storedreqs.html).

 `size(CGSize)`: Width and height of the video ad unit.

### CGSize

 Size of video ad unit.

 **Parameters**

 `width`: Width of video ad unit in DIPs.

 `height`: Height of video ad unit in DIPs.

### Parameters

  `placement`: [int] or [enum]: OpenRTB placement

  `api`: [int] or [enum]: OpenRTB api frameworks

  `maxBitrate`: int: OpenRTB maxBirate

  `minBitrate`: int: OpenRTB minBitrate

  `maxDuration`:int: OpenRTB maxDuration

  `minDuration`: int: OpenRTB minDuration

  `mimes`: [string]: OpenRTB mime types

  `playbackMethod`: [int]: OpenRTB playbackMethod

  `protocols`: [int] or [enum]: OpenRTB Protocols

#### api
  Array of integers or enum representing the supported OpenRTB 2.5 Frameworks:  
  - 1 or Signals.Api.VPAID_1 : VPAID 1.0  
  - 2 or Signals.Api.VPAID_2 : VPAID 2.0  
  - 3 or Signals.Api.MRAID_1 : MRAID-1  
  - 4 or Signals.Api.ORMMA : ORMMA  
  - 5 or Signals.Api.MARAID_2 : MRAID-2  
  - 6 or Signals.Api.MARAID_3 : MRAID-3

#### maxBitrate
  Integer representing the OpenRTB 2.5 maximum bit rate in Kbps.

#### minBitrate
  Integer representing the OpenRTB 2.5 minimum bit rate in Kbps.

#### maxDuration
  Integer representing the OpenRTB 2.5 maximum video ad duration in seconds.

#### minDuration
  Integer representing the OpenRTB 2.5 minimum video ad duration in seconds.

#### mimes
  Array of strings representing the supported OpenRTB 2.5 content MIME types (e.g., “video/x-ms-wmv”, “video/mp4”).

#### playbackMethod
  Array of OpenRTB 2.5 playback methods. If none are specified, any method may be used. Only one method is typically used in practice. It is strongly advised to use only the first element of the array.
  - 1 or Signals.PlaybackMethod.AutoPlaySoundOn : Initiates on Page Load with Sound On
  - 2 or Signals.PlaybackMethod.AutoPlaySoundOff : Initiates on Page Load with Sound Off by Default
  - 3 or Signals.PlaybackMethod.ClickToPlay : Initiates on Click with Sound On
  - 4 or Signals.PlaybackMethod.MouseOver : Initiates on Mouse-Over with Sound On
  - 5 or Signals.PlaybackMethod.EnterSoundOn : Initiates on Entering Viewport with Sound On
  - 6 or Signals.PlaybackMethod.EnterSoundOff: Initiates on Entering Viewport with Sound Off by Default

#### protocols
  Array or enum of OpenRTB 2.5 supported Protocols. Values can be one of:
  - 1 or Signals.Protocols.VAST_1_0 : VAST 1.0
  - 2 or Signals.Protocols.VAST_2_0 : VAST 2.0
  - 3 or Signals.Protocols.VAST_3_0 : VAST 3.0
  - 4 or Signals.Protocols.VAST_1_0_Wrapper : VAST 1.0 Wrapper
  - 5 or Signals.Protocols.VAST_2_0_Wrapper : VAST 2.0 Wrapper
  - 6 or Signals.Protocols.VAST_3_0_Wrapper : VAST 3.0 Wrapper
  - 7 or Signals.Protocols.VAST_4_0 : VAST 4.0
  - 8 or Signals.Protocols.VAST_4_0_Wrapper : VAST 4.0 Wrapper

See our documentation on [AdUnit](/prebid-mobile/pbm-api/ios/pbm-adunit-ios.html) for more details.

### Helper to Construct Google IMA adServer URL

This utility method takes the adUnit Id of the publisher along with the adSlot sizes & Prebid custom keywords to construct the IMA adServer URL that the publisher can use to make the request.

```public func constructAdTagURLForIMAWithPrebidKeys (adUnitID:String, adSlotSizes:[IMAAdSlotSize], customKeywords: [String:String]) throws -> String```

### Example

<div>
<pre>
<code>
var adUnit: VideoAdUnit!

var adsLoader: IMAAdsLoader!
var adsManager: IMAAdsManager!


//setup PB Video
let adUnit = VideoAdUnit(configId: "1001-1")

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

//setup IMA Video
adsLoader = IMAAdsLoader(settings: nil)
adsLoader.delegate = self
adUnit.fetchDemand { (ResultCode, prebidKeys: [String : String]?) in
    print("prebid keys")
    if(ResultCode == .prebidDemandFetchSuccess){
        do {
                     let adServerTag:String = try IMAUtils.shared.constructAdTagURLForIMAWithPrebidKeys(adUnitID: "your_ad_unit",  
                    adSlotSizes: [.Size640x480,.Size400x300], customKeywords: prebidKeys!)
                    let adDisplayContainer = IMAAdDisplayContainer(adContainer: self.appInstreamView)
                    // Create an ad request with our ad tag, display container, and optional user context.
                    let request = IMAAdsRequest(adTagUrl: adServerTag, adDisplayContainer: adDisplayContainer, contentPlayhead: nil, userContext: nil)
                    self.adsLoader.requestAds(with: request)
                }catch {
                    print (error)
                }
    } else {
                print ("Error constructing IMA Tag")
            }
    }
}


//adsLoader delegate
    func adsLoader(_ loader: IMAAdsLoader!, adsLoadedWith adsLoadedData: IMAAdsLoadedData!) {
        // Grab the instance of the IMAAdsManager and set ourselves as the delegate.
        adsManager = adsLoadedData.adsManager
        adsManager.delegate = self


        // Create ads rendering settings and tell the SDK to use the in-app browser.
        let adsRenderingSettings = IMAAdsRenderingSettings()
        adsRenderingSettings.webOpenerPresentingController = self


        // Initialize the ads manager.
        adsManager.initialize(with: adsRenderingSettings)
    }

    func adsLoader(_ loader: IMAAdsLoader!, failedWith adErrorData: IMAAdLoadingErrorData!) {
        print("Error loading ads: \(adErrorData.adError.message ?? "nil")")
    }

    //adsManager delegate
    func adsManager(_ adsManager: IMAAdsManager!, didReceive event: IMAAdEvent!) {
        if event.type == IMAAdEventType.LOADED {
          // When the SDK notifies us that ads have been loaded, play them.
          adsManager.start()
        }
    }

    func adsManager(_ adsManager: IMAAdsManager!, didReceive error: IMAAdError!) {
        print("AdsManager error: \(error.message ?? "nil")")
    }

</code>
</pre>
</div>
