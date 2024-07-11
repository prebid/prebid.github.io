---
layout: example
title: Using Prebid.js with Microsoft Monetize Ad Server
description: Using Prebid.js with Microsoft Monetize Ad Server

sidebarType: 1

about:
- This example shows how to use Prebid.js with Micosoft Monetize Ad Server.
- See the <a href="https://docs.xandr.com/bundle/seller-tag/page/seller-tag/seller-tag.html">Seller Tag (AST)</a> documentation for more information.
- To configure the Seller Tag to use SafeFrames, refer to the <a href="https://docs.xandr.com/bundle/seller-tag/page/seller-tag/safeframe-api-reference.html">SafeFrame API Reference</a>.

---

## Using Prebid.js with Microsoft Monetize Ad Server

{% include prebidjs-non-prod.html %}
{% include astjs.html %}

{% capture htmlCodePrebid %}<h5>Div-1</h5>
<div id="div-1">
    <script type="text/javascript">
        apntag.anq.push(function() {
            apntag.showTag('div-1');
        });
    </script>
</div>

<br>

<h5>Div-2</h5>
<div id="div-2">
    <script type="text/javascript">
        apntag.anq.push(function() {
            apntag.showTag('div-2');
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

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

var adUnits = [
    {
        code: 'div-1',
        mediaTypes: {
            banner: {
                sizes: div_1_sizes
            }
        },
        bids: [{
            bidder: 'appnexus',
            params: {
                placementId: 13144370
            }
        }]
    },
    {
        code: 'div-2',
        mediaTypes: {
            banner: {
                sizes: div_2_sizes
            }
        },
        bids: [{
            bidder: 'appnexus',
            params: {
                placementId: 13144370
            }
        }]
    }
];

pbjs.que.push(function() {
    pbjs.addAdUnits(adUnits);
    pbjs.requestBids({
        bidsBackHandler: function(bidResponses) {
            initAdserver();
        },
        timeout: PREBID_TIMEOUT
    });

});

// Prebid Config Section END

var apntag = apntag || {};
apntag.anq = apntag.anq || [];
apntag.anq.push(function() {
    apntag.setPageOpts({
        member: 1543
    });
    apntag.defineTag({
        tagId: 10885450,
        sizes: div_1_sizes,
        targetId: 'div-1'
    });
    apntag.defineTag({
        tagId: 10885450,
        sizes: div_2_sizes,
        targetId: 'div-2'
    });
});

//start loading tags
function initAdserver() {
    if (pbjs.requestSent) {
        return;
    }
    pbjs.requestSent = true;
    pbjs.que.push(function() {
        apntag.anq.push(function() {
            pbjs.setTargetingForAst();
            apntag.loadTags();
        });
    });
}
{% endcapture %}

{% include code/web-example.html id="basic-prebid-example" html=htmlCodePrebid js=jsCode %}
