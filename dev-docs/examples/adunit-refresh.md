---
layout: example
title: Individual Ad Unit Refresh / Infinite Scroll
description: Individual Ad Unit Refresh / Infinite Scroll

sidebarType: 1

about:
- Demonstrates the ability to <strong>refresh individual ad units</strong>. This is useful for infinite scrolling ad slots.
- Keep in mind that when auto-refreshing is done incorrectly, it could cause the same bids to be rendered repeatedly. For instance, when googletag.pubads.refresh() is called directly without removing the PBJS targeting, the same hb_ variables get re-sent to GAM, re-chosen, and re-rendered over and over without ever asking PBJS for updated targeting variables.  See <a href="/dev-docs/publisher-api-reference/setConfig.html#setConfig-auctionOptions">Auction Options</a> for more info.


pid: 20
---

## Individual Ad Unit Refresh / Infinite Scroll

{% capture htmlCodePrebid %}<h5>Div-1</h5>
<button class="btn btn-primary mb-3" onclick="refreshBid()">Refresh Ad Unit</button>
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

var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

var adUnits = [{
    code: '/19968336/header-bid-tag-0',
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

pbjs.que.push(function() {
    pbjs.addAdUnits(adUnits);
});

var slot1;
googletag.cmd.push(function() {
    slot1 = googletag.defineSlot('/19968336/header-bid-tag-0', [[300, 250]], 'div-1')
        .addService(googletag.pubads());
    googletag.pubads().disableInitialLoad();
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
});

function refreshBid() {
    pbjs.que.push(function() {
        pbjs.requestBids({
            timeout: PREBID_TIMEOUT,
            adUnitCodes: ['/19968336/header-bid-tag-0'],
            bidsBackHandler: function() {
                pbjs.setTargetingForGPTAsync(['/19968336/header-bid-tag-0']);
                googletag.pubads().refresh([slot1]);
            }
        });
    });
}
{% endcapture %}

{% include code/web-example.html id="basic-prebid-example" html=htmlCodePrebid js=jsCode %}
