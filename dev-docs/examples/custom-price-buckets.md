---
layout: example
title: Custom Price Granularity Buckets
description: Custom Price Granularity Buckets

sidebarType: 1

about:
- This example shows custom price granularity buckets using <code>pbjs.setConfig()</code>.
- See the <a href="/dev-docs/publisher-api-reference/setConfig.html#setConfig-Price-Granularity">API reference</a> for more detail.

---

## Custom Price Granularity Buckets

{% capture htmlCodePrebid %}<h5>Div-1</h5>
<div id='div-1'>
  <script type='text/javascript'>
    googletag.cmd.push(function() {
      googletag.display('div-1');
    });
  </script>
</div>
{% endcapture %}

{% capture jsCode %}var sizes = [
    [300, 250]
];
var PREBID_TIMEOUT = 1000;
var FAILSAFE_TIMEOUT = 3000;

var adUnits = [{
    code: '/19968336/header-bid-tag-1',
    mediaTypes: {
        banner: {
            sizes: sizes
        }
    },
    bids: [{
        bidder: 'appnexus',
        params: {
            placementId: 13144370
        }
    }]
}];

const customConfigObject = {
    "buckets": [
        {
            "precision": 2, //default is 2 if omitted - means 2.1234 rounded to 2 decimal places = 2.12
            "min": 0,
            "max": 5,
            "increment": 0.01
        },
        {
            "precision": 2,
            "min": 5,
            "max": 8,
            "increment": 0.05
        },
        {
            "precision": 2,
            "min": 8,
            "max": 20,
            "increment": 0.5
        },
        {
            "precision": 2,
            "min": 21,
            "max": 99,
            "increment": 1.00
        }
    ]
};

var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
googletag.cmd.push(function() {
    googletag.pubads().disableInitialLoad();
});

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

pbjs.que.push(function() {
    pbjs.addAdUnits(adUnits);
    pbjs.setConfig({
        priceGranularity: customConfigObject
    });
    pbjs.requestBids({
        bidsBackHandler: initAdserver,
        timeout: PREBID_TIMEOUT
    });
});

function initAdserver() {
    if (pbjs.initAdserverSet) return;
    pbjs.initAdserverSet = true;
    googletag.cmd.push(function() {
        pbjs.que.push(function() {
            pbjs.setTargetingForGPTAsync();
            googletag.pubads().refresh();
        });
    });
}

// in case PBJS doesn't load
setTimeout(function() {
    initAdserver();
}, FAILSAFE_TIMEOUT);

googletag.cmd.push(function() {
    googletag.defineSlot('/19968336/header-bid-tag-1', sizes, 'div-1').addService(googletag.pubads());
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
});
{% endcapture %}

{% include code/web-example.html id="basic-prebid-example" html=htmlCodePrebid js=jsCode %}
