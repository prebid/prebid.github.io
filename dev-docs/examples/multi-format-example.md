---
layout: example
title: Multi-Format Ad Units
description: Multi-Format Ad Units

sidebarType: 1

about:
- A multi-format ad unit allows you to receive any combination of banner, video, or native demand
- A multi-format ad unit has two methods - a simple setup with in-renderer integration that does not require complex configuration on the ad server side, and format switching on the ad server side
- Any bidder that supports at least one of the listed media types can participate in the auction for that ad unit
- For engineering setup instructions, see <a href="/dev-docs/show-multi-format-ads.html">Show Multi-Format Ads</a>
- In this example, to keep it simple, ad rendering is performed using `pbjs.renderAd`
- InRenderer.js, an open-source renderer optimized for in-renderer integration, is used as the renderer for in-renderer integration. For more information, see <a href="https://github.com/hogekai/in-renderer-js" target="_blank">InRenderer.js documentation on Github</a>

---

## Example

{% capture htmlCodePrebid %}
<h1>Multi-format Example</h1>

<div id="ad-unit-1"></div>
{% endcapture %}

{% capture jsCode %}var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

var adUnit = {
  code: "ad-unit-1",
  mediaTypes: {
    banner: {
        sizes: [[300, 250]]
    },
    video: {
      context: "outstream",
      playerSize: [320, 180],
      mimes: ["video/mp4", "video/webm", "video/ogg"],
      protocols: [2, 3, 5, 6, 7, 8],
      api: [2],
    },
    native: {
      adTemplate: `<div style="width: 300px; height:250px; background-image: url(##hb_native_asset_id_1##);">`,
      ortb: {
        assets: [
          {
            id: 1,
            required: 1,
            img: {
              type: 3,
              w: 300,
              h: 250,
            },
          },
        ],
      },
    },
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
