---
layout: example
title: Filter Sizes Dynamically with Labels
description: Filter Sizes Dynamically with Labels
sidebarType: 1

about:
- This example demonstrates dynamic filtering on ad unit sizes
- Ad unit labels applied based on CSS media queries

---

## Filter Sizes Dynamically with Labels

{% include prebidjs-non-prod.html %}
{% include gptjs.html %}

{% capture htmlCodePrebid %}<h5>Div-1</h5>
<div id='div-1'>
  <script type='text/javascript'>
    googletag.cmd.push(function() {
      googletag.display('div-1');
    });
  </script>
</div>
{% endcapture %}

{% capture jsCode %}var desktopSizes = [
    [970, 250],
    [300, 600],
    [300, 250]
];
var tabletSizes = [
    [728, 90],
    [160, 600],
    [300, 250]
];
var phoneSizes = [
    [320, 100],
    [320, 50],
    [300, 250]
];
var allSizes = [
    [970, 250],
    [728,90],
    [320, 100],
    [320, 50],
    [300, 600],
    [300, 250],
    [160,600]
];
var PREBID_TIMEOUT = 1000;
var FAILSAFE_TIMEOUT = 3000;

var adUnits = [
    {
        code: '/19968336/header-bid-tag-0',
        mediaTypes: {
            banner: {
                sizes: allSizes
            }
        },
        bids: [
            {
                bidder: 'appnexus',
                params: {
                    placementId: 13144370
                }
            }
        ]
    }
];

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
googletag.cmd.push(function() {
    googletag.pubads().disableInitialLoad();
});

pbjs.que.push(function() {
    pbjs.addAdUnits(adUnits);
    pbjs.setConfig({
        sizeConfig: [{
            'mediaQuery': '(min-width: 1025px)',
            'sizesSupported': desktopSizes,
            'labels': ['desktop']
        }, {
            'mediaQuery': '(min-width: 768px) and (max-width: 1024px)',
            'sizesSupported': tabletSizes,
            'labels': ['tablet']
        }, {
            'mediaQuery': '(min-width: 320px) and (max-width: 812px)',
            'sizesSupported': phoneSizes,
            'labels': ['phone']
        }]
    });
    pbjs.requestBids({
        bidsBackHandler: sendAdserverRequest,
        timeout: PREBID_TIMEOUT
    });
});

function sendAdserverRequest() {
    if (pbjs.adserverRequestSent) return;
    pbjs.adserverRequestSent = true;
    googletag.cmd.push(function() {
        pbjs.que.push(function() {
            pbjs.setTargetingForGPTAsync();
            googletag.pubads().refresh();
        });
    });
}

// in case PBJS doesn't load
setTimeout(function() {
    sendAdserverRequest();
}, FAILSAFE_TIMEOUT);

googletag.cmd.push(function() {
    googletag.defineSlot('/19968336/header-bid-tag-0', allSizes, 'div-1')
        .addService(googletag.pubads());
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
});
{% endcapture %}

{% include code/web-example.html id="size-mapping-example" html=htmlCodePrebid js=jsCode %}
