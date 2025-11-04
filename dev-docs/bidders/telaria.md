---
layout: bidder
title: Telaria
description: Telaria Bidder Adaptor
pbjs: true
pbs: false
biddercode: telaria
media_types: video, no-display
tcfeu_supported: true
usp_supported: false
coppa_supported: false
schain_supported: true
floors_supported: false
prebid_member: true
safeframes_ok: false
deals_supported: false
pbs_app_supported: false
fpd_supported: false
gvl_id: 202
sidebarType: 1
---

### Registration

The Telaria adapter requires setup and approval from your Magnite account manager. Please reach out to them for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name                 | Scope    | Description                                                                                                                                                   | Example                                                                                                                                                                                              | Type        |
|----------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| adCode | required | A unique ID assigned by your Magnite account team. | `'lufip'`   | `string`    |
| supplyCode | required | A code assigned by your Magnite account team. | `'demo'`   | `string`    |
| videoId | optional | The ID of video asset. | `'myVideo'`   | `string`    |

For other parameters, please refer to the **Tag Parameters** section in the  [Telaria Console](https://console.telaria.com)

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

### Supply Chain Object

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
            "videoId": "MyCoolVideo"
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
