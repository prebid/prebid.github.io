---
layout: page
title: How to add a Prebid 1.0 Bidder Adapter
description: Documentation on how to add a new bidder adapter
top_nav_section: dev_docs
nav_section: adapters
---

<div class="bs-docs-section" markdown="1">

# How to Add a New Bidder Adapter
{:.no_toc}

{: .alert.alert-warning :}
**This document is a work in progress for Prebid 1.0** Feedback welcome - [open an issue](https://github.com/prebid/prebid.github.io/issues) on Github.

At a high level, a bidder adapter is responsible for:

1. Creating the bid requests for the bidder's server.
2. Parsing and registering the bid responses.

This page has instructions for writing your own bidder adapter.  The instructions here try to walk you through some of the code you'll need to write for your adapter.  When in doubt, use [the working adapters in the Github repo](https://github.com/prebid/Prebid.js/tree/master/modules) for reference.

* TOC
{:toc}


## Planning your adapter

With each adapter submission, there are two files in the pull request:

* modules/exampleBidAdapter.js - the file containing the code for the adapter
* modules/exampleBidAdapter.md - a markdown file containing key information about the adapter:
   * The contact email of the adapter's maintainer.
   * A test ad unit that will consistently return test creatives. This helps us to ensure future Prebid.js updates do not break your adapter.

Example markdown file:
{% highlight text %}
# Overview

Module Name: Example Bidder Adapter
Module Type: Bidder Adapter
Maintainer: prebid@example.com

# Description

Module that connects to Example's demand sources

# Test Parameters
```
    var adUnits = [
           {
               code: 'test-div',
               sizes: [[300, 250]],  // a display size
               bids: [
                   {
                       bidder: "example",
                       params: {
                           placement: '12345'
                       }
                   }
               ]
           },{
               code: 'test-div',
               sizes: [[300, 50]],   // a mobile size
               bids: [
                   {
                       bidder: "example",
                       params: {
                           placement: 67890
                       }
                   }
               ]
           }
       ];
```
{% endhighlight %}

Note: if your adapter supports video, outstream video, or native, you must also provide example parameters for each type.

{: .alert.alert-warning :}
**Prebid 1.0:** the markdown documentation file for your adapter is a new requirement. So are the following
required conventions.

In order to provide a fast and safe header bidding environment for publishers, the Prebid.org team reviews all adapters for the following conventions:

* Support multiple instances - all adapters must support the creation of multiple concurrent instances. This means, for example, that adapters cannot rely on global variables.
* No loading of external libraries - all code must be present in the adapter, not loaded at runtime.
* Must support HTTPS - within a secure page context, the request to the bidder’s server must also be secure.
* Compressed responses - all bid responses from the bidder’s server must be gzipped.
* Bid responses may not use JSONP - all requests must be AJAX with JSON responses.
* All user-sync activity must be registered via the provided functions - the platform will place all registered syncs in the page after the auction is complete, subject to publisher configuration.

<div class="alert alert-danger" role="alert">
  <p>
Failure to follow any of the above conventions could lead to delays in approving your adapter for inclusion in Prebid.js.
  </p>
</div>

### Design your bid params

The AdUnit's `bid.params` object will define the parameters of your ad request.  You can include tag ID, site ID, ad size, keywords, and other data, such as video parameters.

For more information about the kinds of information that can be passed using these parameters, see [existing bidder parameters]({{site.baseurl}}/dev-docs/bidders.html).

A sample AdUnit with parameters for the 'example' bidder:

{% highlight js %}
{
var adUnits = [{
    code: "top-med-rect",
    sizes: [ [300, 250], [300, 600] ]
    bids: [{
            bidder: "example",
            // params is custom to the bidder adapter and will be
            // passed through from the configuration as is.
            params: { 
            	unit: '3242432',
                pgid: '123124',
		custom: { other: "xyz" }
            },
        }
    ]
}];
{% endhighlight %}

## Create the Adapter

{: .alert.alert-success :}
If you're the type that likes to skip to the answer instead of going through a tutorial, see the <a href="#bidder-example">Full Bid Adapter Example</a> below.

The new code will reside under the modules directory with the name of the bidder suffixed by ‘BidAdapter’, e.g., exampleBidAdapter.js

Compared to previous versions of Prebid, the new BaseAdapter model saves the adapter from having to make the AJAX call and provides consistency in how adapters are structured. Instead of a single entry point, the BaseAdapter approach defines 4 entry points:

* isBidRequestValid - takes a single bids.params object and responds with true (valid) or false (invalid)
* buildRequests - takes the entire array of bidRequests and returns an array of ServerRequest objects
* interpretResponse - takes a single request/response and generates a bid object.
* getUserSyncs - if the publisher allows user-sync activity, the platform will call this function and the adapter may register pixels and/or iframe user syncs.

A high level example of the structure:

{% highlight js %}
import * as utils from 'src/utils';
import { registerBidder } from 'src/adapters/bidderFactory';
const BIDDER_CODE = 'example';
export const spec = {
    code: BIDDER_CODE,
    isBidRequestValid: function(bid) { },
    buildRequests: function(bidRequests) { },
    interpretResponse: function(serverResponse) { },
    getUserSyncs: function(syncOptions) { }
}
adaptermanager.aliasBidAdapter(BIDDER_CODE, 'ex'); // short code
registerBidder(spec);
{% endhighlight %}

### Building the Request

When the page asks Prebid.js for bids, your module’s `buildRequests` function will be executed. Building the request will use data from several places:

* AdUnit params - this is what's in the auctionRequest.bids array. TBD
* Transaction ID - bidRequest.transactionId should be sent to your server and forwarded to any Demand Side Platforms your server communicates with. TBD
* Ad Server Currency - if your service supports bidding in more than one currency, your adapter should call pbjs.getConfig(currency) to see if the page has defined which currency it prefers for bids.
* Referrer - bidRequest.referrer should be passed into your server and utilized there. This is important in contexts like AMP where the original page referrer isn't available directly to the adapter.

{: .alert.alert-warning :}
**Prebid 1.0:** Some of these bid request recommendations are new.

{: .alert.alert-success :}
There are several IDs present in the bidRequest object: **Bid ID** is unique across AdUnits and Bidders.
**Auction ID** is unique per call to requestBids(), but is the same across AdUnits. And finally,
**Transaction ID** is unique for each AdUnit with a call to requestBids, but same across bidders. This is the ID that DSPs need to recognize the same impression coming in from different supply sources.

The ServerRequest objects returned from your adapter have this structure:
 
{: .table .table-bordered .table-striped }
| Attribute | Type | Description | Example Value |
| --- | --- | --- | --- |
| type | string | Which HTTP method should be used | GET/POST |
| endpoint | string | The endpoint for the request. | "http://bids.example.com" |
| data | string | Data to be sent in the POST request | |

Here's a sample block of code returning a ServerRequest object:

{% highlight js %}
return {
            method: 'POST',
            url: URL,
            data: payloadString,
        };
{% endhighlight %}

### Interpreting the Response

The `interpretResponse` function will be called when the browser has received the response from your server. The function will parse the response and create a bidResponse object.

If the bid is invalid (no fill or error), create the bidObject as shown below.

{% highlight js %}
    if (NO_BID || ERROR_BID) {
      return [];
    }
    const bids = [];
    const bid = {
	requestId: bidRequest.bidId,
	bidderCode: spec.code,
	cpm: CPM,
	width: WIDTH,
	height: HEIGHT,
	creative_id: CREATIVE_ID,
	dealId: DEAL_ID,
	currency: CURRENCY,
	netRevenue: true,
	ttl: TIME_TO_LIVE,
	ad: CREATIVE_BODY
    };
    bids.push(bid);
    return bids;
{% endhighlight %}

For details about the status codes, see [constants.json](https://github.com/prebid/Prebid.js/blob/master/src/constants.json).

{: .alert.alert-warning :}
**Prebid 1.0:** There are several new parameters required on the bid response object.

The parameters of the `bidObject` are:

{: .table .table-bordered .table-striped }
| Key          | Scope     | Description                                                              | Example                              |
| :----        | :-------- | :-------                                                                 | :-------  |
| `id` | Required  | The bid ID. Used to tie this bid back to the request.    | 12345     |
| `bidderCode` | Required  | The bidder code.                                                         | `"example"`  |
| `cpm`        | Required  | The bid price. We recommend the most granular price a bidder can provide | 3.5764    |
| `width`      | Required  | The width of the returned creative. For video, this is the player width. | 300       |
| `height`     | Required  | The height of the returned creative. For video, this is the player height. | 250       |
| `ad`         | Required  | The creative payload of the returned bid.                                | `"<html><h3>I am an ad</h3></html>"` |
| `ttl`        | Required  | Time-to-Live – how long (in seconds) Prebid can use this bid. Default value is 5 minutes. | 360 |
| `creative_id`| Required  | A bidder-specific unique code that supports tracing the ad creative back to the source. | `"123abc"` |
| `currency`   | Required  | 3-letter code defining the currency of the bid. Defaults to USD. | `"EUR"` |
| `vastUrl`| Required for video | URL where the VAST document can be retrieved when ready for display. | `"http://vid.example.com/9876` |
| `netRevenue` | Optional  | Boolean defining whether the bid is Net or Gross. The default is true (Net). Bidders responding with Gross-price bids should set this to false. | `false` |

### Register User Syncs

All user ID sync activity must be done in one of two ways:
1. The `getUserSyncs` callback of the BaseAdapter model
2. The userSync.registerSync function()

{% highlight js %}
getUserSyncs: function(syncOptions) {
        if (syncOptions.iframeEnabled) {
            return [{
                type: 'iframe',
                url: '//acdn.adnxs.com/ib/static/usersync/v3/async_usersync.html'
            }];
        }
    }
{% endhighlight %}

See (TBD - link to UserSync) for more information.


## Supporting Video

{: .alert.alert-warning :}
**Prebid 1.0:** There aren't any differences in video except that there was formerly a separate
document describing how to build a video adapter. That information has been moved here.

There are a few differences for adapters supporting video auctions. Here are the steps to ensure that an
adapter properly supports video:

**Step 1: Register the adapter as supporting video**

Add the 'supportedMediaTypes' argument to the spec object:

{% highlight js %}
export const spec = {
    code: BIDDER_CODE,
    supportedMediaTypes: [VIDEO],
    ...
}
{% endhighlight %}

**Step 2: Accept video parameters and pass them to your server**

See the [AppNexus AST adapter]({{site.baseurl}}/dev-docs/bidders.html#appnexusAst) for an example of how
video parameters may be passed in from the AdUnit.

**Step 3: Respond with VAST or a VAST URL **

When bidder returns VAST or a VAST URL in its bid response, Prebid provides a service to cache these results.
If you want to override where the system caches the VAST, call setConfig:

{% highlight js %}
pbjs.setConfig({videoConfig: { cache: CACHE_URL}});
{% endhighlight %}

For more information, see the implementation of [pbjs.buildMasterVideoTagFromAdserverTag](https://github.com/prebid/Prebid.js/blob/master/src/prebid.js).


<a name="bidder-example"></a>

## Full Bid Adapter Example using the BaseAdapter

{% highlight js %}
import * as utils from 'src/utils';
import { registerBidder } from 'src/adapters/bidderFactory';
const BIDDER_CODE = 'MYBIDDER';
export const spec = {
    code: BIDDER_CODE,
    /**
     * Determines whether or not the given bid request is valid.
     *
     * @param {BidRequest} bid The bid params to validate.
     * @return boolean True if this is a valid bid, and false otherwise.
     */
    isBidRequestValid: function(bid) {
        return !!(bid.params.placementId || (bid.params.member && bid.params.invCode));
    },
    /**
     * Make a server request from the list of BidRequests.
     *
     * @param {BidRequest[]} bidRequests A non-empty list of bid requests which should be sent to the Server.
     * @return ServerRequest Info describing the request to the server.
     */
    buildRequests: function(bidRequests) {
        const payload = {
		// use bidRequests to get bidder-dependent request info

		// pull requested transaction ID from bidRequests[].tid
        };
        const payloadString = JSON.stringify(payload);
        return {
            method: 'POST',
            url: ENDPOINT_URL,
            data: payloadString,
        };
    },
    /**
     * Unpack the response from the server into a list of bids.
     *
     * @param {*} serverResponse A successful response from the server.
     * @return {Bid[]} An array of bids which were nested inside the server.
     */
    interpretResponse: function(serverResponse) {
        let bidRequest = this.bidRequest;
        const bids = [];
        // loop through serverResponses {
            const bid = {
                requestId: bidRequest.bidId,
		bidderCode: spec.code,
                cpm: CPM,
                width: WIDTH,
                height: HEIGHT,
                creative_id: CREATIVE_ID,
                dealId: DEAL_ID,
		currency: CURRENCY,
		netRevenue: true,
		ttl: TIME_TO_LIVE,
		ad: CREATIVE_BODY
	    };
	    bids.push(bid);
        };
        return bids;
    },
    getUserSyncs: function(syncOptions) {
        if (syncOptions.iframeEnabled) {
            return [{
                type: 'iframe',
                url: 'ADAPTER_SYNC_URL'
            }];
        }
    }
}
adaptermanager.aliasBidAdapter(BIDDER_CODE, 'ex'); // short code
registerBidder(spec);
{% endhighlight %}

## Open Items

Items to complete before this doc is taken out of draft mode:

1. Complete the BaseAdapter example(s)
1. Confirm the bidRequest IDs: bid ID, transaction ID
1. Confirm that Rubicon's ok with netRevenue being mandatory
1. Flesh out video section:
    1. Confirm cache override
    1. Add Outstream
1. Add Native


## Further Reading

+ [The bidder adapter sources in the repo](https://github.com/prebid/Prebid.js/tree/master/modules)

</div>
