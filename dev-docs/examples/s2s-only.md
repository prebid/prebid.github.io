---
layout: example
title: Server-Side Only Bidding
left_nav_override: Examples
description: Bidding only through Prebid Server, without client-side bid adapters
sidebarType: 1

about:
- This example sends all demand through Prebid Server. No client-side bid adapter is involved.
- The ad unit requests a Prebid Server stored impression, so Prebid Server decides which bidders take part. Bidders listed in <code>s2sConfig.bidders</code> also don't need their Prebid.js adapter in the build; see <a href="/dev-docs/modules/prebidServer.html#server-side-bidders-dont-need-a-client-side-adapter">Server-Side Bidders Don't Need a Client-Side Adapter</a>.
- The endpoint is the Prebid mobile team's test server, which answers these stored impressions with test creatives. Don't use it in production.

---

## Server-Side Only Example

{% capture htmlCodePrebid %}<h5>test-div</h5>
<div id='test-div'></div>
{% endcapture %}

{% capture jsCode %}var adUnits = [
    {
        code: 'test-div',
        mediaTypes: {
            banner: {
                sizes: [[300, 250]]
            }
        },
        // the impression is configured in Prebid Server, as a stored request
        ortb2Imp: {
            ext: {
                prebid: {
                    storedrequest: {
                        id: 'prebid-demo-banner-300-250'
                    }
                }
            }
        },
        // no client-side bidders: only send this ad unit to the Prebid Server instance named 'testServer'
        bids: [
            {
                module: 'pbsBidAdapter',
                params: {
                    configName: 'testServer'
                }
            }
        ]
    }
];

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

pbjs.que.push(function() {
    pbjs.setConfig({
        s2sConfig: [{
            name: 'testServer',
            accountId: '0689a263-318d-448b-a3d4-b02e8a709d9d',
            enabled: true,
            bidders: [],
            // bids come back from seats that weren't requested in adUnit.bids
            allowUnknownBidderCodes: true,
            timeout: 1000,
            endpoint: 'https://prebid-server-test-j.prebid.org/openrtb2/auction',
            syncEndpoint: 'https://prebid-server-test-j.prebid.org/cookie_sync'
        }]
    });
    pbjs.addAdUnits(adUnits);
    pbjs.requestBids({
        timeout: 2000,
        bidsBackHandler: function() {
            pbjs.getHighestCpmBids().forEach(renderOne);
        }
    });
});

function renderOne(winningBid) {
    var div = document.getElementById(winningBid.adUnitCode);
    if (!div || !winningBid.adId) {
        return;
    }
    var iframe = document.createElement('iframe');
    iframe.width = winningBid.width;
    iframe.height = winningBid.height;
    iframe.scrolling = 'no';
    iframe.title = '3rd party ad content';
    iframe.style.border = '0';
    div.appendChild(iframe);
    pbjs.renderAd(iframe.contentWindow.document, winningBid.adId);
}
{% endcapture %}

{% include code/web-example.html id="s2s-only-example" html=htmlCodePrebid js=jsCode scripts="pbjs" %}

## Listing Bidders Without Their Adapters

With your own Prebid Server, you can also list bidders explicitly. Their params are passed to Prebid Server as is, and their Prebid.js adapters can be left out of the build:

```javascript
pbjs.setConfig({
    s2sConfig: [{
        accountId: 'YOUR_ACCOUNT_ID',
        enabled: true,
        bidders: ['exampleBidder'],
        endpoint: 'https://prebid-server.example.com/openrtb2/auction',
        syncEndpoint: 'https://prebid-server.example.com/cookie_sync'
    }]
});

pbjs.addAdUnits([{
    code: 'test-div',
    mediaTypes: {
        banner: {
            sizes: [[300, 250]]
        }
    },
    bids: [{
        bidder: 'exampleBidder', // no exampleBidderBidAdapter in the Prebid.js build
        params: {
            placementId: 12345
        }
    }]
}]);
```

Check the [caveats](/dev-docs/modules/prebidServer.html#server-side-bidders-dont-need-a-client-side-adapter) for GDPR vendor IDs, aliases and client-side fallback when you leave adapters out.
