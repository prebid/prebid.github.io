---
layout: example
title: Basic Example
left_nav_override: Examples
description: Basic Prebid.js Example
sidebarType: 1


about:
- This example demonstrates asynchronous Prebid.js integration with a single Google Ad Manager ad slot
- Default keyword targeting setup (<a href="/dev-docs/publisher-api-reference/bidderSettings.html">reference</a>)
- Default price granularity

pid: 10
---

## Basic Prebid.js Example

{% capture htmlCodePrebid %}
<!-- DO NOT add this script in prod -->
<script src="intercept-banner-not-for-prod.js" ></script>
<!-- END -->

<h5>Div-1</h5>
<div id='div-1' style="min-height:250px;">
  <script type='text/javascript'>
    googletag.cmd.push(function() {
      googletag.display('div-1');
    });
  </script>
</div>
{% endcapture %}

{% capture jsCode %}
var sizes = [
  [300, 250]
];
var PREBID_TIMEOUT = 700;

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
      placementId: 'XXXXXXX' //not used in prod
    }
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
    bidsBackHandler: initAdserver
  });
});

function initAdserver() {
  if (pbjs.initAdserverSet) return;
  pbjs.initAdserverSet = true;
  googletag.cmd.push(function() {
    if (pbjs.libLoaded) {
      pbjs.que.push(function() {
        pbjs.setTargetingForGPTAsync();
        googletag.pubads().refresh();
      });
    } else {
      googletag.pubads().refresh();
    }
  });
}

setTimeout(function() {
  initAdserver();
}, PREBID_TIMEOUT);

googletag.cmd.push(function() {
  googletag.defineSlot('/19968336/header-bid-tag-1', sizes, 'div-1')
    .addService(googletag.pubads());
  googletag.pubads().enableSingleRequest();
  googletag.enableServices();
});
{% endcapture %}

{% include code/web-example.html id="basic-prebid-example" html=htmlCodePrebid js=jsCode scripts="pbjs,gpt" %}
