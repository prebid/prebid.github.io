---
layout: page_v2
title: Module - Prebid Server Adapter
display_name: Prebid Server Adapter
description: Server-to-Server header bidding
page_type: module
module_code : prebidServerBidAdapter
enable_download : true
vendor_specific: false
sidebarType : 1
---

# Prebid Server Adapter
{: .no_toc}

* TOC
{:toc }

## Overview

The Prebid Server Adapter is a meta-adapter. It's not an actual bidder, but
rather a way to get a batch of bids from other bidders with one request.
A request for the set of auctions is sent to Prebid Server, which performs
all the auctions server-to-server (S2S), responding in time for Prebid.js to
send the results to the ad server. This lightens the performance load on the user's device.

## Configuration
Here's an example config enabling the AppNexus Prebid Server:

```javascript
pbjs.setConfig({
    s2sConfig: {
        accountId : '12345',
        bidders : ['appnexus','pubmatic', 'rubicon'],
        defaultVendor: 'appnexus',
        timeout: 300
    }
});
```

To use multiple prebid servers, just define `s2sConfig` as an array. 
The same bidder cannot be set in both configs. For example:

```javascript
pbjs.setConfig({
    s2sConfig: [
    {
        accountId: '12345',
        bidders: ['appnexus','pubmatic'],
        defaultVendor: 'appnexus',
        timeout: 300,
    },
    {
        accountId: '678910',
        bidders: ['rubicon'],
        defaultVendor: 'rubicon',
        timeout: 300,
    },
    ],
});
```
There are many configuration options for s2sConfig:

{: .table .table-bordered .table-striped }
| Attribute | Scope | Type | Description                                                                                   |
|------------+---------+---------+---------------------------------------------------------------|
| `accountId` | Required | String | Your Prebid Server account ID. This is obtained from whoever's hosting your Prebid Server. |
| `bidders` | Optional | Array of Strings | Which bidders auctions should take place on the server side |
| `allowUnknownBidderCodes` | Optional | Boolean | Allow Prebid Server to bid on behalf of bidders that are not explicitly listed in the adUnit. See important [note](#allowUnknownBidderCodes) below. Defaults to `false`. |
| `defaultVendor` | Optional | String | Automatically includes all following options in the config with vendor's default values.  Individual properties can be overridden by including them in the config along with this setting. See the Additional Notes below for more information. |
| `enabled` | Optional | Boolean | Enables this s2sConfig block - defaults to `false` |
| `timeout` | Required | Integer | Number of milliseconds allowed for the server-side auctions. This should be approximately 200ms-300ms less than your Prebid.js timeout to allow for all bids to be returned in a timely manner. See the Additional Notes below for more information. |
| `adapter` | Required | String | Adapter to use to connect to Prebid Server. Defaults to 'prebidServer' |
| `endpoint` | Required | URL or Object | Defines the auction endpoint for the Prebid Server cluster.  See table below for object config properties. |
| `syncEndpoint` | Required | URL or Object | Defines the cookie_sync endpoint for the Prebid Server cluster. See table below for object config properties. |
| `userSyncLimit` | Optional | Integer | Max number of userSync URLs that can be executed by Prebid Server cookie_sync per request.  If not defined, PBS will execute all userSync URLs included in the request. |
| `syncTimeout` | Optional | Integer | Maximum number of milliseconds allowed for each server-side userSync to load. Default is 1000. |
| `syncUrlModifier` | Optional | Object | Function to modify a bidder's sync url before the actual call to the sync endpoint. Bidder must be enabled for s2sConfig. |
| `coopSync` | Optional | Boolean | Whether or not PBS is allowed to perform "cooperative syncing" for bidders not on this page. Publishers help each other improve match rates by allowing this. Default is true. |
| `defaultTtl` | Optional | Integer | Configures the default TTL in the Prebid Server adapter to use when Prebid Server does not return a bid TTL - 60 if not set |
| `adapterOptions` | Optional | Object | Arguments will be added to resulting OpenRTB payload to Prebid Server in every impression object at request.imp[].ext.BIDDER. See the example above. |
| `extPrebid` | Optional | Object | Arguments will be added to resulting OpenRTB payload to Prebid Server in request.ext.prebid. See the examples below. |

If `endpoint` and `syncEndpoint` are objects, these are the supported properties:

{: .table .table-bordered .table-striped }
| Attribute | Scope | Type | Description |
|------------+---------+---------+---------------------------------------------------------------|
| p1Consent | Required | String | Defines the auction endpoint or the cookie_sync endpoint for the Prebid Server cluster for non-consent requests or users who grant consent. |
| noP1Consent | Required | String | Defines the auction endpoint or the cookie_sync endpoint for the Prebid Server cluster for users who do not grant consent. (This is useful for a server configured to not accept any cookies to ensure compliance regulations.) |

**Notes on s2sConfig properties**

- Currently supported vendors are: appnexus, openx, and rubicon
- When using `defaultVendor` option, `accountId` still needs to be defined.
- If `bidders` is omitted, only adUnits that also omit bidders will be sent to Prebid Server. See the [stored impressions](#stored-imp) example below.
- If the `s2sConfig` timeout is greater than the Prebid.js timeout, the `s2sConfig` timeout will be automatically adjusted to 75% of the Prebid.js timeout in order to fit within the auction process.
- When using the `endpoint` or `syncEndpoint` object configs, you should define both properties.  If either property is not defined, Prebid Server requests for that type of user will not be made.  If you do not need to distinguish endpoints for consent reasons, you can simply define the same URL value in both fields or use the String version of the field (which is configured to use defined URL for all users).
- <a name="allowUnknownBidderCodes" /> When `allowUnknownBidderCodes` is `true`, bidders that have not been explicitly requested in [`adUnit.bids`](../adunit-reference.html#adunitbids) may take part in the auction. This can break custom logic that relies on the availability of a bid request object for any given bid. Known scenarios where custom code won't get the request when there's an "unknown bidder":
    - There will not be a [`bidRequested`](/dev-docs/publisher-api-reference/getEvents.html) event.
    - In the [MASS custom renderers](/dev-docs/modules/mass.html#configuration-parameters) module, `payload.bidRequest` will be undefined.
    - In the [Price Floors module](/dev-docs/modules/floors.html), custom schema functions will see the bidRequest object as undefined.


Additional options for `s2sConfig` may be enabled by including the [Server-to-Server testing module]({{site.baseurl}}/dev-docs/modules/s2sTesting.html).

**Passing the Referrer to Server Side Adapters**

* Setting `extPrebid.origreferrer` will be recognized by some server-side adapters as the referring URL for the current page.

**Emitting SeatNonBid Data**

* SeatNonBid information from Prebid Server can be emitted through a `seatNonBid` event by setting `extPrebid.returnallbidstatus` equal to `true`.

## Bid Params

Bid params are sourced from the adapter configurations set for client side. These do not need to change for Prebid Server.

{: .alert.alert-warning :}
**Errors in bidder parameters will cause Prebid Server to reject the
entire request.** The Prebid Server philosophy is to avoid silent failures --
we assume you will test changes, and that it will be easier to notice a
4xx error coming from the server than a silent failure where it skips just
the bad parameter.


## Examples

### Defining endpoints

s2sConfig example with the endpoint attributes defined instead of using the 'defaultVendor' approach:
```javascript
pbjs.setConfig({
    s2sConfig: [{
        accountId: '1001',
        bidders: ['bidderA', 'bidderB'],
        endpoint: 'https://mypbs.example.com/path',
        syncEndpoint: 'https://mypbs.example.com/path',
        timeout: 300
    }]
})
```

A similar example with the endpoint attributes defined as objects:
```javascript
pbjs.setConfig({
    s2sConfig: [{
        accountId: '1001',
        bidders: ['bidderA', 'bidderB'],
        endpoint: {
            p1Consent: 'https://mypbs.example.com/path',
            noP1Consent: 'https://mypbs2.example.com/path'
        },
        syncEndpoint: {
            p1Consent: 'https://mypbs.example.com/path',
            noP1Consent: 'https://mypbs2.example.com/path'
        },
        timeout: 300
    }]
})
```

### Server-Side Aliases

You may want to run a particular bidder on the client for banner, but that same bidder on the
server for video. You would do this by setting a **server-side** alias. For example:

```javascript
pbjs.setConfig({
  s2sConfig: [{
    accountId: '1',
    bidders: ['tripleliftVideo'],
    defaultVendor: 'appnexus',
    timeout: 500,
    extPrebid: {
      aliases: {
        tripleliftVideo: tripleLift
      }
    }
  }]
})
```

Here's how it works:

1. Video ad units are coded with the dynamic alias. e.g. tripleliftVideo
1. The s2sConfig.bidders array contains 'tripleliftVideo' telling Prebid.js to direct bids for that code to the server
1. Finally, the extPrebid.aliases line tells Prebid Server to route the 'tripleliftVideo' biddercode to the 'triplelift' server-side adapter.

### Video via s2sConfig

Supporting video through the Server-to-Server route can be done by providing a couple of extra arguments on the `extPrebid` object. e.g.

```javascript
pbjs.setConfig({
    s2sConfig: [{
        accountId: '1001',
        bidders: ['rubicon', 'pubmatic'],
        defaultVendor: 'rubicon',
        timeout: 250,
        extPrebid: {
            cache: {
                vastxml: {returnCreative: false}
            },
            targeting: {
                pricegranularity: {"ranges": [{"max": 40.00, "increment": 1.00}]}
            }
        }
    }]
})
```

<a name="stored-imp" />

### Stored impressions

Prebid Server stored [requests](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#stored-requests) can be requested through the adUnit `ortb2Imp` property. This is useful to move the list of bidders and parameters from the page to blocks of JSON stored on the server. For these cases, it's not necessary to specify `bids`:  

```javascript
pbjs.addAdUnits([{
  code: 'example-stored-request',
  mediaTypes: {
    banner: {
      sizes: [[300, 250]]
    }
  },
  ortb2Imp: {
    ext: {
      prebid: {
        storedrequest: {
          id: 'your-stored-request-id'
        }
      }
    }
  }
}])
```

### Stored responses

For debugging purposes, it can be useful to have a page that retrieves a static value rather than running an actual auction.
For this you can use PBS [stored responses](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#stored-responses-pbs-java-only).
Here's an example:

```javascript
pbjs.addAdUnits([{
  code: 'example-stored-response',
  mediaTypes: {
    banner: {
      sizes: [[300, 250]]
    }
  },
  ortb2Imp: {
    ext: {
      prebid: {
        storedauctionresponse: {
          id: 'your-stored-response-id'
        }
      }
    }
  }
}])
```

## Related Reading
- [Prebid Server Overview](/prebid-server/overview/prebid-server-overview.html)
