---
layout: example
title: Native Ad Unit
description: Native Ad Units

sidebarType: 1

about:
- Native advertising is where the ad experience follows the natural form and function of the user experience in which it is placed.
- For engineering setup instructions, see <a href="/dev-docs/show-native-ads.html">Show Native Ads</a>
- For ad ops setup instructions, see <a href="/adops/gam-native.html">GAM Step by Step - Native Creatives</a>

---

## Native Ad Unit

{% include prebidjs-non-prod.html %}
{% include gptjs.html %}

{% capture htmlCodePrebid %}<div id='div-1'>
<p>No response</p>
<script type='text/javascript'>
    googletag.cmd.push(function() {
        googletag.display('div-1');
    });

</script>
</div>

<div id='div-2'>
<p>No response</p>
<script type='text/javascript'>
    googletag.cmd.push(function() {
        googletag.display('div-2');
    });

</script>
</div>
{% endcapture %}

{% capture jsCode %} var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];
var PREBID_TIMEOUT = 3000;

var date = new Date().getTime();

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

// Load GPT when timeout is reached.
setTimeout(initAdserver, PREBID_TIMEOUT);

pbjs.que.push(function() {

    pbjs.setConfig({
        debug: true
    });

    var allSlotsBidWon = function allSlotsBidWon() {
        console.log('allSlotsBidWon called');
    };

    pbjs.onEvent('bidWon', allSlotsBidWon);

    var adUnits = [{
            code: '/19968336/prebid_native_example_1',
            sizes: [
                [360, 360]
            ],
            mediaTypes: {
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
                    placementId: 13232354,
                    allowSmallerSizes: true
                }
            }]
        },
        {
            code: '/19968336/prebid_native_example_2',
            sizes: [
                [1, 1]
            ],
            mediaTypes: {
                native: {
                    title: {
                        required: true
                    },
                    body: {
                        required: true
                    },
                    image: {
                        required: true
                    },
                    sponsoredBy: {
                        required: true
                    },
                    icon: {
                        required: false
                    },
                }
            },
            bids: [{
                bidder: 'appnexus',
                params: {
                    placementId: 13232354,
                    allowSmallerSizes: true
                }
            }]
        }
    ];

    pbjs.addAdUnits(adUnits);
    pbjs.requestBids({
        bidsBackHandler: function(bidResponses) {
            initAdserver();
        }
    });
});

// GPT setup
googletag.cmd.push(function() {
    var slot1 = googletag.defineSlot('/19968336/prebid_native_example_1', [[360, 360]], 'div-1').addService(googletag.pubads());
    var slot2 = googletag.defineSlot('/19968336/prebid_native_example_2', 'fluid', 'div-2').addService(googletag.pubads());
    googletag.pubads().disableInitialLoad();
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
});

{% endcapture %}

{% include code/web-example.html id="basic-prebid-example" html=htmlCodePrebid js=jsCode %}
