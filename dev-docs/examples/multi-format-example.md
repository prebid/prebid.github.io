---
layout: example
title: Multi-Format Ad Units
description: Multi-Format Ad Units

sidebarType: 1

about:
- A multi-format ad unit allows you to receive any combination of banner, video, or native demand
- Any bidder that supports at least one of the listed media types can participate in the auction for that ad unit
- For engineering setup instructions, see <a href="/dev-docs/show-multi-format-ads.html">Show Multi-Format Ads</a>
- For ad ops setup instructions, see <a href="/adops/step-by-step.html">Google Ad Manager with Prebid Step by Step</a>

---

## Basic Prebid.js Example

{% capture htmlCodePrebid %}<h3>div-banner-native-1</h3>
<div id='div-banner-native-1'>
<p>No response</p>
<script type='text/javascript'>
    googletag.cmd.push(function() {
        googletag.display('div-banner-native');
    });

</script>
</div>

<h3>div-banner-native-2</h3>
<div id='div-banner-native-2'>
    <p>No response</p>
    <script type='text/javascript'>
        googletag.cmd.push(function() {
            googletag.display('div-banner-outstream');
        });

    </script>
</div>
{% endcapture %}

{% capture jsCode %}var PREBID_TIMEOUT = 1000;
var FAILSAFE_TIMEOUT = 3000;

var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

function initAdserver() {
    if (pbjs.initAdserverSet) return;

    googletag.cmd.push(function() {
        pbjs.que.push(function() {
            pbjs.setTargetingForGPTAsync();
            googletag.pubads().refresh();
        });
    });

    pbjs.initAdserverSet = true;
}

pbjs.que.push(function() {
    var adUnits = [{
            code: 'div-banner-native-1',
            mediaTypes: {
                banner: {
                    sizes: [
                        [300, 250]
                    ]
                },
                native: {
                    type: 'image'
                },
            },
            bids: [{
                bidder: 'appnexus',
                params: {
                    placementId: 13232392,
                }
            }]
        },
        {
            code: 'div-banner-native-2',
            mediaTypes: {
                banner: {
                    sizes: [
                        [300, 250]
                    ]
                },
                native: {
                    title: {
                        required: true
                    },
                    image: {
                        required: true
                    },
                    sponsoredBy: {
                        required: true
                    }
                }
            },
            bids: [{
                bidder: 'appnexus',
                params: {
                    placementId: 13232392,
                }
            }]
        }
    ];

    pbjs.setConfig({
        debug: true,
        cache: {
            url: false
        },
    });

    pbjs.addAdUnits(adUnits);
    pbjs.requestBids({
            timeout: PREBID_TIMEOUT,
        bidsBackHandler: function(bidResponses) {
            initAdserver();
        }
    });
});

// in case PBJS doesn't load
setTimeout(initAdserver, FAILSAFE_TIMEOUT);

googletag.cmd.push(function() {
    googletag
        .defineSlot(
            '/19968336/prebid_multiformat_test', [
                [300, 250],
                [360, 360]
            ],
            'div-banner-native-1'
        )
        .addService(googletag.pubads());

    googletag
        .defineSlot(
            '/19968336/prebid_multiformat_test', [
                [300, 250],
                [360, 360]
            ],
            'div-banner-native-2'
        )
        .addService(googletag.pubads());

    googletag.pubads().disableInitialLoad();
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
});
{% endcapture %}

{% include code/web-example.html id="basic-prebid-example" html=htmlCodePrebid js=jsCode %}
