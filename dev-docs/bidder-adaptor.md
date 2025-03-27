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

* [Required Adapter Rules](#bidder-adaptor-Required-Adapter-Conventions)
* [Required Files](#bidder-adaptor-Required-Files)
* [Designing your Bid Params](#bidder-adaptor-Designing-your-Bid-Params)
* [HTTP Simple Requests](#bidder-adaptor-HTTP-simple-requests)

<a name="bidder-adaptor-Required-Adapter-Conventions"></a>

### Required Adapter Rules

In order to provide a fast and safe header bidding environment for publishers, the Prebid.org team reviews all adapters for the required bid adapter conventions laid out in the [Module Rules](/dev-docs/module-rules.html). Here are additional details specific to Prebid.js:

* **No loading of external code**: All code must be present in the adapter, not loaded at runtime. Exceptions are possible -- see [the full policy](https://github.com/prebid/prebid-js-external-js-template#policy).
* **All user-sync activity must be registered via the provided functions**: The platform will place all registered syncs in the page after the auction is complete, subject to publisher configuration.
* **Adapters may not create or trigger any network requests or pixels** outside of the requests the wrapper creates on behalf of the adapter (from the return values of `buildRequests()` and `getUserSyncs()`) or that are included in a winning and rendered creative.
* **Adapters may not modify ad slots directly**: For example, accessing `googletag.pubads().getSlots()` to modify or set targeting directly on slots is not permitted.
* **All parameter conventions must be followed**: Video params must be read from AdUnit.mediaTypes.video when available; however, bidder config can override the ad unit.

{: .alert.alert-danger :}
The above list is **not** the full list of requirements. Failure to follow any of the required conventions defined in the [Module Rules](/dev-docs/module-rules.html) could lead to delays in approving your adapter for inclusion in Prebid.js. If you'd like to apply for an exception to one of the rules, make your request in a new [Prebid.js issue](https://github.com/prebid/Prebid.js/issues).

<a name="bidder-adaptor-Required-Files"></a>

### Required Files

With each adapter submission, there are two files required to be in the pull request:

* `modules/exampleBidAdapter.js`: the file containing the code for the adapter
* `modules/exampleBidAdapter.md`: a markdown file containing key information about the adapter:
  * The contact email of the adapter's maintainer.
  * A test ad unit that will consistently return test creatives. This helps us to ensure future Prebid.js updates do not break your adapter.  Note that if your adapter supports video (instream and/or outstream context) or native, you must also provide example parameters for each type.

Example markdown file:

```md

# Overview

```markdown
Module Name: Example Bidder Adapter
Module Type: Bidder Adapter
Maintainer: prebid@example.com
```

# Description

Module that connects to Example's demand sources

# Test Parameters

```javascript
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

<a name="bidder-adaptor-Designing-your-Bid-Params"></a>

## Designing your Bid Params

The parameters of your ad request will be stored in the ad unit's `bid.params` object.  You can include tag info, ad size, keywords, and other data such as video parameters.

For more information about the kinds of information that can be passed using these parameters, see the example below, as well as [the existing bidder parameters]({{site.baseurl}}/dev-docs/bidders.html).

```javascript
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
```

<a name="bidder-adaptor-HTTP-simple-requests"></a>

## HTTP Simple Requests

When defining the HTTP headers for your endpoint, it is important from a performance perspective to consider what forces the browser to initiate a [CORS preflight request](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request). We encourage learning more about [Simple Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests) & [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) as it relates to your specific development configuration.

A 'Simple Request' meets **all** of the following conditions:

* Must be one of 3 following allowed methods
  * GET
  * HEAD
  * POST

* Only headers that are allowed to be manually set apart from the headers automatically set by the user-agent
  * `Accept`
  * `Accept-Language`
  * `Content-Language`
  * `Content-Type`
  * `Range`

* For the `Content-Type` header the only type/subtype combinations allowed are the following
  * application/x-www-form-urlencoded
  * multipart/form-data
  * text/plain

* If the request is made using `XMLHttpRequest` object, no event listeners are registered on the object returned by the `XMLHttpRequest.upload` property used in the request

* No `ReadableStream` object is used in the request

Prebid recommends keeping module HTTP requests 'simple' if at all possible. The default content-type used by Prebid.js is text/plain. Prebid switched to preferring the fetch api and added the Topics header when available in 8.9.

## Creating the Adapter

{: .alert.alert-success :}
If you're the type that likes to skip to the answer instead of going through a tutorial, see the <a href="#bidder-example">Full Bid Adapter Example</a> below.

{: .alert.alert-warning :}

### Note on ORTB adapters

{: .alert.alert-warning :}
If your adapter interfaces with an ORTB backend, you may take advantage of Prebid's [ORTB conversion library](https://github.com/prebid/Prebid.js/blob/master/libraries/ortbConverter/README.md), which provides most of the implementation for `buildRequests` and `interpretResponse`.

* [Overview](#bidder-adaptor-Overview)
* [Building the Request](#bidder-adaptor-Building-the-Request)
* [Interpreting the Response](#bidder-adaptor-Interpreting-the-Response)
* [Registering User Syncs](#bidder-adaptor-Registering-User-Syncs)
* [Registering on Timeout](#bidder-adaptor-Registering-on-Timout)

<a name="bidder-adaptor-Overview"></a>

### Overview

The new code will reside under the `modules` directory with the name of the bidder suffixed by 'BidAdapter', e.g., `exampleBidAdapter.js`.

Here are some guidelines for choosing a bidder code:

* The bidder code must be lower case alphanumeric. The only special character allowed is underscore.
* The bidder code must be unique - make sure none of the other bid adapters is using the same code.
* The bidder code should be unique for the first 6 characters - this consideration helps with generating unique targeting keys for use by some ad exchanges, such as Google Ad Manager.
* There are several reserved words that cannot be used as bidder names: all, context, data, general, prebid, and skadn.

Compared to previous versions of Prebid, the new `BaseAdapter` model saves the adapter from having to make the AJAX call and provides consistency in how adapters are structured. Instead of a single entry point, the `BaseAdapter` approach defines the following entry points:

* `isBidRequestValid` - Verify the the `AdUnits.bids`, respond with `true` (valid) or `false` (invalid).
* `buildRequests` - Takes an array of valid bid requests, all of which are guaranteed to have passed the `isBidRequestValid()` test.
* `interpretResponse` - Parse the response and generate one or more bid objects.
* `getUserSyncs` - If the publisher allows user-sync activity, the platform will call this function and the adapter may register pixels and/or iframe user syncs.  For more information, see [Registering User Syncs](#bidder-adaptor-Registering-User-Syncs) below.
* `onTimeout` - If the adapter timed out for an auction, the platform will call this function and the adapter may register timeout.  For more information, see [Registering User Syncs](#bidder-adaptor-Registering-User-Syncs) below.

A high level example of the structure:

```javascript

import * as utils from 'src/utils';
import { registerBidder } from 'src/adapters/bidderFactory';
import { config } from 'src/config';
import {BANNER, VIDEO, NATIVE} from 'src/mediaTypes.js';
const BIDDER_CODE = 'example';
export const spec = {
    code: BIDDER_CODE,
    gvlid: IAB_GVL_ID,
    aliases: [
      { code: "myalias", gvlid: IAB_GVL_ID_IF_DIFFERENT }
    ],
    isBidRequestValid: function(bid) {},
    buildRequests: function(validBidRequests[], bidderRequest) {},
    interpretResponse: function(serverResponse, request) {},
    getUserSyncs: function(syncOptions, serverResponses, gdprConsent, uspConsent) {},
    onTimeout: function(timeoutData) {},
    onBidWon: function(bid) {},
    onSetTargeting: function(bid) {},
    onBidderError: function({ error, bidderRequest }) {},
    onAdRenderSucceeded: function(bid) {},
    supportedMediaTypes: [BANNER, VIDEO, NATIVE]
}
registerBidder(spec);

```

<a id="ortb-adapters"></a>

### Note on ORTB adapters

If your adapter interfaces with an ORTB backend, you may take advantage of Prebid's [ORTB conversion library](https://github.com/prebid/Prebid.js/blob/master/libraries/ortbConverter/README.md), which provides most of the implementation for `buildRequests` and `interpretResponse`.

<a name="bidder-adaptor-Building-the-Request"></a>

### Building the Request

When the page asks Prebid.js for bids, your module's `buildRequests` function will be executed and passed two parameters:

* `validBidRequests[]` - An array of bidRequest objects, one for each AdUnit that your module is involved in. This array has been processed for special features like sizeConfig, so it's the list that you should be looping through.
* `bidderRequest` - The master bidRequest object. This object is useful because it carries a couple of bid parameters that are global to all the bids.

```javascript
buildRequests: function(validBidRequests, bidderRequest) {
   ...
   return ServerRequestObjects;
}
```

Building the request will use data from several places:

* **Ad Unit Params**: The arguments provided by the page are in `validBidRequests[]`.
* **BidRequest Params**: Several important parameters such as first-party data, userId, GDPR, USP, and supply chain values are on the `bidderRequest` object.
* **Prebid Config**: Publishers can set a number of config values that bid adapters should consider reading.

#### Ad Unit Params in the validBidRequests Array

Here is a sample array entry for `validBidRequests[]`:

```javascript
[{
  adUnitCode: "test-div",
  auctionId: "b06c5141-fe8f-4cdf-9d7d-54415490a917",
  bidId: "22c4871113f461",
  bidder: "rubicon",
  bidderRequestId: "15246a574e859f",
  bidRequestsCount: 1,
  bidderRequestsCount: 1,
  auctionsCount: 1,
  bidderWinsCount: 0,
  userId: {...},
  userIdAsEid: {...},
  schain: {...},
  mediaTypes: {banner: {...}},
  params: {...},
  src: "client",
  transactionId: "54a58774-7a41-494e-9aaf-fa7b79164f0c"
}]
```

Retrieve your bid parameters from the `params` object.

Other notes:

* **Bid ID** is unique across ad units and bidders.
* **auctionId** (see [note](#tid-warning)) is unique per call to `requestBids()`, but is the same across ad units and bidders.
* **Transaction ID** (see [note](#tid-warning)) is unique for each ad unit within a call to `requestBids()`, but same across bidders. This is the ID that enables DSPs to recognize the same impression coming in from different supply sources.
* **Bid Request Count** is the number of times `requestBids()` has been called for this ad unit.
* **Bidder Request Count** is the number of times `requestBids()` has been called for this ad unit and bidder.
* **Auctions Count** is the number of times `requestBids()` has been called for this ad unit excluding the duplicates generated by twin adUnits.
* **userId** is where bidders can look for IDs offered by the various [User ID modules](/dev-docs/modules/userId.html#prebidjs-adapters).
* **userIdAsEid** is the EID-formatted version of `userId`.
* **ortb2** a copy of `bidderRequest.ortb2` (see below), provided here for convenience.
* **schain** is where bidders can look for any [Supply Chain](/dev-docs/modules/schain.html) data that they should pass through to the endpoint.

#### bidderRequest Parameters

Here is a sample bidderRequest object:

```javascript
{
  auctionId: "b06c5141-fe8f-4cdf-9d7d-54415490a917",
  auctionStart: 1579746300522,
  bidderCode: "myBidderCode",
  bidderRequestId: "15246a574e859f",
  bids: [{...}],
  gdprConsent: {consentString: "BOtmiBKOtmiBKABABAENAFAAAAACeAAA", vendorData: {...}, gdprApplies: true},
  ortb2: {...},
  refererInfo: {
    canonicalUrl: null,
    page: "http://mypage.org?pbjs_debug=true",
    domain: "mypage.org",
    referer: null,
    numIframes: 0,
    reachedTop: true,
    isAmp: false,
    stack: ["http://mypage.org?pbjs_debug=true"]
  }
}
```

Notes on parameters in the bidderRequest object:

* **auctionId** (see [note](#tid-warning)) is unique per call to `requestBids()`, but is the same across ad units.
* **ortb2** is the global (not specific to any adUnit) [first party data](/features/firstPartyData.html) to use for all requests in this auction. Note that Prebid allows any standard ORTB field or extension as first party data - including items that typically wouldn't be considered as such, for example user agent client hints (`device.sua`) or information on the regulatory environment (`regs.ext.gpc`).

    {: .alert.alert-warning :}
    If your adapter generates an ORTB request, we recommend that you include _everything_ contained in `bidderRequest.ortb2` (and `bidRequest.ortb2Imp`); or, use the [ORTB conversion library](https://github.com/prebid/Prebid.js/blob/master/libraries/ortbConverter/README.md) which does this by default.  

    Since version 7.29, if Prebid finds appropriate values for the following fields, `ortb2` is guaranteed to contain:

  * under `site`: `page`, `ref`, `domain`, `publisher.domain`, `keywords`;
  * under `device`: `w`, `h`, `dnt`, `ua`, `sua`, `language`;
  * under `regs`: `coppa`, `ext.gdpr`, `ext.us_privacy`;
  * under `user`: `user.ext.consent`

Some of the data in `ortb2` is also made available through other `bidderRequest` fields:

* **refererInfo** is provided so you don't have to call any utils functions. See below for more information.
* **gdprConsent** is the object containing data from the [TCF ConsentManagement](/dev-docs/modules/consentManagementTcf.html) module. For TCF2+, it will contain both the tcfString and the addtlConsent string if the CMP sets the latter as part of the TCData object.
* **uspConsent** is the object containing data from the [US Privacy ConsentManagement](/dev-docs/modules/consentManagementUsp.html) module.

<a id="tid-warning"></a>

{: .alert.alert-warning :}
Since version 8, `auctionId` and `transactionId` are being migrated to `ortb2.source.tid` and `ortb2Imp.ext.tid` respectively; and are disabled by default, requiring [publisher opt-in](https://docs.prebid.org/dev-docs/pb8-notes.html#transaction-identifiers-are-now-reliable-and-opt-in).
When disabled, `auctionId`/`transactionId` are set to `null`; `ortb2.source.tid`/`ortb2Imp.ext.tid` are not populated. Your adapter should prefer the latter two, and be able to handle the case when they are undefined.

<a name="std-param-location"></a>

#### Prebid Standard Parameter Locations

There are a number of important values that a publisher expects to be handled in a standard way across all Prebid.js adapters:

{: .table .table-bordered .table-striped }
| Parameter | Description                                   | Example               |
| ----- | ------------ | ---------- |
| Ad Server Currency | If your endpoint supports responding in different currencies, read this value. | config.getConfig('currency.adServerCurrency') |
| Bidder Timeout | Use if your endpoint needs to know how long the page is allowing the auction to run. | bidderRequest.timeout; |
| COPPA | If your endpoint supports the Child Online Privacy Protection Act, you should read this value. | bidderRequest.ortb2.regs.coppa; |
| First Party Data | The publisher, as well as a number of modules, may provide [first party data](/features/firstPartyData.html) (e.g. page type). | bidderRequest.ortb2; validBidRequests[].ortb2Imp|
| Floors | Adapters that accept a floor parameter must also support the [floors module](https://docs.prebid.org/dev-docs/modules/floors.html) | [`bidRequest.getFloor()`](/dev-docs/modules/floors.html#bid-adapter-interface) |
| Page URL and referrer | Instead of building your own function to find the page location, domain, or referrer, look in the standard bidRequest location. | bidderRequest.refererInfo.page |
| [Supply Chain](/dev-docs/modules/schain.html) | Adapters cannot accept an schain parameter. Rather, they must look for the schain parameter at bidRequest.schain. | bidRequest.schain |
| Video Parameters | Video params must be read from AdUnit.mediaType.video when available; however bidder config can override the ad unit. | AdUnit.mediaType.video |

#### Location and referrers

Referrer information should be passed to your endpoint in contexts where the original page referrer isn't available directly to the adapter. Use the `bidderRequest.refererInfo` property to pass in referrer information. This property contains the following parameters:

* `location`: a string containing the detected top-level URL, or null when the top window is inaccessible.
* `topmostLocation`: a string containing the URL of the topmost accessible frame.
* `canonicalUrl`: a string containing the canonical (search engine friendly) URL, as set by the publisher.
* `page`: the best candidate for the top level URL - or null when the top window is inaccessible. Equivalent to `canonicalUrl` || `location`.
* `domain`: the domain (hostname and port) portion of `page`.
* `ref`: referrer to the top window (`window.top.document.referrer`), or null when the top window is inaccessible.
* `reachedTop`: a boolean specifying whether Prebid was able to walk up to the top window.
* `numIframes`: the number of iFrames.
* `stack`: an array of URLs of all windows from the top window down to the current window.
* `isAmp`: a boolean specifying whether the detected referer was determined based on AMP page information.

The URLs returned by `refererInfo` are in raw format. We recommend encoding the URL before adding it to the request payload to ensure it will be sent and interpreted correctly.

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

```javascript

return {
    method: 'POST',
    url: URL,
    data: payloadObject
};

```

To have the topics in the Sec-Browsing-Topics request header marked by the browser as observed, but also to include the current page visit in the user's next epoch top topic calculation, the server's response has to include Observe-Browsing-Topics: ?1.

Here's a JavaScript example using setHeader(): `res.setHeader('Observe-Browsing-Topics', '?1');`

<a name="bidder-adaptor-Interpreting-the-Response"></a>

### Interpreting the Response

The `interpretResponse` function will be called when the browser has received the response from your server. The function will parse the response and create a bidResponse object containing one or more bids. The adapter should indicate no valid bids by returning an empty array. An example showing a single bid:

```javascript

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
        mediaType: MEDIA_TYPE,
        meta: {
            advertiserDomains: [ARRAY_OF_ADVERTISER_DOMAINS],        
            advertiserId: ADVERTISER_ID,
            advertiserName: ADVERTISER_NAME,
            agencyId: AGENCY_ID,
            agencyName: AGENCY_NAME,
            brandId: BRAND_ID,
            brandName: BRAND_NAME,
            dchain: DEMAND_CHAIN_OBJECT,
            demandSource: DEMAND_SOURCE,
            dsa: IAB_DSA_RESPONSE_OBJECT,
            mediaType: MEDIA_TYPE,
            networkId: NETWORK_ID,
            networkName: NETWORK_NAME,
            primaryCatId: IAB_CATEGORY,
            secondaryCatIds: [ARRAY_OF_IAB_CATEGORIES]
        }
    };
    bidResponses.push(bidResponse);
    return bidResponses;

```

{: .alert.alert-info :}
Please provide as much information as possible in the `meta` object. Publishers use this
data for tracking down bad creatives and ad blocking. The advertiserDomains field and the Demand Chain Object are
particularly useful. Publishers may have analytics or security vendors with the capability to parse and validate complicated demand chain objects. The meta.advertiserDomains field is proposed as required in 5.0; other fields may become required in a future release.

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
| `bidderCode` | Optional                                    | Bidder code to use for the response - for adapters that wish to reply on behalf of other bidders. Defaults to the code registered with [`registerBidder`](#bidder-adaptor-Overview); note that any other code will need to be [explicitly allowed by the publisher](/dev-docs/publisher-api-reference/bidderSettings.html#allowAlternateBidderCodes). | 'exampleBidder' |  
| `dealId`     | Optional                                    | Deal ID                                                                                                                                       | `"123abc"`                           |
| `meta`                   | Optional     | Object containing metadata about the bid                                                                                                                         |                                      |
| `meta.networkId`         | Optional     | Bidder-specific Network/DSP Id               | `"1111"`             |
| `meta.networkName`       | Optional     | Network/DSP Name               | `"NetworkN"`                |
| `meta.agencyId`          | Optional     | Bidder-specific Agency ID               | `"2222"`                          |
| `meta.agencyName`        | Optional     | Agency Name     | `"Agency, Inc."`           |
| `meta.advertiserId`      | Optional     | Bidder-specific Advertiser ID     | `"3333"`                         |
| `meta.advertiserName`    | Optional     | Advertiser Name               | `"AdvertiserA"`                          |
| `meta.advertiserDomains` | Required(*)  | Array of Advertiser Domains for the landing page(s). This is an array that aligns with the OpenRTB 'adomain' field. See note below this table. | `["advertisera.com"]`     |
| `meta.brandId`           | Optional     | Bidder-specific Brand ID (some advertisers may have many brands)                                                                                                   | `"4444"`                    |
| `meta.brandName`         | Optional     | Brand Name                                   | `"BrandB"`                          |
| `meta.demandSource`      | Optional     | Demand Source (Some adapters may functionally serve multiple SSPs or exchanges, and this would specify which)                                  | `"SourceB"`
| `meta.dchain`            | Optional     | Demand Chain Object                                   | `{ 'ver': '1.0', 'complete': 0, 'nodes': [ { 'asi': 'magnite.com', 'bsid': '123456789', } ] }`                          |
| `meta.dsa`               | Optional     | The [IAB DSA response object](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/main/extensions/community_extensions/dsa_transparency.md) for the Digital Services Act (DSA) | `{ 'behalf': 'sample text', 'paid': 'sample value', 'transparency': [{ 'domain': 'sample domain', 'params': [1, 2] }], 'adrender': 1 }` | 
| `meta.primaryCatId`      | Optional     | Primary [IAB category ID](https://www.iab.com/guidelines/iab-quality-assurance-guidelines-qag-taxonomy/)               |  `"IAB-111"`                         |
| `meta.secondaryCatIds`   | Optional     | Array of secondary IAB category IDs      | `["IAB-222","IAB-333"]`       |
| `meta.mediaType`         | Optional     | "banner", "native", or "video" - this should be set in scenarios where a bidder responds to a "banner" mediaType with a creative that's actually a video (e.g. outstream) or native. | `"native"`  |
| `eventtrackers`          | Optional     | Array of objects in the same format as [ORTB native section 5.8, "Event Tracker Response Object"](https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf) |  `[{event: 500, method: 1, url: "https://www.example.com/track"]}]` |
| `eventtrackers[].event`   | Required     | Event type. Prebid.js will fire tracking pixels for `500` (bid won) and `1` (bid was rendered). |    `500`      |
| `eventtrackers[].method` | Required     | Tracking method. Prebid.js only fires image pixels (`1`)                                        |    `1`        |
| `eventtrackers[].url`    | Required     | Tracker URL                                                                                      | `https//www.example.com/track` |

{: .alert.alert-info :}
**Note:** bid adapters must be coded to accept the 'advertiserDomains' parameter from their endpoint even if that endpoint doesn't currently respond with that value.
Prebid.org publishers have required that all bidders must eventually supply this value, so every bidder should be planning for it.
There's often a long lag time between making a PBJS adapter update and when most pubs upgrade to it, so we minimally require adapters to be ready for the day when the endpoint responds with adomain.

#### Resolve OpenRTB Macros in the Creatives

If your endpoint can return creatives with OpenRTB macros, your adapter
should resolve them.

Prebid will resolve the AUCTION_PRICE macro, but it will be after currency conversion and any bid adjustments. This differs from how OpenRTB defines this value as being the clearing price in the
bid currency. Header Bidding is a first-price auction, the best candidate for
"clearing price" is the original bid itself.

Prebid won't resolve any other macros in the creative (e.g. AUCTION_ID, AUCTION_CURRENCY).

<a name="bidder-adaptor-Registering-User-Syncs"></a>

### Registering User Syncs

All user ID sync activity should be done using the `getUserSyncs` callback of the `BaseAdapter` model.

Given an array of all the responses from the server, `getUserSyncs` is used to determine which user syncs should occur. The order of syncs in the `serverResponses` array matters. The most important ones should come first, since publishers may limit how many are dropped on their page.

See below for an example implementation.  For more examples, search for `getUserSyncs` in the [modules directory in the repo](https://github.com/prebid/Prebid.js/tree/master/modules).

```javascript

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

```

<a name="bidder-adaptor-Registering-on-Timout"></a>

### Registering on Timeout

The `onTimeout` function will be called when an adapter has timed out for an auction. The adapter can fire an ajax or pixel call to register the timeout at their end.

Sample data passed to this function:

```javascript
[{
  "bidder": "example",
  "bidId": "51ef8751f9aead",
  "params": {
    ...
  },
  "adUnitCode": "div-gpt-ad-1460505748561-0",
  "timeout": 3000,
  "auctionId": "18fd8b8b0bd757"
}]
```

### Registering on Bid Won

The `onBidWon` function will be called when a bid from the adapter won the auction.

Sample data received by this function:

```javascript
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
```

### Registering on Bid Billable

The `onBidBillable` function will be called when it deems a bid to be billable. When a bid wins, it is by default also billable. That is, by default, onBidWon and onBidBillable will be called one after the other. However, a publisher can flag adUnits as being separately billable: `pbjs.addAdUnits({deferBilling: true, ...})`. Winning bids for adUnits with `deferBilling` set to true, trigger the onBidWon function but not the onBidBillable function. When appropriate (e.g. an interstitial is displayed), the publisher may then call the public API method, `pbjs.triggerBilling(winningBidObjectToBill)` passing the winning bid to be billed, which will trigger onBidBillable.

Sample data received by this function (same as what is recieved for onBidWon):

```javascript
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
```

### Registering on Set Targeting

The `onSetTargeting` function will be called when the adserver targeting has been set for a bid from the adapter.

Sample data received by this function:

```javascript
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
```

### Registering on Bidder Error

The `onBidderError` function will be called when the bidder responded with an error. Which means that the HTTP response status code is not between `200-299` and not equal to `304`.

Sample data received by this function:

```javascript
{
    error: XMLHttpRequest,
    bidderRequest: {
        {
            auctionId: "b06c5141-fe8f-4cdf-9d7d-54415490a917",
            auctionStart: 1579746300522,
            bidderCode: "myBidderCode",
            bidderRequestId: "15246a574e859f",
            bids: [{...}],
            gdprConsent: {consentString: "BOtmiBKOtmiBKABABAENAFAAAAACeAAA", vendorData: {...}, gdprApplies: true},
            refererInfo: {
                canonicalUrl: null,
                page: "http://mypage.org?pbjs_debug=true",
                domain: "mypage.org",
                ref: null,
                numIframes: 0,
                reachedTop: true,
                isAmp: false,
                stack: ["http://mypage.org?pbjs_debug=true"]
            }
        }
    }
}
```

### Adding adapter aliases

Use aliases if you want to reuse your adapter using other name for your partner/client, or just a shortcut name.

```javascript

export const spec = {
    code: 'appnexus',
    aliases: [
        'apnx',
        {
            code:'apx',
            gvlid: 1,
            skipPbsAliasing: false
        }
    ],
    ...
}

```

spec.aliases can be an array of strings or objects.

### Alias object description

If the alias entry is an object, the following attributes are supported:

{: .table .table-bordered .table-striped }
| Name  | Scope | Description   | Type      |
|-------|-------|---------------|-----------|
| `code` | required | shortcode/partner name | `string` |
| `gvlid` | optional | global vendor list id of company scoped to alias | `integer` |
| `skipPbsAliasing` | optional | ability to skip passing spec.code to prebid server in request extension. In case you have a prebid server adapter with the name same as the alias/shortcode. Default value: `false` | `boolean` |

{: .alert.alert-info :}
Note on aliases and TCF Global Vendor List IDs: if an alias entry does not have its own GVLID but wishes to claim GDPR support,
the documentation entry (The file in <https://github.com/prebid/prebid.github.io/tree/master/dev-docs/bidders>) must list the GVLID of the main adapter with that company's name in parentheses.
Look for other doc entries containing an `aliasCode` metadata entry.

### Supporting Privacy Regulations

If your bid adapter is going to be used in Europe, you should support GDPR:

* Get a [Global Vendor ID](https://iabeurope.eu/tcf-for-vendors/) from the IAB-Europe
* Add your GVLID into the spec block as 'gvlid'. If you don't do this, Prebid.js may block requests to your adapter.
* Read the gdprConsent string from the bid request object and pass it through to your endpoint

If your bid adapter is going to be used in Canada, you should support GPP:

* Get a [Global Vendor ID](https://iabcanada.com/tcf-canada/for-vendors/) from IAB-Canada
* Add your GVLID into the spec block as 'gvlid'. If you don't do this, Prebid.js may block requests to your adapter.
* Read the gppConsent string from the bid request object and pass it through to your endpoint
* If you are registered in Canada, but not in Europe, you put the gvlid in the same place. Prebid will check the CMP for consent to a specific vendor id and expect the correct processing in both Canada and Europe, as there are no collisions.

If your bid adapter is going to be used in the United States, you should support COPPA, GPP and CCPA:

* Read the uspConsent string from the bid request object and pass it through to your endpoint
* Read the gppConsent from the bid request object and pass it through to your endpoint
* Read coppa from the request object and forward it to your endpoint
* Consider handling data deletion events

## Supporting Video

Follow the steps in this section to ensure that your adapter properly supports video.

### Step 1: Register the adapter as supporting video

Add the `supportedMediaTypes` argument to the spec object, and make sure VIDEO is in the list:

```javascript
export const spec = {
    code: BIDDER_CODE,
    supportedMediaTypes: [VIDEO],
    // ...
}
```

{: .alert.alert-info :}
If your adapter supports banner and video media types, make sure to include `'banner'` in the `supportedMediaTypes` array as well

### Step 2: Accept video parameters and pass them to your server

Video parameters are often passed in from the ad unit in a `video` object. As of Prebid 4.0 the following paramters should be read from the ad unit when available; bidders can accept overrides of the ad unit on their bidder configuration parameters but should read from the ad unit configuration when their bidder parameters are not set. Parameters one should expect on the ad unit include:

* mimes
* minduration
* maxduration
* protocols
* startdelay
* placement
* skip
* skipafter
* minbitrate
* maxbitrate
* delivery
* playbackmethod
* api
* linearity

The design of these parameters may vary depending on what your server-side bidder accepts.  If possible, we recommend using the video parameters in the [OpenRTB specification](https://iabtechlab.com/specifications-guidelines/openrtb/).

For examples of video parameters accepted by different adapters, see [the list of bidders with video demand]({{site.baseurl}}/dev-docs/bidders.html#bidder-video-native).

#### Ingesting the Video Context

Video ad units have a publisher-defined video context, which can be either `'instream'` or `'outstream'` or `'adpod'`.  Video demand partners can choose to ingest this signal for targeting purposes.  For example, the ad unit shown below has the outstream video context:

```javascript
...
mediaTypes: {
    video: {
        context: 'outstream',
    playerSize: [640, 480],
    mimes: ['video/mp4'],
    protocols: [1, 2, 3, 4, 5, 6, 7, 8],
    playbackmethod: [2],
    skip: 1
        // video params must be read from here in place of
        // or instead of bidder-specific parameters
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
The following is Prebid's way to setup bid request for long-form, adapters are free to choose their own approach.

Prebid now accepts multiple bid responses for a single `bidRequest.bids` object. For each Ad pod Prebid expects you to send back n bid responses. It is up to you how bid responses are returned. Prebid's recommendation is that you expand an Ad pod placement into a set of request objects according to the total adpod duration and the range of duration seconds. It also depends on your endpoint as well how you may want to create your request for long-form. Appnexus adapter follows below algorithm to expand its placement.

#### Use case 1: I want to request my endpoint to return bids with varying ranges of durations

```text
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

* round the duration to the next highest specified duration value based on adunit. If the duration is above a range within a set buffer (hardcoded to 2s in prebid-core), that bid falls down into that bucket. (eg if `durationRangeSec` was [5, 15, 30] -> 2s is rounded to 5s; 17s is rounded back to 15s; 18s is rounded up to 30s)
* reject bid if the bid is above the range of the listed durations (and outside the buffer)

Prebid will set the rounded duration value in the `bid.video.durationBucket` field for accepted bids

#### Use case 2: I want to request my endpoint to return bids that exactly match the durations I want

```text
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

```javascript
{
  meta: {
    primaryCatId: '<iab sub category>', // only needed if you want to ensure competitive separation
  },
  video: {
    context: 'adpod',
    durationSeconds: 30
  }
}
```

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

```javascript
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

```javascript
getIabSubCategory(bidderCode, pCategory)
```

**Params**

{: .table .table-bordered .table-striped }
| Key          | Scope    | Description                                   | Example               |
|--------------|----------|-----------------------------------------------|-----------------------|
| `bidderCode` | Required | BIDDER_CODE defined in spec.                  | `"sample-biddercode"` |
| `pCategory`  | Required | Proprietary category returned in bid response | `"sample-category"`   |

**Example**

```javascript

import { getIabSubCategory } from '../src/adapters/bidderFactory';
let primaryCatId = getIabSubCategory(bidderCode, pCategory)

```

#### Outstream Video Renderers

As described in [Show Outstream Video Ads]({{site.baseurl}}/dev-docs/show-outstream-video-ads.html), for an ad unit to play outstream ads, a "renderer" is required.  A renderer is the client-side code (usually a combination of JavaScript, HTML, and CSS) responsible for displaying a creative on a page.  A renderer must provide a player environment capable of playing a video creative (most commonly an XML document).

If possible, we recommend that publishers associate a renderer with their outstream video ad units.  By doing so, all video-enabled demand partners will be able to participate in the auction, regardless of whether a given demand partner provides a renderer on its bid responses.  Prebid.js will always invoke a publisher-defined renderer on a given ad unit.

However, if the publisher does not define a renderer, you will need to return a renderer with your bid response if you want to participate in the auction for outstream ad unit.

### Step 3: Respond with a VAST URL or raw VAST XML

The returned VAST URL or raw VAST XML should be added into `bid.vastUrl` or `bid.vastXml`, respectively.

For example:

```javascript

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

```

### Deals in Ad Pods

To do deals for long-form video (`adpod` ad unit) just add the `dielTier` integer value to `bid.video.dealTier`. For more details on conducting deals in ad pods see our [ad pod module documentation](/dev-docs/modules/adpod.html).

## Supporting Native

In order for your bidder to support the native media type:

1. Your (server-side) bidder needs to return a response that contains native assets.
2. Your (client-side) bidder adapter needs to unpack the server's response into a Prebid-compatible bid response populated with the required native assets.
3. Your bidder adapter must be capable of ingesting the required and optional native assets specified on the `adUnit.mediaTypes.native` object, as described in [Show Native Ads](/prebid/native-implementation.html).
4. Your code, including tests, should check whether native support is enabled (through the global flag `FEATURES.NATIVE`) before doing #2 or #3. This allows users not interested in native to build your adapter without any native-specific code.
5. Your spec must declare NATIVE in the supportedMediaTypes array.

There are two ways Prebid supports native:

* The preferred method is for publishers to [define their native assets directly in OpenRTB format](/prebid/native-implementation.html).
* The legacy way is for pubs to supply a [Prebid-proprietary native asset syntax](/prebid/native-implementation-legacy.html).

### ORTB Native

1. Read the bidrequest.ortb object
2. Set the bidresponse object appropriately

### Legacy Native

The adapter code sample below fulfills requirement #2, unpacking the server's reponse and:

1. Checking for native assets on the response.
2. If present, filling in the `native` object with those assets.

```javascript

/* Does the bidder respond with native assets? */
else if (FEATURES.NATIVE && rtbBid.rtb.native) {

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
        ... many other possible native assets ...
    };
}

```

The full list of assets your bidder can set are defined [by legacy Prebid.js](/prebid/native-implementation-legacy.html#3-prebidjs-native-adunit-overview). All assets can be returned as strings, or images can be returned as objects with attributes `url`, `height`, and `width`.

Here's an example of returning image sizes:

```javascript
    /* Does the bidder respond with native assets? */
    else if (FEATURES.NATIVE && rtbBid.rtb.native) {

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

The targeting key `hb_native_image` (about which your can read more in the [Native Implementation Guide](/prebid/native-implementation.html)) will be set with the value of `image.url` if `image` is an object.

If `image` is a string, `hb_native_image` will be populated with that string (a URL).

### Transitioning Between Native Approaches

For some time, Prebid engineers will try to ensure that legacy-style request definitions will continue to work. However, Prebid.JS is internally converting everything to OpenRTB. So, OpenRTB is the way to go if you want to ensure your native adapter will continue to work for the long run.

We assume that in the first times all adapters will only understand legacy-style native, so we expose two functions in `native.js`:

* `convertOrtbRequestToProprietaryNative(bidRequests)` - this function will convert OpenRTB-style native requests to legacy format. Actually, we've already added this conversion to all adapters so they will not fail when an OpenRTB definition is used by publisher.

* `toOrtbNativeRequest(legacyNativeAssets)` - In the future, you should convert your bid adapter to assume that OpenRTB is the standard. If, however, you encounter a native bid without the `ortb` property, you can call this function to convert legacy assets to OpenRTB.

For the bid response, Prebid expects to find your OpenRTB bid response under `bid.native.ortb` property.

## Adding Unit Tests

Every adapter submission must include unit tests.  For details about adapter testing requirements, see the **Writing Tests** section of [CONTRIBUTING.md](https://github.com/prebid/Prebid.js/blob/master/CONTRIBUTING.md).

For example tests, see [the existing adapter test suites](https://github.com/prebid/Prebid.js/tree/master/test/spec/modules).

<a name="bidder-example"></a>

## Full Bid Adapter Example

```javascript

import * as utils from 'src/utils';
import {config} from 'src/config';
import {registerBidder} from 'src/adapters/bidderFactory';
import {BANNER, VIDEO, NATIVE} from 'src/mediaTypes.js';
const BIDDER_CODE = 'example';
export const spec = {
        code: BIDDER_CODE,
    gvlid: 0000000000,
    supportedMediaTypes: [BANNER, VIDEO, NATIVE],
        aliases: [{code: "myAlias", gvlid: 99999999999} ],
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
            return bidResponses;
        };
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

    /**
     * Register bidder specific code, which will execute if the bidder responded with an error
     * @param {error, bidderRequest} An object with the XMLHttpRequest error and the bid request object
     */
    onBidderError: function({ error, bidderRequest }) {
        // Bidder specific code
    }

    /**
     * Register bidder specific code, which will execute if the ad
     * has been rendered successfully
     * @param {bid} bid request object
     */
    onAdRenderSucceeded: function(bid) {
        // Bidder specific code
    }
}
registerBidder(spec);

```

## Submitting your adapter

* [Write unit tests](https://github.com/prebid/Prebid.js/blob/master/CONTRIBUTING.md)
* Create a docs pull request against [prebid.github.io](https://github.com/prebid/prebid.github.io)
  * Fork the repo
  * Copy a file in [dev-docs/bidders](https://github.com/prebid/prebid.github.io/tree/master/dev-docs/bidders) and name it to exactly the same as your biddercode. Add the following metadata to the header of your .md file:
    * Add 'biddercode' and set it to the code that publishers should be using to reference your bidder in an AdUnit. _This needs to be the same name as the docs file!_
    * Add 'aliasCode' if your biddercode is not the same name as your PBJS implementation file. e.g. if your biddercode is "ex", but the file in the PBJS repo is exampleBidAdapter.js, this value needs to be "example".
    * Add `pbjs: true`. If you also have a [Prebid Server bid adapter](/prebid-server/developers/add-new-bidder-go.html), add `pbs: true`. Default is false for both.
    * If you're on the IAB Global Vendor List (including just [Canada](https://vendor-list.consensu.org/v2/ca/vendor-list.json)), add your ID number in `gvl_id`.
    * If you support the IAB's TCF-EU consent string format and have a GVL ID, you may add `tcfeu_supported: true`. Default is false.
    * If you support the IAB's US Privacy consent string format, add `usp_supported: true`. Default is false.
    * If you support one or more userId modules, add `userId: (list of supported vendors)`. No default value.
    * If you support video and/or native mediaTypes add `media_types: video, native`. Note that display is added by default. If you don't support display, add "no-display" as the first entry, e.g. `media_types: no-display, native`. No default value.
    * If you support the COPPA flag, add `coppa_supported: true`. Default is false.
    * If you support the IAB's GPP consent string, add `gpp_sids` with a comma separated list of section names, e.g. `gpp_sids: tcfeu, tcfca, usnat, usstate_all, usp`. Default is None.
    * If you support the [supply chain](/dev-docs/modules/schain.html) feature, add `schain_supported: true`. Default is false.
    * If you support passing a demand chain on the response, add `dchain_supported: true`. Default is false.
    * If your bidder doesn't work well with safeframed creatives, add `safeframes_ok: false`. This will alert publishers to not use safeframed creatives when creating the ad server entries for your bidder. No default value.
    * If you support deals, set `deals_supported: true`. No default value..
    * If you support floors, set `floors_supported: true`. No default value..
    * If you support first party data, you must document what exactly is supported and then you may set `fpd_supported: true`. No default value.
    * If you support any OpenRTB blocking parameters, you must document what exactly is supported and then you may set `ortb_blocking_supported` to 'true','partial', or 'false'. No default value. In order to set 'true', you must support: bcat, badv, battr, and bapp.
    * Let publishers know how you support multiformat requests -- those with more than one mediatype (e.g. both banner and video). Here are the options: will-bid-on-any, will-bid-on-one, will-not-bid
    * If you support [privacy sandbox features](https://developers.google.com/privacy-sandbox) you can list them in the `privacy_sandbox` meta field. Allowed values are `paapi`, `topics`.
    * If you're a member of Prebid.org, add `prebid_member: true`. Default is false.
    * Always add `sidebarType: 1`. This is required for docs.prebid.org site navigation.
* Submit both the code and docs pull requests

For example:

```markdown
---
layout: bidder
title: example
description: Prebid example Bidder Adapter
biddercode: example
aliasCode: fileContainingPBJSAdapterCodeIfDifferentThenBidderCode
tcfeu_supported: true/false
dsa_supported: true/false
gvl_id: none
usp_supported: true/false
coppa_supported: true/false
gpp_sids: tcfeu, tcfca, usnat, usstate_all, usp
schain_supported: true/false
dchain_supported: true/false
userId: (list of supported vendors)
media_types: banner, video, native
safeframes_ok: true/false
deals_supported: true/false
floors_supported: true/false
fpd_supported: true/false
pbjs: true/false
pbs: true/false
prebid_member: true/false
multiformat_supported: will-bid-on-any, will-bid-on-one, will-not-bid
ortb_blocking_supported: true/partial/false
privacy_sandbox: no or comma separated list of `paapi`, `topics`
sidebarType: 1
---
### Note

The Example Bidding adapter requires setup before beginning. Please contact us at [setup@example.com](mailto:setup@example.com).

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

* [Prebid.js Repo - Bidder Adapter Sources](https://github.com/prebid/Prebid.js/tree/master/modules)
* [Module Rules](/dev-docs/module-rules.html)
