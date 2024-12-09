---
layout: example
title: Postbid Example
description: Postbid Example
sidebarType: 1



why_link: /overview/what-is-post-bid.html

about: 
- Postbid is a third-party tag creative you setup in your ad server that loads the whole Prebid.js package. Create a line item in the ad server targeting each ad unit on your page. The <strong>creative will contain the code below</strong>.
- If the ad unit supports multiple sizes, you'll need to do one of two things -- either create a Postbid creative for each desired size with that size hardcoded in the PBJS adunit, or use ad server macros to pass the size through to the creative. For example, in Google Ad Manager there are HEIGHT and WIDTH macros. 
- There is no need to create line items for each price bucket as the postbid creative is served after the ad server has chosen the line item. 
- This postbid creative <strong>supports passback</strong>. See how this works below.

---

## Postbid Example

{% capture htmlCodePrebid %}<h5>postbid iframe</h5>
<iframe id='postbid_iframe' 
    FRAMEBORDER="0"
    SCROLLING="no"
    MARGINHEIGHT="0"
    MARGINWIDTH="0"
    TOPMARGIN="0" 
    LEFTMARGIN="0" 
    ALLOWTRANSPARENCY="true"
    WIDTH="0"
    HEIGHT="0">
</iframe>
{% endcapture %}

{% capture jsCode %}var sizes = [
    [300, 250]
];
var PREBID_TIMEOUT = 1000;            
var adUnits = [{
    code: 'postbid_iframe',
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

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

pbjs.que.push(function() {
    pbjs.addAdUnits(adUnits);
    pbjs.requestBids({
        timeout: PREBID_TIMEOUT,
        bidsBackHandler: function() {
            var iframe = document.getElementById('postbid_iframe');
            var iframeDoc = iframe.contentWindow.document;
            var adServerTargeting = pbjs.getAdserverTargetingForAdUnitCode('postbid_iframe');

            // If any bidders return any creatives
            if (adServerTargeting && adServerTargeting['hb_adid']) {
                pbjs.renderAd(iframeDoc, adServerTargeting['hb_adid']);
            } else {
                iframe.width = sizes[0][0];
                iframe.height = sizes[0][1];
                iframeDoc.write('<head></head><body>' + passbackTagHtml + '</body>');
                iframeDoc.close();
            }
        }
    });
});

// Define the passback HTML tag here.
// Note that this tag is usually in either Script tag form or iFrame form. 
var passbackTagHtml = 'TO ADD';
{% endcapture %}

{% include code/web-example.html id="basic-prebid-example" html=htmlCodePrebid js=jsCode %}
