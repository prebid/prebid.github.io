---
layout: bidder
title: Telaria
description: Telaria Bidder Adaptor
pbjs: true
biddercode: telaria
media_types: video
gdpr_supported: true
---

### Overview
This documentation covers some of the parameters that the  **Telaria** `(previously Tremor Video)` exchange accepts. And is intended to be referenced by publishers using prebid 1.x. Documentation for prebid 0.x can be found under [tremor](/dev-docs/bidders/tremor)

### Bid Params
Please refer to the **Tag Parameters** section in the  [Telaria Console](https://console.telaria.com)

### Example Ad Unit
```javascript
var adUnit = {
    "code": "video1",
    "mediaTypes": {
        "video": {
            "playerSize": [640, 480],
            "context": "instream"
        }
    },
    "bids": [{
        "bidder": "telaria",
        "params": {
            "supplyCode": "ssp-demo-rm6rh",
            "adCode": "ssp-!demo!-lufip",
            "videoId": "MyCoolVideo"     
        }
    }]
}
```
### Supply Chain Object:
```javascript
// There are two ways of passing the SupplyChain Object to our adapter:
// 1) set it in the config
pbjs.setConfig({
    "schain": {
        "ver":"1.0",
        "complete": 1,
        "nodes": [
            {
                "asi":"indirectseller.com",
                "sid":"00001",
                "hp":1
            }
        ]     
    }
});

// 2) pass it in the params object of the adunit:
var adUnit = {
    "code": "video1",
    "mediaTypes": {
        "video": {
            "playerSize": [640, 480],
            "context": "instream"
        }
    },
    "bids": [{
        "bidder": "telaria",
        "params": {
            "supplyCode": "ssp-demo-rm6rh",
            "adCode": "ssp-!demo!-lufip",
            "videoId": "MyCoolVideo",
// Other params go here,
            "schain" : {
                "ver":"1.0",
                "complete":1,
                "nodes":[
                    {
                        "asi":"exchange1.com",
                        "sid":"1234",
                        "hp":1
                    },
                    {
                        "asi":"exchange2.com",
                        "sid":"abcd",
                        "hp":1
                    }
                ]
            }
        }
    }]
}
```
[Telaria Prebid Example](https://console.telaria.com/examples/hb/headerbidding.jsp)

### Delivery

+ `1` : In-Stream: Played before, during or after the streaming video content that the consumer has requested (e.g., Pre-roll, Mid-roll, Post-roll).
+ `2` : In-Banner: Exists within a web banner that leverages the banner space to deliver a video experience as opposed to another static or rich media format. The format relies on the existence of display ad inventory on the page for its delivery.
+ `3` : In-Article: Loads and plays dynamically between paragraphs of editorial content; existing as a standalone branded message.
+ `4` : In-Feed: Found in content, social, or product feeds.
+ `5` : Interstitial/Slider/Floating: Covers the entire or a portion of screen area, but is always on screen while displayed (i.e. cannot be scrolled out of view). Note that a full-screen interstitial (e.g., in mobile) can be distinguished from a floating/slider unit by the imp.instl field.

### Placement

+ `1` : Streaming
+ `2` : Progressive
+ `3` : Download

### Supply Chain Object
The adapter has been enhanced to accept the supply chain object (schain) if provided. Please refer to [SupplyChain for Non RTB Requests](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/master/supplychainobject.md#supplychain-for-non-openrtb-requests) for more information
