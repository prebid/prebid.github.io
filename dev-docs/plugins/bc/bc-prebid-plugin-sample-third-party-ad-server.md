---
layout: page_v2
title: Prebid Plugin for Brightcove (Videojs) Player API
description: Ad Unit Reference
top_nav_section: dev_docs
nav_section: plugins
pid: 10
---



# Sample Brightcove Player Prebid Plugin Integration - Using Publisher Preferred Ad Server

## Overview

The Brightcove Prebid Plugin can be used to generate partial results where a list of bids returned during pre-bidding is passed into a publisher-preferred ad server.  This preferred ad server will make the final determination of the winning ad outside of the plugin.

In this case, the publisher must call `renderAd()` to pass in the results determined by the preferred ad server.

This process can be done either when the plugin runs prebid in the header or in the body after the Brightcove Player has been loaded.

## Sample Code

### Using Publisher Preferred Ad Server, Plugin Runs Prebid in Header

The following is a sample Brightcove Prebid Plugin integration that invokes prebid in the header before Brightcove Player has been loaded, but the final decision is made by a publisher-preferred ad server.

#### Sample Prebid Plugin Integration, Using Results From a Preferred Ad Server, Prebid Run in Header

```html
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
        window.bc_plugin_pbjs.plugin_prebid_options.biddersSpec = params;

        // set the callback for the external ad server
        window.bc_plugin_pbjs.plugin_prebid_options.adServerCallback = function (bids) {
            callMyAdServerCode(bids, function (creative) {window.myPrebidCreative = creative});
        };

    </script>

    <script type="text/javascript" src="https://acdn.adnxs.com/video/plugins/bc/prebid/bc_prebid_vast.js"></script>
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
    ...
    // IMPORTANT - NEED TO HAVE SOME CODE TO CHECK TO MAKE SURE THAT THE RESULTS FROM THE PREFERRED AD SERVER IS AVAILABLE
    ...
    // register the plugin
    BCVideo_PrebidVastPlugin.init();
    // set the render options
    var renderoptions = {};
    // set timeOffset for a preroll
    renderoptions.timeOffset = 'start';

    // other publisher preferences can be passed in if needed
    renderoptions.skippable = {enabled: true, videoThreshold : 16, videoOffset : 5};


    // call render ad using the creative that was selected using the preferred ad server
    BCVideo_PrebidVastPlugin.renderAd(renderoptions, 'player', window.myPrebidCreative);
</script>

</body>
</html>
```

### Using Publisher Preferred Ad Server, Plugin Runs Prebid After Brightcove Player Has Loaded

The following is a sample Brightcove Prebid Plugin integration that invokes prebid after Brightcove Player has been loaded, but the final decision is made by a publisher-preferred ad server.

#### Sample Prebid Plugin Integration, Using Results From a Preferred Ad Server; Prebid Runs After Player Has Loaded

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

    // set the callback for the external ad server
    // pluginCallback represents an inline function defined within the plugin
    // pluginCallback should have the following prototype:  function (creative)
    // the creative argument can be xml or url to the xml
    options.adServerCallback = function (bids, pluginCallback) {
        var myCreative = callMyAdServerCode(bids);
        pluginCallback(myCreative);
    };


    // add in the render options
    options.skippable = {enabled: false};
    options.timeOffset = 'start';

     // call renderAd to run prebid and to render the ad selected by the third-party ad server
     BCVideo_PrebidVastPlugin.renderAd(roptions, 'bcPlayer');
</script>

</body>
</html>
```
