---
layout: page_v2
title: Prebid Video | JW Player Example
description: Prebid client side video example for JW Player
top_nav_section: pbjs-video
nav_section: pbjs-video-examples
sidebarType: 4
isVideoExample: true
videoType: jw-player-platform

---

## {{page.title}}

{{ page.description }}



<div class="container pb-video-example">

  <div class="row" style="width:100%">
    {% include alerts/alert_important.html content="This example uses a test version of Prebid.js hosted on our CDN that is not recommended for production use.  It includes all available adapters.  Production implementations should build from source or customize the build using the <a href='http://prebid.org/download.html'>Download</a> page to make sure only the necessary bidder adapters are included." %}
  </div>

  <h2>Prebid Video - JW Platform</h2>
        <br>
        <br>
        <div id="myElement1" style="border:1px dashed red;"></div>
        <!-- This line loads a player without loading any video content -->
        <!-- Replace this with the correct url for your player -->
        <script src="https://content.jwplatform.com/libraries/72xIKEe6.js"></script>
        <script>
            var playerInstance = jwplayer('myElement1');

            function invokeVideoPlayer(url) {
                // this calls setup on the player we initialized
                // this will use the settings defined in the player we loaded above unless you override them here
                playerInstance.setup({
                    // this line loads a playlist from your jwplatform account (in either json or rss format)
                    // this can also be a single media file by specifying "file" : "content.jwplatform.com/videos/VIDEOKEY.mp4"
                    // Replace this with the correct url for your playlist
                    "playlist": "https://content.jwplatform.com/feeds/ae4tmw2D.json",
                    "width": 640,
                    "height": 480,
                    // we enable vast advertising for this player
                    "advertising": {
                        "client": "vast",
                        // url is the vast tag url that we passed in when we called invokeVideoPlayer in the header
                        "tag": url,
                    },
                });
            }

            if (tempTag) {
                invokeVideoPlayer(tempTag);
                tempTag = false;
            }

        </script>


</div>
