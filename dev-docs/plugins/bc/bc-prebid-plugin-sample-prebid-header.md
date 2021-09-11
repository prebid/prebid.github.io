---
layout: page_v2
title: Prebid Plugin for Brightcove (Videojs) Player API
description: Ad Unit Reference
top_nav_section: dev_docs
nav_section: plugins
pid: 10
---



# Sample Brightcove Player Prebid Plugin Integration - Prebid in Header

## Overview

The Brightcove Player Prebid Plugin can be integrated on the publisher's page in such a way that the pre-bidding can be executed in the header of the page before the Brightcove Player is loaded.

## Advantages

- Potentially lower latency in rendering selected ad; the reduction in latency is directly related to how long the prebid process is allowed to run.

## Disadvantages

- Requires publisher code both in the header to start the prebid process and also in the body to render the ad once the Brightcove Player is loaded.
- Publisher *must* register the plugin on page - it cannot register the plugin in Brightcove Studio.

## Caveats

- There is no guarantee that the prebid process will complete *before* the Brightcove Player is loaded, so there may still be some latency.
- If the Brightcove Player is being embedded in a cross-domain (unfriendly) iFrame, then the prebid process *must* occur in the header of the iFrame and *not* in the header of the page.

## Sample Code

The following is a sample Brightcove Player Prebid Plugin integration that invokes Prebid in the header before Brightcove Player has been loaded.

```
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Brightcove Player Prebid Plugin - Prebid in Header</title>

    <link href="https://acdn.adnxs.com/video/plugins/css/mol/bc_vpaid_vast_mo.css" rel="stylesheet">
    <link href="https://acdn.adnxs.com/video/plugins/bc/prebid/bc_prebid_vast_vjs.css" rel="stylesheet">
    <script>
        // define the prebid options variable
        // NOTE:  you MUST use this variable name
        window.bc_plugin_pbjs = { plugin_prebid_options: {} };

        // specify prebid parameters as the value of biddersSpec
        // the set of bidders here shows how to specify the AppNexus video bidder:  appnexus
        var params = {
            code : 'my-video-tag',
            mediaTypes: {
		video: {
		  context: 'instream',
                  playerSize: [640, 480],
                  mimes: ['video/mp4'],
                  protocols: [1, 2, 3, 4, 5, 6, 7, 8],
                  playbackmethod: [2],
                  skip: 1
		}
            bids: [
                {
                    bidder: 'appnexus',
                    params: {
                        placementId: 12334567
                    }
                }
            ]
        };
        window.bc_plugin_pbjs.plugin_prebid_options.biddersSpec = params;

        // set the Google Ad Manager Parameters
        var dfpParams = {
            params : {
                iu : '/1234456/prebid_cache_video_ad_unit_test',
                output : 'vast'
            }
        };

        window.bc_plugin_pbjs.plugin_prebid_options.dfpParameters = dfpParams;
    </script>

    <script type="text/javascript" src="https://acdn.adnxs.com/video/plugins/bc/prebid/bc_prebid_vast.min.js"></script>
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

<script>
    // register the plugin
    BCVideo_PrebidVastPlugin.init();
    // set the render options
    var renderoptions = {};
    // set timeOffset for a preroll
    renderoptions.timeOffset = 'start';

    // other publisher preferences can be passed in if needed
    renderoptions.skippable = {enabled: true, videoThreshold : 16, videoOffset : 5};

    BCVideo_PrebidVastPlugin.renderAd(renderoptions, 'player');
</script>

</body>
</html>
```


