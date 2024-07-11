---
layout: example
title: Meta Bid Filtering
left_nav_override: Examples
description: Bid filtering on meta object example
sidebarType: 1

about:
- This is an example that filters bid responses based on the metadata object.
- Bidders can supply metadata about the bid such as advertiser domain. See the "meta" fields in the <a href="/dev-docs/bidder-adaptor.html#interpreting-the-response">bid response</a> for the full list of metadata.

---

## Meta Bid Filtering

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
        },
        
    }]
}];

// ======== DO NOT EDIT BELOW THIS LINE =========== //
var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
googletag.cmd.push(function() {
    googletag.pubads().disableInitialLoad();
});

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

pbjs.que.push(function() {
    pbjs.addAdUnits(adUnits);
    pbjs.requestBids({
        bidsBackHandler: (bids) => {
            // loop through ad units
            Object.entries(bids).forEach(([adUnit, bids]) => {
                // invalidate blocked ads
                bids.forEach(bid => {
                    if (isBlockedAd(bid.meta)) {
                        pbjs.markWinningBidAsUsed({ adId: bid.adId });
                    }
                })
            }) 
            initAdserver()
            },
        timeout: PREBID_TIMEOUT
    });
});

function initAdserver() {
    if (pbjs.initAdserverSet) return;
    pbjs.initAdserverSet = true;
    googletag.cmd.push(function() {
        pbjs.setTargetingForGPTAsync && pbjs.setTargetingForGPTAsync();
        googletag.pubads().refresh();
    });
}

// function for filtering logic or checking if bid.meta has a specific property
function isBlockedAd(metaObject){
    // example that checks if advertiserDomain exists
    // metaObject.hasOwnProperty("advertiserDomain")
    
}

// in case PBJS doesn't load
setTimeout(function() {
    initAdserver();
}, FAILSAFE_TIMEOUT);

googletag.cmd.push(function() {
    googletag.defineSlot('/19968336/header-bid-tag-1', sizes, 'div-1')
        .addService(googletag.pubads());
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
});
{% endcapture %}

{% include code/web-example.html id="basic-prebid-example" html=htmlCodePrebid js=jsCode %}
