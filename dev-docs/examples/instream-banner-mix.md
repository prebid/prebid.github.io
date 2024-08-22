---
layout: example
title: Instream Video and Banner Ad Mixed Page
description: An example of displaying both instream video and banner ads using Prebid.js

sidebarType: 1

about:
- This example shows how to display instream video and banner ads within the same configuration.

---

## Instream Video and Banner Ad Mixed Page

{% capture htmlCodePrebid %}<h2>Prebid Video - JW Platform</h2>
<div id="myElement1"></div>
<!-- This line loads a player without loading any video content -->
<!-- Replace this with the correct url for your player -->
<script src="https://content.jwplatform.com/libraries/72xIKEe6.js"></script>
<script>
<!-- markdownlint-disable MD0034 -->
// we initialize our player instance, specifying the div to load it into
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

<!-- Basic Prebid Display Section - Body -->
<!-- ################################### -->
<h2>Basic Prebid.js Example</h2>
<h5>Div-1</h5>
<div id='div-1'>
    <script type='text/javascript'>
        googletag.cmd.push(function() {
            googletag.display('div-1');
        });
    </script>
</div>

<h5>Div-2</h5>
<div id='div-2'>
    <script type='text/javascript'>
        googletag.cmd.push(function() {
            googletag.display('div-2');
        });
    </script>
</div>
{% endcapture %}

{% capture jsCode %}var div_1_sizes = [
    [300, 250],
    [300, 600]
];
var div_2_sizes = [
    [728, 90],
    [970, 250]
];
var PREBID_TIMEOUT = 1000;
var FAILSAFE_TIMEOUT = 3000;

var adUnits = [
    {
        code: '/19968336/header-bid-tag-0',
        mediaTypes: {
            banner: {
                sizes: div_1_sizes
            }
        },
        bids: [{
            bidder: 'appnexus',
            params: {
                placementId: 13144370
            }
        }]
    },
    {
        code: '/19968336/header-bid-tag-1',
        mediaTypes: {
            banner: {
                sizes: div_2_sizes
            }
        },
        bids: [{
            bidder: 'appnexus',
            params: {
                placementId: 13144370
            }
        }]
    }
];

var videoAdUnit = {
    code: 'video1',
    mediaTypes: {
        video: {
            playerSize: [640, 480],
            context: 'instream',
            plcmt: 2,
        }
    },
    bids: [{
        bidder: 'appnexus',
        params: {
            placementId: 13232361, // Add your own placement id here
            video: {
                skipppable: true,
                playback_method: ['auto_play_sound_off']
            }
        }
    }]
};

var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
googletag.cmd.push(function() {
    googletag.pubads().disableInitialLoad();
});

// Init Prebid.js
var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

// define invokeVideoPlayer in advance in case we get the bids back from prebid before the entire page loads
var tempTag = false;
var invokeVideoPlayer = function(url) {
    tempTag = url;
};

pbjs.que.push(function() {
    pbjs.addAdUnits(adUnits);
    pbjs.addAdUnits(videoAdUnit);
    pbjs.setConfig({
        debug: true,
        cache: {
            url: '<https://prebid.adnxs.com/pbc/v1/cache>'
        }
    });
    pbjs.requestBids({
        bidsBackHandler: initAdserver,
        timeout: PREBID_TIMEOUT,
        auctionId: 'auction_1'
    })
});

function initAdserver(bids) {

    if (pbjs.initAdserverSet) return;
    pbjs.initAdserverSet = true;

    // Get all of the adUnit codes for the display adUnits
    var displayAdUnitCodes = [];
    adUnits.forEach(function(adUnit) {
        displayAdUnitCodes.push(adUnit.code);
    });

    // Set targeting for each display slot
    googletag.cmd.push(function() {
        pbjs.que.push(function() {
            pbjs.setTargetingForGPTAsync(displayAdUnitCodes);
            googletag.pubads().refresh();
        });
    });

    // Build DFP URL with targeting for videoAdUnit
    var videoUrl = pbjs.adServers.dfp.buildVideoUrl({
        adUnit: videoAdUnit,
        params: {
            iu: '/19968336/prebid_cache_video_adunit',
            cust_params: {
                section: 'blog',
                anotherKey: 'anotherValue'
            },
            output: 'vast'
        }
    });

    // Pass URL to Video player to make final DFP call
    invokeVideoPlayer(videoUrl);
}
// in case PBJS doesn't load
setTimeout(function() {
    initAdserver();
}, FAILSAFE_TIMEOUT);

googletag.cmd.push(function() {
    googletag.defineSlot('/19968336/header-bid-tag-0', div_1_sizes, 'div-1').addService(googletag.pubads());
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
});
googletag.cmd.push(function() {
    googletag.defineSlot('/19968336/header-bid-tag-1', div_2_sizes, 'div-2').addService(googletag.pubads());
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
});
{% endcapture %}

{% include code/web-example.html id="basic-prebid-example" html=htmlCodePrebid js=jsCode %}
