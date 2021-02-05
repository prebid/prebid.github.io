---
layout: page_v2
title: Publisher API Reference
description: Publisher API Reference for Prebid.js Header Bidding
top_nav_section: dev_docs
nav_section: reference
pid: 10
sidebarType: 1
---



# Publisher API Reference

This page has documentation for the public API methods of Prebid.js.

<a name="module_pbjs"></a>

## pbjs

* [pbjs](#module_pbjs)

  * [.getAdserverTargeting()](#module_pbjs.getAdserverTargeting)
  * [.getAdserverTargetingForAdUnitCode([adUnitCode])](#module_pbjs.getAdserverTargetingForAdUnitCode)
  * [.getBidResponses()](#module_pbjs.getBidResponses)
  * [.getBidResponsesForAdUnitCode(adUnitCode)](#module_pbjs.getBidResponsesForAdUnitCode)
  * [.getEvents()](#module_pbjs.onEvent)
  * [.getHighestCpmBids([adUnitCode])](#module_pbjs.getHighestCpmBids)
  * [.getAllWinningBids()](#module_pbjs.getAllWinningBids)
  * [.getAllPrebidWinningBids()](#module_pbjs.getAllPrebidWinningBids)
  * [.getNoBids()](#module_pbjs.getNoBids)
  * [.getNoBidsForAdUnitCode(adUnitCode)](#module_pbjs.getNoBidsForAdUnitCode)
  * [.setTargetingForGPTAsync([codeArr], customSlotMatching)](#module_pbjs.setTargetingForGPTAsync)
  * [.setTargetingForAst()](#module_pbjs.setTargetingForAst)
  * [.renderAd(doc, id)](#module_pbjs.renderAd)
  * [.removeAdUnit(adUnitCode)](#module_pbjs.removeAdUnit)
  * [.requestBids(requestObj)](#module_pbjs.requestBids)
  * [.addAdUnits(Array\|Object)](#module_pbjs.addAdUnits)
  * [.bidderSettings](#module_pbjs.bidderSettings)
  * [.onEvent(event, handler, id)](#module_pbjs.onEvent)
  * [.offEvent(event, handler, id)](#module_pbjs.onEvent)
  * [.enableAnalytics(config)](#module_pbjs.enableAnalytics)
  * [.aliasBidder(adapterName, aliasedName, options)](#module_pbjs.aliasBidder)
  * [.markWinningBidAsUsed(markBidRequest)](#module_pbjs.markWinningBidAsUsed)
  * [.setConfig(options)](#module_pbjs.setConfig)
    * [debugging](#setConfig-Debugging)
    * [deviceAccess](#setConfig-deviceAcess)
    * [bidderTimeout](#setConfig-Bidder-Timeouts)
    * [maxRequestsPerOrigin](#setConfig-Max-Requests-Per-Origin)
    * [disableAjaxTimeout](#setConfig-Disable-Ajax-Timeout)
    * [timeoutBuffer](#setConfig-timeoutBuffer)
    * [bidderOrder](#setConfig-Bidder-Order)
    * [enableSendAllBids](#setConfig-Send-All-Bids)
    * [sendBidsControl](#setConfig-Send-Bids-Control)
    * [useBidCache](#setConfig-Use-Bid-Cache)
    * [pageUrl](#setConfig-Page-URL)
    * [publisherDomain](#setConfig-Publisher-Domain)
    * [priceGranularity](#setConfig-Price-Granularity)
    * [mediaTypePriceGranularity](#setConfig-MediaType-Price-Granularity)
    * [s2sConfig](#setConfig-Server-to-Server) (server-to-server config)
    * [app](#setConfig-app) (mobile app post-bid)
    * [userSync](#setConfig-Configure-User-Syncing)
    * [targetingControls](#setConfig-targetingControls)
    * [sizeConfig and labels](#setConfig-Configure-Responsive-Ads) (responsive ads)
    * [COPPA](#setConfig-coppa)
    * [first party data](#setConfig-fpd)
    * [cache](#setConfig-vast-cache)
    * [instreamTracking](#setConfig-instream-tracking) - requires [Instream Tracking Module](/dev-docs/modules/instreamTracking.html)
    * [site](#setConfig-site)
    * [auctionOptions](#setConfig-auctionOptions)
    * [realTimeData](#setConfig-realTimeData)
    * [Generic Configuration](#setConfig-Generic-Configuration)
    * [Troubleshooting your config](#setConfig-Troubleshooting-your-configuration)
  * [.setBidderConfig(options)](#module_pbjs.setBidderConfig)
  * [.getConfig([string])](#module_pbjs.getConfig)

Functions added by optional modules

  * [.adServers.dfp.buildVideoUrl(options)](#module_pbjs.adServers.dfp.buildVideoUrl) - requires [GAM Video Module](/dev-docs/modules/dfp_video.html)
  * [.adServers.dfp.buildAdpodVideoUrl(options)](#module_pbjs.adServers.dfp.buildAdpodVideoUrl) - requires [GAM Video Module](/dev-docs/modules/dfp_video.html) <span style="color:red" markdown="1">[Alpha]</span>
  * [.adServers.freewheel.getTargeting(options)](#module_pbjs.getTargeting) - requires [Freewheel Module](/dev-docs/modules/freewheel.html)
  * [.getUserIds()](#userId.getUserIds) - requires [User Id Module](/dev-docs/modules/userId.html)
  * [.getUserIdsAsEids()](#userId.getUserIdsAsEids) - requires [User Id Module](/dev-docs/modules/userId.html)
  * [.refreshUserIds(options, callback)](#userId.refreshUserIds) - requires [User Id Module](/dev-docs/modules/userId.html)

<a name="module_pbjs.getAdserverTargeting"></a>

### pbjs.getAdserverTargeting() ⇒ `object`

Returns all ad server targeting for all ad units. Note that some bidder's response may not have been received if you call this function too quickly after the requests are sent.

The targeting keys can be configured in [ad server targeting](#module_pbjs.bidderSettings).

When [deals are enabled]({{site.baseurl}}/adops/deals.html), the object returned by this method may include a field `hb_deal_BIDDERCODE`, where `BIDDERCODE` is replaced by the name of the bidder, e.g., AppNexus, Rubicon, etc.

**Kind**: static method of [pbjs](#module_pbjs)

**Returns**: `object` - Map of adUnitCodes and targeting values []

**Returned Object Example:**

{% highlight js %}
{
  "/9968336/header-bid-tag-0": {
    "hb_bidder": "rubicon",
    "hb_adid": "13f44b0d3c",
    "hb_pb": "1.50"
  },
  "/9968336/header-bid-tag-1": {
    "hb_bidder": "openx",
    "hb_adid": "147ac541a",
    "hb_pb": "1.00"
  },
  "/9968336/header-bid-tag-2": {
    "hb_bidder": "appnexus",
    "hb_adid": "147ac541a",
    "hb_pb": "2.50",
    "hb_deal_appnexus": "ABC_123"
  }
}
{% endhighlight %}

<hr class="full-rule">

<a name="module_pbjs.getAdserverTargetingForAdUnitCode"></a>

### pbjs.getAdserverTargetingForAdUnitCode([adunitCode]) ⇒ `object`

This function returns the query string targeting parameters available at this moment for a given ad unit. For full documentation see function [pbjs.getAdserverTargeting()](#module_pbjs.getAdserverTargeting).

**Kind**: static method of [pbjs](#module_pbjs)

**Returns**: `object` - returnObj return bids

**Request Params:**

{: .table .table-bordered .table-striped }
| Param | Type | Description |
| --- | --- | --- |
| [adunitCode] | `string` | adUnitCode to get the bid responses for |

**Returned Object Example:**

{% highlight js %}
{
  "hb_bidder": "rubicon",
  "hb_adid": "13f44b0d3c",
  "hb_pb": "0.50"
}
{% endhighlight %}

<hr class="full-rule">

<a name="module_pbjs.getBidResponses"></a>

### pbjs.getBidResponses() ⇒ `object`

This function returns the bid responses at the given moment.

**Kind**: static method of [pbjs](#module_pbjs).

**Returns**: `object` - map | object that contains the bidResponses.

**Returned Object Params**:

{: .table .table-bordered .table-striped }
| Param               | Type    | Description                                                                                                                     |                                                           |
|---------------------+---------+---------------------------------------------------------------------------------------------------------------------------------+-----------------------------------------------------------|
| `bidder`            | String  | The bidder code. Used by ad server's line items to identify bidders                                                             |                                                 `rubicon` |
| `adId`              | String  | The unique identifier of a bid creative. It's used by the line item's creative as in [this example]({{site.github.url}}/adops/send-all-bids-adops.html#step-3-add-a-creative). |                                                     `123` |
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


{% highlight bash %}
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
{% endhighlight %}
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

{% highlight bash %}
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
{% endhighlight %}

</div>
</div>
</div>
</div>

<hr class="full-rule">

<a name="module_pbjs.getBidResponsesForAdUnitCode"></a>

### pbjs.getBidResponsesForAdUnitCode(adUnitCode) ⇒ `Object`

Returns bidResponses for the specified adUnitCode. See full documentation at [pbjs.getBidResponses()](#module_pbjs.getBidResponses).

**Kind**: static method of [pbjs](#module_pbjs)

**Returns**: `Object` - bidResponse object

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| adUnitCode | Required | `String` | adUnitCode |

<hr class="full-rule">

<a name="module_pbjs.getHighestCpmBids"></a>

### pbjs.getHighestCpmBids([adUnitCode]) ⇒ `Array`

Use this method to retrieve an array of winning bids.

+ `pbjs.getHighestCpmBids()`: with no argument, returns an array of winning bid objects for each ad unit on page
+ `pbjs.getHighestCpmBids(adUnitCode)`: when passed an ad unit code, returns an array with the winning bid object for that ad unit

{: .alert.alert-warning :}
Note that from **Prebid 3.0** onwards, `pbjs.getHighestCpmBids` will not return rendered bids.

<hr class="full-rule">

<a name="module_pbjs.getAllWinningBids"></a>

### pbjs.getAllWinningBids() ⇒ `Array`

Use this method to get all of the bids that have won their respective auctions and also rendered on the page.  Useful for [troubleshooting your integration]({{site.baseurl}}/dev-docs/prebid-troubleshooting-guide.html).

+ `pbjs.getAllWinningBids()`: returns an array of bid objects that have won their respective auctions and also rendered on the page.

<hr class="full-rule">

<a name="module_pbjs.getAllPrebidWinningBids"></a>

### pbjs.getAllPrebidWinningBids() ⇒ `Array`

Use this method to get all of the bids that have won their respective auctions but not rendered on the page.  Useful for [troubleshooting your integration]({{site.baseurl}}/dev-docs/prebid-troubleshooting-guide.html).

+ `pbjs.getAllPrebidWinningBids()`: returns an array of bid objects that have won their respective auctions but not rendered on the page.

<hr class="full-rule">

<a name="module_pbjs.getTargeting"></a>

### pbjs.adServers.freewheel.getTargeting(options) ⇒ Object

{: .alert.alert-info :}
The FreeWheel implementation of this function requires including the `freeWheelAdserverVideo` module in your Prebid.js build.

Use this method to get targeting key-value pairs to be sent to the ad server.

+ `pbjs.adServers.freewheel.getTargeting(options)`: returns key-value pair from the ad server.

```javascript

pbjs.adServers.freewheel.getTargeting({
    codes: [adUnitCode1],
    callback: function(err, targeting) {
        //pass targeting to player api
    }
});
```
#### Argument Reference

##### The `options` object

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| codes | Optional | `Array` |  [`adUnitCode1`] |
| callback | Required | `Function` |  Callback function to execute when targeting data is back. |

<hr class="full-rule">

<a name="userId.getUserIds"></a>

### pbjs.getUserIds() ⇒ Object

{: .alert.alert-info :}
To use this function, include the [UserId module](/dev-docs/modules/userId.html) in your Prebid.js build.

If you need to export the user IDs stored by Prebid User ID module, the `getUserIds()` function will return an object formatted the same as bidRequest.userId.

```
pbjs.getUserIds() // returns object like bidRequest.userId. e.g. {"pubcid":"1111", "tdid":"2222"}
```

<hr class="full-rule">

<a name="userId.getUserIdsAsEids"></a>

### pbjs.getUserIdsAsEids() ⇒ Object

{: .alert.alert-info :}
To use this function, include the [UserId module](/dev-docs/modules/userId.html) in your Prebid.js build.

If you need to export the user IDs stored by Prebid User ID module in ORTB Eids frormat, then the `getUserIdsAsEids()` function will return an array formatted as per [ORTB Eids](https://github.com/prebid/Prebid.js/blob/master/modules/userId/eids.md).

```
pbjs.getUserIdsAsEids() // returns userIds in ORTB Eids format. e.g.
[
  {
      source: 'pubcid.org',
      uids: [{
          id: 'some-random-id-value',
          atype: 1
      }]
  },

  {
      source: 'adserver.org',
      uids: [{
          id: 'some-random-id-value',
          atype: 1,
          ext: {
              rtiPartner: 'TDID'
          }
      }]
  }
]
```

<hr class="full-rule">

<a name="userId.refreshUserIds"></a>

### pbjs.refreshUserIds(options, callback)

{: .alert.alert-info :}
To use this function, include the [UserId module](/dev-docs/modules/userId.html) in your Prebid.js build.

The `refreshUserIds` function allows you to force either all or a subset of userId submodules to reinitialize their id values. You might want to do this if an event on your page occurred that would change the id value of a submodule. For example, a user logging in.

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| options | optional | Object | Options object |
| options.submoduleNames | optional | Array of strings | The userId submodule names that should be refreshed. If this option is omitted, all userId submodules are refreshed. |
| callback | optional | Function | Callback that is called after refreshing user ids has completed |


```
pbjs.refreshUserIds();
pbjs.refreshUserIds({ submoduleNames: ['britepoolId'] }, () => console.log("Done!"));
```

<hr class="full-rule">

<a name="module_pbjs.getNoBids"></a>

### pbjs.getNoBids() ⇒ `Object`

Use this method to get all of the bid requests that resulted in a NO_BID.  These are bid requests that were sent to a bidder but, for whatever reason, the bidder decided not to bid on.  Used by debugging snippet in [Tips for Troubleshooting](/dev-docs/troubleshooting-tips.html).

+ `pbjs.getNoBids()`: returns an array of bid request objects that were deliberately not bid on by a bidder.

<hr class="full-rule">

<a name="module_pbjs.getNoBidsForAdUnitCode"></a>

### pbjs.getNoBidsForAdUnitCode(adUnitCode) ⇒ `Object`

Returns bid requests that resulted in a NO_BID for the specified adUnitCode.  See full documentation at [pbjs.getNoBids()](#module_pbjs.getNoBids).

**Kind**: static method of [pbjs](#module_pbjs)

**Returns**: `Object` - NO_BID bidResponse object

**Request Params:**

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| adUnitCode | Required | `String` | adUnitCode |

<hr class="full-rule">

<a name="module_pbjs.setTargetingForGPTAsync"></a>

### pbjs.setTargetingForGPTAsync([codeArr], customSlotMatching)

Set query string targeting on GPT ad units after the auction.

**Kind**: static method of [pbjs](#module_pbjs)

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | -- |
| [codeArr] | Optional | `array` | an array of adUnitCodes to set targeting for. |
| customSlotMatching | Optional | `function` | gets a GoogleTag slot and returns a filter function for adUnitCode. |

This function matches AdUnits that have returned from the auction to a GPT ad slot and adds the `hb_`
targeting attributes to the slot so they get sent to GAM.

Here's how it works:
1. For each AdUnit code that's returned from auction or is specified in the `codeArr` parameter:
2. For each GPT ad slot on the page:
3. If the `customSlotMatching` function is defined, call it. Else, try to match the AdUnit `code` with the GPT slot name. Else try to match the AdUnit `code` with the ID of the HTML div containing the slot.
4. On the first slot that matches, add targeting from the bids on the AdUnit. Exactly which targets are added depends on the status of [enableSendAllBids](/dev-docs/publisher-api-reference.html#setConfig-Send-All-Bids) and [auctionKeyMaxChars](/dev-docs/publisher-api-reference.html#setConfig-targetingControls).

{% capture tipAlert %} To see which targeting key/value pairs are being added to each slot, you can use the GPT Console. From the javascript console, run `googletag.openConsole();` {% endcapture %}

{% include alerts/alert_tip.html content=tipAlert %}

The `customSlotMatching` parameter allows flexibility in deciding which div id
the ad results should render into. This could be useful on long-scrolling pages... instead of setting the timeout of auctions
short to make sure they get good viewability, the logic can find an appropriate placement for the auction
result depending on where the user is once the auction completes.

```
// returns a filter function that matches either with the slot or the adUnitCode
// this filter function is being invoked after the auction has completed
// this means that it can be used in order to place this within viewport instead of a static div naming
// which regular classic setup allows (by default the its looking for a div id named same as the adUnitCode)

// slot is in view according to the divInView() function
function pickInViewDiv(slot) {
   return function(adUnitCode) {
        return adUnitCode === slot.getAdUnitPath() &&
                    divInView(slot.getSlotElementId()); }
};

// make sure we render the results from the auction in a div that is visible in the viewport (example infinite scrolling, instead of rendering a ad in the top of the list that will never be visible (made up example))

setTargetingForGPTAsync(adUnit, pickInViewDiv);
```

<hr class="full-rule">

<a name="module_pbjs.setTargetingForAst"></a>

### pbjs.setTargetingForAst(adUnitCode)

Set query string targeting for AST ([Seller Tag](https://docs.xandr.com/bundle/seller-tag/page/seller-tag.html)) ad unit(s).  Note that this function has to be called after all ad units on page are defined.  For working example code, see [Using Prebid.js with AppNexus Publisher Ad Server]({{site.github.url}}/dev-docs/examples/use-prebid-with-appnexus-ad-server.html). If the function is invoked without arguments it will set targeting for all adUnits defined.

**Kind**: static method of [pbjs](#module_pbjs)

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | -- |
| adUnitCode | Optional | `String or Array of strings` | Code(s) of the adUnit(s) for which targeting is being set. Omitting this parameter will set targeting on all adUnits. |

<hr class="full-rule">

<a name="module_pbjs.renderAd"></a>

### pbjs.renderAd(doc, id)

This function will render the ad (based on params) in the given iframe document passed through. Note that doc SHOULD NOT be the parent document page as we can't doc.write() asynchronously. This function is usually used in the ad server's creative.

**Kind**: static method of [pbjs](#module_pbjs)


{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| doc | Required | `object` | document |
| id | Required | `string` | bid id to locate the ad |


<hr class="full-rule">

<a name="module_pbjs.removeAdUnit"></a>

### pbjs.removeAdUnit(adUnitCode)

Remove adUnit(s) from the pbjs configuration, If adUnit is not given then it will remove all adUnits

**Kind**: static method of [pbjs](#module_pbjs)


{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| adUnitCode | Optional | `String or Array of strings` | the adUnitCode(s) to remove, if empty it removes all |


<hr class="full-rule">

<a name="module_pbjs.requestBids"></a>

### pbjs.requestBids(requestObj)

Request bids. When `adUnits` or `adUnitCodes` are not specified, request bids for all ad units added.

**Kind**: static method of [pbjs](#module_pbjs)


{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| requestObj | Optional | `Object` |  |
| requestObj.adUnitCodes | Optional | `Array of strings` | adUnit codes to request. Use this or `requestObj.adUnits`. Default to all `adUnitCodes` if empty. |
| requestObj.adUnits | Optional | `Array of objects` | AdUnitObjects to request. Use this or `requestObj.adUnitCodes`. Default to all `adUnits` if empty. |
| requestObj.timeout | Optional | `Integer` | Timeout for requesting the bids specified in milliseconds |
| requestObj.bidsBackHandler | Optional | `function` | Callback to execute when all the bid responses are back or the timeout hits. Callback will be passed three parameters, the [bidResponses](#module_pbjs.getBidResponses) themselves, a `timedOut` flag (true if any bidders timed out) and the `auctionId`. |
| requestObj.labels | Optional | `Array of strings` | Defines [labels](#labels) that may be matched on ad unit targeting conditions. |
| requestObj.auctionId | Optional | `String` | Defines an auction ID to be used rather than having the system generate one. This can be useful if there are multiple wrappers on a page and a single auction ID is desired to tie them together in analytics. |

Example call
```
pbjs.requestBids({
    bidsBackHandler: sendAdserverRequest,
    timeout: 1000,
    labels: ["custom1"]
});
```

Example parameters sent to the bidsBackHandler:
```
function sendAdserverRequest(bids, timedOut, auctionId) {
    // bids
    // {"test-div":{"bids":[{"bidderCode":"bidderA", ...}]}}
    // See [getBidResponses function](#module_pbjs.getBidResponses) for details
    // timedOut=false
    // auctionId="130aad5e-eb1a-4b7d-8939-0663ba251887"
    ...
}
```

<hr class="full-rule">

<a name="module_pbjs.addAdUnits"></a>

### pbjs.addAdUnits(Array|Object)

Takes one ad unit object or an array of ad unit objects and adds them to the Prebid auction.  For usage examples, see [Examples](#addAdUnits-Examples) below and the [Getting Started]({{site.baseurl}}/dev-docs/getting-started.html) page.

+ [Ad Unit Properties](#addAdUnits-AdUnitProperties)
+ [Examples](#addAdUnits-Examples)

<a name="addAdUnits-AdUnitProperties">

#### Ad Unit Properties

See the table below for the list of properties on the ad unit.  For example ad units, see the [Examples](#addAdUnits-Examples) below.

{: .table .table-bordered .table-striped }
| Name         | Scope    | Type                                  | Description                                                                                                                                                                       |
|--------------+----------+---------------------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `code`       | Required | String                                | Unique identifier that you create and assign to this ad unit.  Used to set query string targeting on the ad. If using GPT, we recommend setting this to slot element ID.          |
| `sizes`      | Required | Array[Number] or Array[Array[Number]] | All the sizes that this ad unit can accept.  Examples: `[400, 600]`, `[[300, 250], [300, 600]]`.  For 1.0 and later, prefer [`mediaTypes.banner.sizes`](#adUnit-banner).          |
| `bids`       | Required | Array[Object]                         | Each bid represents a request to a bidder.  For a list of properties, see [Bids](#addAdUnits-Bids) below.                                                                         |
| `mediaTypes` | Optional | Object                                | Defines one or multiple media types the ad unit supports.  For a list of properties, see [Media Types](#addAdUnits-MediaTypes) below.                                                                     |
| `labelAny` | optional  | array<string> | An array of string labels, used for showing responsive ads.  With the `labelAny` operator, just one label has to match for the condition to be true. Works with the `sizeConfig` object passed in to [pbjs.setConfig]({{site.baseurl}}/dev-docs/publisher-api-reference.html#module_pbjs.setConfig).  |
| `labelAll` | optional  | array<string> | An array of string labels, used for showing responsive and conditional ads. With the `labelAll` conditional, every element of the target array must match an element of the label array in order for the condition to be true. Works with the `sizeConfig` object passed in to [pbjs.setConfig]({{site.baseurl}}/dev-docs/publisher-api-reference.html#module_pbjs.setConfig).  |

<a name="addAdUnits-Bids" />

##### Bids

See the table below for the list of properties in the `bids` array of the ad unit.  For example ad units, see the [Examples](#addAdUnits-Examples) below.

{: .table .table-bordered .table-striped }

| Name     | Scope    | Type          | Description                                                                                                                                                                       |
|----------+----------+---------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `bidder` | Required | String        | Bidder code. Find the [complete reference for all supported bidders here](bidders.html).                                                                                          |
| `params` | Required | Object        | Bidder's preferred way of identifying a bid request. Find the [complete reference for all supported bidders here](bidders.html).                                                  |
| `labelAny` | optional  | array<string> | An array of string labels, used for showing responsive ads.  With the `labelAny` operator, just one label has to match for the condition to be true. Works with the `sizeConfig` object passed in to [pbjs.setConfig]({{site.baseurl}}/dev-docs/publisher-api-reference.html#module_pbjs.setConfig).  |
| `labelAll` | optional  | array<string> | An array of string labels, used for showing responsive and conditional ads. With the `labelAll` conditional, every element of the target array must match an element of the label array in order for the condition to be true. Works with the `sizeConfig` object passed in to [pbjs.setConfig]({{site.baseurl}}/dev-docs/publisher-api-reference.html#module_pbjs.setConfig).  |

<a name="addAdUnits-MediaTypes" />

##### Media Types

See the table below for the list of properties in the `mediaTypes` object of the ad unit.  For example ad units showing the different media types, see the [Examples](#addAdUnits-Examples) below.

{: .table .table-bordered .table-striped }
| Name     | Scope                                                        | Type   | Description                                                                                                        |
|----------+--------------------------------------------------------------+--------+--------------------------------------------------------------------------------------------------------------------|
| `banner` | optional. If no other properties are specified, this is the default | Object | Defines properties of a banner ad.  For examples, see [the banner example below](#adUnit-banner).                  |
| `native` | optional | Object | Defines properties of a native ad.  For an example native ad unit, see [the native example below](#adUnit-native). |
| `video`  | optional | Object | Defines properties of a video ad.  For examples, see [the video examples below](#adUnit-video).                    |

<a name="addAdUnits-Examples">

#### Examples

+ [Native](#adUnit-native)
+ [Video](#adUnit-video)
+ [Banner](#adUnit-banner)
+ [Multi-format](#adUnit-multi-format)


<a name="adUnit-native">

##### Native

For an example of a native ad unit, see below.  For more detailed instructions, see [Show Native Ads]({{site.baseurl}}/dev-docs/show-native-ads.html).

```javascript
pbjs.addAdUnits({
    code: slot.code,
    mediaTypes: {
        native: {
            image: {
                required: true,
                sizes: [150, 50]
            },
            title: {
                required: true,
                len: 80
            },
            sponsoredBy: {
                required: true
            },
            clickUrl: {
                required: true
            },
            body: {
                required: true
            },
            icon: {
                required: true,
                sizes: [50, 50]
            }
        }
    },
    bids: [
        {
            bidder: 'appnexus',
            params: {
                placementId: 13232354
            }
        }
    ]
});
```

{% include dev-docs/native-image-asset-sizes.md %}

<a name="adUnit-video">

##### Video

For an example of an instream video ad unit, see below.  For more detailed instructions, see [Show Video Ads]({{site.baseurl}}/dev-docs/show-video-with-a-dfp-video-tag.html).

```javascript
pbjs.addAdUnits({
    code: slot.code,
    mediaTypes: {
        video: {
            context: 'instream',
            playerSize: [640, 480]
        },
    },
    bids: [{
        bidder: 'appnexus',
        params: {
            placementId: 13232361,
            video: {
                skippable: true,
                playback_methods: ['auto_play_sound_off']
            }
        }
    }]
});
```

For an example of an outstream video ad unit, see below.  For more detailed instructions, see [Show Outstream Video Ads]({{site.baseurl}}/dev-docs/show-outstream-video-ads.html).

```javascript
pbjs.addAdUnit({
    code: slot.code,
    mediaTypes: {
        video: {
            context: 'outstream',
            playerSize: [640, 480]
        }
    },
    renderer: {
        url: 'https://cdn.adnxs.com/renderer/video/ANOutstreamVideo.js',
        render: function(bid) {
            ANOutstreamVideo.renderAd({
                targetId: bid.adUnitCode,
                adResponse: bid.adResponse,
            });
        }
    },
    ...
})
```

<a name="adUnit-banner">

##### Banner

For an example of a banner ad unit, see below.  For more detailed instructions, see [Getting Started]({{site.baseurl}}/dev-docs/getting-started.html).

```javascript
pbjs.addAdUnits({
    code: slot.code,
    mediaTypes: {
        banner: {
            sizes: [[300, 250]]
        }
    },
    bids: [
        {
            bidder: 'appnexus',
            params: {
                placementId: 13144370
            }
        }
    ]
})
```

<a name="adUnit-multi-format">

##### Multi-format

Multiple media formats may be declared on a single ad unit, allowing any bidder that supports at least one of those media formats to participate in the auction. Any bidder that isn't compatible with the specified `mediaTypes` will be dropped from the ad unit. If `mediaTypes` is not specified on an ad unit, `banner` is the assumed format and any banner bidder is eligible for inclusion.

For examples of a multi-format ad units and behavior, see below.

```javascript
// each bidder supports at least one of the formats, so all will participate
pbjs.addAdUnits({
  code: 'div-banner-outstream-native',
  mediaTypes: {
    banner: { sizes: [[300, 250], [300, 600]] },
    native: {
        title: {required: true},
        image: {required: true},
        body: {required: false},
    },
    video: {
        context: 'outstream',
        playerSize: [400, 600],
    },
  },
  bids: [
    {
      bidder: 'bannerBidder',
      params: {placementId: '481'}
    },
    {
      bidder: 'nativeBidder',
      params: {titleAsset: '516'}
    },
    {
      bidder: 'videoBidder',
      params: {vidId: '234'}
    },
  ]
});
```

```javascript
// only nativeBidder and videoBidder will participate
pbjs.addAdUnits({
  code: 'div-native-outstream',
  mediaTypes: {
    native: { type: 'image' },
    video: { context: 'outstream', playerSize: [400, 600] },
  },
  bids: [
    {
      bidder: 'bannerBidder',
      params: {placementId: '481'}
    },
    {
      bidder: 'nativeBidder',
      params: {titleAsset: '516'}
    },
    {
      bidder: 'videoBidder',
      params: {vidId: '234'}
    },
  ]
});
```

<hr class="full-rule">

<a name="module_pbjs.bidderSettings"></a>

### pbjs.bidderSettings

#### 1. Overview

The bidderSettings object provides a way to define some behaviors for the
platform and specific adapters. The basic structure is a 'standard' section with defaults for all adapters, and then one or more adapter-specific sections that override behavior for that bidder:

{% highlight js %}

pbjs.bidderSettings = {
    standard: {
         [...]
    },
    ix: {
        [...]
    },
    rubicon: {
        [...]
    },
}

{% endhighlight %}

Defining bidderSettings is optional; the platform has default values for all of the options.
Adapters may specify their own default settings, though this isn't common.
Some sample scenarios where publishers may wish to alter the default settings:

* using bidder-specific ad server targeting instead of Prebid-standard targeting
* passing additional information to the ad server
* adjusting the bid CPM sent to the ad server

#### 2. Bidder Setting Attributes

{: .table .table-bordered .table-striped }
| Attribute | Scope | Version | Default | Description |
| --- | --- | --- | --- | --- |
| adserverTargeting | standard or adapter-specific | all | see below | Define which key/value pairs are sent to the ad server. |
| bidCpmAdjustment | standard or adapter-specific | all | n/a | Could, for example, adjust a bidder's gross-price bid to net price. |
| sendStandardTargeting | adapter-specific | 0.13.0 | true | If adapter-specific targeting is specified, can be used to suppress the standard targeting for that adapter. |
| suppressEmptyKeys | standard or adapter-specific | 0.13.0 | false | If custom adserverTargeting functions are specified that may generate empty keys, this can be used to suppress them. |

##### 2.1. adserverTargeting

As described in the [AdOps documentation]({{site.baseurl}}/adops/before-you-start.html), Prebid has a recommended standard
set of ad server targeting that works across bidders. This standard targeting approach is
defined in the adserverTargeting attribute in the 'standard' section, but can be overridden
per adapter as needed. Both scenarios are described below.

{: .alert.alert-warning :}
Note that once `standard.adserverTargeting` is specified,
you'll need to fully manage the targeting -- the default `hb_` targeting variables will not be added.

**Keyword targeting for all bidders**

The below code snippet is the *default* setting for ad server targeting. For each bidder's bid,
Prebid.js will set 6 keys (`hb_bidder`, `hb_adid`, `hb_pb`, `hb_size`, `hb_source`, `hb_format`) with their corresponding values.
In addition, video will receive additional keys: `hb_cache_id`, `hb_uuid`, and `hb_cache_host`.
The key value pair targeting is applied to the bid's corresponding ad unit. Your ad ops team will have the ad server's line items and creatives to utilize these keys.

If you'd like to customize the key value pairs, you can overwrite the settings as the below example shows. *Note* that once you updated the settings, let your ad ops team know about the change, so they can update the line item targeting accordingly. See the [Ad Ops](/adops/before-you-start.html) documentation for more information.

<a name="bidderSettingsDefault"></a>
<a name="default-keywords">

There's no need to include the following code if you choose to use the *below default setting*.

{% highlight js %}

pbjs.bidderSettings = {
    standard: {
        adserverTargeting: [{
            key: "hb_bidder",
            val: function(bidResponse) {
                return bidResponse.bidderCode;
            }
        }, {
            key: "hb_adid",
            val: function(bidResponse) {
                return bidResponse.adId;
            }
        }, {
            key: "hb_pb",
            val: function(bidResponse) {
                return bidResponse.pbMg;
            }
        }, {
            key: 'hb_size',
            val: function (bidResponse) {
                return bidResponse.size;
            }
        }, {
            key: 'hb_source',
            val: function (bidResponse) {
                return bidResponse.source;
            }
        }, {
            key: 'hb_format',
            val: function (bidResponse) {
                return bidResponse.mediaType;
            }
        }]
    }
}

{% endhighlight %}

{: .alert.alert-warning :}
Note that the existence of `bidderSettings.adserverTargeting.standard` will prevent the system from adding the standard display targeting values: hb_bidder, hb_adid, hb_pb, hb_size, hb_source, and hb_format. However, if the mediaType is video and `bidderSettings.adserverTargeting.standard` does not specify hb_uuid, hb_cache_id, or hb_cache_host, they will be added unless `bidderSettings.sendStandardTargeting` is set to false.

<a name="key-targeting-specific-bidder"></a>
**Keyword targeting for a specific bidder**

Let’s say the bidder prefers a separate set of line items. You can overwrite the bidder
settings as the below example for AppNexus shows.

*Note that the line item setup has to match the targeting change*

{% highlight js %}
pbjs.bidderSettings = {
    appnexus: {
      sendStandardTargeting: false,
      adserverTargeting: [
        {
            key: "apn_pbMg",
            val: function(bidResponse) {
                return bidResponse.pbMg;
            }
        }, {
            key: "apn_adId",
            val: function(bidResponse) {
                return bidResponse.adId;
            }
        }
      ]
    }
}
{% endhighlight %}


In other words, the above config sends 2 pairs of key/value strings targeting for every AppNexus bid and for every ad unit. The 1st pair would be `apn_pbMg` => the value of `bidResponse.pbMg`. The 2nd pair would be `apn_adId` => the value of `bidResponse.adId`. You can find the documentation of bidResponse object [here](bidders.html#common-bidresponse).

Note that sendStandardTargeting is set to false so that the standard Prebid targeting (hb_bidder, etc.) aren't also sent to the ad server.

**Price Buckets**

Now let's say you would like to define a bidder-specific price bucket function rather than use the ones available by default in prebid.js. Even the [priceGranularity config](/dev-docs/publisher-api-reference.html#setConfig-Price-Granularity) option applies to all bidders -- with this approach you can overwrite price buckets.

*Note: this will only impact the price bucket sent to the ad server for targeting. It won't actually impact the cpm value used for ordering the bids.*

{% highlight js %}

pbjs.bidderSettings = {
    standard: {
        [...]
        adserverTargeting: [{
            key: "hb_pb",
            val: function(bidResponse) {
                // define your own function to assign price bucket
                if (cpm < 2)
                    return "pb1"; // all bids less than $2 are assigned to price bucket 'pb1'
                if (cpm < 3)
                    return "pb2"; // all bids less than $3 are assigned to price bucket 'pb2'
                if (cpm < 4)
                    return "pb3"; // all bids less than $4 are assigned to price bucket 'pb3'
                if (cpm < 5)
                    return "pb4"; // all bids less than $5 are assigned to price bucket 'pb4'
                if (cpm < 6)
                    return "pb5"; // all bids less than $6 are assigned to price bucket 'pb5'
                return "pb6"; // all bids $6 and above are assigned to price bucket 'pb6'
            }
        }]
	[...]
    }
}
{% endhighlight %}

##### 2.2. bidCpmAdjustment

Some bidders return gross prices instead of the net prices (what the publisher will actually
get paid). For example, a publisher's net price might be 15% below the returned gross price.
In this case, the publisher may want to adjust the bidder's returned price to run a true
header bidding auction. Otherwise, this bidder's gross price will unfairly win over your
other demand sources who report the real price.

{% highlight js %}

pbjs.bidderSettings = {
  standard: { ... }
  aol: {
    bidCpmAdjustment : function(bidCpm, bid){
      // adjust the bid in real time before the auction takes place
      console.log('Bidder is: ' + bid.bidderCode);
      return bidCpm * .85;
    }
  }
};

{% endhighlight %}

In the above example, the AOL bidder will inherit from "standard" adserverTargeting keys, so that you don't have to define the targeting keywords again.

##### 2.3. sendStandardTargeting

This boolean flag minimizes key/value pairs sent to the ad server when
adapter-specific targeting is specified. By default, the platform will send both adapter-specific adServerTargeting as well as the standard adServerTargeting.

While sending extra targeting the ad server may not matter, this flag can be used to
suppress the standard targeting for adapters that define their own.

See the [example above](#key-targeting-specific-bidder) for example usage.

##### 2.4. suppressEmptyKeys

If a custom adServerTargeting function can return an empty value, this boolean flag can be used to avoid sending those empty values to the ad server.

<hr class="full-rule" />

<a name="module_pbjs.onEvent"></a>

### pbjs.onEvent(event, handler, id)

### pbjs.offEvent(event, handler, id)

### pbjs.getEvents() ⇒ `Array`

The methods `onEvent` and `offEvent` are provided for you to register
a callback to handle a Prebid.js event.

The `getEvents` method returns a copy of all emitted events.

The optional `id` parameter provides more finely-grained event
callback registration.  This makes it possible to register callback
events for a specific item in the event context.

For example, `bidWon` events will accept an `id` for ad unit code.
`bidWon` callbacks registered with an ad unit code id will be called
when a bid for that ad unit code wins the auction. Without an `id`
this method registers the callback for every `bidWon` event.

{: .alert.alert-info :}
Currently, `bidWon` is the only event that accepts the `id` parameter.

The available events are:

{: .table .table-bordered .table-striped }
| Event         | Description                             | Callback Arguments |
|---------------+-----------------------------------------|--------------------|
| auctionInit   | The auction has started                 | Object containing auction details |
| auctionEnd    | The auction has ended                   | Object containing auction details |
| beforeRequestBids | Bids are about to be requested from adapters (added in 3.x) | Array of adunits in the auction |
| bidRequested  | A bid was requested from a specific bidder | Bid request object |
| bidResponse   | A bid response has arrived              | Bid response object |
| bidAdjustment | A bid was adjusted                      | Bid response object |
| bidWon        | A bid has won                           | Bid response object |
| bidTimeout    | A bid timed out                         | Array of objects with timed out bids |
| setTargeting  | Targeting has been set                  | Hash of targeting values |
| requestBids   | Bids have been requested from adapters (i.e. pbjs.requestBids() was called) | None |
| addAdUnits    | Ad units have been added to the auction | None |
| adRenderFailed| Ad rendering failed | Object containing 'reason' and 'message' |
| auctionDebug  | An error was logged to the console | Object containing 'type' and 'arguments' |
| bidderDone    | A bidder has signaled they are done responding | Bid request object |
| tcf2Enforcement | There was a TCF2 enforcement action taken | `{ storageBlocked: ['moduleA', 'moduleB'], biddersBlocked: ['moduleB'], analyticsBlocked: ['moduleC'] }` |

The examples below show how these events can be used.

Events example 1
{% highlight js %}

        /* Log when ad units are added to Prebid */
        pbjs.onEvent('addAdUnits', function() {
          console.log('Ad units were added to Prebid.')
          console.log(pbjs.adUnits);
        });

        /* Log when Prebid wins the ad server auction */
        pbjs.onEvent('bidWon', function(data) {
          console.log(data.bidderCode+ ' won the ad server auction for ad unit ' +data.adUnitCode+ ' at ' +data.cpm+ ' CPM');
        });

{% endhighlight %}

Events example 2: Use the optional 3rd parameter for the `bidWon` event
{% highlight js %}
        /* This handler will be called only for rightAdUnit */
        /* Uses the `pbjs.offEvent` method to remove the handler once it has been called */
        var bidWonHandler = function bidWonHandler() {
            console.log('bidWonHandler: ', arguments);
            pbjs.offEvent('bidWon', bidWonHandler, rightAdUnit);
        };

        var rightAdUnit="/111111/right";
        pbjs.que.push(function () {
            var adUnits = [{
                code: rightAdUnit,
		...
	    },{
		...
	    }];

	    pbjs.addAdUnits(adUnits);
            pbjs.requestBids({
		...
            });

            /* Register a callback for just the rightSlot `bidWon` event */
            /* Note that defining an event that uses the 3rd parameter must come after initiating the auction */
            pbjs.onEvent('bidWon', bidWonHandler, rightAdUnit);

            ...
{% endhighlight %}

Events example 3: Dynamically modify the auction
{% highlight js %}
	var bidderFilter = function bidderFilter(adunits) {
	    // pub-specific logic to optimize bidders
            // e.g. "remove any that haven't bid in the last 4 refreshes"
	};
	pbjs.onEvent('beforeRequestBids', bidderFilter);
{% endhighlight %}

Events example 4: Log errors and render fails to your own endpoint
{% highlight js %}
        pbjs.onEvent('adRenderFailed', function () {
              // pub-specific logic to call their own endpoint
            });
	pbjs.onEvent('auctionDebug', function () {
              // pub-specific logic to call their own endpoint
            });
{% endhighlight %}

<hr class="full-rule" />

<a name="module_pbjs.enableAnalytics"></a>

### pbjs.enableAnalytics(config)

Enables sending analytics data to the analytics provider of your choice. For a list of analytics adapters, see [Analytics for Prebid](/overview/analytics.html).

Note that each analytics adapter has it's own invocation parameters. Analytics adapters that are built in the standard way should
support a `sampling` option. You'll need to check with your analytics provider to confirm
whether their system recommends the use of this parameter. They may have alternate methods of sampling.

```
pbjs.enableAnalytics([{
    provider: "analyticsA",
    options: {
        providerSpecificParams: ...
        sampling: 0.25          // only call the analytics adapter this percent of the time
    }
}]);
```

To learn how to build an analytics adapter, see [How to Add an Analytics Adapter](/dev-docs/integrate-with-the-prebid-analytics-api.html).

<hr class="full-rule" />

<a name="module_pbjs.aliasBidder"></a>

### pbjs.aliasBidder(adapterName, aliasedName, options)

To define an alias for a bidder adapter, call this method at runtime:

{% highlight js %}

pbjs.aliasBidder('appnexus', 'newAlias', options: { gvlid: 111111} );

{% endhighlight %}

Defining an alias can help avoid user confusion since it's possible to send parameters to the same adapter but in different contexts (e.g, The publisher uses `"appnexus"` for demand and also uses `"newAlias"` which is an SSP partner that uses the `"appnexus"` adapter to serve their own unique demand).

If you define an alias and are using `pbjs.sendAllBids`, you must also set up additional line items in the ad server with keyword targeting that matches the name of the alias.  For example:

+ `hb_pb_newalias`
+ `hb_adid_newalias`
+ `hb_size_newalias`
+ `hb_deal_newalias`

The options object supports these parameters:

{: .table .table-bordered .table-striped }
| Option Parameter    | Type    | Description             |
|------------|---------|---------------------------------|
| gvlid | integer | IAB Global Vendor List ID for this alias for use with the [GDPR Enforcement module](/dev-docs/modules/gdprEnforcement.html). |

{: .alert.alert-info :}
Creating an alias for a Prebid Server adapter is done differently. See 'extPrebid'
config in the [`s2sConfig`](#setConfig-Server-to-Server) object.

<hr class="full-rule" />

<a name="module_pbjs.setConfig"></a>

### pbjs.setConfig(options)

`setConfig` supports a number of advanced configuration options:

See below for usage examples.

Core config:

+ [Debugging](#setConfig-Debugging)
+ [Device Access](#setConfig-deviceAccess)
+ [Bidder Timeouts](#setConfig-Bidder-Timeouts)
+ [Max Requests Per Origin](#setConfig-Max-Requests-Per-Origin)
+ [Disable Ajax Timeout](#setConfig-Disable-Ajax-Timeout)
+ [Set Timeout Buffer](#setConfig-timeoutBuffer)
+ [Turn on send all bids mode](#setConfig-Send-All-Bids)
+ [Configure send bids control](#setConfig-Send-Bids-Control)
+ [Bid cache](#setConfig-Use-Bid-Cache)
+ [Set the order in which bidders are called](#setConfig-Bidder-Order)
+ [Set the page URL](#setConfig-Page-URL)
+ [Set the publisher's domain](#setConfig-Publisher-Domain)
+ [Set a delay before requesting cookie sync](#setConfig-Cookie-Sync-Delay)
+ [Set price granularity](#setConfig-Price-Granularity)
+ [Configure server-to-server header bidding](#setConfig-Server-to-Server)
+ [Configure user syncing](#setConfig-Configure-User-Syncing)
+ [Configure targeting controls](#setConfig-targetingControls)
+ [Configure responsive ad units with `sizeConfig` and `labels`](#setConfig-Configure-Responsive-Ads)
+ [COPPA](#setConfig-coppa)
+ [First Party Data](#setConfig-fpd)
+ [Caching VAST XML](#setConfig-vast-cache)
+ [Site Metadata](#setConfig-site)
+ [Generic Configuration](#setConfig-Generic-Configuration)
+ [Troubleshooting configuration](#setConfig-Troubleshooting-your-configuration)

Module config: other options to `setConfig()` are available if the relevant module is included in the Prebid.js build.

+ [Currency module](/dev-docs/modules/currency.html)
+ [Consent Management](/dev-docs/modules/consentManagement.html#page-integration)
+ [User ID module](/dev-docs/modules/userId.html#configuration)
+ [Adpod](/dev-docs/modules/adpod.html)
+ [IAB Category Translation](/dev-docs/modules/categoryTranslation.html)

<a name="setConfig-Debugging" />

#### Debugging

Debug mode can be enabled permanently in a page if desired. In debug mode,
Prebid.js will post additional messages to the browser console and cause Prebid Server to
return additional information in its response. If not specified, debug is off.
Note that debugging can be specified for a specific page view by adding
`pbjs_debug=true` to the URL's query string. e.g. <code>/pbjs_demo.html?pbjs_debug=true</code> See [Prebid.js troubleshooting tips](/dev-docs/troubleshooting-tips.html) for more information.

Turn on debugging permanently in the page:
{% highlight js %}
pbjs.setConfig({ debug: true });
{% endhighlight %}

{: .alert.alert-warning :}
Note that turning on debugging for Prebid Server causes most server-side adapters to consider it a test request, meaning that they won't count on reports.

<a name="setConfig-deviceAccess" />

#### Device Access

You can prevent Prebid.js from reading or writing cookies or HTML localstorage by setting this flag:

{% highlight js %}
pbjs.setConfig({ deviceAccess: false });
{% endhighlight %}

This can be useful in GDPR, CCPA, COPPA or other privacy scenarios where a publisher has determined that header bidding should not read from or write the user's device.

<a name="setConfig-Bidder-Timeouts" />

#### Bidder Timeouts

Set a global bidder timeout:

{% highlight js %}
pbjs.setConfig({ bidderTimeout: 3000 });
{% endhighlight %}

{: .alert.alert-warning :}
**Bid Timeouts and JavaScript Timers**
Note that it's possible for the timeout to be triggered later than expected, leading to a bid participating in the auction later than expected.  This is due to how [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) works in JS: it queues the callback in the event loop in an approximate location that *should* execute after this time but *it is not guaranteed*.
With a busy page load, bids can be included in the auction even if the time to respond is greater than the timeout set by Prebid.js.  However, we do close the auction immediately if the threshold is greater than 200ms, so you should see a drop off after that period.
For more information about the asynchronous event loop and `setTimeout`, see [How JavaScript Timers Work](https://johnresig.com/blog/how-javascript-timers-work/).

#### Max Requests Per Origin

<a name="setConfig-Max-Requests-Per-Origin" />

Since browsers have a limit of how many requests they will allow to a specific domain before they block, Prebid.js
will queue auctions that would cause requests to a specific origin to exceed that limit.  The limit is different
for each browser. Prebid.js defaults to a max of `4` requests per origin.  That value can be configured with
`maxRequestsPerOrigin`.

{% highlight js %}
// most browsers allow at least 6 requests, but your results may vary for your user base.  Sometimes using all
// `6` requests can impact performance negatively for users with poor internet connections.
pbjs.setConfig({ maxRequestsPerOrigin: 6 });

// to emulate pre 1-x behavior and have all auctions queue (no concurrent auctions), you can set it to `1`.
pbjs.setConfig({ maxRequestsPerOrigin: 1 });
{% endhighlight %}

#### Disable Ajax Timeout

<a name="setConfig-Disable-Ajax-Timeout" />

Prebid core adds a timeout on XMLHttpRequest request to terminate the request once auction is timedout. Since Prebid is ignoring all the bids after timeout it does not make sense to continue the request after timeout. However, you have the option to disable this by using `disableAjaxTimeout`.

{% highlight js %}
pbjs.setConfig({ disableAjaxTimeout: true });
{% endhighlight %}

#### Set Timeout Buffer

<a name="setConfig-timeoutBuffer" />

Prebid core adds a timeout buffer to extend the time that bidders have to return a bid after the auction closes. This buffer is used to offset the "time slippage" of the setTimeout behavior in browsers. Prebid.js sets the default value to 400ms. You can change this value by setting `timeoutBuffer` to the amount of time you want to use. The following example sets the buffer to 300ms.

{% highlight js %}
pbjs.setConfig({ timeoutBuffer: 300 });
{% endhighlight %}

#### Send All Bids

<a name="setConfig-Send-All-Bids" />

When enableSendAllBids is **true** (the default), the page will send keywords for all bidders to your ad server. The ad server can then make the decision on which bidder will win. Some ad servers, such as Google Ad Manager, can then generate reporting on historical bid prices from all bidders.

However, there will be a set of ad server targeting values for each bidder, so if you run many bidders this could cause an issue with how much data is being sent to the ad server.

There are several ways to address the issue of sending too much data to the ad server:

1. Set `enableSendAllBids` to **false**. This will minimize the number of targeting variables sent to the ad server; only the top bid will be sent.
1. Define the `auctionKeyMaxChars` setting. This allows you to establish a limit on the number of bytes sent to the ad server. See [targetingControls](#setConfig-targetingControls) for more details.
1. Set `enableSendAllBids` to **false** and `targetingControls.alwaysIncludeDeals` to **true**. This will send the top bid and any deals.
1. Set `enableSendAllBids` to **false**, `targetingControls.alwaysIncludeDeals` to **true**, and `auctionKeyMaxChars`. This will send the top bid and any deals up to the maximum number of characters.

Note that targeting config must be set before either `pbjs.setTargetingForGPTAsync()` or `pbjs.getAdserverTargeting()` is called.

##### Example results where enableSendAllBids is true

{% highlight bash %}
{
  "hb_adid_audienceNetw": "1663076dadb443d",
  "hb_pb_audienceNetwor": "9.00",
  "hb_size_audienceNetw": "300x250",
  "hb_format_audienceNe": "banner",
  "hb_source_audienceNe": "client",
  "hb_adid_rubicon": "3485968928",
  "hb_pb_rubicon": "8.00",
  "hb_size_rubicon": "300x250",
  "hb_deal_rubicon": "11111111",
  "hb_format_rubicon": "banner",
  "hb_source_rubicon": "client",
  "hb_adid_appnexus": "191f4aca0c0be8",
  "hb_pb_appnexus": "10.00",
  "hb_size_appnexus": "300x250",
  "hb_format_appnexus": "banner",
  "hb_source_appnexus": "client",
  // the winning bid is copied to attributes without a suffix
  "hb_bidder": "appnexus",
  "hb_adid": "191f4aca0c0be8",
  "hb_pb": "10.00",
  "hb_size": "300x250",
  "hb_format": "banner"
}
{% endhighlight %}

You can see how the number of ad server targeting variable could get large
when many bidders are present.

{% capture noteAlert %}
The Prebid recommendation is to leave `enableSendAllBids` as **true** when ad server targeting volume is not a concern. This approach is more transparent and leaves the decisioning in the ad server.
{% endcapture %}

{% include alerts/alert_note.html content=noteAlert %}

##### Example of setting enableSendAllBids to false

Turning off `enableSendAllBids` will cause the system to return only the
winning bid. However, this could be a problem if you need to support [deals](/adops/deals.html), as often a deal may be chosen to win over an open market bid.

To make sure that deal bids are sent along with the winning bid in the enableSendAllBids:false scenario, use the `alwaysIncludeDeals` flag that's part of [targetingControls](#setConfig-targetingControls):

```javascript
pbjs.setConfig({
  enableSendAllBids: false,
  targetingControls: {
    alwaysIncludeDeals: true
  }
});
```

<a name="setConfig-Bidder-Order" />

#### Configure Send Bids Control

<a name="setConfig-Send-Bids-Control" />

The `sendBidsControl` object passed to `pbjs.setConfig` provides the publisher with the ability to adjust the targeting behavior when [sendAllBids](#setConfig-Send-All-Bids) is enabled.

{: .table .table-bordered .table-striped }
| Attribute        | Type    | Description             |
|------------+---------+---------------------------------|
| `bidLimit` | integer | The maximum number of bids the system can add to ad server targeting. |
| `dealPrioritization` | boolean | When `true`, bids with deals are prioritized before bids without deals. |

##### Details on the bidLimit setting

Below is an example config containing `bidLimit`:

```javascript
pbjs.setConfig({
  sendBidsControl: {
    bidLimit: 2
  }
});
```
When this property is set, the value assigned to `bidLimit` is the maximum number of bids that will be sent to the ad server. If `bidLimit` is set to 0, sendAllBids will have no maximum bid limit and *all* bids will be sent. This setting can be helpful if you know that your ad server has a finite limit to the amount of query characters it will accept and process.

{: .alert.alert-info :}
Note that this feature overlaps and can be used in conjunction with [targetingControls.auctionKeyMaxChars](/dev-docs/publisher-api-reference.html#setConfig-targetingControls). Please see that section for tips on controlling the number of characters being sent to the ad server.

#### Use Bid Cache

<a name="setConfig-Use-Bid-Cache" />

Prebid.js currently allows for [caching and reusing bids in a very narrowly defined scope](/dev-docs/faq.html#does-prebidjs-cache-bids).
However, if you'd like, you can disable this feature and prevent Prebid.js from using anything but the latest bids for
a given auction.

{: .alert.alert-warning :}
This option is available in version 1.39 as true-by-default and became false-by-default as of Prebid.js 2.0. If you want to use this
feature in 2.0 and later, you'll need to set the value to true.

{% highlight js %}
pbjs.setConfig({ useBidCache: true })
{% endhighlight %}


#### Bidder Order

Set the order in which bidders are called:

{% highlight js %}
pbjs.setConfig({ bidderSequence: "fixed" })   /* default is "random" */
{% endhighlight %}

<a name="setConfig-Page-URL" />

#### Page URL

Override the Prebid.js page referrer algorithm.

a{% highlight js %}
pbjs.setConfig({ pageUrl: "https://example.com/index.html" )
{% endhighlight %}

<a name="setConfig-Publisher-Domain" />

#### Publisher Domain

Set the publisher's domain where Prebid is running, for cross-domain iframe communication:

{% highlight js %}
pbjs.setConfig({ publisherDomain: "https://www.theverge.com" )
{% endhighlight %}

<a name="setConfig-Price-Granularity" />

#### Price Granularity

This configuration defines the price bucket granularity setting that will be used for the `hb_pb` keyword.

{% highlight js %}
pbjs.setConfig({ priceGranularity: "medium" })
{% endhighlight %}

Standard values:

+ `"low"`: $0.50 increments, capped at $5 CPM
+ `"medium"`: $0.10 increments, capped at $20 CPM (the default)
+ `"high"`: $0.01 increments, capped at $20 CPM
+ `"auto"`: Applies a sliding scale to determine granularity as shown in the [Auto Granularity](#autoGranularityBucket) table below.
+ `"dense"`: Like `"auto"`, but the bid price granularity uses smaller increments, especially at lower CPMs.  For details, see the [Dense Granularity](#denseGranularityBucket) table below.
+ `customConfigObject`: If you pass in a custom config object (as shown in the [Custom CPM Bucket Sizing](#customCPMObject) example below), you can have much finer control over CPM bucket sizes, precision, and caps.

<a name="autoGranularityBucket"></a>

##### Auto Granularity

{: .table .table-bordered .table-striped }
| CPM                 | 	Granularity                  |  Example |
|---------------------+----------------------------------+--------|
| CPM <= $5            | 	$0.05 increments             | $1.87 floored to $1.85 |
| CPM <= $10 and > $5  | 	$0.10 increments             | $5.09 floored to $5.00 |
| CPM <= $20 and > $10 | 	$0.50 increments             | $14.26 floored to $14.00 |
| CPM > $20           | 	Caps the price bucket at $20 | $24.82 floored to $20.00 |

<a name="denseGranularityBucket"></a>

##### Dense Granularity

{: .table .table-bordered .table-striped }
| CPM        | 	Granularity                  | Example |
|------------+-------------------------------+---------|
| CPM <= $3  | 	$0.01 increments             | $1.87 floored to $1.87 |
| CPM <= $8 and >$3  | 	$0.05 increments             | $5.09 floored to $5.05 |
| CPM <= $20 and >$8 | 	$0.50 increments             | $14.26 floored to $14.00 |
| CPM >  $20 | 	Caps the price bucket at $20 | $24.82 floored to $20.00 |

<a name="customCPMObject"></a>

##### Custom CPM Bucket Sizing

To set up your own custom CPM buckets, create an object like the following, and pass it into `setConfig`:

```javascript
const customConfigObject = {
  "buckets" : [{
      "precision": 2,  //default is 2 if omitted - means 2.1234 rounded to 2 decimal places = 2.12
      "max" : 5,
      "increment" : 0.01  // from $0 to $5, 1-cent increments
    },
    {
      "max" : 8,
      "increment" : 0.05  // from $5 to $8, round down to the previous 5-cent increment
    },
    {
      "max" : 40,
      "increment" : 0.5   // from $8 to $40, round down to the previous 50-cent increment
    }]
};

//set custom config object
pbjs.setConfig({
    priceGranularity: customConfigObject
})
```

Here are the rules for CPM intervals:

- `max` and `increment` must be specified
- A range's minimum value is assumed to be the max value of the previous range. The first interval starts at a min value of 0.
- `precision` is optional and defaults to 2

{% capture warning-granularity %}
As of Prebid.js 3.0, the 'min' parameter is no longer supported in custom granularities.
<br/>
<br/>
Also note an important idiosyncracy of the way that price ranges are supported: the
interval starts at the min value, and the max of one range defines the min of the next range.
So if the second interval defines an implicit min of 0.99 and goes to 5 with an increment of 0.05, Prebid.js will generate the values: 0.99, 1.04, 1.09, etc.
<br/>
<br/>
This implies that ranges should have max values that are really the min value of next range.
{% endcapture %}

{% include alerts/alert_warning.html content=warning-granularity %}


<a name="setConfig-MediaType-Price-Granularity" />

#### Media Type Price Granularity

The default [Prebid price granularities](#setConfig-Price-Granularity) cap out at $20, which isn't always convenient for video ads, which can command more than $20. One solution is to just set up a
custom price
granularity as described above. Another approach is
`mediaTypePriceGranularity` config that may be set to define granularities for each of five media types:
banner, video, video-instream, video-outstream, and native. e.g.

{% highlight js %}
const customPriceGranularity = {
            'buckets': [
              { 'precision': 2, 'max':x 5, 'increment': 0.25 },
              { 'precision': 2, 'max': 20, 'increment': 0.5 },
              { 'precision': 2, 'max': 100, 'increment': 1 }
            ]
};

pbjs.setConfig({'mediaTypePriceGranularity': {
          'video': customPriceGranularity,   // used as default for instream video
	  'video-outstream': customPriceGranularityOutstream,
          'banner': 'medium',
          'native': 'medium',
        }
});
{% endhighlight %}

Any `mediaTypePriceGranularity` setting takes precedence over `priceGranularity`.

{: .alert.alert-info :}
Note: mediaTypePriceGranularity is the only place that 'video-outstream' or 'video-instream'
are recognized. This was driven by the recognition that outstream often shares line items with banner.
If the mediatype is video, the price bucketing code further looks at the context (e.g. outstream) to see if there's
a price granularity override. If it doesn't find 'video-outstream' defined, it will then look for just 'video'.

<a name="setConfig-Server-to-Server" />

#### Server to Server

Prebid.js can be configured to connect to one or more [Prebid Servers](/prebid-server/overview/prebid-server-overview.html) for one or more bidders.

Example config:

{% highlight js %}
pbjs.setConfig({
    s2sConfig: [{
        accountId: '1',
        bidders: ['appnexus', 'openx', 'tripleliftVideo'],
        defaultVendor: 'appnexus',
        timeout: 500,
        adapterOptions: {
            openx: { key: 'value' },
            appnexus: { key: 'value' }
        },
        syncUrlModifier: {
            'openx': function(type, url, bidder) {
            const publisherId = '00000123231231'
            url += `&ri=${publisherId}`;
            return url
            }
        },
	extPrebid: {
	    aliases: {
                tripleliftVideo: tripleLift
            }
        }
    }]
})
{% endhighlight %}

{: .alert.alert-info :}
Note that `s2sConfig` can be specified as an object or an array.

The `s2sConfig` properties:

{: .table .table-bordered .table-striped }
| Attribute | Scope | Type | Description                                                                                   |
|------------+---------+---------+---------------------------------------------------------------|
| `accountId` | Required | String | Your Prebid Server account ID. This is obtained from whoever's hosting your Prebid Server. |
| `bidders` | Required | Array of Strings | Which bidders auctions should take place on the server side |
| `defaultVendor` | Optional | String | Automatically includes all following options in the config with vendor's default values.  Individual properties can be overridden by including them in the config along with this setting. See the Additional Notes below for more information. |
| `enabled` | Optional | Boolean | Enables this s2sConfig block - defaults to `false` |
| `timeout` | Required | Integer | Number of milliseconds allowed for the server-side auctions. This should be approximately 200ms-300ms less than your Prebid.js timeout to allow for all bids to be returned in a timely manner. See the Additional Notes below for more information. |
| `adapter` | Required | String | Adapter to use to connect to Prebid Server. Defaults to 'prebidServer' |
| `endpoint` | Required | URL | Defines the auction endpoint for the Prebid Server cluster |
| `syncEndpoint` | Required | URL | Defines the cookie_sync endpoint for the Prebid Server cluster |
| `userSyncLimit` | Optional | Integer | Max number of userSync URLs that can be executed by Prebid Server cookie_sync per request.  If not defined, PBS will execute all userSync URLs included in the request. |
| `defaultTtl` | Optional | Integer | Configures the default TTL in the Prebid Server adapter to use when Prebid Server does not return a bid TTL - 60 if not set |
| `adapterOptions` | Optional | Object | Arguments will be added to resulting OpenRTB payload to Prebid Server in every impression object at request.imp[].ext.BIDDER. See the example above. |
| `extPrebid` | Optional | Object | Arguments will be added to resulting OpenRTB payload to Prebid Server in request.ext.prebid. See the examples below. |
| `syncUrlModifier` | Optional | Object | Function to modify a bidder's sync url before the actual call to the sync endpoint. Bidder must be enabled for s2sConfig. |

**Notes on s2sConfig properties**

- Currently supported vendors are: appnexus & rubicon
- When using `defaultVendor` option, `accountId` and `bidders` properties still need to be defined.
- If the `s2sConfig` timeout is greater than the Prebid.js timeout, the `s2sConfig` timeout will be automatically adjusted to 75% of the Prebid.js timeout in order to fit within the auction process.

{: .alert.alert-warning :}
**Errors in bidder parameters will cause Prebid Server to reject the
entire request.** The Prebid Server philosophy is to avoid silent failures --
we assume you will test changes, and that it will be easier to notice a
4xx error coming from the server than a silent failure where it skips just
the bad parameter.

**Video via s2sConfig**

Supporting video through the Server-to-Server route can be done by providing a couple of extra arguments on the `extPrebid` object. e.g.

{% highlight js %}
pbjs.setConfig({
    s2sConfig: [{
        accountId: '1001',
        bidders: ['rubicon', 'pubmatic'],
        defaultVendor: 'rubicon',
        timeout: 250,
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
{% endhighlight %}

Additional options for `s2sConfig` may be enabled by including the [Server-to-Server testing module]({{site.baseurl}}/dev-docs/modules/s2sTesting.html).

**Server-Side Aliases**

You may want to run a particular bidder on the client for banner, but that same bidder on the
server for video. You would do this by setting a **server-side** alias. The
[example](#setConfig-Server-to-Server) at the start of this section provides an example. Here's how it works:

1. Video ad units are coded with the dynamic alias. e.g. tripleliftVideo
1. The s2sConfig.bidders array contains 'tripleliftVideo' telling Prebid.js to direct bids for that code to the server
1. Finally, the extPrebid.aliases line tells Prebid Server to route the 'tripleliftVideo' biddercode to the 'triplelift' server-side adapter.

**Passing the Referrer to Server Side Adapters**

* Setting `extPrebid.origreferrer` will be recognized by some server-side adapters as the referring URL for the current page.

<a name="setConfig-app" />

#### Mobile App Post-Bid

To support [post-bid](/overview/what-is-post-bid.html) scenarios on mobile apps, the
prebidServerBidAdapter module recognizes the `app` config object to
forward details through the server:

{% highlight js %}
pbjs.setConfig({
   app: {
      bundle: "org.prebid.mobile.demoapp",
      domain: "prebid.org"
   }
{% endhighlight %}

<a name="setConfig-Configure-User-Syncing" />

#### Configure User Syncing

The user sync configuration options described in this section give publishers control over how adapters behave with respect to dropping pixels or scripts to cookie users with IDs.
This practice is called "user syncing" because the aim is to let the bidders match IDs between their cookie space and the DSP's cookie space.
There's a good reason for bidders to be doing this -- DSPs are more likely to bid on impressions where they know something about the history of the user.
However, there are also good reasons why publishers may want to control the use of these practices:

- *Page performance*: Publishers may wish to move ad-related cookie work to much later in the page load after ads and content have loaded.
- *User privacy*: Some publishers may want to opt out of these practices even though it limits their users' values on the open market.
- *Security*: Publishers may want to control which bidders are trusted to inject images and JavaScript into their pages.

{: .alert.alert-info :}
**User syncing default behavior**
If you don't tweak any of the settings described in this section, the default behavior of Prebid.js is to wait 3 seconds after the auction ends, and then allow every adapter to drop up to 5 image-based user syncs.

For more information, see the sections below.

- [User Sync Properties](#setConfig-ConfigureUserSyncing-UserSyncProperties)
- [User Sync Examples](#setConfig-ConfigureUserSyncing-UserSyncExamples)
- [How User Syncing Works](#setConfig-ConfigureUserSyncing-HowUserSyncingWorks)

<a name="setConfig-ConfigureUserSyncing-UserSyncProperties" />

##### User Sync Properties

For descriptions of all the properties that control user syncs, see the table below.

{: .table .table-bordered .table-striped }
| Attribute        | Type    | Description                                                                                             |
|------------------+---------+---------------------------------------------------------------------------------------------------------|
| `syncEnabled`    | Boolean | Enable/disable the user syncing feature. Default: `true`.  |
| `filterSettings` | Object  | Configure lists of adapters to include or exclude their user syncing based on the pixel type (image/iframe). |
| `syncsPerBidder` | Integer | Number of registered syncs allowed per adapter. Default: `5`. To allow all, set to `0`. |
| `syncDelay`      | Integer | Delay in milliseconds for user syncing (both bid adapter user sync pixels and [userId module]({{site.baseurl}}/dev-docs/modules/userId.html) ID providers) after the auction ends. Default: `3000`. Ignored if auctionDelay > 0. |
| `auctionDelay`   | Integer | Delay in milliseconds of the auction to retrieve user ids via the [userId module]({{site.baseurl}}/dev-docs/modules/userId.html) before the auction starts. Continues auction once all IDs are retrieved or delay times out. Does not apply to bid adapter user sync pixels. Default: `0`. |
| `enableOverride` | Boolean | Enable/disable publisher to trigger user syncs by calling `pbjs.triggerUserSyncs()`. Default: `false`. |
| `aliasSyncEnabled` | Boolean | Enable/disable registered syncs for aliased adapters. Default: `false`. |

<a name="setConfig-ConfigureUserSyncing-UserSyncExamples" />

##### User Sync Examples

For examples of configurations that will change the default behavior, see below.

Push the user syncs to later in the page load:

{% highlight js %}
pbjs.setConfig({
    userSync: {
        syncDelay: 5000 // write image pixels 5 seconds after the auction
    }
});
{% endhighlight %}

Turn off user syncing entirely:

{% highlight js %}
pbjs.setConfig({
    userSync: {
        syncEnabled: false
    }
});
{% endhighlight %}

Delay auction to retrieve userId module IDs first:

{% highlight js %}
pbjs.setConfig({
    userSync: {
        auctionDelay: 1000 // delay auction up to 1 second
    }
});
{% endhighlight %}

Allow iframe-based syncs (the presence of a valid `filterSettings.iframe` object automatically enables iframe type user-syncing):

{% highlight js %}
pbjs.setConfig({
    userSync: {
        filterSettings: {
            iframe: {
                bidders: '*',   // '*' means all bidders
                filter: 'include'
            }
        }
    }
});
{% endhighlight %}
_Note - iframe-based syncing is disabled by default.  Image-based syncing is enabled by default; it can be disabled by excluding all/certain bidders via the `filterSettings` object._

Only certain bidders are allowed to sync and only certain types of sync pixels:

{% highlight js %}
pbjs.setConfig({
    userSync: {
        filterSettings: {
            iframe: {
                bidders: ['def'],  // only this bidder is excluded from syncing iframe pixels, all other bidders are allowed
                filter: 'exclude'
            },
            image: {
                bidders: ['abc', 'def', 'xyz'],  //only these 3 bidders are allowed to sync image pixels
                filter: 'include'
            }
        },
        syncsPerBidder: 3, // and no more than 3 syncs at a time
        syncDelay: 6000, // 6 seconds after the auction
    }
});
{% endhighlight %}

If you want to apply the same bidder inclusion/exlusion rules for both types of sync pixels, you can use the `all` object instead specifying both `image` and `iframe` objects like so:

{% highlight js %}
pbjs.setConfig({
    userSync: {
        /* only these bidders are allowed to sync.  Both iframe and image pixels are permitted. */
        filterSettings: {
            all: {
                bidders: ['abc', 'def', 'xyz'],
                filter: 'include'
            }
        },
        syncsPerBidder: 3, // and no more than 3 syncs at a time
        syncDelay: 6000, // 6 seconds after the auction
    }
});
{% endhighlight %}

_Note - the `all` field is mutually exclusive and cannot be combined with the `iframe`/`image` fields in the `userSync` config.  This restriction is to promote clear logic as to how bidders will operate in regards to their `userSync` pixels.  If the fields are used together, this will be considered an invalid config and Prebid will instead use the default `userSync` logic (all image pixels permitted and all iframe pixels are blocked)._

The same bidders can drop sync pixels, but the timing will be controlled by the page:

{% highlight js %}
pbjs.setConfig({
    userSync: {
        /* only these bidders are allowed to sync, and only image pixels */
        filterSettings: {
            image: {
                bidders: ['abc', 'def', 'xyz'],
                filter: 'include'
            }
        },
        enableOverride: true // publisher will call `pbjs.triggerUserSyncs()`
    }
});
{% endhighlight %}

As noted, there's a function available to give the page control of when registered user syncs are added.

{% highlight js %}
pbjs.triggerUserSyncs();
{% endhighlight %}

<a name="setConfig-ConfigureUserSyncing-HowUserSyncingWorks" />

##### How User Syncing Works

The [userSync.registerSync()]({{site.baseurl}}/dev-docs/bidder-adaptor.html#bidder-adaptor-Registering-User-Syncs) function called by the adapter keeps a queue of valid userSync requests. It prevents unwanted sync entries from being placed on the queue:

* Removes undesired sync types. (i.e. blocks iframe pixels if `filterSettings.iframe` wasn't declared)
* Removes undesired adapter registrations. (i.e. enforces the configured filtering logic from the `filterSettings` object)
* Makes sure there's not too many queue entries from a given adapter. (i.e. enforces syncsPerBidder)

When user syncs are run, regardless of whether they are invoked by the platform or by the page calling pbjs.triggerUserSyncs(), the queue entries are randomized and appended to the bottom of the HTML tag.

<a name="setConfig-targetingControls" />

#### Configure Targeting Controls

The `targetingControls` object passed to `pbjs.setConfig` provides some options to influence how an auction's targeting keys are generated and managed.

{: .table .table-bordered .table-striped }
| Attribute        | Type    | Description             |
|------------+---------+---------------------------------|
| auctionKeyMaxChars | integer | Specifies the maximum number of characters the system can add to ad server targeting. |
| alwaysIncludeDeals | boolean | If [enableSendAllBids](#setConfig-Send-All-Bids) is false, set this value to `true` to ensure that deals are sent along with the winning bid |
| allowTargetingKeys | Array of Strings | Selects supported default targeting keys. |

{: .alert.alert-info :}
Note that this feature overlaps and can be used in conjunction with [sendBidsControl.bidLimit](/dev-docs/publisher-api-reference.html#setConfig-Send-Bids-Control).

##### Details on the auctionKeyMaxChars setting

Below is an example config containing `auctionKeyMaxChars`:

```javascript
pbjs.setConfig({
  targetingControls: {
    auctionKeyMaxChars: 5000,
  }
});
```

When this property is set up, the `auctionKeyMaxChars` setting creates an effective ceiling for the number of auction targeting keys that are passed to an ad server.  This setting can be helpful if you know that your ad server has a finite limit to the amount of query characters it will accept and process.  When there is such a limit, query characters that exceed the threshold are normally just dropped and/or ignored, which can cause potential issues with the delivery or rendering of the ad.

Specifically, Prebid will go through the following steps with this feature:

* Collect all the available targeting keys that were generated naturally by the auction.  The keys are grouped by each of the adUnits that participated in the auction.
* Prioritize these groups of targeting keys based on the following factors:
  * Bids with deals are prioritized before bids without deals.
  * Bids with higher CPM are ranked before lower CPM bids.
  **Note** - The sorting follows this order specifically, so a bid with a deal that had a $10 CPM would be sorted before a bid with no deal that had a $15 CPM.
* Convert the keys for each group into the format that they are passed to the ad server (i.e., an encoded query string) and count the number of characters that are used.
* If the count is below the running threshold set in the `setConfig` call, that set of targeting keys will be passed along.  If the keys exceed the limit, then they are excluded.

 If you want to review the particular details about which sets of keys are passed/rejected, you can find them in the Prebid console debug log.

##### Finding the right value

Given the varying nature of how sites are set up for advertising and the varying mechanics and data-points needed by ad servers, providing a generic threshold setting is tricky.  If you plan to enable this setting, it's recommended you review your own setup to determine the ideal value.  The following steps provide some guidance on how to start this process:

* Use Prebid to set up a test page that uses the typical setup for your site (in terms of the number of ad slots, etc.).
* Once it's working, look for the average number of characters Prebid uses for the auction targeting keys.
  * You can do this by enabling the Prebid debug mode, enabling this setting in your `setConfig` with a high value, and then opening the browser's console to review the Console Logs section.
* Also in the browser console, find your ad server's ad URL in the Network tab and review the details of the request to obtain information about the query data (specifically the number of characters used).
  * You can copy the data to another tool to count the number of characters that are present.

Between these two values (Prebid's targeting key count and the overall ad URL query character count), you will find the average number of characters that are used by your ad server.  It's likely that these ad server values will remain consistent given that type of setup.  So if you know your ad server has a particular character limit, you can assume that these ad server characters will be reserved and the difference is what you could allot to Prebid.

Between this feature and the overlapping [sendBidsControl.bidLimit](/dev-docs/publisher-api-reference.html#setConfig-Send-Bids-Control), you should be able to make sure that there's not too much data going to the ad server.

##### Details on the allowTargetingKeys setting

When this property is set up, the `allowTargetingKeys` creates a default targeting key mask based on the default targeting keys defined in CONSTANTS.TARGETING_KEYS and CONSTANTS.NATIVE_KEYS. Any default keys that do not match the mask will not be sent to the adserver. This setting can be helpful if you find that your prebid implementation is by default sending key values that your adserver isn't configured to process. When extraneous key values are sent, the ad server request can be truncated, which can cause potential issues with the delivery or rendering of the ad.

To accomplish this, Prebid does the following:
* Collect original targeting generated by the auction.
* Generate new targeting filtered against allowed keys.
  * Custom targeting keys are always added to targeting.
  * Default targeting keys are added to targeting only if they match an allowed key named in `setConfig`.
* New targeting replaces original targeting before targeting is flattened.

The targeting key names and the associated prefix value filtered by `allowTargetingKeys`:

{: .table .table-bordered .table-striped }
| Name        | Value    |
|------------+------------|
| BIDDER | `hb_bidder` |
| AD_ID | `hb_adid` |
| PRICE_BUCKET | `hb_pb` |
| SIZE | `hb_size` |
| DEAL | `hb_deal` |
| SOURCE | `hb_source` |
| FORMAT | `hb_format` |
| UUID | `hb_uuid` |
| CACHE_ID | `hb_cache_id` |
| CACHE_HOST | `hb_cache_host` |
| ADOMAIN | `hb_adomain` |
| title | `hb_native_title` |
| body | `hb_native_body` |
| body2 | `hb_native_body2` |
| privacyLink | `hb_native_privacy` |
| privacyIcon | `hb_native_privicon` |
| sponsoredBy | `hb_native_brand` |
| image | `hb_native_image` |
| icon | `hb_native_icon` |
| clickUrl | `hb_native_linkurl` |
| displayUrl | `hb_native_displayurl` |
| cta | `hb_native_cta` |
| rating | `hb_native_rating` |
| address | `hb_native_address` |
| downloads | `hb_native_downloads` |
| likes | `hb_native_likes` |
| phone | `hb_native_phone` |
| price | `hb_native_price` |
| salePrice | `hb_native_saleprice` |

Below is an example config containing `allowTargetingKeys` excluding all default targeting keys except `hb_bidder`, `hb_adid`, and `hb_pb`:

```javascript
config.setConfig({
  targetingControls: {
    allowTargetingKeys: ['BIDDER', 'AD_ID', 'PRICE_BUCKET']
  }
});
```

<a name="setConfig-Configure-Responsive-Ads" />

#### Configure Responsive Ads

The `sizeConfig` object passed to `pbjs.setConfig` provides a global way to describe types of devices and screens using [CSS media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries).  See below for an explanation of the feature and examples showing how to use it.

{% capture tip-choosing %}
As of Prebid.js 3.11.0, the [Advanced SizeMapping module](/dev-docs/modules/sizeMappingV2.html) provides an alternate way to handle responsive AdUnits.
You should consider using that module if any of these scenarios are true:
{::nomarkdown}
<ul>
<li> You need to work with video or native AdUnits</li>
<li> The site needs to alter different AdUnits at different screen widths; e.g., the left-nav changes sizes at 600 pixels, but the footer's size behavior changes at 620 pixels.</li>
<li>The site needs to alter different mediaTypes at different screen widths; e.g., the banner size ranges are 0-400px, 401-700px, and 701+px, but the native ads appear at 500px.</li>
<li>Some bidders or mediaTypes should be included (or removed) at different overlapping size ranges.</li>
</ul>
<br/>
{:/}
If, on the other hand, you're only working with the banner mediaType and the AdUnits all change behavior together at the same viewport width, then the built-in sizeConfig feature is appropriate.
{% endcapture %}
{% include alerts/alert_tip.html content=tip-choosing %}

+ [How it works](#sizeConfig-How-it-Works)
+ [Example](#sizeConfig-Example)
+ [Labels](#labels)

<a name="sizeConfig-How-it-Works" />

##### How Size Config Works for Banners

- Before `requestBids` sends bid requests to adapters, it will evaluate and pick the appropriate label(s) based on the `sizeConfig.mediaQuery` and device properties.  Once it determines the active label(s), it will then filter the `adUnit.bids` array based on the `labels` defined and whether the `banner` mediaType was included. Ad units that include a `banner` mediaType that don't match the label definition are dropped.
- The required `sizeConfig.mediaQuery` property allows [CSS media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries).  The queries are tested using the [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) API.
- If a label conditional (e.g. `labelAny`) doesn't exist on an ad unit, it is automatically included in all requests for bids.
- If multiple rules match, the sizes will be filtered to the intersection of all matching rules' `sizeConfig.sizesSupported` arrays.
- The `adUnit.mediaTypes.banner.sizes` selected will be filtered based on the `sizesSupported` of the matched `sizeConfig`. So the `adUnit.mediaTypes.banner.sizes` is a subset of the sizes defined from the resulting intersection of `sizesSupported` sizes and `adUnit.mediaTypes.banner.sizes`. (Note: size config will also operate on `adUnit.sizes`, however `adUnit.sizes` is deprecated in favor of `adUnit.mediaTypes`)

###### Note on sizeConfig and different mediaTypes

The sizeConfig logic only applies to `adUnits`/`bids` that include the `banner` `mediaType` (regardless of whether the request is single or multi-format).

For example, if a request  contained the `banner` and `video` `mediaTypes` and it failed the label check, then the entire adUnit/bid would be dropped (including the `video` part of the request).  However if the same request passed the label check, then the `adUnit.mediaTypes.banner.sizes` would be filtered as per the matching sizeConfig and the multi-format request would proceed as normal.

If the ad unit does not include `banner` `mediaType` at all, then the sizeConfig logic will not influence that ad Unit; it will automatically be passed into the auction.

<a name="sizeConfig-Example" />

##### Example

To set size configuration rules, pass in `sizeConfig` as follows:

{% highlight js %}

pbjs.setConfig({
    sizeConfig: [{
        'mediaQuery': '(min-width: 1600px)',
        'sizesSupported': [
            [1000, 300],
            [970, 90],
            [728, 90],
            [300, 250]
        ],
        'labels': ['desktop-hd']
    }, {
        'mediaQuery': '(min-width: 1200px)',
        'sizesSupported': [
            [970, 90],
            [728, 90],
            [300, 250]
        ],
        'labels': ['desktop']
    }, {
        'mediaQuery': '(min-width: 768px) and (max-width: 1199px)',
        'sizesSupported': [
            [728, 90],
            [300, 250]
        ],
        'labels': ['tablet']
    }, {
        'mediaQuery': '(min-width: 0px)',
        'sizesSupported': [
            [300, 250],
            [300, 100]
        ],
        'labels': ['phone']
    }]
});

{% endhighlight %}

##### Labels

There are two parts to defining responsive and conditional ad units with labels:

1. Defining the labels
2. Defining the conditional ad unit targeting for the labels

Labels may be defined in two ways:

1. Through [`sizeConfig`](#setConfig-Configure-Responsive-Ads)
2. As an argument to [`pbjs.requestBids`](#module_pbjs.requestBids)

{% highlight js %}
pbjs.requestBids({labels: []});
{% endhighlight %}

Labels may be targeted in the AdUnit structure by two conditional operators: `labelAny` and `labelAll`.

With the `labelAny` operator, just one label has to match for the condition to be true. In the example below, either A or B can be defined in the label array to activate the bid or ad unit:
{% highlight bash %}
labelAny: ["A", "B"]
{% endhighlight %}

With the `labelAll` conditional, every element of the target array must match an element of the label array in
order for the condition to be true. In the example below, both A and B must be defined in the label array to activate the bid or ad unit:
{% highlight bash %}
labelAll: ["A", "B"]
{% endhighlight %}

{: .alert.alert-warning :}
Only one conditional may be specified on a given AdUnit or bid -- if both `labelAny` and `labelAll` are specified, only the first one will be utilized and an error will be logged to the console. It is allowable for an AdUnit to have one condition and a bid to have another.

{: .alert.alert-warning :}
If either `labeAny` or `labelAll` values is an empty array, it evaluates to `true`.

{: .alert.alert-warning :}
It is important to note that labels do not act as filters for sizeConfig. In the example above, using a screen of 1600px wide and `labelAll:["desktop"]` will *not* filter out sizes defined in the `desktop-hd` sizeConfig. Labels in sizeConfig are only used for selecting or de-selecting AdUnits and AdUnit.bids.

Label targeting on the ad unit looks like the following:

{% highlight js %}

pbjs.addAdUnits([{
    code: "ad-slot-1",
    mediaTypes: {
        banner: {
            sizes: [
                [970, 90],
                [728, 90],
                [300, 250],
                [300, 100]
            ]
        }
    },
    labelAny: ["visitor-uk"]
    /* The full set of bids, not all of which are relevant on all devices */
    bids: [{
            bidder: "pulsepoint",
            /* Labels flag this bid as relevant only on these screen sizes. */
            labelAny: ["desktop", "tablet"],
            params: {
                "cf": "728X90",
                "cp": 123456,
                "ct": 123456
            }
        },
        {
            bidder: "pulsepoint",
            labelAny: ["desktop", "phone"],
            params: {
                "cf": "300x250",
                "cp": 123456,
                "ct": 123456
            }
        },
        {
            bidder: "sovrn",
            labelAny: ["desktop", "tablet"],
            params: {
                "tagid": "123456"
            }
        },
        {
            bidder: "sovrn",
            labelAny: ["phone"],
            params: {
                "tagid": "111111"
            }
        }
    ]
}]);

{% endhighlight %}

See [Conditional Ad Units]({{site.baseurl}}/dev-docs/conditional-ad-units.html) for additional use cases around labels.


<a name="setConfig-coppa" />

#### COPPA

Bidder adapters that support the Child Online Privacy Protection Act (COPPA) read the `coppa` configuration.
Publishers with content falling under the scope of this regulation should consult with their legal teams.
The flag may be passed to supporting adapters with this config:

{% highlight js %}
pbjs.setConfig({coppa: true});
{% endhighlight %}

<a name="setConfig-fpd" />

#### First Party Data

Historically, a number of adapters supported taking key/value pairs as arguments, but they were all different. For example:

- RubiconProject took `keywords`, `inventory` and `visitor` parameters
- AppNexus took `keywords` and `user`
- OpenX took `customParams`

First party data allows publishers to specify key/value data in one place where each compatible bid adapter can read it.

{: .alert.alert-warning :}
Not all bid adapters currently support reading first party data in this way, but support should increase over time.

**Scenario 1** - Global (cross-adunit) First Party Data open to all bidders

{% highlight js %}
pbjs.setConfig({
   fpd: {
       context: {
           keywords: "power tools",
           search: "drill",
           content: { userrating: 4 },
           data: {
               pageType: "article",
               category: "tools"
           }
        },
        user: {
           keywords: "a,b",
           gender: "M",
           yob: 1984,
           geo: { country: "ca" },
           data: {
              registered: true,
              interests: ["cars"]
           }
        }
    }
});
{% endhighlight %}

{: .alert.alert-info :}
The First Party Data JSON structure reflects the OpenRTB standard. Arbitrary values should go in context.data or
user.data. Keywords, search, content, gender, yob, and geo are special values in OpenRTB.

**Scenario 2** - Global (cross-adunit) First Party Data open only to a subset of bidders

If a publisher only wants certain bidders to receive the data, use the [setBidderConfig](#module_pbjs.setBidderConfig) function like this:

{% highlight js %}
pbjs.setBidderConfig({
   bidders: ['bidderA', 'bidderB'],
   config: {
       fpd: {
           context: {
               data: {
                  pageType: "article",
                  category: "tools"
               }
            },
            user: {
               data: {
                  registered: true,
                  interests: ["cars"]
               }
          }
      }
   }
});
{% endhighlight %}

**Scenario 3** - See the [AdUnit Reference](/dev-docs/adunit-reference.html) for AdUnit-specific first party data.

<a name="setConfig-vast-cache" />

See [Prebid Server First Party Data](/prebid-server/features/pbs-fpd.html) for details about passing data server-side.

#### Client-side Caching of VAST XML

When serving video ads, VAST XML creatives must be cached on the network so the
video player can retrieve them when it's ready. Players don't obtain the VAST XML from
the JavaScript DOM in Prebid.js, but rather expect to be given a URL where it can
be retrieved. There are two different flows possible with Prebid.js around VAST XML caching:

- Server-side caching:
  Some video bidders (e.g. Rubicon Project) always cache the VAST XML on their servers as part of the bid. They provide a 'videoCacheKey', which is used in conjunction with the VAST URL in the ad server to retrieve the correct VAST XML when needed. In this case, Prebid.js has nothing else to do.
- Client-side caching:
  Video bidders that don't cache on their servers return the entire VAST XML body. In this scenario, Prebid.js needs to copy the VAST XML to a publisher-defined cache location on the network. In this scenario, Prebid.js POSTs the VAST XML to the named Prebid Cache URL. It then sets the 'videoCacheKey' to the key that's returned in the response.

For client-side caching, set the Prebid Cache URL as shown here (substituting the correct URL for the one shown here):

{% highlight js %}
pbjs.setConfig({
        cache: {
            url: 'https://prebid.adnxs.com/pbc/v1/cache'
        }
});
{% endhighlight %}

{: .alert.alert-warning :}
The endpoint URL provided must be a Prebid Cache or be otherwise compatible with the [Prebid Cache interface](https://github.com/prebid/prebid-cache).

As of Prebid.js 2.36, you can track client-side cached VAST XML. This functionality is useful for publishers who want to allow their analytics provider to measure video impressions. The prerequisite to using this feature is the availability of a Prebid Server that supports:

- the /vtrack endpoint
- an analytics module with connection to an analytics system that supports joining the impression event to the original auction request on the bidid
- the ability of a publisher to utilize the feature (if account-level permission is enabled)

Given those conditions, the `vasttrack` flag can be specified:

{% highlight js %}
pbjs.setConfig({
        cache: {
            url: '_PREBID_SERVER_URL_/vtrack',
            vasttrack: true
        }
});
{% endhighlight %}

Setting the `vasttrack` parameter to `true` supplies the POST made to the `/vtrack`
Prebid Server endpoint with a couple of additional parameters needed
by the analytics system to join the event to the original auction request.

<a name="setConfig-instream-tracking" />

#### Instream tracking

{: .alert.alert-info :}
To enable this tracking, include the `instreamTracking` module in your Prebid.js build.

This configuration will allow Analytics Adapters and Bid Adapters to track `BID_WON` events for Instream video bids.

{: .table .table-bordered .table-striped }
| Field    | Scope   | Type   | Description                                                                           |
|----------+---------+--------+---------------------------------------------------------------------------------------|
| `instreamTracking` | Required | Object | Configuration object for instream tracking |
| `instreamTracking.enabled` | Required | Boolean | Enable/disable the instream tracking feature. Default: `false`. |
| `instreamTracking.maxWindow` | Optional | Integer | The time in ms after which polling for instream delivery stops. Default: `60000` i.e. 60 seconds |
| `instreamTracking.pollingFreq` | Optional | Integer |The frequency of polling. Default: `500`ms |
| `instreamTracking.urlPattern` | Optional | RegExp | Regex for cache url patterns, to avoid false positives. |

#### Example

{% highlight js %}
pbjs.setConfig({
        'instreamTracking': {
            enabled: true,
        }
});
{% endhighlight %}

More examples [here](/dev-docs/modules/instreamTracking.html#example-with-urlpattern).

<a name="setConfig-site" />

#### Site Configuration

Adapters, including Prebid Server adapters, can support taking site parameters like language.
The structure here is OpenRTB; the site object will be available to client- and server-side adapters.

{% highlight js %}
pbjs.setConfig({
   site: {
       content: {
           language: "en"
       }
   }
});
{% endhighlight %}

<a name="setConfig-auctionOptions" />

#### Auction Options

The `auctionOptions` object passed to `pbjs.setConfig` provides a method to specify bidders that the Prebid auction will no longer wait for before determing the auction has completed. This may be helpful if you find there are a number of low performing and/or high timeout bidders in your page's rotation.

{: .table .table-bordered .table-striped }
| Field    | Scope   | Type   | Description                                                                           |
|----------+---------+--------+---------------------------------------------------------------------------------------|
| `secondaryBidders` | Required | Array of Strings | The bidders that will be removed from determining when an Auction has completed. |

Example config:

{% highlight js %}
pbjs.setConfig({
    'auctionOptions': {
        'secondaryBidders': ['doNotWaitForMe']
    }
});
{% endhighlight %}

<a name="setConfig-realTimeData" />

#### Real-Time Data Modules

All of the modules that fall under the [Real-Time Data (RTD) category](/dev-docs/modules/index.html#real-time-data-providers) conform to
a consistent set of publisher controls. The pub can choose to run multiple
RTD modules, define an overall amount of time they're willing to wait for
results, and even flag some of the modules as being more "important"
than others.

```
pbjs.setConfig({
    ...,
    realTimeData: {
      auctionDelay: 100,     // REQUIRED: applies to all RTD modules
      dataProviders: [{
          name: "RTD-MODULE-1",
          waitForIt: true,   // OPTIONAL: flag this module as important
          params: {
	    ... module-specific parameters ...
          }
      },{
          name: "RTD-MODULE-2",
          waitForIt: false,   // OPTIONAL: flag this module as less important
          params: {
	    ... module-specific parameters ...
          }
      }]
    }
});

```

The controls publishers have over the RTD modules:

{: .table .table-bordered .table-striped }
| Field | Required? | Type | Description |
|---|---|---|---|
| realTimeData.auctionDelay | no | integer | Defines the maximum amount of time, in milliseconds, the header bidding auction will be delayed while waiting for a response from the RTD modules as a whole group. The default is 0 ms delay, which means that RTD modules need to obtain their data when the page initializes. |
| realTimeData.dataProviders[].waitForIt | no | boolean | Setting this value to true flags this RTD module as "important" enough to wait the full auction delay period. Once all such RTD modules have returned, the auction will proceed even if there are other RTD modules that have not yet responded. The default is `false`. |

The idea behind the `waitForIt` flag is that publishers can decide which
modules are worth waiting for and which better hustle. For example, imagine a bus stop:
the bus driver will wait up to 100ms for a few important passengers: A, J, and X.
Once these three passengers are on the bus, it will leave immediately, even if 100ms hasn't been reached. Other potential passengers need to be on before these three or they will be left behind. If A, J, or X doesn't get on the bus before the 100ms are up, they, too, will be left behind.

This may not seem fair, but keep in mind that speed has a significant impact
on ad performance: header bidding gets only a small amount of time to run the auction before the ad server is called.
Some publishers carefully manage these precious milliseconds, balancing impact
of the real-time data with the revenue loss from auction delay.

Notes:
- The only time `waitForIt` means anything is if some modules are flagged as true and others as false. If all modules are the same (true or false), it has no effect.
- Likewise, `waitForIt` doesn't mean anything without an auctionDelay specified.

<a name="setConfig-Generic-Configuration" />

#### Generic setConfig Configuration

Some adapters may support other options, as defined in their documentation. To set arbitrary configuration values:

{% highlight js %}
pbjs.setConfig({ <key>: <value> });
{% endhighlight %}

<a name="setConfig-Troubleshooting-your-configuration" />

#### Troubleshooting your configuration

Towards catching syntax errors, one tip is to call `pbjs.setConfig` without an object, e.g.,

{% highlight js %}
pbjs.setConfig('debug', 'true'));
{% endhighlight %}

then Prebid.js will print an error to the console that says:

```
ERROR: setConfig options must be an object
```

If you don't see that message, you can assume the config object is valid.

<hr class="full-rule" />

<a name="module_pbjs.setBidderConfig"></a>

### pbjs.setBidderConfig(options)

This function is similar to [`setConfig`](#module_pbjs.setConfig), but is designed to support certain bidder-specific scenarios.

Configuration provided through the [`setConfig`](#module_pbjs.setConfig) function is
globally available to all bidder adapters. This makes sense because
most of these settings are global in nature. However, there are use cases where different bidders require different data, or where certain parameters apply only to a given
bidder. Use `setBidderConfig` when you need to support these cases.

The page usage is:

{% highlight js %}
pbjs.setBidderConfig({
   bidders: ["bidderA"],  // one or more bidders
   config: {              // the bidder-specific config
      bidderA: {
         customArg: 'value'
      }
   }
});
{% endhighlight %}

When 'bidderA' calls `getConfig('bidderA')`, it will receive the object that contains 'customArg'.
If any other bidder calls `getConfig('bidderA')`, it will receive nothing.

{: .alert.alert-info :}
This function is currently used by the `schain` feature. Refer to the [schain]({{site.baseurl}}/dev-docs/modules/schain.html) documentation for examples.

<a name="module_pbjs.getConfig"></a>

### pbjs.getConfig([string])

The `getConfig` function is for retrieving the current configuration object or subscribing to configuration updates. When called with no parameters, the entire config object is returned. When called with a string parameter, a single configuration property matching that parameter is returned.

{% highlight js %}
/* Get config object */
config.getConfig()

/* Get debug config */
config.getConfig('debug')
{% endhighlight %}

The `getConfig` function also contains a 'subscribe' ability that adds a callback function to a set of listeners that are invoked whenever `setConfig` is called. The subscribed function will be passed the options object that was used in the `setConfig` call. Individual topics can be subscribed to by passing a string as the first parameter and a callback function as the second.  For example:

{% highlight js %}

/* Subscribe to all configuration changes */
getConfig((config) => console.log('config set:', config));

/* Subscribe to only 'logging' changes */
getConfig('logging', (config) => console.log('logging set:', config));

/* Unsubscribe */
const unsubscribe = getConfig(...);
unsubscribe(); // no longer listening

{% endhighlight %}

<hr class="full-rule" />

<a name="module_pbjs.adServers.dfp.buildVideoUrl"></a>

### pbjs.adServers.dfp.buildVideoUrl(options)

{: .alert.alert-info :}
The Google Ad Manager implementation of this function requires including the `dfpAdServerVideo` module in your Prebid.js build.

This method combines publisher-provided parameters with Prebid.js targeting parameters to build a Google Ad Manager video ad tag URL that can be used by a video player.

#### Argument Reference

##### The `options` object

{: .table .table-bordered .table-striped }
| Field    | Type   | Description                                                                                                                                                                        |
|----------+--------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `adUnit` | object | *Required*. The Prebid ad unit to which the returned URL will map.                                                                                                                 |
| `params` | object | *Optional*. Querystring parameters that will be used to construct the Google Ad Manager video ad tag URL. Publisher-supplied values will override values set by Prebid.js. See below for fields. |
| `url`    | string | *Optional*. The video ad server URL. When given alongside params, the parsed URL will be overwritten with any matching components of params.                                       |
| `bid`    | object | *Optional*. The Prebid bid for which targeting will be set. If this is not defined, Prebid will use the bid with the highest CPM for the adUnit.                                   |

{: .alert.alert-warning :}
One or both of options.params and options.url is required. In other words, you may pass in one, the other, or both, but not neither.

##### The `options.params` object

{: .table .table-bordered .table-striped }
| Field             | Type   | Description                                                                                                                 | Example                                         |
|-------------------+--------+-----------------------------------------------------------------------------------------------------------------------------+-------------------------------------------------|
| `iu`              | string | *Required*. Google Ad Manager ad unit ID.                                                                                                 | `/19968336/prebid_cache_video_adunit`           |
| `cust_params`     | object | *Optional*. Key-value pairs merged with Prebid's targeting values and sent to Google Ad Manager on the video ad tag URL.                  | `{section: "blog", anotherKey: "anotherValue"}` |
| `description_url` | string | *Optional*. Describes the video. Required for Ad Exchange. Prebid.js will build this for you unless you pass it explicitly. | `https://www.example.com`                        |

For more information on any of these params, see [the Google Ad Manager video tag documentation](https://support.google.com/admanager/answer/1068325).

#### Examples

There are several different ways to build up your video URL, as shown in the examples below:

Using `options.params` only:

```javascript
pbjs.requestBids({
    bidsBackHandler: function(bids) {
        var videoUrl = pbjs.adServers.dfp.buildVideoUrl({
            adUnit: videoAdUnit,
            params: {
                iu: '/19968336/prebid_cache_video_adunit',
                cust_params: {
                    section: "blog",
                    anotherKey: "anotherValue"
                },
                hl: "en",
                output: "xml_vast2",
                url: "https://www.example.com",
            }
        });
        invokeVideoPlayer(videoUrl);
    }
});
```

Using `options.url` only:

```javascript
var adserverTag = 'https://pubads.g.doubleclick.net/gampad/ads?'
+ 'sz=640x480&iu=/19968336/prebid_cache_video_adunit&impl=s&gdfp_req=1'
+ '&env=vp&output=xml_vast2&unviewed_position_start=1&hl=en&url=https://www.example.com'
+ '&cust_params=section%3Dblog%26anotherKey%3DanotherValue';

var videoUrl = pbjs.adServers.dfp.buildVideoUrl({
    adUnit: videoAdUnit,
    url: adserverTag
});
```

<a name="module_pbjs.requestBids"></a>

{: .alert.alert-warning :}
In the event of collisions, querystring values passed via `options.params` take precedence over those passed via `options.url`.

<hr class="full-rule">

<a name="module_pbjs.adServers.dfp.buildAdpodVideoUrl"></a>

### pbjs.adServers.dfp.buildAdpodVideoUrl(options) <span style="color:red" markdown="1">[Alpha]</span>

{: .alert.alert-info :}
The GAM implementation of this function requires including the `dfpAdServerVideo` module in your Prebid.js build.

This method combines publisher-provided parameters with Prebid.js targeting parameters to build a GAM video ad tag URL that can be used by a video player.

#### Argument Reference

##### The `options` object

{: .table .table-bordered .table-striped }
| Field    | Type   | Description                                                                                                                                                                        |
|----------+--------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| iu | string | `adunit` |
| description_url | string | The value should be the url pointing to a description of the video playing on the page. |

{% include alerts/alert_important.html content="For long form Prebid.js will add key-value strings for multiple bids. This prevents retrieving the description url from bid." %}

#### Example

```JavaScript
pbjs.que.push(function(){
    pbjs.addAdUnits(videoAdUnit);
    pbjs.setConfig({
        cache: {
            url: 'https://prebid.adnxs.com/pbc/v1/cache'
        },
        adpod: {
            brandCategoryExclusion: true
        },
        brandCategoryTranslation: {
            translationFile: "https://mymappingfile.com/mapping.json"
        }
    });

    pbjs.requestBids({
        bidsBackHandler: function(bids) {
            pbjs.adServers.dfp. buildAdpodVideoUrl({
                codes: ['sample-code'],
                params: {
                    iu: '/123456/testing/prebid.org/adunit1',
                    description_url: 'https://mycontent.com/episode-1'
                },
                callback: function(err, masterTag) {
                    // Invoke video player and pass the master tag
                }
            });
        }
    });
});
```

{% include alerts/alert_warning.html content="Set the `pbjs.setConfig.cache.url` to the URL that will cache the VAST XML. " %}

<hr class="full-rule">

<a name="module_pbjs.markWinningBidAsUsed"></a>

### pbjs.markWinningBidAsUsed(markBidRequest)

This function can be used to mark the winning bid as used. This is useful when running multiple video advertisements on the page, since these are not automatically marked as “rendered”.
If you know the adId, then be specific, otherwise Prebid will retrieve the winning bid for the adUnitCode and mark it accordingly.

#### Argument Reference

##### The `markBidRequest` object (use one or both)

{: .table .table-bordered .table-striped }
| Param | Type | Description |
| --- | --- | --- |
| adUnitCode | `string` | (Optional) The ad unit code |
| adId | `string` | (Optional) The id representing the ad we want to mark |
