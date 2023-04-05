---
layout: page_v2
title: Prebid Plugin for Brightcove (Videojs) Player API
description: Ad Unit Reference
---



# Brightcove Prebid Plugin - Sample Integration Using General Method via Brightcove Studio

## Overview

You can define and integrate the Prebid Plugin in Brightcove Studio but define all the prebid and rendering options on the publisher page if you wish.  

See **[Plugin Integration with Brightcove Player Using Brightcove Studio]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-integration-studio.html)** for details about the General Method of integrating the plugin in Brightcove Studio.

This page presents a sample publisher page using the General Integration Method via Brightcove Studio.

## Sample Integration

```
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Brightcove Plugin Embedded Test</title>

</head>

<body >

<div style="background: #ff8800; color: #ffffff; overflow:scroll; width:750px; height:560px;">

    <div id="parentContainer1" style="width:640px; position:absolute; top:100px; left:70px; z-index:1000;">

        <video id="bcplayer"
            data-video-id="5664543481001"
            data-account="5530036758001"
            data-player="S1dkJj2Pz"
            data-embed="default"
            data-application-id
            class="video-js"
            controls
            playsinline
            width="600"
            height="337.5">
        </video>
        <script src="//players.brightcove.net/5530036758001/S1dkJj2Pz_default/index.min.js"></script>  
    </div>

    <script>
    // create the options object
    var adOptions = {
        "prebidPath": "//files.prebid.org/prebid-org.js",  // not for production use
        "biddersSpec": {
            ”code": "my-video-tag",
            "mediaTypes": {
                "video": {
                    "context": "instream",
		    "playerSize": [640,480],
                    "mimes": ["video/mp4","application/javascript"],
                    "protocols": [1,2,3,4,5,6,7,8],
                    "playbackmethod": [1,2],
                    "api": [1,2 ]
                }
            },
            "bids": [{
                "bidder": "appnexus",
                "params": {
                    "placementId": 8845778
                }
            }]
        },
        "prebidConfigOptions": {
         "cache": {"url": "https://prebid.adnxs.com/pbc/v1/cache"},
        "enableSendAllBids": true
        },
        "prebidTimeout": 700,
        "enablePrebidCache": true
    };

    // add in the render options
    // other publisher preferences can be passed in if needed
    adOptions.skippable = {enabled: true, videoThreshold : 16, videoOffset : 5};


    // call renderAd on the plugin
    BCVideo_PrebidVastPlugin.renderAd(adOptions, 'bcplayer');     
    </script>

</div>

</body>
</html>
```


