---
layout: bidder
title: Telaria
description: Telaria Bidder Adaptor
hide: true
biddercode: telaria
biddercode_longer_than_12: false
media_types: video
---

### Overview
This documentation covers some of the parameters that the  **Telaria** `(previously Tremor Video)` exchange accepts. And is intended to be referenced by publishers using prebid 1.x. Documentation for prebid 0.x can be found under [tremor]({{site.baseurl}}/dev-docs/bidders/bidders.html#tremor)


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
            // Other params go here       
        }
    }]
}
```

### delivery

+ `1` : In-Stream: Played before, during or after the streaming video content that the consumer has requested (e.g., Pre-roll, Mid-roll, Post-roll).
+ `2` : In-Banner: Exists within a web banner that leverages the banner space to deliver a video experience as opposed to another static or rich media format. The format relies on the existence of display ad inventory on the page for its delivery.
+ `3` : In-Article: Loads and plays dynamically between paragraphs of editorial content; existing as a standalone branded message.
+ `4` : In-Feed: Found in content, social, or product feeds.
+ `5` : Interstitial/Slider/Floating: Covers the entire or a portion of screen area, but is always on screen while displayed (i.e. cannot be scrolled out of view). Note that a full-screen interstitial (e.g., in mobile) can be distinguished from a floating/slider unit by the imp.instl field.

### placement

+ `1` : Streaming
+ `2` : Progressive
+ `3` : Download
