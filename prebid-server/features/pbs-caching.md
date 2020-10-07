---
layout: page_v2
sidebarType: 5
title: Prebid Server | Features | Caching | Overview

---

# Prebid Server | Features | Caching

There are several important scenarios where Prebid stores some or all of the bid in the 'cloud' for a time, either because it has to or because it's advantageous:

1. Most video players require that they be given a URL that points to VAST XML for advertisements stored on the network. 
1. [AMP](/prebid-server/use-cases/pbs-amp.html) requires that only ad server targeting be returned, not the whole creative body. When chosen, the creative is obtained from network.
1. [Mobile applications](/prebid-server/use-cases/pbs-sdk.html) could accept the full creative body, but it's better performance for users if ad creatives stay in the network unless they're going to be displayed.

There are two flows in this diagram: the numbered circles follow the auction request and the lettered circles follow the retrieval of the creative:

![Prebid Caching Architecture](/assets/images/prebid-server/pbs-cache-feature.png)

Populating Items in the Cache

1. The device makes the auction request.
2. Prebid Server processes the request.
3. The bidders respond.
4. Prebid Server stores the bid or the VAST XML in Prebid Cache. Note that in some cases, the answer may go back to the browser and be populated in the cache by a separate browser request.
5. The Prebid Cache server stores the object in the No-SQL backend.

Retrieving Items from the Cache

A. The device makes the retrieval request.
B. The request goes directly to Prebid Cache.
C. Which retrieves the bid or VAST from the backend.

## Technical Setup

Each Prebid Server host company may set up Prebid Cache in a somewhat
different way, but in general, the `/cache` endpoint gets routed directly
to the Prebid Cache server.

Also, each host company can choose to integrate different backend storage
systems like Redis, Aerospike, etc.

## Examples

You can watch the caching take place with your browser developer tools.

### Video

From one of the [video instream examples](/examples/video/instream/jwplayer/pb-ve-jwplayer-platform.html):

The VAST XML is stored into Prebid Cache from Prebid.js with this call:
```
POST https://prebid.adnxs.com/pbc/v1/cache
<VAST XML BODY>
```
And the response from the /cache call is:
```
{"responses":[{"uuid":"9b05c38c-709c-4fb5-8592-8fcacb1289f7"}]}
```

And when the video player is ready to display the video ad, this
call is seen go out:
```
GET https://prebid.adnxs.com/pbc/v1/cache?uuid=9b05c38c-709c-4fb5-8592-8fcacb1289f7
```
And the response is the VAST XML.

### AMP

Here's an example AMP response from Prebid Server:
```
{
    "targeting": {
        "hb_cache_id": "14b468d0-3c58-4a5d-ae5d-ab9a47b6152c",
        "hb_pb": "0.40",
        "hb_pb_rubicon": "0.40",
        "hb_cache_path": "/cache",
        "hb_size": "300x50",
        "hb_bidder": "rubicon",
        "hb_cache_host": "prebid-server.example.com",
        "hb_bidid": "add62e49-9d5c-4e22-a450-fd4e922941aa"
    }
}
```

Then when the ad is chosen by the ad server, this fetch goes out from the browser:
```
https://prebid-server.example.com/cache?uuid=14b468d0-3c58-4a5d-ae5d-ab9a47b6152c
```

