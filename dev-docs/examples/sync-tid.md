---
layout: example
title: Sync Transaction Ids With Another Library
description: Synchronize Transaction Ids With Another Library
sidebarType: 1

about:
- imp.ext.tid sync
- This example demonstrates sending the same impression transaction identifier (imp.ext.tid) to two on page libraries.

---

## Sync Transaction Ids With Another Library

{% include prebidjs-non-prod.html %}
{% include gptjs.html %}

```javascript
const AUCTION_TIMEOUT = 1500;
const FAILSAFE_TIMEOUT = 3000;

const requestManager = {
    adserverRequestSent: false,
    otherLibrary: false,
    prebid: false,
};

const slots = [
    {
        id: 'div-gpt-ad-123-0',
        tid: crypto.randomUUID(),
        sizes: [
            [300, 250]
        ]
    }
]

anotherLibraryTag.fetchBids({
    slots: slots.map((slot) => ({
        // Please confirm precise syntax for this next line with other library documentation
        slotID: slot.id,
        sizes: slot.sizes,
        timeout: AUCTION_TIMEOUT
    })),
    function() {
        googletag.cmd.push(function() {
            anotherLibraryTag.setDisplayBids();
            requestManager.otherLibrary = true;
            sendBidsToAdServer();
        });
    }
});

pbjs.que.push(function() {
    pbjs.setConfig({
        debug: true,
    });
    pbjs.requestBids({
        bidsBackHandler: prebidBidsBack,
        timeout: AUCTION_TIMEOUT,
        adUnits: slots.map((slot) => ({
            code: slot.id,
            mediaTypes: {
                banner: {
                    sizes: slot.sizes,
                },
            },
            ortb2Imp: {
                ext: {
                    tid: slot.tid
                }
            },
            bids: [
                {
                    bidder: 'appnexus',
                    params: {
                        placementId: 13144370,
                    },
                },
            ],
        }))
    });
});

// prebid bids returned
function prebidBidsBack() {
    pbjs.initAdserverSet = true;
    googletag.cmd.push(function() {
        pbjs.setTargetingForGPTAsync && pbjs.setTargetingForGPTAsync();
        requestManager.prebid = true;
        sendBidsToAdServer();
    });
}

// send all bids to GAM
function sendBidsToAdServer(failsafeTimoutReached) {
    if (requestManager.adserverRequestSent === true) return;

    if (failsafeTimoutReached) {
        console.warn("AUCTION FAILSAFE TIMEOUT REACHED");
        googletag.cmd.push(function() {
            googletag.pubads().refresh();
        });
        requestManager.adserverRequestSent = true;
        return;
    }

    if (requestManager.otherLibrary && requestManager.prebid) {
        googletag.cmd.push(function() {
            googletag.pubads().refresh();
        });
        requestManager.adserverRequestSent = true;
    }
}

setTimeout(function() {
    sendBidsToAdServer(true);
}, FAILSAFE_TIMEOUT);
```
