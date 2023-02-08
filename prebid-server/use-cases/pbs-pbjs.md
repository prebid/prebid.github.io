---
layout: page_v2
sidebarType: 5
title: Prebid Server | Use Cases | Prebid.js

---

# Use Case: Prebid Server | Prebid.js
{: .no_toc}

* TOC
{:toc}

When publishers specify bidders in [Prebid.js `s2sConfig`](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Server-to-Server), the browser connects to Prebid Server to coordinate the header bidding auction for those bidders.

## Workflow

Here are workflows diagramming how this works.

### Banner

![Prebid Server Web Banner Architecture](/assets/images/flowcharts/prebid-server/pbjs-server-flow.png){:class="pb-xlg-img"}

1. Prebid.js is set up to run auctions for one or more bidders through “s2sConfig”.
1. Prebid Server parses the request and holds the auction.
1. The response, including the body of the winning creative(s), is sent back to the browser.
1. Prebid.js passes ad server targeting variables to the page, which forwards it to the ad server.
1. When a header bidding ad wins, the ad server responds to the page with the [Prebid Universal Creative](https://github.com/prebid/prebid-universal-creative).
1. Which calls the render function in Prebid.js to display the creative.

### Video

Video ad units are handled in mostly the same way as banner, but there's caching involved and display is different.

![Prebid Server Web Video Architecture](/assets/images/flowcharts/prebid-server/pbjs-video-server-flow.png){:class="pb-xlg-img"}

1. Prebid.js is set up to run auctions for one or more bidders through “s2sConfig”.
1. Prebid Server parses the request and holds the auction.
1. VAST XML bid responses are placed in a cache.
1. Prebid Server responds to the page with results and a cache ID.
1. Prebid.js passes bid information for video bids to the video player.
1. The player calls the ad server directly. When header bidding wins, the ad server responds directly to the player with a URL from which to retrieve the VAST XML.
1. The player pulls the winning VAST from the cache.
1. The player displays the winning VAST within the video when appropriate.

## Details

The following sections give additional details of the steps provided in the workflows.

### Prebid.js s2sConfig is Placed in the Page

Here's a page example assuming that you're running your own Prebid Server. See [Prebid.js `s2sConfig`](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Server-to-Server) for more information. Note that this config would handle both banner and video auctions server-side for bidderA and bidderB.

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

Here's an example video request that could come from Prebid.js:

```
{
    "id": "548f8837-9411-4b8e-8caa-11234565d7a5",
    "cur": [
        "USD"
    ],
    "source": {
        "tid": "548f8837-9411-4b8e-8caa-11234565d7a5"
    },
    "tmax": 1000,
    "imp": [
        {
            "exp": 300,
            "id": "vi_621608",
            "secure": 1,
            "ext": {
                "bidderA": {
                    "param1": "val1"
                },
                "bidderB": {
                    "param2": "val2"
                }
            },
            "video": {
                "playerSize": [
                    [ 640, 480 ]
                ],
                "context": "instream",
                "mimes": [
                    "video/mp4",
                    "video/x-flv",
                    "video/x-ms-wmv",
                    "application/x-mpegurl",
                    "video/mpeg",
                    "video/ogg",
                    "video/quicktime",
                    "video/webm",
                    "video/x-m4v"
                ],
                "protocols": [ 1, 2, 3, 4, 5, 6 ],
                "playbackmethod": [
                    6
                ],
                "maxduration": 120,
                "linearity": 1,
                "api": [
                    2
                ],
                "pos": 1,
                "w": 640,
                "h": 480
            }
        }
    ],
    "ext": {
        "prebid": {
            "cache": {
                "vastxml": {
                    "returnCreative": false
                }
            },
            "targeting": {
                "includewinners": true,
                "includebidderkeys": false,
                "pricegranularity": {
                    "ranges": [
                        {
                            "max": 40,
                            "increment": 1
                        }
                    ]
                }
            }
        }
    },
    "site": {
        "page": "https://example.com/index.html"
    },
    "regs": {
        "ext": {
            "us_privacy": "1YNY"
        }
    }
}
```

Next comes the auction and response:

1. Enforce privacy regulations
1. Call the bidders
1. Collect responses
1. Cache the VAST XML as instructed (for video)
1. Prepare the OpenRTB response

### The Page Gets the Response

Here's an example video response carrying cache information for where
the VAST can be retrieved.

```
{
    "id": "19af7cb0-b186-4128-84d6-8b60fddc21d9",
    "seatbid": [
        {
            "bid": [
                {
                    "id": "19af7cb0-b186-4128-84d6-8123456c21d0",
                    "impid": "video1",
                    "price": 1.23,
                    "crid": "4458534",
                    "ext": {
                        "prebid": {
                            "type": "video",
                            "targeting": {
                                "hb_size_bidderA": "1x1",
                                "hb_cache_id": "114ded12-ed89-439e-9704-412345627652",
                                "hb_uuid": "114ded12-ed89-439e-9704-412345627652",
                                "hb_cache_path_bidderA": "/cache",
                                "hb_cache_host_bidderA": "prebid-cache-us-east.example.com",
                                "hb_pb": "1.20",
                                "hb_pb_rubicon": "1.20",
                                "hb_cache_id_bidderA": "114ded12-ed89-439e-9704-412345627652",
                                "hb_uuid_bidderA": "114ded12-ed89-439e-9704-412345627652",
                                "hb_cache_path": "/cache",
                                "hb_size": "1x1",
                                "hb_bidder": "bidderA",
                                "hb_bidder_bidderA": "bidderA",
                                "hb_cache_host": "prebid-cache-us-east.rubiconproject.com"
                            },
                            "cache": {
                                "bids": {
                                    "url": "https://prebid-cache-us-east.rubiconproject.com/cache?uuid=114ded12-ed89-439e-9704-412345627652",
                                    "cacheId": "114ded12-ed89-439e-9704-412345627652"
                                }
                            }
                        }
                    }
                }
            ],
            "seat": "bidderA",
            "group": 0
        }
    ],
    "cur": "USD",
    "ext": {
        "responsetimemillis": {
            "bidderA": 52
        },
        "tmaxrequest": 500
    }
}
```

Prebid.js parses this and makes the data available to Prebid.js core.

### The Ad Server is Called

#### Banner

A callback function grabs the ad server targeting values and
adds them to the ad server call.

#### Video

Depending on the ad server, the ad server targeting values are added
to the ad server URL and given to the video player.

The player decides when it's time to call the ad server.

### The Ad is Displayed

#### Banner

When a Prebid ad wins in the ad server, the response is a JavaScript creative. This JavaScript loads the Prebid Universal Creative code, which displays the ad in an iframe.

#### Video

When a Prebid video ad wins in the ad server, the response is a VAST URL.
The video player uses this URL to retrieve the VAST, and then loads the
actual creative asset when it's time to display.

## Further Reading

- [What is Prebid.js?](/prebid/prebidjs.html)
- [Prebid Video Ads](/formats/video.html)
