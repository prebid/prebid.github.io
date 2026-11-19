---
layout: example
title: Instream Video and Banner Ad Mixed Page
description: An example of displaying both instream video and banner ads using Prebid.js

sidebarType: 1

about:
- This example shows how to display instream video and banner ads within the same configuration.
- The video ad is fetched from Google Ad Manager with `pbjs.adServers.gam.getVastXml` and played in JW Player; the bid VAST is cached locally (`cache.useLocal`).

---
<!-- markdownlint-disable-file MD034 -->
## Instream Video and Banner Ad Mixed Page

{% capture htmlCodePrebid %}<h2>Prebid Video - JW Player</h2>
<div id="myElement1"></div>
<!-- This line loads a player without loading any video content -->
<!-- Replace this with the library URL of your own JW Player -->
<script src="https://cdn.jwplayer.com/libraries/dNV4UKpE.js"></script>
<script>

// we initialize our player instance, specifying the div to load it into
var playerInstance = jwplayer('myElement1');

function invokeVideoPlayer(vastXml) {
    // this calls setup on the player we initialized
    // this will use the settings defined in the player we loaded above unless you override them here
    playerInstance.setup({
        // the content video; this can also be a "playlist" URL from your JW Player account
        "file": "https://vjs.zencdn.net/v/oceans.mp4",
        "width": 640,
        "height": 480,
        "autostart": true,
        "mute": true,
        // we enable vast advertising for this player
        "advertising": {
            "client": "vast",
            // vastXml is the VAST returned by Google Ad Manager, passed in when we called invokeVideoPlayer in the header
            "schedule": [{
                "vastxml": vastXml,
                "offset": "pre"
            }]
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
            bidder: 'msft',
            params: {
                placement_id: 13144370
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
            bidder: 'msft',
            params: {
                placement_id: 13144370
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
        bidder: 'msft',
        params: {
            placement_id: 13232361, // Add your own placement id here
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
var invokeVideoPlayer = function(vastXml) {
    tempTag = vastXml;
};

pbjs.que.push(function() {
    pbjs.addAdUnits(adUnits);
    pbjs.addAdUnits(videoAdUnit);
    pbjs.setConfig({
        debug: true,
        cache: {
            // keep the video bid's VAST in the browser instead of a Prebid Cache server
            useLocal: true
        }
    });
    pbjs.requestBids({
        bidsBackHandler: function(bids) {
            initAdserver(bids);
            initVideoAdserver();
        },
        timeout: PREBID_TIMEOUT,
        auctionId: 'auction_1'
    })
});

function initVideoAdserver() {
    // Fetch the GAM VAST for videoAdUnit; with cache.useLocal, Prebid inlines the winning bid's VAST
    pbjs.adServers.gam.getVastXml({
        adUnit: videoAdUnit,
        params: {
            iu: '/41758329/localcache',
            cust_params: {
                section: 'blog',
                anotherKey: 'anotherValue'
            }
        }
    }).then(function(vastXml) {
        // Pass the VAST to the video player
        invokeVideoPlayer(vastXml);
    });
}

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
        if (pbjs.libLoaded) {
            pbjs.que.push(function() {
                pbjs.setTargetingForGPTAsync(displayAdUnitCodes);
                googletag.pubads().refresh();
            });
        } else {
            googletag.pubads().refresh();
        }
    });
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

{% comment %} The live test bidder doesn't reliably bid, so the result tab simulates the video bid with the debugging module; banner bids are not simulated, and the code listing is unchanged. {% endcomment %}
{% include video/mock-video-bid.html adUnitCode="video1" %}

{% include code/web-example.html id="basic-prebid-example" html=htmlCodePrebid js=jsCode %}
