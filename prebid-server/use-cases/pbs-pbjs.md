---
layout: page_v2
sidebarType: 5
title: Prebid Server | Use Cases | Prebid.js

---

# Use Case: Prebid Server | Prebid.js

When publishers specify bidders in [Prebid.js `s2sConfig`](/dev-docs/publisher-api-reference.html#setConfig-Server-to-Server), the browser connects to Prebid Server to coordinate the header bidding auction for those bidders.

Here's how that works for banner adunits:

![Prebid Server Web Banner Architecture](/assets/images/prebid-server/pbs-js-banner-architecture.png)

1. Prebid.js is set up to run auctions for one or more bidders through “s2sConfig”.
1. Prebid Server parses the request and holds the auction
1. The response, including the body of the winning creative(s), is sent back to the browser
1. Prebid.js passes ad server targeting variables to the page, which forwards it to the ad server. 
1. When a header bidding ad wins, the ad server responds to the page with the Prebid Universal Creative
1. Which calls the render function in Prebid.js to display the creative.


Video ad units are handled in mostly the same way, but there's caching involved and display is different:

![Prebid Server Web Video Architecture](/assets/images/prebid-server/pbs-js-video-architecture.png)

1. Prebid.js is set up to run auctions for one or more bidders through “s2sConfig”.
1. Prebid Server parses the request and holds the auction
1. VAST XML bid responses are placed in a cache
1. Prebid Server responds to the page with results and a cache ID
1. Prebid.js passes bid information for video bids to the video player
1. The player calls the ad server directly. When header bidding wins, the ad server responds directly to the player with a URL from which to retrieve the VAST XML
1. The player pulls the winning VAST from the cache
1. And displays it within the video when appropriate

## How It Works - Detailed

### Prebid.js s2sConfig is Placed in the Page

Here's a page example assuming that you're running your own Prebid Server. See [Prebid.js `s2sConfig`](/dev-docs/publisher-api-reference.html#setConfig-Server-to-Server) for details. Note that this config
would run both banner and video auctions server-side for bidderA and bidderB.

```
pbjs.setConfig({
    s2sConfig: [{
        accountId: '1',
        bidders: ['bidderA', 'bidderB'],
        adapter: 'prebidServer',
        enabled: true,
        endpoint: 'https://prebid-server.example.com/openrtb2/auction',
        syncEndpoint: 'https://prebid-server.example.com/cookie_sync',
        timeout: 500,
        extPrebid: {
            cache: {
                vastxml: { returnCreative: false }
            },
            targeting: {
                pricegranularity: {"ranges": [{"max":40.00,"increment":1.00}]}
            }
        }
    }]
})
```

The Prebid.js `Prebid Server Bid Adapter` creates the OpenRTB for the adunits involved in the auction.

### Prebid Server Receives the Request



### The Page Gets the Response

### The Page Calls the Ad Server

### The Ad is Displayed
