---
layout: page_v2
title: Prebid Plugin for Brightcove (Videojs) Player API
description: Ad Unit Reference
top_nav_section: dev_docs
nav_section: plugins
pid: 10
---



# Sample Brightcove Player Prebid Plugin Integration - Publisher Uses Custom Header Bidding, Plugin Renders the Ad

## Overview

Publishers can decide that they want to run their own custom header bidding process outside of the plugin. The Brightcove Player Prebid Plugin can then be used to render the ad that was selected by this custom process.

The publisher simply needs to call `renderAd()` once the Brightcove Player has been loaded.

## Sample Code

The following is a sample Brightcove Prebid Plugin integration that invokes to the plugin to render the results of a custom header process.

### Sample Prebid Plugin Integration, Using Results From External Custom Header Bidding

```html
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Brightcove Player Prebid Plugin - Custom Header Bidding</title>

    <link href="https://acdn.adnxs.com/video/plugins/css/mol/bc_vpaid_vast_mo.css" rel="stylesheet">
    <link href="https://acdn.adnxs.com/video/plugins/bc/prebid/bc_prebid_vast_vjs.css" rel="stylesheet">
 <script type="text/javascript" src="../my-custom-header-bidding.js"></script>
 <script>
    runMyCustomHeaderBidding(function(creative) {window.myPrebidResults = creative});
 </script>
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

    // define the render options
    var options = {};
    // set timeOffset for a preroll
    options.timeOffset = 'start';

    // other publisher preferences can be passed in if needed
    options.skippable = {enabled: true, videoThreshold : 16, videoOffset : 5};

    // IMPORTANT NOTE
    // there should be some code here to synchronize the returns of the prebid results
    // with calling the renderAd function.  You need to make sure that
    // you have the prebid results BEFORE calling renderAd().
    // invoke renderAd, passing in the results of the custom prebid process
    BCVideo_PrebidVastPlugin.renderAd(options, 'player', window.myPrebidResults);
</script>

</body>
</html>
```
