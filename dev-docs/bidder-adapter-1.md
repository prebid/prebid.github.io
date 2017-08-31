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

1. Sending out bid requests to the ad server
2. Registering the bids that are returned with Prebid.js

This page has instructions for writing your own bidder adapter.  The instructions here try to walk you through some of the code you'll need to write for your adapter.  When in doubt, use [the working adapters in the Github repo](https://github.com/prebid/Prebid.js/tree/master/modules) for reference.

* TOC
{:toc}


## Step 1: Planning your adapter

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
               sizes: [[300, 250]],
               bids: [
                   {
                       bidder: example,
                       params: {
                           placement: '12345'
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

## Step 2: Design your bid params

The AdUnit's `bid.params` object will define the parameters of your ad request.  You can include tag ID, site ID, ad size, keywords, and other data, such as video parameters.

For more information about the kinds of information that can be passed using these parameters, see [existing bidder parameters]({{site.baseurl}}/dev-docs/bidders.html).

A sample AdUnit with parameters for the 'example' bidder:

{% highlight js %}
{
var adUnits = [{
    slotId: "top-med-rect",
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

{: .alert.alert-warning :}
**Prebid 1.0:** the `AdUnit.code` parameter has been deprecated. Instead, use slotId or divId.

## Step 3: Add a new bidder JS file

{: .alert.alert-success :}
If you're the type that likes to skip to the answer instead of going through a tutorial, see the <a href="#bidder-example">Full Bid Adapter Example</a> below.

1. Create a JS file under the `modules` directory with the name of the bidder suffixed by 'BidAdapter', e.g., `exampleBidAdapter.js`

2. The basic outline of a module is:

{% highlight js %}
import Adapter from 'src/adapter';
import bidfactory from 'src/bidfactory';
import adaptermanager from 'src/adaptermanager';
import * as utils from 'src/utils';
import { ajax } from 'src/ajax';
import { STATUS } from 'src/constants';

const BIDDER_CODE = 'example';
const ENDPOINT = 'https://bids.example.com';

function ExampleAdapter() {
  return Object.assign(new Adapter(BIDDER_CODE), {
    callBids: function(auctionRequests, addBidResponse, done) {
       // main function called by the Prebid platform
    }
  });

  // helper functions
}
adaptermanager.registerBidAdapter(new ExampleAdapter, BIDDER_CODE);
module.exports = ExampleAdapter;
{% endhighlight %}

{: .alert.alert-warning :}
**Prebid 1.0:** Note that callBids has a different signature.

Notes on the callBids function signature:

* The `auctionRequests` object contains multiple bids.params as configured in multiple AdUnits. TBD
* The `addBidResponse` function is where your code will register the bid response(s)
* The `done` callback function is used to indicate your module has registered all bids for this auction. Until you
call done, you're holding up the call to the ad server!


## Step 4: Send out bid requests

When the page asks Prebid.js to send out bid requests, your module's `callBids` function will be executed. This is a good place for you to send out bid requests to your server.

Example:

{% highlight js %}
ajax(
    ENDPOINT,
    {
          success: handleSuccessResponse.bind(this, auctionRequest, addBidResponse, done)
          error: handleErrorResponse.bind(this, done)
    },
    buildPostBody(bids),  // uses a helper function
    {
          withCredentials: true
    }
);
{% endhighlight %}

Building the request will use data from several places:

* AdUnit params - this is what's in the auctionRequest.bids array. TBD
* Auction Transaction ID - auctionRequest.transactionId should be sent to your server and forwarded to any Demand Side Platforms your server communicates with. TBD
* Ad Server Currency - if your service supports bidding in more than one currency, your adapter should call pbjs.getConfig(currency) to see if the page has defined which currency it prefers for bids.
* Referrer - auctionRequest.referrer should be passed into your server and utilized there. This is important in contexts like AMP where the original page referrer isn't available directly to the adapter.

{: .alert.alert-warning :}
**Prebid 1.0:** Some of these bid request recommendations are new.

After making the request, `callBids` is done -- control will pass back to Prebid and your adapter code will
be called again later: either handleSuccessResponse() or handleErrorResponse() in the example above.

## Step 5: Register bid responses

Your `callBids` function will set up a callback to be notified when the browser has received the response
from your server.

To register the bid, call the `addBidResponse(bidId, bidObject)` function. To register multiple bids, call the function multiple times.

If the bid is valid, create the bid response as shown below, matching the bid request/response pair. For details about the status codes, see [constants.json](https://github.com/prebid/Prebid.js/blob/master/src/constants.json).

{% highlight js %}
[TBD ... insert code from example ...]
{% endhighlight %}

If the bid is invalid (no fill or error), create the `bidObject` as shown below.

{% highlight js %}
addBidResponse(
          bidRequest.id,
          bidfactory.createBid(STATUS.NO_BID, bidRequest)
);
{% endhighlight %}

The addBidResponse function has two parameters:

* id - in bidder API's callback, there'll be ID(s) that tie back to the request params in the `auctionRequest` object. Building a map from `id` to the request param(s)/ID(s) will help you retrieve the `id` based on the callback. TBD
* bidObject - your server's auction response

{: .alert.alert-warning :}
**Prebid 1.0:** The auctionId is new and replaces code as the key to match the AdUnit. Also note that there
are several new parameters required on the bid response object.

The parameters of the `bidObject` are:

{: .table .table-bordered .table-striped }
| Key          | Scope     | Description                                                              | Example                              |
| :----        | :-------- | :-------                                                                 | :-------  |
| `id` | Required  | TBD - The ID of the auctionRequest. Used to tie this bid back to the request.    | 12345     |
| `bidderCode` | Required  | The bidder code.                                                         | `"example"`  |
| `cpm`        | Required  | The bid price. We recommend the most granular price a bidder can provide | 3.5764    |
| `width`      | Required  | The width of the returned creative. For video, this is the player width. | 300       |
| `height`     | Required  | The height of the returned creative. For video, this is the player height. | 250       |
| `ad`         | Required  | The creative payload of the returned bid                                 | `"<html><h3>I am an ad</h3></html>"` |
| `ttl`        | Required  | Time-to-Live -- how long (in ms) Prebid can use this bid. (TBD - DEFAULT?)       | 100 |
| `creative_id`| Required  | A bidder-specific unique code that supports tracing the ad creative back to the source. | `"123abc"` |
| `vastUrl`| Required for video | URL where the VAST document can be retrieved when ready for display. | `"http://vid.example.com/9876` |
| `netRevenue` | Optional  | Boolean defining whether the bid is Net or Gross. The default is true (Net). Bidders responding with Gross-price bids should set this to false. | `false` |
| `currency`   | Optional  | 3-letter code defining the currency of the bid. Defaults to USD. | `"EUR"` |


## Supporting Video

{: .alert.alert-warning :}
**Prebid 1.0:** There aren't any differences in video except that there was formerly a separate
document describing how to build a video adapter. That information has been moved here.

There are a few differences for adapters supporting video auctions. To check that your module properly supports
video:

**Step 1: Register the adapter as supporting video**

Add the 'supportedMediaTypes' argument to the `registerBidAdapter` call:

{% highlight js %}
adaptermanager.registerBidAdapter(new ExampleBidAdapter, 'example', {
  supportedMediaTypes: ['video']
});
{% endhighlight %}

**Step 2: Accept video parameters and pass them to your server**

See the [AppNexus AST adapter]({{site.baseurl}}/dev-docs/bidders.html#appnexusAst) for an example of how
video parameters may be passed in from the AdUnit.

**Step 3: Respond with a VAST URL**

Your bidder must support returning a VAST URL in its bid response. This is the URL where the player will go to display the
video ad if its chosen for display.

{: .alert.alert-warning :}
**Note:** Prebid doesn't provide a service to cache video creatives. You'll need to provide your own video URL.

For more information, see the implementation of [pbjs.buildMasterVideoTagFromAdserverTag](https://github.com/prebid/Prebid.js/blob/master/src/prebid.js).


<a name="bidder-example"></a>

## Full Bid Adapter Example

{% highlight js %}

[copy in example code]

{% endhighlight %}

## Further Reading

+ [The bidder adapter sources in the repo](https://github.com/prebid/Prebid.js/tree/master/modules)

</div>
