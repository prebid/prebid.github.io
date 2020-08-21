---
layout: page_v2
title: How to Add a New Prebid.js Bidder Adapter
description: Documentation on how to add a Prebid.js new bidder adapter
top_nav_section: dev_docs
nav_section: adapters
sidebarType: 1
---



# How to Add a New Prebid.js Bidder Adapter
{:.no_toc}

At a high level, a bidder adapter is responsible for:

1. Creating the bid requests for the bidder's server.
2. Parsing and registering the bid responses.

This page has instructions for writing your own bidder adapter.  The instructions here try to walk you through some of the code you'll need to write for your adapter.  When in doubt, use [the working adapters in the GitHub repo](https://github.com/prebid/Prebid.js/tree/master/modules) for reference.

* TOC
{:toc}

## Planning your Adapter

+ [Required Adapter Rules](#bidder-adaptor-Required-Adapter-Conventions)
+ [Required Files](#bidder-adaptor-Required-Files)
+ [Designing your Bid Params](#bidder-adaptor-Designing-your-Bid-Params)

<a name="bidder-adaptor-Required-Adapter-Conventions" />

### Required Adapter Rules

In order to provide a fast and safe header bidding environment for publishers, the Prebid.org team reviews all adapters for the required bid adapter conventions laid out in the [Module Rules](/dev-docs/module-rules.html). Here are additional details specific to Prebid.js:

* **No loading of external code**: All code must be present in the adapter, not loaded at runtime. Exceptions are possible -- see [the full policy](https://github.com/prebid/prebid-js-external-js-template#policy).
* **All user-sync activity must be registered via the provided functions**: The platform will place all registered syncs in the page after the auction is complete, subject to publisher configuration.
* **Adapters may not create or trigger any network requests or pixels** outside of the requests the wrapper creates on behalf of the adapter (from the return values of `buildRequests()` and `getUserSyncs()`) or that are included in a winning and rendered creative.
* **Adapters may not modify ad slots directly**: For example, accessing `googletag.pubads().getSlots()` to modify or set targeting directly on slots is not permitted.
* **All parameter conventions must be followed**: Video params must be read from AdUnit.mediaTypes.video when available; however, bidder config can override the ad unit.

{: .alert.alert-danger :}
The above list is **not** the full list of requirements. Failure to follow any of the required conventions defined in the [Module Rules](/dev-docs/module-rules.html) could lead to delays in approving your adapter for inclusion in Prebid.js. If you'd like to apply for an exception to one of the rules, make your request in a new [Prebid.js issue](https://github.com/prebid/Prebid.js/issues).

<a name="bidder-adaptor-Required-Files" />

### Required Files

With each adapter submission, there are two files required to be in the pull request:

* `modules/exampleBidAdapter.js`: the file containing the code for the adapter
* `modules/exampleBidAdapter.md`: a markdown file containing key information about the adapter:
   * The contact email of the adapter's maintainer.
   * A test ad unit that will consistently return test creatives. This helps us to ensure future Prebid.js updates do not break your adapter.  Note that if your adapter supports video (instream and/or outstream context) or native, you must also provide example parameters for each type.

Example markdown file:

{% highlight text %}

# Overview

```
Module Name: Example Bidder Adapter
Module Type: Bidder Adapter
Maintainer: prebid@example.com
```

# Description

Module that connects to Example's demand sources

# Test Parameters
```
    var adUnits = [
        {
            code: 'test-div',
            mediaTypes: {
                banner: {
                    sizes: [[300, 250]],  // a display size
                }
            },
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
            mediaTypes: {
                banner: {
                    sizes: [[320, 50]],   // a mobile size
                }
            },
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

<a name="bidder-adaptor-Designing-your-Bid-Params" />

### Designing your Bid Params

The parameters of your ad request will be stored in the ad unit's `bid.params` object.  You can include tag info, ad size, keywords, and other data such as video parameters.

For more information about the kinds of information that can be passed using these parameters, see the example below, as well as [the existing bidder parameters]({{site.baseurl}}/dev-docs/bidders.html).

{% highlight js %}

{
    var adUnits = [{
        code: "top-med-rect",
        mediaTypes: {
            banner: {
                sizes: [
                    [300, 250],
                    [300, 600]
                ]
            }
        },
        bids: [{
            bidder: "example",
            // params is custom to the bidder adapter and will be
            // passed through from the configuration as is.
            params: {
                unit: '3242432',
                pgid: '123124',
                custom: {
                    other: "xyz"
                }
            },
        }]
    }];

{% endhighlight %}

## Creating the Adapter

{: .alert.alert-success :}
If you're the type that likes to skip to the answer instead of going through a tutorial, see the <a href="#bidder-example">Full Bid Adapter Example</a> below.

+ [Overview](#bidder-adaptor-Overview)
+ [Building the Request](#bidder-adaptor-Building-the-Request)
+ [Interpreting the Response](#bidder-adaptor-Interpreting-the-Response)
+ [Registering User Syncs](#bidder-adaptor-Registering-User-Syncs)
+ [Registering on Timeout](#bidder-adaptor-Registering-on-Timout)

<a name="bidder-adaptor-Overview" />

### Overview

The new code will reside under the `modules` directory with the name of the bidder suffixed by 'BidAdapter', e.g., `exampleBidAdapter.js`.

Compared to previous versions of Prebid, the new `BaseAdapter` model saves the adapter from having to make the AJAX call and provides consistency in how adapters are structured. Instead of a single entry point, the `BaseAdapter` approach defines the following entry points:

* `isBidRequestValid` - Verify the the `AdUnits.bids`, respond with `true` (valid) or `false` (invalid).
* `buildRequests` - Takes an array of valid bid requests, all of which are guaranteed to have passed the `isBidRequestValid()` test.
* `interpretResponse` - Parse the response and generate one or more bid objects.
* `getUserSyncs` - If the publisher allows user-sync activity, the platform will call this function and the adapter may register pixels and/or iframe user syncs.  For more information, see [Registering User Syncs](#bidder-adaptor-Registering-User-Syncs) below.
* `onTimeout` - If the adapter timed out for an auction, the platform will call this function and the adapter may register timeout.  For more information, see [Registering User Syncs](#bidder-adaptor-Registering-User-Syncs) below.

A high level example of the structure:

{% highlight js %}

import * as utils from 'src/utils';
import { registerBidder } from 'src/adapters/bidderFactory';
import { config } from 'src/config';
const BIDDER_CODE = 'example';
export const spec = {
    code: BIDDER_CODE,
    aliases: ['ex'], // short code
    isBidRequestValid: function(bid) {},
    buildRequests: function(validBidRequests[], bidderRequest) {},
    interpretResponse: function(serverResponse, request) {},
    getUserSyncs: function(syncOptions, serverResponses, gdprConsent, uspConsent) {},
    onTimeout: function(timeoutData) {},
    onBidWon: function(bid) {},
    onSetTargeting: function(bid) {}
}
registerBidder(spec);

{% endhighlight %}

<a name="bidder-adaptor-Building-the-Request" />

### Building the Request

When the page asks Prebid.js for bids, your module's `buildRequests` function will be executed and passed two parameters:

- `validBidRequests[]` - An array of bidRequest objects, one for each AdUnit that your module is involved in. This array has been processed for special features like sizeConfig, so it's the list that you should be looping through.
- `bidderRequest` - The master bidRequest object. This object is useful because it carries a couple of bid parameters that are global to all the bids.

{% highlight js %}
buildRequests: function(validBidRequests, bidderRequest) {
   ...
   return ServerRequestObjects;
}
{% endhighlight %}

Building the request will use data from several places:

* **Ad Unit Params**: The arguments provided by the page are in `validBidRequests[]`.
* **BidRequest Params**: Several important parameters such as userId, GDPR, USP, and supply chain values are on the `bidderRequest` object.
* **Prebid Config**: Publishers can set a number of config values that bid adapters should consider reading.


#### Ad Unit Params in the validBidRequests Array

Here is a sample array entry for `validBidRequests[]`:

{% highlight js %}
[{
  adUnitCode: "test-div"
  auctionId: "b06c5141-fe8f-4cdf-9d7d-54415490a917"
  bidId: "22c4871113f461"
  bidder: "rubicon"
  bidderRequestId: "15246a574e859f"
  bidRequestsCount: 1
  bidderRequestsCount: 1
  bidderWinsCount: 0
  userId: {...}
  schain: {...}
  mediaTypes: {banner: {...}}
  params: {...}
  src: "client"
  transactionId: "54a58774-7a41-494e-9aaf-fa7b79164f0c"
}]
{% endhighlight %}

Retrieve your bid parameters from the `params` object.

Other notes:
- **Bid ID** is unique across ad units and bidders.
- **Transaction ID** is unique for each ad unit with a call to `requestBids()`, but same across bidders. This is the ID that enables DSPs to recognize the same impression coming in from different supply sources.
- **Bid Request Count** is the number of times `requestBids()` has been called for this ad unit.
- **Bidder Request Count** is the number of times `requestBids()` has been called for this ad unit and bidder.
- **userId** is where bidders can look for IDs offered by the various [User ID modules](/dev-docs/modules/userId.html#prebidjs-adapters).
- **schain** is where bidders can look for any [Supply Chain](/dev-docs/modules/schain.html) data that they should pass through to the endpoint.

#### bidderRequest Parameters

Here is a sample bidderRequest object:

{% highlight js %}
{
  auctionId: "b06c5141-fe8f-4cdf-9d7d-54415490a917",
  auctionStart: 1579746300522,
  bidderCode: "myBidderCode",
  bidderRequestId: "15246a574e859f",
  bids: [{...}],
  gdprConsent: {consentString: "BOtmiBKOtmiBKABABAENAFAAAAACeAAA", vendorData: {...}, gdprApplies: true},
  refererInfo: {
    canonicalUrl: undefined,
    numIframes: 0,
    reachedTop: true,
    referer: "http://mypage?pbjs_debug=true"
  }
}
{% endhighlight %}

Notes on parameters in the bidderRequest object:
- **auctionID** is unique per call to `requestBids()`, but is the same across ad units.
- **refererInfo** is provided so you don't have to call any utils functions. See below for more information.
- **gdprConsent** is the object containing data from the [GDPR ConsentManagement](/dev-docs/modules/consentManagement.html) module. For TCF2+, it will contain both the tcfString and the addtlConsent string if the CMP sets the latter as part of the TCData object.
- **uspConsent** is the object containing data from the [US Privacy ConsentManagement](/dev-docs/modules/consentManagementUsp.html) module

<a name="std-param-location"></a>

#### Prebid Standard Parameter Locations

There are a number of important values that a publisher expects to be handled in a standard way across all Prebid.js adapters:

{: .table .table-bordered .table-striped }
| Parameter | Description                                   | Example               |
| ----- | ------------ | ---------- |
| Ad Server Currency | If your endpoint supports responding in different currencies, read this value. | config.getConfig('currency.adServerCurrency') |
| Bidder Timeout | Use if your endpoint needs to know how long the page is allowing the auction to run. | config.getConfig('bidderTimeout'); |
| COPPA | If your endpoint supports the Child Online Privacy Protection Act, you should read this value. | config.getConfig('coppa'); |
| First Party Data | The publisher may provide [first party data](/dev-docs/publisher-api-reference.html#setConfig-fpd) (e.g. page type). | config.getConfig('fpd'); |
| Floors | Adapters that accept a floor parameter must also support the [floors module](https://docs.prebid.org/dev-docs/modules/floors.html) | [`getFloor()`](/dev-docs/modules/floors.html#bid-adapter-interface) |
| Page Referrer | Intead of building your own function to find the page referrer, look in the standard bidRequest location. | bidderRequest.refererInfo.referer |
| Publisher Domain | The page may declare its domain, useful in cross-iframe scenarios. | config.getConfig('publisherDomain') |
| [Supply Chain](/dev-docs/modules/schain.html) | Adapters cannot accept an schain parameter. Rather, they must look for the schain parameter at bidRequest.schain. | bidRequest.schain |
| Video Parameters | Video params must be read from AdUnit.mediaType.video when available; however bidder config can override the ad unit. | AdUnit.mediaType.video |

#### Referrers

Referrer information should be passed to your endpoint in contexts where the original page referrer isn't available directly to the adapter. Use the `bidderRequest.refererInfo` property to pass in referrer information. This property contains the following parameters:

- `referer`: a string containing the detected top-level URL.
- `reachedTop`: a boolean specifying whether Prebid was able to walk up to the top window.
- `numIframes`: the number of iFrames.
- `stack`: a string of comma-separated URLs of all origins.
- `canonicalUrl`: a string containing the canonical (search engine friendly) URL defined in top-most window.

The URL returned by `refererInfo` is in raw format. We recommend encoding the URL before adding it to the request payload to ensure it will be sent and interpreted correctly.

#### The output of buildRequests: ServerRequest Objects

You shouldn't call your bid endpoint directly. Rather, the end result of your buildRequests function is one or more
ServerRequest objects. These objects have this structure:

{: .table .table-bordered .table-striped }
| Attribute | Type             | Description                                                        | Example Value               |
|-----------+------------------+--------------------------------------------------------------------+-----------------------------|
| `method`  | String           | Which HTTP method should be used.                                  | `POST`                      |
| `url`     | String           | The endpoint for the request.                                      | `"https://bids.example.com"` |
| `data`    | String or Object | Data to be sent in the POST request. Objects will be sent as JSON. |                             |

Here's a sample block of code returning a ServerRequest object:

{% highlight js %}

return {
    method: 'POST',
    url: URL,
    data: payloadObject
};

{% endhighlight %}

<a name="bidder-adaptor-Interpreting-the-Response" />

### Interpreting the Response

The `interpretResponse` function will be called when the browser has received the response from your server. The function will parse the response and create a bidResponse object containing one or more bids. The adapter should indicate no valid bids by returning an empty array. An example showing a single bid:

{% highlight js %}

    // if the bid response was empty or an error, return []
    // otherwise parse the response and return a bidResponses array

    // The response body and headers can be retrieved like this:
    //
    // const serverBody = serverResponse.body;
    // const headerValue = serverResponse.headers.get('some-response-header')
    const bidResponses = [];
    const bidResponse = {
        requestId: BID_ID,
        cpm: CPM,
        currency: CURRENCY,
        width: WIDTH,
        height: HEIGHT,
        creativeId: CREATIVE_ID,
        dealId: DEAL_ID,
        netRevenue: true,
        ttl: TIME_TO_LIVE,
        ad: CREATIVE_BODY,
        dealId: DEAL_ID,
        meta: {
            networkId: NETWORK_ID,
            networkName: NETWORK_NAME
            agencyId: AGENCY_ID,
            agencyName: AGENCY_NAME,
            advertiserId: ADVERTISER_ID,
            advertiserName: ADVERTISER_NAME,
            advertiserDomains: [ARRAY_OF_ADVERTISER_DOMAINS]
            brandId: BRAND_ID,
            brandName: BRAND_NAME,
            primaryCatId: IAB_CATEGORY,
            secondaryCatIds: [ARRAY_OF_IAB_CATEGORIES],
            mediaType: MEDIA_TYPE
        }
    };
    bidResponses.push(bidResponse);
    return bidResponses;

{% endhighlight %}

{: .alert.alert-info :}
Please provide as much information as possible in the `meta` object. Publishers use this
data for tracking down bad creatives and ad blocking. The advertiserDomains field is
particularly useful. Some of these fields may become required in a future release.

The parameters of the `bidResponse` object are:

{: .table .table-bordered .table-striped }
| Key          | Scope                                       | Description                                                                                                                                   | Example                              |
|--------------+---------------------------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------+--------------------------------------|
| `requestId`  | Required                                    | The bid ID that was sent to `spec.buildRequests` as `bidRequests[].bidId`. Used to tie this bid back to the request.                          | 12345                                |
| `cpm`        | Required                                    | The bid price. We recommend the most granular price a bidder can provide                                                                      | 3.5764                               |
| `currency`   | Required                                    | 3-letter ISO 4217 code defining the currency of the bid.                                                                                      | `"EUR"`                              |
| `width`      | Required                                    | The width of the returned creative. For video, this is the player width.                                                                      | 300                                  |
| `height`     | Required                                    | The height of the returned creative. For video, this is the player height.                                                                    | 250                                  |
| `ad`         | Required                                    | The creative payload of the returned bid.                                                                                                     | `"<html><h3>I am an ad</h3></html>"` |
| `ttl`        | Required                                    | Time-to-Live - how long (in seconds) Prebid can use this bid. See the [FAQ entry](/dev-docs/faq.html#does-prebidjs-cache-bids) for more info.   | 360                                  |
| `creativeId` | Required                                    | A bidder-specific unique code that supports tracing the ad creative back to the source.                                                       | `"123abc"`                           |
| `netRevenue` | Required                                    | Boolean defining whether the bid is Net or Gross. The value `true` is Net. Bidders responding with Gross-price bids should set this to false. | `false`                              |
| `vastUrl`    | Either this or `vastXml` required for video | URL where the VAST document can be retrieved when ready for display.                                                                          | `"https://vid.example.com/9876`       |
| `vastImpUrl` | Optional; only usable with `vastUrl` and requires prebid cache to be enabled | An impression tracking URL to serve with video Ad                                                                                             | `"https://vid.exmpale.com/imp/134"`   |
| `vastXml`    | Either this or `vastUrl` required for video | XML for VAST document to be cached for later retrieval.                                                                                       | `<VAST version="3.0">...`            |
| `dealId`     | Optional                                    | Deal ID                                                                                                                                       | `"123abc"`                           |
| `meta`     | Optional                                    | Object containing metadata about the bid                                                                                                                                       |                           |
| `meta.networkId`     | Optional                                    | Bidder-specific Network/DSP Id               | 1111             |
| `meta.networkName`     | Optional                                    | Network/DSP Name               | `"NetworkN"`                |
| `meta.agencyId`     | Optional                                    | Bidder-specific Agency ID               | 2222                          |
| `meta.agencyName`     | Optional                                    | Agency Name     | `"Agency, Inc."`           |
| `meta.advertiserId`     | Optional                                    | Bidder-specific Advertiser ID     | 3333                          |
| `meta.advertiserName`     | Optional                                    | Advertiser Name               | `"AdvertiserA"`                          |
| `meta.advertiserDomains`     | Optional                                    | Array of Advertiser Domains for the landing page(s). This is an array to align with the OpenRTB 'adomain' field.    | `["advertisera.com"]`     |
| `meta.brandId`     | Optional                                    | Bidder-specific Brand ID (some advertisers may have many brands)                                                                                                   | 4444                    |
| `meta.brandName`     | Optional                                    | Brand Name                                   | `"BrandB"`                          |
| `meta.primaryCatId`     | Optional                                    | Primary [IAB category ID](https://www.iab.com/guidelines/iab-quality-assurance-guidelines-qag-taxonomy/)               |  `"IAB-111"`                         |
| `meta.secondaryCatIds`     | Optional                                    | Array of secondary IAB category IDs      | `["IAB-222","IAB-333"]`       |
| `meta.mediaType`     | Optional                                  | "banner", "native", or "video" - this should be set in scenarios where a bidder responds to a "banner" mediaType with a creative that's actually a video (e.g. outstream) or native. | `"native"`  |

<a name="bidder-adaptor-Registering-User-Syncs" />

### Registering User Syncs

All user ID sync activity should be done using the `getUserSyncs` callback of the `BaseAdapter` model.

Given an array of all the responses from the server, `getUserSyncs` is used to determine which user syncs should occur. The order of syncs in the `serverResponses` array matters. The most important ones should come first, since publishers may limit how many are dropped on their page.

See below for an example implementation.  For more examples, search for `getUserSyncs` in the [modules directory in the repo](https://github.com/prebid/Prebid.js/tree/master/modules).

{% highlight js %}

{
    getUserSyncs: function(syncOptions, serverResponses, gdprConsent, uspConsent) {
       const syncs = []

       var gdpr_params;
       if (typeof gdprConsent.gdprApplies === 'boolean') {
           gdpr_params = `gdpr=${Number(gdprConsent.gdprApplies)}&gdpr_consent=${gdprConsent.consentString}`;
       } else {
           gdpr_params = `gdpr_consent=${gdprConsent.consentString}`;
       }

        if (syncOptions.iframeEnabled) {
            syncs.push({
                type: 'iframe',
                url: '//acdn.adnxs.com/ib/static/usersync/v3/async_usersync.html?' + gdpr_params
            });
        }
        if (syncOptions.pixelEnabled && serverResponses.length > 0) {
            syncs.push({
                type: 'image',
                url: serverResponses[0].body.userSync.url + gdpr_params
            });
        }
        return syncs;
    }
}

{% endhighlight %}

<a name="bidder-adaptor-Registering-on-Timout" />

### Registering on Timeout

The `onTimeout` function will be called when an adpater timed out for an auction. Adapter can fire a ajax or pixel call to register a timeout at thier end.

Sample data received to this function:

{% highlight js %}
{
  "bidder": "example",
  "bidId": "51ef8751f9aead",
  "params": {
    ...
  },
  "adUnitCode": "div-gpt-ad-1460505748561-0",
  "timeout": 3000,
  "auctionId": "18fd8b8b0bd757"
}
{% endhighlight %}

### Registering on Bid Won

The `onBidWon` function will be called when a bid from the adapter won the auction.

Sample data received by this function:

{% highlight js %}
{
  "bidder": "example",
  "width": 300,
  "height": 250,
  "adId": "330a22bdea4cac",
  "mediaType": "banner",
  "cpm": 0.28
  "ad": "...",
  "requestId": "418b37f85e772c",
  "adUnitCode": "div-gpt-ad-1460505748561-0",
  "size": "350x250",
  "adserverTargeting": {
    "hb_bidder": "example",
    "hb_adid": "330a22bdea4cac",
    "hb_pb": "0.20",
    "hb_size": "350x250"
  }
}
{% endhighlight %}

### Registering on Set Targeting

The `onSetTargeting` function will be called when the adserver targeting has been set for a bid from the adapter.

Sample data received by this function:

{% highlight js %}
{
  "bidder": "example",
  "width": 300,
  "height": 250,
  "adId": "330a22bdea4cac",
  "mediaType": "banner",
  "cpm": 0.28,
  "ad": "...",
  "requestId": "418b37f85e772c",
  "adUnitCode": "div-gpt-ad-1460505748561-0",
  "size": "350x250",
  "adserverTargeting": {
    "hb_bidder": "example",
    "hb_adid": "330a22bdea4cac",
    "hb_pb": "0.20",
    "hb_size": "350x250"
  }
}
{% endhighlight %}

## Supporting Video

Follow the steps in this section to ensure that your adapter properly supports video.

### Step 1: Register the adapter as supporting video

Add the `supportedMediaTypes` argument to the spec object, and make sure `video` is in the list:

{% highlight js %}

export const spec = {
    code: BIDDER_CODE,
    supportedMediaTypes: ['video'],
    ...
}

{% endhighlight %}

{: .alert.alert-info :}
If your adapter supports banner and video media types, make sure to include `'banner'` in the `supportedMediaTypes` array as well

### Step 2: Accept video parameters and pass them to your server

Video parameters are often passed in from the ad unit in a `video` object. As of Prebid 4.0 the following paramters should be read from the ad unit when available; bidders can accept overrides of the ad unit on their bidder configuration parameters but should read from the ad unit configuration when their bidder parameters are not set. Parameters one should expect on the ad unit include:

| parameter |
|-|
| mimes |
| minduration |
| maxduration |
| protocols |
| startdelay |
| placement |
| skip |
| skipafter |
| minbitrate |
| maxbitrate |
| delivery |
| playbackmethod |
| api |
| linearity |

The design of these parameters may vary depending on what your server-side bidder accepts.  If possible, we recommend using the video parameters in the [OpenRTB specification](https://iabtechlab.com/specifications-guidelines/openrtb/).

For examples of video parameters accepted by different adapters, see [the list of bidders with video demand]({{site.baseurl}}/dev-docs/bidders.html#bidder-video-native).

#### Ingesting the Video Context

Video ad units have a publisher-defined video context, which can be either `'instream'` or `'outstream'` or `'adpod'`.  Video demand partners can choose to ingest this signal for targeting purposes.  For example, the ad unit shown below has the outstream video context:

```javascript
...
mediaTypes: {
    video: {
        context: 'outstream'
    },
},
...
```

You can check for the video context in your adapter as shown below, and then modify your response as needed:

```javascript
const videoMediaType = utils.deepAccess(bid, 'mediaTypes.video');
const context        = utils.deepAccess(bid, 'mediaTypes.video.context');

if (bid.mediaType === 'video' || (videoMediaType && context !== 'outstream')) {
    /* Do something here. */
}
```

#### Long-Form Video Content

{: .alert.alert-info :}
Following is Prebid's way to setup bid request for long-form, apadters are free to choose their own approach.

Prebid now accepts multiple bid responses for a single `bidRequest.bids` object. For each Ad pod Prebid expects you to send back n bid responses. It is up to you how bid responses are returned. Prebid's recommendation is that you expand an Ad pod placement into a set of request objects according to the total adpod duration and the range of duration seconds. It also depends on your endpoint as well how you may want to create your request for long-form. Appnexus adapter follows below algorithm to expand its placement.

#### Use case 1: I want to request my endpoint to return bids with varying ranges of durations
```
AdUnit config
{
  ...
  adPodDuration: 300,
  durationRangeSec: [15, 30]
  ...
}

Algorithm
# of placements = adPodDuration / MIN_VALUE(durationRangeSec)

Each placement set max duration:
placement.video.maxduration = MAX_VALUE(durationRangeSec)

Example:
# of placements : 300 / 15 = 20.
placement.video.maxduration = 30 (all placements the same)

Your endpoint responds with:
10 bids with 30 seconds duration
10 bids with 15 seconds duration
```

In Use case 1, you are asking endpoint to respond with 20 bids between min duration 0 and max duration 30 seconds. If you get bids with duration which does not match duration in `durationRangeSec` array, Prebid will evaluate the bid's duration and will match into the appropriate duration bucket by using a rounding-type logic. This new duration will be used in sending bids to Ad server.

Prebid creates virtual duration buckets based on `durationRangeSec` value. Prebid will
  - round the duration to the next highest specified duration value based on adunit. If the duration is above a range within a set buffer (hardcoded to 2s in prebid-core), that bid falls down into that bucket. (eg if `durationRangeSec` was [5, 15, 30] -> 2s is rounded to 5s; 17s is rounded back to 15s; 18s is rounded up to 30s)
  - reject bid if the bid is above the range of the listed durations (and outside the buffer)

Prebid will set the rounded duration value in the `bid.video.durationBucket` field for accepted bids

#### Use case 2: I want to request my endpoint to return bids that exactly match the durations I want
```
AdUnit config
{
  ...
  adPodDuration: 300,
  durationRangeSec: [15, 30],
  requireExactDuration: true
  ...
}

Algorithm
# of placements = MAX_VALUE(adPodDuration/MIN_VALUE(allowedDurationsSec), durationRangeSec.length)

Each placement:
placement.video.minduration = durationRangeSec[i]
placement.video.maxduration = durationRangeSec[i]

Example:
# of placements : MAX_VALUE( (300 / 15 = 20), 2) == 20

20 / 2 = 10 placements:
placement.video.minduration = 15
placement.video.maxduration = 15

20 / 2 = 10 placements:
placement.video.minduration = 30
placement.video.maxduration = 30

Your endpoint responds with:
10 bids with 30 seconds duration
10 bids with 15 seconds duration
```

In Use case 2 `requireExactDuration` is set to true and hence Prebid will only select bids that exactly match duration in `durationRangeSec` (don't round at all).

In both use cases, adapter is requesting bid responses for 20 placements in one single http request. You can split these into chunks depending on your endpoint's capacity.

Adapter must add following new properties to bid response

{% highlight js %}
{
  meta: {
    primaryCatId: '<iab sub category>', // only needed if you want to ensure competitive separation
  },
  video: {
    context: 'adpod',
    durationSeconds: 30
  }
}
{% endhighlight %}


Appnexus Adapter uses above explained approach. You can refer [here](https://github.com/prebid/Prebid.js/blob/master/modules/appnexusBidAdapter.js)

Adapter must return one [IAB accepted subcategories](https://iabtechlab.com/wp-content/uploads/2017/11/IAB_Tech_Lab_Content_Taxonomy_V2_Final_2017-11.xlsx) (links to MS Excel file) if they want to support competitive separation. These IAB sub categories will be converted to Ad server industry/group. If adapter is returning their own proprietary categroy, it is the responsibility of the adapter to convert their categories into [IAB accepted subcategories](https://iabtechlab.com/wp-content/uploads/2017/11/IAB_Tech_Lab_Content_Taxonomy_V2_Final_2017-11.xlsx) (links to MS Excel file).

If the demand partner is going to use Prebid API for this process, their adapter will need to include the `getMappingFileInfo` function in their spec file. Prebid core will use the information returned from the function to preload the mapping file in local storage and update on the specified refresh cycle.

**Params**  

{: .table .table-bordered .table-striped }
| Key             | Scope    | Description                                                                                        | Example                    |
|-----------------|----------|----------------------------------------------------------------------------------------------------|----------------------------|
| `url`             | Required | The URL to the mapping file.                                                                       | `"//example.com/mapping.json"` |
| `refreshInDays`   | Optional | A number representing the number of days before the mapping values are updated. Default value is 1 | `7`                        |
| `localStorageKey` | Optional | A unique key to store the mapping file in local storage. Default value is bidder code.             | `"uniqueKey"`                  |


**Example**

```
getMappingFileInfo: function() {
  return {
    url: '<mappingFileURL>',
    refreshInDays: 7
    localStorageKey: '<uniqueCode>'
  }
}
```

The mapping file is stored locally to expedite category conversion. Depending on the size of the adpod each adapter could have 20-30 bids. Storing the mapping file locally will prevent HTTP calls being made for each category conversion.

To get the subcategory to use, call this function, which needs to be imported from the `bidderFactory`.  

```
getIabSubCategory(bidderCode, pCategory)
```

**Params**

{: .table .table-bordered .table-striped }
| Key          | Scope    | Description                                   | Example               |
|--------------|----------|-----------------------------------------------|-----------------------|
| `bidderCode` | Required | BIDDER_CODE defined in spec.                  | `"sample-biddercode"` |
| `pCategory`  | Required | Proprietary category returned in bid response | `"sample-category"`   |

**Example**

{% highlight js %}

import { getIabSubCategory } from '../src/adapters/bidderFactory';
let primaryCatId = getIabSubCategory(bidderCode, pCategory)

{% endhighlight %}

#### Outstream Video Renderers

As described in [Show Outstream Video Ads]({{site.baseurl}}/dev-docs/show-outstream-video-ads.html), for an ad unit to play outstream ads, a "renderer" is required.  A renderer is the client-side code (usually a combination of JavaScript, HTML, and CSS) responsible for displaying a creative on a page.  A renderer must provide a player environment capable of playing a video creative (most commonly an XML document).

If possible, we recommend that publishers associate a renderer with their outstream video ad units.  By doing so, all video-enabled demand partners will be able to participate in the auction, regardless of whether a given demand partner provides a renderer on its bid responses.  Prebid.js will always invoke a publisher-defined renderer on a given ad unit.

However, if the publisher does not define a renderer, you will need to return a renderer with your bid response if you want to participate in the auction for outstream ad unit.

### Step 3: Respond with a VAST URL or raw VAST XML

The returned VAST URL or raw VAST XML should be added into `bid.vastUrl` or `bid.vastXml`, respectively.

For example:

{% highlight js %}

function createBid(status, reqBid, response) {
    let bid = bidfactory.createBid(status, reqBid);

    if (response) {
        bid.cpm = response.price;
        bid.crid = response.crid;
        bid.vastXml = response.adm;
        bid.mediaType = 'video';
    }

    return bid;
}

{% endhighlight %}

### Deals in Ad Pods

To do deals for long-form video (`adpod` ad unit) just add the `dielTier` integer value to `bid.video.dealTier`. For more details on conducting deals in ad pods see our [ad pod module documentation](/dev-docs/modules/adpod.html).

## Supporting Native

In order for your bidder to support the native media type:

1. Your (server-side) bidder needs to return a response that contains native assets.
2. Your (client-side) bidder adapter needs to unpack the server's response into a Prebid-compatible bid response populated with the required native assets.
3. Your bidder adapter must be capable of ingesting the required and optional native assets specified on the `adUnit.mediaTypes.native` object, as described in [Show Native Ads]({{site.baseurl}}/dev-docs/show-native-ads.html).

The adapter code samples below fulfills requirement #2, unpacking the server's reponse and:

1. Checking for native assets on the response.
2. If present, filling in the `native` object with those assets.

{% highlight js %}

/* Does the bidder respond with native assets? */
else if (rtbBid.rtb.native) {

    /* If yes, let's populate our response with native assets */

    const nativeResponse = rtbBid.rtb.native;

    bid.native = {
        title: nativeResponse.title,
        body: nativeResponse.desc,
        cta: nativeResponse.ctatext,
        sponsoredBy: nativeResponse.sponsored,
        image: nativeResponse.main_img && nativeResponse.main_img.url,
        icon: nativeResponse.icon && nativeResponse.icon.url,
        clickUrl: nativeResponse.link.url,
        impressionTrackers: nativeResponse.impression_trackers,
    };
}

{% endhighlight %}

As of the [0.34.1 release](https://github.com/prebid/Prebid.js/releases/tag/0.34.1), a bidder may optionally return the height and width of a native `image` or `icon` asset.

If your bidder does return the image size, you can expose the image dimensions on the bid response object as shown below.

```javascript
    /* Does the bidder respond with native assets? */
    else if (rtbBid.rtb.native) {

        const nativeResponse = rtbBid.rtb.native;

        /* */

        bid.native = {
            title: nativeResponse.title,
            image: {
              url: nativeResponse.img.url,
              height: nativeResponse.img.height,
              width: nativeResponse.img.width,
            },
            icon: nativeResponse.icon.url,
        };
    }
```

The targeting key `hb_native_image` (about which more [here]({{site.baseurl}}/adops/setting-up-prebid-native-in-dfp.html) (ad ops setup) and [here]({{site.baseurl}}/dev-docs/show-native-ads.html) (engineering setup)) will be set with the value of `image.url` if `image` is an object.

If `image` is a string, `hb_native_image` will be populated with that string (a URL).

## Adding Unit Tests

Every adapter submission must include unit tests.  For details about adapter testing requirements, see the **Writing Tests** section of [CONTRIBUTING.md](https://github.com/prebid/Prebid.js/blob/master/CONTRIBUTING.md).

For example tests, see [the existing adapter test suites](https://github.com/prebid/Prebid.js/tree/master/test/spec/modules).

<a name="bidder-example"></a>

## Full Bid Adapter Example

{% highlight js %}

import * as utils from 'src/utils';
import {config} from 'src/config';
import {registerBidder} from 'src/adapters/bidderFactory';
const BIDDER_CODE = 'example';
export const spec = {
        code: BIDDER_CODE,
        aliases: ['ex'], // short code
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
         * @param {validBidRequests[]} - an array of bids
         * @return ServerRequest Info describing the request to the server.
         */
        buildRequests: function(validBidRequests) {
            const payload = {
                /*
                Use `bidderRequest.bids[]` to get bidder-dependent
                request info.

                If your bidder supports multiple currencies, use
                `config.getConfig(currency)` to find which one the ad
                server needs.

                Pull the requested transaction ID from
                `bidderRequest.bids[].transactionId`.
                */
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
         * @param {ServerResponse} serverResponse A successful response from the server.
         * @return {Bid[]} An array of bids which were nested inside the server.
         */
        interpretResponse: function(serverResponse, bidRequest) {
            // const serverBody  = serverResponse.body;
            // const headerValue = serverResponse.headers.get('some-response-header');
            const bidResponses = [];
            const bidResponse = {
                requestId: bidRequest.bidId,
                cpm: CPM,
                width: WIDTH,
                height: HEIGHT,
                creativeId: CREATIVE_ID,
                dealId: DEAL_ID,
                currency: CURRENCY,
                netRevenue: true,
                ttl: TIME_TO_LIVE,
                referrer: REFERER,
                ad: CREATIVE_BODY
            };
            bidResponses.push(bidResponse);
        };
        return bidResponses;
    },

    /**
     * Register the user sync pixels which should be dropped after the auction.
     *
     * @param {SyncOptions} syncOptions Which user syncs are allowed?
     * @param {ServerResponse[]} serverResponses List of server's responses.
     * @return {UserSync[]} The user syncs which should be dropped.
     */
    getUserSyncs: function(syncOptions, serverResponses, gdprConsent, uspConsent) {
       const syncs = []

       var gdpr_params;
       if (typeof gdprConsent.gdprApplies === 'boolean') {
           gdpr_params = `gdpr=${Number(gdprConsent.gdprApplies)}&gdpr_consent=${gdprConsent.consentString}`;
       } else {
           gdpr_params = `gdpr_consent=${gdprConsent.consentString}`;
       }

        if (syncOptions.iframeEnabled) {
            syncs.push({
                type: 'iframe',
                url: '//acdn.adnxs.com/ib/static/usersync/v3/async_usersync.html?' + gdpr_params
            });
        }
        if (syncOptions.pixelEnabled && serverResponses.length > 0) {
            syncs.push({
                type: 'image',
                url: serverResponses[0].body.userSync.url + gdpr_params
            });
        }
        return syncs;
    }

    /**
     * Register bidder specific code, which will execute if bidder timed out after an auction
     * @param {data} Containing timeout specific data
     */
    onTimeout: function(data) {
        // Bidder specifc code
    }

    /**
     * Register bidder specific code, which will execute if a bid from this bidder won the auction
     * @param {Bid} The bid that won the auction
     */
    onBidWon: function(bid) {
        // Bidder specific code
    }

    /**
     * Register bidder specific code, which will execute when the adserver targeting has been set for a bid from this bidder
     * @param {Bid} The bid of which the targeting has been set
     */
    onSetTargeting: function(bid) {
        // Bidder specific code
    }
}
registerBidder(spec);

{% endhighlight %}


## Submitting your adapter

- [Write unit tests](https://github.com/prebid/Prebid.js/blob/master/CONTRIBUTING.md)
- Create a docs pull request against [prebid.github.io](https://github.com/prebid/prebid.github.io)
  - Fork the repo
  - Copy a file in [dev-docs/bidders](https://github.com/prebid/prebid.github.io/tree/master/dev-docs/bidders) and modify. Add the following metadata to the header of your .md file:
    - Add `pbjs: true`. If you also have a [Prebid Server bid adapter](/prebid-server/developers/add-new-bidder-go.html), add `pbs: true`. Default is false for both.
    - If you support the GDPR consentManagement module and TCF1, add `gdpr_supported: true`. Default is false.
    - If you support the GDPR consentManagement module and TCF2, add `tcf2_supported: true`. Default is false.
    - If you support the US Privacy consentManagementUsp module, add `usp_supported: true`. Default is false.
    - If you support one or more userId modules, add `userId: (list of supported vendors)`. No default value.
    - If you support video and/or native mediaTypes add `media_types: video, native`. Note that display is added by default. If you don't support display, add "no-display" as the first entry, e.g. `media_types: no-display, native`. No default value.
    - If you support COPPA, add `coppa_supported: true`. Default is false.
    - If you support the [supply chain](/dev-docs/modules/schain.html) feature, add `schain_supported: true`. Default is false.
    - If your bidder doesn't work well with safeframed creatives, add `safeframes_ok: false`. This will alert publishers to not use safeframed creatives when creating the ad server entries for your bidder. No default value.
    - If you support deals, set `bidder_supports_deals: true`. No default value..
    - If you're a member of Prebid.org, add `prebid_member: true`. Default is false.
- Submit both the code and docs pull requests

For example:
```
---
layout: bidder
title: example
description: Prebid example Bidder Adapter
biddercode: example
gdpr_supported: true/false
tcf2_supported: true/false
usp_supported: true/false
coppa_supported: true/false
schain_supported: true/false
userId: (list of supported vendors)
media_types: banner, video, native
safeframes_ok: true/false
bidder_supports_deals: true/false
pbjs: true/false
pbs: true/false
prebid_member: true/false
---
### Note:

The Example Bidding adapter requires setup before beginning. Please contact us at setup@example.com

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `placement`      | required | Placement id         | `'11111'`    | `string` |
```

Within a few days, the code pull request will be assigned to a developer for review.
Once the inspection passes, the code will be merged and included with the next release. Once released, the documentation pull request will be merged.

The Prebid.org [download page](/download.html) will automatically be updated with your adapter once everything's been merged.

## Further Reading

+ [Prebid.js Repo - Bidder Adapter Sources](https://github.com/prebid/Prebid.js/tree/master/modules)
+ [Module Rules](/dev-docs/module-rules.html)
