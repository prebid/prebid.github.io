---
layout: example
title: in-renderer Integration Example
description: in-renderer Integration (formerly known as “outstream”) Example

sidebarType: 1

about:
  - in-renderer Integration is one of the integration methods for Prebid Video
  - In this example, to keep it simple, ad rendering is performed using `pbjs.renderAd`
  - InRenderer.js, an open-source renderer optimized for in-renderer integration, is used as the renderer for in-renderer integration. For more information, see <a href="https://github.com/hogekai/in-renderer-js" target="_blank">InRenderer.js documentation</a>
---

## Example

{% capture htmlCodePrebid %}
<h1>in-renderer Integration Example</h1>

<div id="ad-unit-1"></div>
{% endcapture %}

{% capture jsCode %}var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

var adUnit = {
  code: "ad-unit-1",
  mediaTypes: {
    video: {
      context: "outstream",
      playerSize: [640, 360],
      mimes: ["video/mp4", "video/webm", "video/ogg"],
      protocols: [2, 3, 5, 6, 7, 8],
      api: [2],
    }
  },
  bids: [
    {
      bidder: "michao",
      params: {
        placement: "inbanner",
        site: 1,
        test: true
      },
    },
  ],
  renderer: {
    url: `https://cdn.jsdelivr.net/npm/in-renderer-js@1/dist/in-renderer.umd.min.js`,
    render: (bid) => {
      var inRenderer = new window.InRenderer();
      inRenderer.render("ad-unit-1", bid);
    },
  },
};

pbjs.que.push(function() {
  pbjs.addAdUnits(adUnit);
  pbjs.requestBids({
    timeout: 5000,
    bidsBackHandler: function () {
      const highestCpmBids = pbjs.getHighestCpmBids("ad-unit-1");
      pbjs.renderAd('ad-unit-1', highestCpmBids[0].adId);
    },
  });
})
{% endcapture %}

{% include code/web-example.html id="basic-prebid-example" html=htmlCodePrebid js=jsCode %}
