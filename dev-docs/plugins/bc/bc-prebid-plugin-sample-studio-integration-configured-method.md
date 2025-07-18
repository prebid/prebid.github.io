---
layout: page_v2
title: Prebid Plugin for Brightcove (Videojs) Player API
description: Ad Unit Reference
top_nav_section: dev_docs
nav_section: plugins
pid: 10
---



# Brightcove Prebid Plugin - Sample Integration Using Configured Method via Brightcove Studio

## Overview

You can define and integrate and completely configure the Prebid Plugin in Brightcove Studio. Using this method, you do not have to add any code on the publisher page to support the plugin.

See **[Plugin Integration with Brightcove Player Using Brightcove Studio]({{site.baseurl}}/dev-docs/plugins/bc/bc-prebid-plugin-integration-studio.html)** for details about the Configured Method of integrating the plugin in Brightcove Studio.

This page presents a sample publisher page using the Configured Integration Method via Brightcove Studio.

## Sample Integration

```html
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

</div>

</body>
</html>
```
