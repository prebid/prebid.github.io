---
layout: page_v2
title: Prebid Plugin for Brightcove (Videojs) Player API
description: Ad Unit Reference
top_nav_section: dev_docs
nav_section: plugins
pid: 10
---



# Sample Brightcove Player Prebid Plugin Integration - Prebid After Player is Loaded

## Overview

The simplest method for using the Brightcove Prebid Plugin is to invoke prebid and render the ad after the Brightcove Player has been loaded.

## Advantages

- Simpler publisher integration - the integration code only needs to occur in the body of the document where the Brightcove Player is loaded.
- Publisher may register the plugin in Brightcove Studio or on page, according to their preference.
- Because all of the code will run in the same document where the Brightcove Player is located, there are no cross-domain issues (with potentially one exception, noted in the "Caveats" section below).

## Disadvantages

- Potentially longer latency in rendering the selected ad; the observed latency is directly related to how long the prebid process is allowed to run.

## Caveats

- If the Brightcove Player is being embedded in a cross-domain (unfriendly) iFrame *and* the publisher is using a preferred ad server to determine the selected ad, then the publisher's code to select the winning ad must run within the same iFrame where the Brightcove Player is located.

## Sample Code

The following is a sample Brightcove Player Prebid Plugin integration that invokes prebid after the Brightcove Player has been loaded.

```html
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Brightcove Player Prebid Plugin - Prebid in Body</title>

    <link href="https://acdn.adnxs.com/video/plugins/css/mol/bc_vpaid_vast_mo.css" rel="stylesheet">
    <link href="https://acdn.adnxs.com/video/plugins/bc/prebid/bc_prebid_vast_vjs.css" rel="stylesheet">
</head>

<body >
<div style="background: #ff8800; color: #ffffff; overflow:scroll; width:1000px; height:800px;">

    <div id="parentContainer1" style="width:640px; position:absolute; top:100px; left:70px; z-index:1000;">
        <video id="player"
            data-video-id="1234567890"
            data-account="1234567890"
            data-player="ABCDEFGH"
            data-embed="default"
            data-application-id
            class="video-js" controls width="600" height="337.5"></video>
        <script src="//players.brightcove.net/5530036758001/HJMTvh2YZ_default/index.min.js"></script>
    </div>
</div>

<script type="text/javascript" src="https://acdn.adnxs.com/video/plugins/bc/prebid/bc_prebid_vast.js"></script>
<script>
    // register the plugin
    BCVideo_PrebidVastPlugin.init();

    // define the options (both prebid and render options)
    var options = {};

    // set the prebid options
    // specify prebid parameters as the value of biddersSpec
    // the set of bidders here shows how to specify the AppNexus video bidder:  appnexus
    var params = {
         code : 'my-video-tag',
         sizes : [640, 480],
         mediaType: 'video',
         bids: [
                {
                    bidder: 'appnexus',
                    params: {
                        placementId: 12334567,
                        video: {
                            skippable: true,
                            playback_method: ['auto_play_sound_off']
                        }
                    }
                }
            ]
     };
     options.biddersSpec = params;

     // set the Google Ad Manager Parameters
     // use this only if you want to use Google Ad Manager as your primary ad server
        var dfpParams = {
            params : {
                iu : '/1234456/prebid_cache_video_ad_unit_test',
                output : 'vast'
            }
        };

     options.dfpParameters = dfpParams;

    // add the render options
    // set timeOffset for a preroll
    options.timeOffset = 'start';

    // other publisher preferences can be passed in if needed
    options.skippable = {enabled: true, videoThreshold : 16, videoOffset : 5};

    // invoke doPrebid which will run prebid and then render the ad
    BCVideo_PrebidVastPlugin.renderAd(options, 'player');
</script>

</body>
</html>

```
