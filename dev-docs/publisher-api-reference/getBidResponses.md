---
layout: api_prebidjs
title: pbjs.getBidResponses()
description: getBidResponses API
sidebarType: 1
---


This function returns the bid responses at the given moment.

**Kind**: static method of `pbjs`.

**Returns**: `object` - map | object that contains the bidResponses.

**Returned Object Params**:

{: .table .table-bordered .table-striped }
| Param               | Type    | Description                                                                                                                     |                                                           |
|---------------------+---------+---------------------------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------|
| `bidder`            | String  | The bidder code. Used by ad server's line items to identify bidders                                                             |                                                 `rubicon` |
| `adId`              | String  | The unique identifier of a bid creative. It's used by the line item's creative as in [this example](/adops/gam-creative-banner-sbs.html). |                                                     `123` |
| `width`             | Integer | The width of the returned creative size.                                                                                        |                                                       300 |
| `height`            | Integer | The height of the returned creative size.                                                                                       |                                                       250 |
| `size`            | String | The width x height of the returned creative size.                                                                                       |                                                       "300x250" |
| `cpm`               | Float   | The exact bid price from the bidder                                                                                             |                                                      1.59 |
| `pbLg`,`pbMg`,`pbHg`,`pbAg`,`pbDg`,`pbCg`  | String  | CPM quantized to a granularity: Low (pbLg), Medium (pbMg), High (pbHg), Auto (pbAg), Dense (pbDg), and Custom (pbCg).    |  "5.00" |
| `currency`  | String  | Currency of the bid CPM | `"USD"` |
| `netRevenue`  | Boolean  | True if bid is Net, False if Gross | `true` |
| `requestTimestamp`  | Integer | The time stamp when the bid request is sent out in milliseconds                                                                 |                                             1444844944106 |
| `responseTimestamp` | Integer | The time stamp when the bid response is received in milliseconds                                                               |                                             1444844944185 |
| `timeToRespond`     | Integer | The amount of time for the bidder to respond with the bid                                                                       |                                                        79 |
| `adUnitCode`        | String  | adUnitCode to get the bid responses for                                                                                         |                               "/9968336/header-bid-tag-0" |
| `creativeId`     | Integer  | Bidder-specific creative ID | 12345678 |
| `mediaType`  | String  | One of: banner, native, video | `banner` |
| `dealId`            | String  | (Optional) If the bid is [associated with a Deal]({{site.baseurl}}/adops/deals.html), this field contains the deal ID.          |                                                 "ABC_123" |
| `adserverTargeting`  | Object  | Contains all the adserver targeting parameters | `{ "hb_bidder": "appnexus", "hb_adid": "7a53a9d3" }` |
| `native`  | Object  | Contains native key value pairs. | `{ "title": "", "body": "" }` |
| `status`  | String  | Status of the bid. Possible values: targetingSet, rendered | `"targetingSet"` |
| `statusMessage`     | String  | The bid's status message                                                                                                        | "Bid returned empty or error response" or "Bid available" |
| `ttl`  | Integer  | How long (in seconds) this bid is considered valid. See this [FAQ entry]({{site.github.url}}/dev-docs/faq.html#does-prebidjs-cache-bids) for more info. | `300` |

<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">

  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingThree">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
          > Response Object Example
        </a>
      </h4>
    </div>
    <div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
      <div class="panel-body" markdown="1">

```json
{
  "/9968336/header-bid-tag-0": {
    "bids": [
      {
        "bidderCode": "appnexus",
        "width": 300,
        "height": 250,
        "statusMessage": "Bid available",
        "adId": "7a53a9d3",
        "creative_id": 29681110,
        "cpm": 0.5,
        "adUrl": "https://nym1.ib.adnxs.com/ab?e=wqT_3QLzBKBqAgAAAgDWAAUIkav6sAUQucfc0v-nzQcYj…r=http%3A%2F%2Flocal%3A4000%2Fexamples%2Fpbjs_partial_refresh_example.html",
        "requestTimestamp": 1444844944095,
        "responseTimestamp": 1444844944180,
        "timeToRespond": 85,
        "adUnitCode": "/19968336/header-bid-tag-0",
        "bidder": "appnexus",
        "usesGenericKeys": true,
        "size": "300x250",
        "adserverTargeting": {
          "hb_bidder": "appnexus",
          "hb_adid": "7a53a9d3",
          "hb_pb": "0.50"
        }
      },{
        "bidderCode": "pubmatic",
        "width": "300",
        "height": "250",
        "statusMessage": "Bid available",
        "adId": "1139e34e14",
        "adSlot": "39620189@300x250",
        "cpm": 1,
        "ad": "<span class=\"PubAPIAd\"><script src='https://ad.turn.com/server/ads.js?pub=5757398&cch=36757096&code=37127675&l=3…tcGlkPUVERkNGMDY5LTA2ODctNDAxQy04NkMwLTIzQjNFNzI1MzdGNiZwYXNzYmFjaz0w_url='></script></span> <!-- PubMatic Ad Ends -->",
        "adUrl": "https://aktrack.pubmatic.com/AdServer/AdDisplayTrackerServlet?operId=1&pubId…local%3A4000%2Fexamples%2Fpbjs_partial_refresh_example.html&lpu=hotels.com",
        "dealId": "",
        "requestTimestamp": 1444844944105,
        "responseTimestamp": 1444844944354,
        "timeToRespond": 249,
        "adUnitCode": "/19968336/header-bid-tag-0",
        "bidder": "pubmatic",
        "usesGenericKeys": true,
        "size": "300x250",
        "adserverTargeting": {
          "hb_bidder": "pubmatic",
          "hb_adid": "1139e34e14",
          "hb_pb": "1.00"
        }
      },
      {
        "bidderCode": "rubicon",
        "width": "300",
        "height": "250",
        "statusMessage": "Bid available",
        "adId": "130d3b0d9b",
        "cpm": 0.795995,
        "ad": "<scri...pt>",
        "ad_id": "3161645",
        "sizeId": "15",
        "requestTimestamp": 1444844944116,
        "responseTimestamp": 1444844944396,
        "timeToRespond": 280,
        "adUnitCode": "/19968336/header-bid-tag-0",
        "bidder": "rubicon",
        "usesGenericKeys": true,
        "size": "300x250",
        "adserverTargeting": {
          "hb_bidder": "rubicon",
          "hb_adid": "130d3b0d9b",
          "hb_pb": "0.50"
        }
      }
    ]
  },
  "/9968336/header-bid-tag1": {
    "bids": [
      {
        "bidderCode": "casale",
        "width": 0,
        "height": 0,
        "statusMessage": "Bid returned empty or error response",
        "adId": "108c0ba49d",
        "requestTimestamp": 1444844944130,
        "responseTimestamp": 1444844944223,
        "timeToRespond": 93,
        "cpm": 0,
        "adUnitCode": "/19968336/header-bid-tag1",
        "bidder": "casale"
      },
      {
        "bidderCode": "openx",
        "width": "728",
        "height": "90",
        "statusMessage": "Bid available",
        "adId": "14d7f9208f",
        "ad_id": "537161420",
        "cpm": 1.717,
        "ad": "<iframe src=...tame>",
        "requestTimestamp": 1444844944130,
        "responseTimestamp": 1444844944490,
        "timeToRespond": 360,
        "adUnitCode": "/19968336/header-bid-tag1",
        "bidder": "openx",
        "usesGenericKeys": true,
        "size": "728x90",
        "adserverTargeting": {
          "hb_bidder": "openx",
          "hb_adid": "14d7f9208f",
          "hb_pb": "1.50"
        }
      }
    ]
  }
}
```

</div>
</div>
</div>
</div>

<div class="panel-group" id="accordion2" role="tablist" aria-multiselectable="true">
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="heading-response-example-2">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion2" href="#response-example-2" aria-expanded="false" aria-controls="response-example-2">
          > Response Object Example - Native
        </a>
      </h4>
    </div>
    <div id="response-example-2" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading-response-example-2">
      <div class="panel-body" markdown="1">

```json
{
    "div-banner-outstream-native" : {
      "bids" : [
          {
            "pbMg" : "10.00",
            "pbLg" : "5.00",
            "width" : 0,
            "requestTimestamp" : 1516315716062,
            "creativeId" : 81589325,
            "pbCg" : "",
            "adUnitCode" : "div-banner-outstream-native",
            "size" : "0x0",
            "bidder" : "appnexus",
            "pbAg" : "10.00",
            "adId" : "473965c9df19d2",
            "adserverTargeting" : {
                "hb_native_icon" : "https://vcdn.adnxs.com/p/creative-image/d4/06/e2/33/d406e233-a5f9-44a6-a3e0-8a714bf0e980.png",
                "hb_native_title" : "This is a Prebid Native Multi-Format Creative",
                "hb_native_brand" : "Prebid.org",
                "hb_adid" : "473965c9df19d2",
                "hb_pb" : "10.00",
                "hb_source" : "client",
                "hb_bidder" : "appnexus",
                "hb_native_image" : "https://vcdn.adnxs.com/p/creative-image/9e/26/5f/b2/9e265fb2-50c8-43f0-88ef-a5a48a9d0dcf.jpg",
                "hb_size" : "0x0",
                "hb_mediatype" : "native",
                "hb_native_body" : "This is a Prebid Native Creative. There are many like it, but this one is mine.",
                "hb_native_linkurl" : "https://prebid.org/dev-docs/show-native-ads.html"
            },
            "native" : {
                "icon" : {
                  "url" : "https://vcdn.adnxs.com/p/creative-image/d4/06/e2/33/d406e233-a5f9-44a6-a3e0-8a714bf0e980.png",
                  "height" : 75,
                  "width" : 75
                },
                "body" : "This is a Prebid Native Creative. There are many like it, but this one is mine.",
                "image" : {
                  "url" : "https://vcdn.adnxs.com/p/creative-image/9e/26/5f/b2/9e265fb2-50c8-43f0-88ef-a5a48a9d0dcf.jpg",
                  "height" : 2250,
                  "width" : 3000
                },
                "clickUrl" : "https://prebid.org/dev-docs/show-native-ads.html",
                "clickTrackers" : [
                  "..."
                ],
                "title" : "This is a Prebid Native Multi-Format Creative",
                "impressionTrackers" : [
                  "..."
                ],
                "sponsoredBy" : "Prebid.org"
            },
            "timeToRespond" : 143,
            "mediaType" : "native",
            "bidderCode" : "appnexus",
            "source" : "client",
            "auctionId" : "1338a6fb-e514-48fc-8db6-872ddf3babdb",
            "responseTimestamp" : 1516315716205,
            "netRevenue" : true,
            "pbDg" : "10.00",
            "pbHg" : "10.00",
            "ttl" : 300,
            "status" : "targetingSet",
            "height" : 0,
            "statusMessage" : "Bid available",
            "cpm" : 10,
            "currency" : "USD"
          }
      ]
    }
}
```

</div>
</div>
</div>
</div>
