---
layout: api_prebidjs
title: pbjs.setConfig(options)
description: setConfig API
sidebarType: 1
---

* TOC
{:toc}

## Overview

`setConfig()` is the main way to tell Prebid.js how you want to run the header bidding auction. Every
call to `setConfig()` overwrites supplied values at the top level. e.g. if `ortb2` is provided as a value, any previously-supplied `ortb2` values will disappear.
If this is not the desired behavior, there is a [`mergeConfig()`](mergeConfig.html) function that will preserve previous values to do not conflict with the newly supplied values.

This page covers the setConfig() values supported by the core of Prebid.js. There are other options available if certain modules are included in the Prebid.js build:

Module-specific configuration:

* [Currency module](/dev-docs/modules/currency.html)
* [Consent Management](/dev-docs/modules/consentManagementTcf.html#page-integration)
* [User ID module](/dev-docs/modules/userId.html#configuration)
* [Adpod](/dev-docs/modules/adpod.html)
* [IAB Category Translation](/dev-docs/modules/categoryTranslation.html)

<a name="setConfig-Debugging"></a>

## PBJS Core Configuration

### Debugging

Debug mode can be enabled permanently in a page if desired. In debug mode,
Prebid.js will post additional messages to the browser console and cause Prebid Server to
return additional information in its response. If not specified, debug is off.
Note that debugging can be specified for a specific page view by adding
`pbjs_debug=true` to the URL's query string. e.g. <code>/pbjs_demo.html?pbjs_debug=true</code> See [Prebid.js troubleshooting guide](/troubleshooting/troubleshooting-guide.html) for more information.

Turn on debugging permanently in the page:

```javascript
pbjs.setConfig({ debug: true });
```

{: .alert.alert-warning :}
Note that turning on debugging for Prebid Server causes most server-side adapters to consider it a test request, meaning that they won't count on reports.

<a name="setConfig-deviceAccess"></a>

### Device Access

You can prevent Prebid.js from reading or writing cookies or HTML localstorage by setting this flag:

```javascript
pbjs.setConfig({ deviceAccess: false });
```

This can be useful in GDPR, CCPA, COPPA or other privacy scenarios where a publisher has determined that header bidding should not read from or write the user's device.

Note that bid adapters are normally denied access to device storage even when `deviceAccess` is `true`; see the [`storageAllowed` bidder setting](/dev-docs/publisher-api-reference/bidderSettings.html#deviceAccess).

<a name="setConfig-Bidder-Timeouts"></a>

### Bidder Timeouts

Set a global bidder timeout:

```javascript
pbjs.setConfig({ bidderTimeout: 3000 });
```

{: .alert.alert-warning :}
**Bid Timeouts and JavaScript Timers**
Note that it's possible for the timeout to be triggered later than expected, leading to a bid participating in the auction later than expected.  This is due to how [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) works in JS: it queues the callback in the event loop in an approximate location that *should* execute after this time but *it is not guaranteed*.
With a busy page load, bids can be included in the auction even if the time to respond is greater than the timeout set by Prebid.js.  However, we do close the auction immediately if the threshold is greater than 200ms, so you should see a drop off after that period.
For more information about the asynchronous event loop and `setTimeout`, see [How JavaScript Timers Work](https://johnresig.com/blog/how-javascript-timers-work/).

<a id="setConfig-enableTIDs"></a>

### Enable sharing of transaction IDs

Prebid generates unique IDs for both auctions and ad units within auctions; these can be used by DSPs to correlate requests from different sources, which is useful for many applications but also a potential privacy concern. Since version 8 they are disabled by default (see [release notes](/dev-docs/pb8-notes.html)), and can be re-enabled with `enableTIDs`:

```javascript
pbjs.setConfig({ enableTIDs: true });
```

### Max Requests Per Origin

<a name="setConfig-Max-Requests-Per-Origin"></a>

Since browsers have a limit of how many requests they will allow to a specific domain before they block, Prebid.js
will queue auctions that would cause requests to a specific origin to exceed that limit.  The limit is different
for each browser. Prebid.js defaults to a max of `4` requests per origin.  That value can be configured with
`maxRequestsPerOrigin`.

```javascript
// most browsers allow at least 6 requests, but your results may vary for your user base.  Sometimes using all
// `6` requests can impact performance negatively for users with poor internet connections.
pbjs.setConfig({ maxRequestsPerOrigin: 6 });

// to emulate pre 1-x behavior and have all auctions queue (no concurrent auctions), you can set it to `1`.
pbjs.setConfig({ maxRequestsPerOrigin: 1 });
```

### Disable Ajax Timeout

<a name="setConfig-Disable-Ajax-Timeout"></a>

Prebid core adds a timeout on XMLHttpRequest request to terminate the request once auction is timedout. Since Prebid is ignoring all the bids after timeout it does not make sense to continue the request after timeout. However, you have the option to disable this by using `disableAjaxTimeout`.

```javascript
pbjs.setConfig({ disableAjaxTimeout: true });
```

### Set TTL Buffer

<a id="setConfig-ttlBuffer"></a>

When an adapter bids, it provides a TTL (time-to-live); the bid is considered expired and unusuable after that time has elapsed. Core subtracts from it a buffer of 1 second; that is, a bid with TTL of 30 seconds is considered expired after 29 seconds. You can adjust this buffer with:

```javascript
pbjs.setConfig({ 
  ttlBuffer: 10  // TTL buffer in seconds 
});
```

### Change prerendering behavior

When a page is [prerendered](https://developer.chrome.com/docs/web-platform/prerender-pages), by default Prebid will delay auctions until it is activated.

You can disable this behavior and allow auctions to run during prerendering with `allowPrerendering`:

```javascript
pbjs.setConfig({
  allowPrerendering: true
})
```

Alternatively you may delay execution of the entire command queue (not just auctions) until the page is activated, using `delayPrerendering`:

```javascript
pbjs.delayPrerendering = true;
```

Note that `delayPrerendering` is a property of the `pbjs` global and not a normal setting; this is because it takes effect before (and delays) any call to `setConfig`.  

### Send All Bids

<a name="setConfig-Send-All-Bids"></a>

When enableSendAllBids is **true** (the default), the page will send keywords for all bidders to your ad server. The ad server can then make the decision on which bidder will win. Some ad servers, such as Google Ad Manager, can then generate reporting on historical bid prices from all bidders.

However, there will be a set of ad server targeting values for each bidder, so if you run many bidders this could cause an issue with how much data is being sent to the ad server.

There are several ways to address the issue of sending too much data to the ad server:

1. Set `enableSendAllBids` to **false**. This will minimize the number of targeting variables sent to the ad server; only the top bid will be sent.
1. Define the `auctionKeyMaxChars` setting. This allows you to establish a limit on the number of bytes sent to the ad server. See [targetingControls](#setConfig-targetingControls) for more details.
1. Set `enableSendAllBids` to **false** and `targetingControls.alwaysIncludeDeals` to **true**. This will send the top bid and any deals.
1. Set `enableSendAllBids` to **false**, `targetingControls.alwaysIncludeDeals` to **true**, and `auctionKeyMaxChars`. This will send the top bid and any deals up to the maximum number of characters.

Note that targeting config must be set before either `pbjs.setTargetingForGPTAsync()` or `pbjs.getAdserverTargeting()` is called.

#### Example results where enableSendAllBids is true
{: .no_toc}

```bash
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
```

You can see how the number of ad server targeting variable could get large
when many bidders are present.

{% capture noteAlert %}
The Prebid recommendation is to leave `enableSendAllBids` as **true** when ad server targeting volume is not a concern. This approach is more transparent and leaves the decisioning in the ad server.
{% endcapture %}

{% include alerts/alert_note.html content=noteAlert %}

##### Example of setting enableSendAllBids to false
{: .no_toc}

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

<a name="setConfig-Bidder-Order"></a>

### Configure Send Bids Control

<a name="setConfig-Send-Bids-Control"></a>

The `sendBidsControl` object passed to `pbjs.setConfig` provides the publisher with the ability to adjust the targeting behavior when [sendAllBids](#setConfig-Send-All-Bids) is enabled.

{: .table .table-bordered .table-striped }
| Attribute        | Type    | Description             |
|------------+---------+---------------------------------|
| `bidLimit` | integer | The maximum number of bids the system can add to ad server targeting. |
| `dealPrioritization` | boolean | When `true`, bids with deals are prioritized before bids without deals. |

#### Details on the bidLimit setting
{: .no_toc}

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
Note that this feature overlaps and can be used in conjunction with [targetingControls.auctionKeyMaxChars](#setConfig-targetingControls). Please see that section for tips on controlling the number of characters being sent to the ad server.

### Use Bid Cache

<a name="setConfig-Use-Bid-Cache"></a>

Prebid.js currently allows for [caching and reusing bids in a very narrowly defined scope](/dev-docs/faq.html#does-prebidjs-cache-bids).
However, if you'd like, you can disable this feature and prevent Prebid.js from using anything but the latest bids for
a given auction.

{: .alert.alert-warning :}
This option is available in version 1.39 as true-by-default and became false-by-default as of Prebid.js 2.0. If you want to use this
feature in 2.0 and later, you'll need to set the value to true.

```javascript
pbjs.setConfig({ useBidCache: true })
```

### Bid Cache Filter Function

<a name="setConfig-Bid-Cache-Filter-Function"></a>

When [Bid Caching](#setConfig-Use-Bid-Cache) is turned on, a custom Filter Function can be defined to gain more granular control over which "cached" bids can be used.  This function will only be called for "cached" bids from previous auctions, not "current" bids from the most recent auction.  The function should take a single bid object argument, and return `true` to use the cached bid, or `false` to not use the cached bid.  For Example, to turn on Bid Caching, but exclude cached video bids, you could do this:

```javascript
pbjs.setConfig({
    useBidCache: true,
    bidCacheFilterFunction: bid => bid.mediaType !== 'video'
});
```

### Minimum bid cache TTL

<a id="setConfig-minBidCacheTTL"></a>

By default, Prebid keeps every bid it receives stored in memory until the user leaves the page, even after the bid actually times out and is no longer available for new auctions. This can cause high memory usage on long-running single-page apps; you can configure Prebid to drop stale bids from memory with `minBidCacheTTL`:

```javascript
pbjs.setConfig({
  minBidCacheTTL: 60  // minimum time (in seconds) that bids should be kept in cache
})
```

When set, bids are only kept in memory for the duration of their actual TTL lifetime or the value of `minBidCacheTTL`, whichever is greater. Setting `minBidCacheTTL: 0` causes bids to be dropped as soon as they expire.

Put another way, this setting doesn't define each bid's TTL, but rather controls how long it's kept around in memory for analytics purposes.

### Event history TTL

<a id="setConfig-eventHistoryTTL"></a>

By default, Prebid keeps in memory a log of every event since the initial page load, and makes it available to analytics adapters and [getEvents()](/dev-docs/publisher-api-reference/getEvents.html).
This can cause high memory usage on long-running single-page apps; you can set a limit on how long events are preserved with `eventHistoryTTL`:

```javascript
pbjs.setConfig({
  eventHistoryTTL: 60 // maximum time (in seconds) that events should be kept in memory
})
```

### Bidder Order

Set the order in which bidders are called:

```javascript
pbjs.setConfig({ bidderSequence: "fixed" })   /* default is "random" */
```

<a name="setConfig-Page-URL"></a>

### Page URL

Override the Prebid.js page referrer for some bidders.

```javascript
pbjs.setConfig({ pageUrl: "https://example.com/index.html" })
```

<a name="setConfig-Price-Granularity"></a>

### Price Granularity

This configuration defines the price bucket granularity setting that will be used for the `hb_pb` keyword.

```javascript
pbjs.setConfig({ priceGranularity: "medium" })
```

Standard values:

* `"low"`: $0.50 increments, capped at $5 CPM
* `"medium"`: $0.10 increments, capped at $20 CPM (the default)
* `"high"`: $0.01 increments, capped at $20 CPM
* `"auto"`: Applies a sliding scale to determine granularity as shown in the [Auto Granularity](#autoGranularityBucket) table below.
* `"dense"`: Like `"auto"`, but the bid price granularity uses smaller increments, especially at lower CPMs.  For details, see the [Dense Granularity](#denseGranularityBucket) table below.
* `customConfigObject`: If you pass in a custom config object (as shown in the [Custom CPM Bucket Sizing](#customCPMObject) example below), you can have much finer control over CPM bucket sizes, precision, and caps.

<a name="autoGranularityBucket"></a>

#### Auto Granularity

{: .table .table-bordered .table-striped }
| CPM                 |     Granularity                  |  Example |
|---------------------+----------------------------------+--------|
| CPM <= $5            |    $0.05 increments             | $1.87 floored to $1.85 |
| CPM <= $10 and > $5  |    $0.10 increments             | $5.09 floored to $5.00 |
| CPM <= $20 and > $10 |    $0.50 increments             | $14.26 floored to $14.00 |
| CPM > $20            |    Caps the price bucket at $20 | $24.82 floored to $20.00 |

<a name="denseGranularityBucket"></a>

#### Dense Granularity

{: .table .table-bordered .table-striped }
| CPM        |  Granularity                  | Example |
|------------+-------------------------------+---------|
| CPM <= $3  |  $0.01 increments             | $1.87 floored to $1.87 |
| CPM <= $8 and >$3  |  $0.05 increments             | $5.09 floored to $5.05 |
| CPM <= $20 and >$8 |  $0.50 increments             | $14.26 floored to $14.00 |
| CPM >  $20 |  Caps the price bucket at $20 | $24.82 floored to $20.00 |

<a name="customCPMObject"></a>

#### Custom CPM Bucket Sizing

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

* `max` and `increment` must be specified
* A range's minimum value is assumed to be the max value of the previous range. The first interval starts at a min value of 0.
* `precision` is optional and defaults to 2

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

<a name="setConfig-MediaType-Price-Granularity"></a>

### Media Type Price Granularity

The standard [Prebid price granularities](#setConfig-Price-Granularity) cap out at 20, which isn't always convenient for video ads, which can command more than that. One solution is to set up a custom price
granularity as described above. Another approach is to use
`mediaTypePriceGranularity` config that may be set to define different price bucket
structures for different types of media:

* for each of five media types: banner, video, video-instream, video-outstream, and native.
* it is recommended that defined granularities be custom. It's possible to define "standard" granularities (e.g. "medium"), but it's not possible to mix both custom and standard granularities.

```javascript
const customPriceGranularityVideo = {
            'buckets': [
              { 'precision': 2, 'max': 5, 'increment': 0.25 },
              { 'precision': 2, 'max': 20, 'increment': 0.5 },
              { 'precision': 2, 'max': 100, 'increment': 1 }
            ]
};
const customPriceGranularityBanner = {
            'buckets': [
              { 'precision': 2, 'max': 5, 'increment': 0.5 },
              { 'precision': 2, 'max': 20, 'increment': 1 }
            ]
};

pbjs.setConfig({'mediaTypePriceGranularity': {
          'video': customPriceGranularity,   // used as default for instream video
          'video-outstream': customPriceGranularityBanner,
          'banner': 'customPriceGranularityBanner'
        }
});
```

Any `mediaTypePriceGranularity` setting takes precedence over `priceGranularity`.

{: .alert.alert-warning :}
mediaTypePriceGranularity works in two modes: either auctions contain adunits with a single media type, or all defined price granularities are custom.
i.e. You cannot run an auction containing a mix of mediatypes across an adunit AND having a mix of "custom" and "standard" price granularities across mediatypes.

{: .alert.alert-info :}
Note that mediaTypePriceGranularity is the only place that 'video-outstream' or 'video-instream'
are recognized. This was driven by the recognition that outstream often shares line items with banner.
If the mediatype is video, the price bucketing code further looks at the context (e.g. outstream) to see if there's
a price granularity override. If it doesn't find 'video-outstream' defined, it will then look for just 'video'.

<a name="setConfig-Cpm-Rounding"></a>

### Custom CPM Rounding

Prebid defaults to rounding down all bids to the nearest increment, which may cause lower CPM ads to be selected.
While this can be addressed through higher [price granularity](#setConfig-Price-Granularity), Prebid also allows setting a custom rounding function.
This function will be used by Prebid to determine what increment a bid will round to.
<br/>
<br/>
You can set a simple rounding function:

```javascript
// Standard rounding
pbjs.setConfig({'cpmRoundingFunction': Math.round});
```

Or you can round according to more complex considerations:

```javascript
// Custom rounding function
const roundToNearestEvenIncrement = function (number) {
  let ceiling = Math.ceil(number);
  let ceilingIsEven = ceiling % 2 === 0;
  if (ceilingIsEven) {
    return ceiling;
  } else {
    return Math.floor(number);
  }
}
pbjs.setConfig({'cpmRoundingFunction': roundToNearestEvenIncrement});
```

<a name="setConfig-Server-to-Server"></a>

### Server to Server

See the [Prebid Server module](/dev-docs/modules/prebidServer.html).

<a name="setConfig-app"></a>

### Mobile App Post-Bid

To support [post-bid](/overview/what-is-post-bid.html) scenarios on mobile apps, the
prebidServerBidAdapter module will accept `ortb2.app` config to
forward details through the server:

```javascript
pbjs.setConfig({
  ortb2: {
    app: {
      bundle: "org.prebid.mobile.demoapp",
      domain: "prebid.org"
    }
  }
});
```

{: .alert.alert-warning :}
In PBJS 4.29 and earlier, don't add the `ortb2` level here -- just `app` directly. Oh, and please upgrade. 4.29 was a long time ago.

<a name="setConfig-Configure-User-Syncing"></a>

### Configure User Syncing

The user sync configuration options described in this section give publishers control over how adapters behave with respect to dropping pixels or scripts to cookie users with IDs.
This practice is called "user syncing" because the aim is to let the bidders match IDs between their cookie space and the DSP's cookie space.
There's a good reason for bidders to be doing this -- DSPs are more likely to bid on impressions where they know something about the history of the user.
However, there are also good reasons why publishers may want to control the use of these practices:

* *Page performance*: Publishers may wish to move ad-related cookie work to much later in the page load after ads and content have loaded.
* *User privacy*: Some publishers may want to opt out of these practices even though it limits their users' values on the open market.
* *Security*: Publishers may want to control which bidders are trusted to inject images and JavaScript into their pages.

{: .alert.alert-info :}
**User syncing default behavior**
If you don't tweak any of the settings described in this section, the default behavior of Prebid.js is to wait 3 seconds after the auction ends, and then allow every adapter to drop up to 5 image-based user syncs.

For more information, see the sections below.

* [User Sync Properties](#setConfig-ConfigureUserSyncing-UserSyncProperties)
* [User Sync Examples](#setConfig-ConfigureUserSyncing-UserSyncExamples)
* [How User Syncing Works](#setConfig-ConfigureUserSyncing-HowUserSyncingWorks)

<a name="setConfig-ConfigureUserSyncing-UserSyncProperties"></a>

#### User Sync Properties

For descriptions of all the properties that control user syncs, see the table below.

{: .table .table-bordered .table-striped }
| Attribute        | Type    | Description                                                                                             |
|------------------+---------+---------------------------------------------------------------------------------------------------------|
| `syncEnabled`    | Boolean | Enable/disable the user syncing feature. Default: `true`.  |
| `filterSettings` | Object  | Configure lists of adapters to include or exclude their user syncing based on the pixel type (image/iframe). |
| `syncsPerBidder` | Integer | Number of registered syncs allowed per adapter. Default: `5`. To allow all, set to `0`. |
| `syncDelay`      | Integer | Delay in milliseconds for user syncing (both bid adapter user sync pixels and [userId module]({{site.baseurl}}/dev-docs/modules/userId.html) ID providers) after the auction ends. Default: `3000`. Ignored by the [userId module]({{site.baseurl}}/dev-docs/modules/userId.html) if auctionDelay > 0. |
| `auctionDelay`   | Integer | Delay in milliseconds of the auction to retrieve user ids via the [userId module]({{site.baseurl}}/dev-docs/modules/userId.html) before the auction starts. Continues auction once all IDs are retrieved or delay times out. Does not apply to bid adapter user sync pixels. Default: `0`. |
| `enableOverride` | Boolean | Enable/disable publisher to trigger user syncs by calling `pbjs.triggerUserSyncs()`. Default: `false`. |
| `aliasSyncEnabled` | Boolean | Enable/disable registered syncs for aliased adapters. Default: `false`. |

<a name="setConfig-ConfigureUserSyncing-UserSyncExamples"></a>

#### User Sync Examples

For examples of configurations that will change the default behavior, see below.

Push the user syncs to later in the page load:

```javascript
pbjs.setConfig({
    userSync: {
        syncDelay: 5000 // write image pixels 5 seconds after the auction
    }
});
```

Turn off user syncing entirely:

```javascript
pbjs.setConfig({
    userSync: {
        syncEnabled: false
    }
});
```

Delay auction to retrieve userId module IDs first:

```javascript
pbjs.setConfig({
    userSync: {
        auctionDelay: 1000 // delay auction up to 1 second
    }
});
```

Allow iframe-based syncs (the presence of a valid `filterSettings.iframe` object automatically enables iframe type user-syncing):

```javascript
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
```

Note - iframe-based syncing is disabled by default.  Image-based syncing is enabled by default; it can be disabled by excluding all/certain bidders via the `filterSettings` object._

Only certain bidders are allowed to sync and only certain types of sync pixels:

```javascript
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
```

If you want to apply the same bidder inclusion/exlusion rules for both types of sync pixels, you can use the `all` object instead specifying both `image` and `iframe` objects like so:

```javascript
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
```

Note - the `all` field is mutually exclusive and cannot be combined with the `iframe`/`image` fields in the `userSync` config.  This restriction is to promote clear logic as to how bidders will operate in regards to their userSync` pixels.  If the fields are used together, this will be considered an invalid config and Prebid will instead use the default `userSync` logic (all image pixels permitted and all iframe pixels are blocked)._

The same bidders can drop sync pixels, but the timing will be controlled by the page:

```javascript
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
```

As noted, there's a function available to give the page control of when registered user syncs are added.

```javascript
pbjs.triggerUserSyncs();
```

<a name="setConfig-ConfigureUserSyncing-HowUserSyncingWorks"></a>

#### How User Syncing Works

The [userSync.registerSync()]({{site.baseurl}}/dev-docs/bidder-adaptor.html#bidder-adaptor-Registering-User-Syncs) function called by the adapter keeps a queue of valid userSync requests. It prevents unwanted sync entries from being placed on the queue:

* Removes undesired sync types. (i.e. blocks iframe pixels if `filterSettings.iframe` wasn't declared)
* Removes undesired adapter registrations. (i.e. enforces the configured filtering logic from the `filterSettings` object)
* Makes sure there's not too many queue entries from a given adapter. (i.e. enforces syncsPerBidder)

When user syncs are run, regardless of whether they are invoked by the platform or by the page calling pbjs.triggerUserSyncs(), the queue entries are randomized and appended to the bottom of the HTML tag.

<a name="setConfig-targetingControls"></a>

### Configure Targeting Controls

The `targetingControls` object passed to `pbjs.setConfig` provides some options to influence how an auction's targeting keys are generated and managed.

{: .table .table-bordered .table-striped }
| Attribute        | Type    | Description             |
|------------+---------+---------------------------------|
| auctionKeyMaxChars | integer | Specifies the maximum number of characters the system can add to ad server targeting. |
| alwaysIncludeDeals | boolean | If [enableSendAllBids](#setConfig-Send-All-Bids) is false, set this value to `true` to ensure that deals are sent along with the winning bid |
| allowTargetingKeys | Array of Strings | Selects supported default targeting keys. |
| addTargetingKeys   | Array of Strings | Selects targeting keys to be supported in addition to the default ones |
| allowSendAllBidsTargetingKeys | Array of Strings | Selects supported default targeting keys. |

{: .alert.alert-info :}
Note that this feature overlaps and can be used in conjunction with [sendBidsControl.bidLimit](#setConfig-Send-Bids-Control).

#### Details on the auctionKeyMaxChars setting
{: .no_toc}

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

#### Finding the right value
{: .no_toc}

Given the varying nature of how sites are set up for advertising and the varying mechanics and data-points needed by ad servers, providing a generic threshold setting is tricky.  If you plan to enable this setting, it's recommended you review your own setup to determine the ideal value.  The following steps provide some guidance on how to start this process:

* Use Prebid to set up a test page that uses the typical setup for your site (in terms of the number of ad slots, etc.).
* Once it's working, look for the average number of characters Prebid uses for the auction targeting keys.
  * You can do this by enabling the Prebid debug mode, enabling this setting in your `setConfig` with a high value, and then opening the browser's console to review the Console Logs section.
* Also in the browser console, find your ad server's ad URL in the Network tab and review the details of the request to obtain information about the query data (specifically the number of characters used).
  * You can copy the data to another tool to count the number of characters that are present.

Between these two values (Prebid's targeting key count and the overall ad URL query character count), you will find the average number of characters that are used by your ad server.  It's likely that these ad server values will remain consistent given that type of setup.  So if you know your ad server has a particular character limit, you can assume that these ad server characters will be reserved and the difference is what you could allot to Prebid.

Between this feature and the overlapping [sendBidsControl.bidLimit](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Send-Bids-Control), you should be able to make sure that there's not too much data going to the ad server.

<a name="targetingControls-allowTargetingKeys"></a>

#### Details on the allowTargetingKeys setting
{: .no_toc}

The `allowTargetingKeys` config creates a targeting key mask based on the default targeting keys defined in CONSTANTS.TARGETING_KEYS and CONSTANTS.NATIVE_KEYS. Any default keys that do not match the mask will not be sent to the adserver. This setting can be helpful if you find that your default Prebid.js implementation is sending key values that your adserver isn't configured to process; extraneous key values may lead to the ad server request being truncated, which can cause potential issues with the delivery or rendering ads.

Prebid.js introduced the concept of optional targeting keys with 4.23. CONSTANTS.DEFAULT_TARGETING_KEYS is defined as a subset of CONSTANTS.TARGETING_KEYS. When a publisher defines targetingControls.allowTargetingKeys, this replaces the constant CONSTANTS.DEFAULT_TARGETING_KEYS and can include optional keys defined in CONSTANTS.TARGETING_KEYS. One example of this would be to make `hb_adomain` part of the default set.

To accomplish this, Prebid does the following:

* Collect original targeting generated by the auction.
* Generate new targeting filtered against allowed keys.
  * Custom targeting keys are always added to targeting.
  * Default targeting keys are added to targeting only if they match an allowed key named in `setConfig`.
* New targeting replaces original targeting before targeting is flattened.

The targeting key names and the associated prefix value filtered by `allowTargetingKeys`:

{: .table .table-bordered .table-striped }
| Name        | Value    | Default | Notes |
|------------+-----------+-------------+------------|
| BIDDER | `hb_bidder` | yes | |
| AD_ID | `hb_adid` | yes | Required for displaying a winning creative. |
| PRICE_BUCKET | `hb_pb` | yes | The results of the [price granularity](/dev-docs/publisher-api-reference/setConfig.html#setConfig-Price-Granularity) calculation. |
| SIZE | `hb_size` | yes | '300x250' |
| DEAL | `hb_deal` | yes | |
| SOURCE | `hb_source` | no | 'client' or 's2s' |
| FORMAT | `hb_format` | yes | 'banner', 'video', or 'native' |
| UUID | `hb_uuid` | no | Network cache ID for video |
| CACHE_ID | `hb_cache_id` | yes | Network cache ID for AMP or Mobile |
| CACHE_HOST | `hb_cache_host` | yes | |
| ADOMAIN | `hb_adomain` | no | Set to bid.meta.advertiserDomains[0]. Use cases: report on VAST errors, set floors on certain buyers, monitor volume from a buyer, track down bad creatives. |
| ACAT | `hb_acat` | no | Set to bid.meta.primaryCatId. Optional category targeting key that can be sent to ad servers that stores the value of the Primary IAB category ID if present. Use cases: category exclusion with an ad server order or programmatic direct deal on another ad slot (good for contextual targeting and/or brand
safety/suitability). |
| CRID | `hb_crid` | no | Set to bid.creativeId. Use cases: report on VAST errors, track down bad creatives. |
| DSP | `hb_dsp` | no | Set to bid.meta.networkName, falling back to bid.meta.networkId. Optional targeting key identifying the DSP or seat |
| title | `hb_native_title` | yes | |
| body | `hb_native_body` | yes | |
| body2 | `hb_native_body2` | yes | |
| privacyLink | `hb_native_privacy` | yes | |
| privacyIcon | `hb_native_privicon` | yes | |
| sponsoredBy | `hb_native_brand` | yes | |
| image | `hb_native_image` | yes | |
| icon | `hb_native_icon` | yes | |
| clickUrl | `hb_native_linkurl` | yes | |
| displayUrl | `hb_native_displayurl` | yes | |
| cta | `hb_native_cta` | yes | |
| rating | `hb_native_rating` | yes | |
| address | `hb_native_address` | yes | |
| downloads | `hb_native_downloads` | yes | |
| likes | `hb_native_likes` | yes | |
| phone | `hb_native_phone` | yes | |
| price | `hb_native_price` | yes | |
| salePrice | `hb_native_saleprice` | yes | |

Below is an example config of `allowTargetingKeys` excluding all default targeting keys except `hb_bidder`, `hb_adid`, and `hb_pb`:

```javascript
config.setConfig({
  targetingControls: {
    allowTargetingKeys: ['BIDDER', 'AD_ID', 'PRICE_BUCKET']
  }
});
```

Another example config showing the addition of `hb_adomain` and excluding all default targeting keys except `hb_bidder`, `hb_adid`, `hb_size` and `hb_pb`:

```javascript
config.setConfig({
  targetingControls: {
    allowTargetingKeys: ['BIDDER', 'AD_ID', 'PRICE_BUCKET', 'SIZE', 'ADOMAIN']
  }
});
```

<a name="targetingControls-addTargetingKeys"></a>

#### Details on the addTargetingKeys setting
{: .no_toc}

The `addTargetingKeys` config is similar to `allowTargetingKeys`, except it adds to the keys in CONSTANTS.DEFAULT_TARGETING_KEYS instead of replacing them. This is useful if you need Prebid.js to generate targeting for some keys that are not allowed by default without removing any of the default ones (see [allowTargetingKeys](#targetingControls-allowTargetingKeys) for details on how targeting is generated).

Note that you may specify only one of `allowTargetingKeys` or `addTargetingKeys`.

For example, this allows every default key, plus `hb_adomain`:

```javascript
config.setConfig({
    targetingControls: {
        addTargetingKeys: ['ADOMAIN']
    }
});
```

Which is equivalent to:

```javascript
config.setConfig({
    targetingControls: {
        allowTargetingKeys: [
            'BIDDER',
            'AD_ID',
            'PRICE_BUCKET',
            'SIZE',
            'DEAL',
            'FORMAT',
            'UUID',
            'CACHE_HOST',
            'title',
            'body',
            'body2',
            'privacyLink',
            'privacyIcon',
            'sponsoredBy',
            'image',
            'icon',
            'clickUrl',
            'displayUrl',
            'cta',
            'rating',
            'address',
            'downloads',
            'likes',
            'phone',
            'price',
            'salePrice',
            'rendererUrl',
            'adTemplate',
            'ADOMAIN'
        ]
    }
});
```

#### Details on the allowSendAllBidsTargetingKeys setting
{: .no_toc}

The `allowSendAllBidsTargetingKeys` is similar to `allowTargetingKeys` except it limits any default bidder specific keys sent to the adserver when sendAllBids is enabled. Any default bidder specific keys that do not match the mask will not be sent to the adserver. This setting can be helpful if you find that your default Prebid.js implementation is sending key values that your adserver isn't configured to process; extraneous key values may lead to the ad server request being truncated, which can cause potential issues with the delivery or rendering ads. An example of an extraneous key value many publishers may find redundant and want to remove is `hb_bidder_biddercode = biddercode`.

Below is an example config of `allowSendAllBidsTargetingKeys` excluding all default send all bids targeting keys except `hb_adid_biddercode`, `hb_pb_biddercode`:

```javascript
config.setConfig({
  targetingControls: {
    allowSendAllBidsTargetingKeys: ['AD_ID', 'PRICE_BUCKET'],
  },
});
```

<a name="setConfig-Configure-Responsive-Ads"></a>

### Configure Responsive Ads

See the [size mapping](/dev-docs/modules/sizeMapping.html) or [advanced size mapping](/dev-docs/modules/sizeMappingV2.html) modules.

<a name="setConfig-coppa"></a>

### COPPA

Bidder adapters that support the Child Online Privacy Protection Act (COPPA) read the `coppa` configuration.
Publishers with content falling under the scope of this regulation should consult with their legal teams.
The flag may be passed to supporting adapters with this config:

```javascript
pbjs.setConfig({coppa: true});
```

<a name="setConfig-fpd"></a>

### First Party Data

The First Party Data feature allows publishers to specify key/value data in one place where each compatible bid adapter can read it.
See the [First Party Data Feature](/features/firstPartyData.html) for more detailed examples.

{: .alert.alert-warning :}
Not all bid adapters currently support reading first party data in this way, but support should increase over time.

**Scenario 1** - Global (cross-adunit) First Party Data open to all bidders

```javascript
pbjs.setConfig({
   ortb2: {
       site: {
         // ...
       },
       user: {
         // ...
       }
    }
});
```

The `ortb2` JSON structure reflects the OpenRTB standard:

* Fields that like keywords, search, content, gender, yob, and geo are values defined in OpenRTB, so should go directly under the site or user objects.
* Arbitrary values should go in site.ext.data or user.ext.data.
* Segments should go in site.content.data[] or user.data[].
* Any other OpenRTB 2.5 field could be added here as well, e.g. site.content.language.

**Scenario 2** - Auction (cross-adunit) First Party Data open to all bidders

If a page needs to specify multiple different sets of top-level data (`site`, `user`, or `app`), use the `ortb2` parameter of [`requestBids`](/dev-docs/publisher-api-reference/setConfig.html) ([example](/features/firstPartyData.html#supplying-auction-specific-data)  

**Scenario 3** - Global (cross-adunit) First Party Data open only to a subset of bidders

If a publisher only wants certain bidders to receive the data, use the [setBidderConfig](/dev-docs/publisher-api-reference/setBidderConfig.html) function.

**Scenario 4** - AdUnit-specific First Party Data

See the [AdUnit Reference](/dev-docs/adunit-reference.html) for AdUnit-specific first party data.

See [Prebid Server First Party Data](/prebid-server/features/pbs-fpd.html) for details about passing data server-side.

<a name="video-module"></a>

### Video Module to integrate with Video Players

The Prebid Video Module allows Prebid to directly integrate with a Video Player, allowing Prebid to automatically load the winning ad into the player, mark bids as won, fill the video and content oRTB params in the bid request, surface video analytics, and more. For more information please visit the [Video Module docs]({{site.github.url}}/prebid-video/video-module.html).  
To register a video player with Prebid, you must use `setConfig` to set a `video` config compliant with the following structure:

{: .table .table-bordered .table-striped }
| Field | Required? | Type | Description |
|---|---|---|---|
| video.providers[] | yes | array of objects | List of Provider configurations. You must define a provider configuration for each player instance that you would like integrate with. |
| video.providers[] .vendorCode | yes | number | The identifier of the Video Provider vendor (i.e. 1 for JW Player, 2 for videojs, etc). Allows Prebid to know which submodule to instantiate. |
| video.providers[].divId | yes | string | The HTML element id of the player or its placeholder div. All analytics events for that player will reference this ID. Additionally, used to indicate which HTLM element must contain the Video Player instance when instantiated. |
| video.providers[] .playerConfig.autoStart | no | boolean | Defaults to false |
| video.providers[] .playerConfig.mute | no | boolean | Defaults to false |
| video.providers[] .playerConfig.licenseKey | no | boolean | The license key or account key. Required by most commercial video players. |
| video.providers[] .playerConfig.setupAds | no | boolean | Defaults to true. Setting to false will prevent Prebid from setting up the ads components for the player. Disable when you wish to setup the player's ad components yourself. |
| video.providers[] .playerConfig.params .vendorConfig | no | object | The configuration block specific to a video player. Use this when setting configuration options not available in `video.providers[].playerConfig`. Its properties supersede the equivalents in `video.providers[].playerConfig`. |
| video.providers[] .playerConfig.params .adPluginConfig | no | object | The configuration block specific to the video player's ad plugin. Use this to customize the ad experience. The configuration spec is defined by your video player's ad plugin. |
| video.providers[] .adServer | no | object | Configuration for ad server integration. Applies to all Ad Units linked to a video provider. Superseded by `video.adServer` configurations defined at the Ad Unit level. |
| video.providers[] .adServer.vendorCode | yes | string | The identifier of the AdServer vendor (i.e. gam, etc) |
| video.providers[] .adServer.baseAdTagUrl | yes | string | Your AdServer Ad Tag. The targeting params of the winning bid will be appended. Required when `video.providers[].adServer.params` is absent. |
| video.providers[] .adServer.params | yes | object | Querystring parameters that will be used to construct the video ad tag URL. Required when `video.providers[].adServer.baseAdTagUrl` is absent. |
| video.contentEnrichmentEnabled | no | boolean | Defaults to true. Set to false to prevent the Video Module from enriching the `site.content` params in the bidder request. |
| video.mainContentDivId | no | string | Div Id of the video player intended to populate the `bidderRequest.site.content` params. Used when multiple video players are registered with the Video Module to indicate which player is rendering the main content. The `bidderRequest.site.content` params will be populated by said video player for all auctions where a Video Player is registered with an Ad Unit in the auction. |
| video.adServer | no | object | Configuration for ad server integration. Applies to all Video Providers and all Ad Units linked to a video provider. Superseded by `video.adServer` configurations defined at the Ad Unit level, and `video.providers[] .adServer` configurations. |
| video.adServer .vendorCode | yes | string | The identifier of the AdServer vendor (i.e. gam, etc) |
| video.adServer .baseAdTagUrl | yes | string | Your AdServer Ad Tag. The targeting params of the winning bid will be appended. Required when `video.adServer.params` is absent. |
| video.adServer .params | yes | object | Querystring parameters that will be used to construct the video ad tag URL. Required when `video.adServer.baseAdTagUrl` is absent. |

**Note:** You can integrate with different Player vendors. For this to work, you must ensure that the right Video Submodules are included in your build, and that the providers have the right `vendorCode`s and `divId`s.

#### Player Integration Example
{: .no_toc}

Assuming your page has 2 JW Player video players, 1 video.js video player, and your ad server is GAM.

```javascript
pbjs.setConfig({
    video: {
        providers: [{
            vendorCode: 1, // constant variable is JWPLAYER_VENDOR - see vendorCodes.js in the video library
            divId: 'jwplayer-div-1',
            playerConfig: {
                autoStart: true,
            }
        }, {
            vendorCode: 2, // constant variable is VIDEO_JS_VENDOR - see vendorCodes.js in the video library
            divId: 'videojs-div',
            playerConfig: {
                params : {
                    adPluginConfig: {
                        numRedirects: 10
                    },
                    vendorConfig: {
                        controls: true,
                        preload: "auto",
                    }
                }
            }
        }, {
            vendorCode: 1, // constant variable is JWPLAYER_VENDOR - see vendorCodes.js in the video library
            divId: 'jwplayer-div-2',
            playerConfig: {
                mute: true
            }
        }],
        adServer: {
            vendorCode: 'gam', // constant variable is GAM_VENDOR - see vendorCodes.js in the video library
            baseAdTagUrl: 'https://pubads.g.doubleclick.net/gampad/ads?iu=/12345/'
        }
    }
});
```

<a name="setConfig-vast-cache"></a>

### Client-side Caching of VAST XML

When serving video ads, VAST XML creatives must be cached on the network so the
video player can retrieve them when it's ready. Players don't obtain the VAST XML from
the JavaScript DOM in Prebid.js, but rather expect to be given a URL where it can
be retrieved. There are two different flows possible with Prebid.js around VAST XML caching:

* Server-side caching:  
  Some video bidders (e.g. Rubicon Project) always cache the VAST XML on their servers as part of the bid. They provide a 'videoCacheKey', which is used in conjunction with the VAST URL in the ad server to retrieve the correct VAST XML when needed. In this case, Prebid.js has nothing else to do. As of Prebid.js 4.28, a publisher may specify the `ignoreBidderCacheKey` flag to re-cache these bids somewhere else using a VAST wrapper.
* Client-side caching:  
  Video bidders that don't cache on their servers return the entire VAST XML body. In this scenario, Prebid.js needs to copy the VAST XML to a publisher-defined cache location on the network. Prebid.js POSTs the VAST XML to the named Prebid Cache URL. It then sets the 'videoCacheKey' to the key that's returned in the response.

{: .table .table-bordered .table-striped }
| Cache Attribute | Required? | Type | Description |
|----+--------+-----+-------|
| cache.url | yes | string | The URL of the Prebid Cache server endpoint where VAST creatives will be sent. |
| cache.timeout | no | number | Timeout (in milliseconds) for network requests to the cache |
| cache.vasttrack | no | boolean | Passes additional data to the url, used for additional event tracking data. Defaults to `false`. |
| cache.ignoreBidderCacheKey | no | boolean | If the bidder supplied their own cache key, setting this value to true adds a VAST wrapper around that URL, stores it in the cache defined by the `url` parameter, and replaces the original video cache key with the new one. This can dramatically simplify ad server setup because it means all VAST creatives reside behind a single URL. The tradeoff: this approach requires the video player to unwrap one extra level of VAST. Defaults to `false`. |
| cache.batchSize | no | number | Enables video cache requests to be batched by a specified amount (defaults to 1) instead of making a single request per each video. |
| cache.batchTimeout | no | number | Used in conjunction with `batchSize`, `batchTimeout` specifies how long to wait in milliseconds before sending a batch video cache request based on the value for `batchSize` (if present). A batch request will be made whether the `batchSize` amount was reached or the `batchTimeout` timer runs out. `batchTimeout` defaults to 0. |

Here's an example of basic client-side caching. Substitute your Prebid Cache URL as needed:

```javascript
pbjs.setConfig({
        cache: {
            url: 'https://prebid.adnxs.com/pbc/v1/cache'
        }
});
```

{: .alert.alert-warning :}
The endpoint URL provided must be a Prebid Cache or be otherwise compatible with the [Prebid Cache interface](https://github.com/prebid/prebid-cache).

As of Prebid.js 4.28, you can specify the `ignoreBidderCacheKey` option:

```javascript
pbjs.setConfig({
        cache: {
            url: 'https://my-pbs.example.com/cache',
            ignoreBidderCacheKey: true
        }
});
```

As of Prebid.js 2.36, you can track client-side cached VAST XML. This functionality is useful for publishers who want to allow their analytics provider to measure video impressions. The prerequisite to using this feature is the availability of a Prebid Server that supports:

* the /vtrack endpoint
* an analytics module with connection to an analytics system that supports joining the impression event to the original auction request on the bidid
* the ability of a publisher to utilize the feature (if account-level permission is enabled)

Given those conditions, the `vasttrack` flag can be specified:

```javascript
pbjs.setConfig({
        cache: {
            url: 'https://my-pbs.example.com/vtrack',
            vasttrack: true
        }
});
```

Setting the `vasttrack` parameter to `true` supplies the POST made to the `/vtrack`
Prebid Server endpoint with a couple of additional parameters needed
by the analytics system to join the event to the original auction request.

Optionally, `batchSize` and `batchTimeout` can be utlilized as illustrated with the example below:

```javascript
pbjs.setConfig({
        cache: {
            url: 'https://prebid.adnxs.com/pbc/v1/cache',
            batchSize: 4,
            batchTimeout: 50
        }
});
```

The example above states that a timer will be initialized and wait up to 50ms for 4 responses to have been collected and then will fire off one batch video cache request for all 4 responses. Note that the batch request will be made when the specified `batchSize` number is reached or with the number of responses that could be collected within the timeframe specified by the value for `batchTimeout`.

If a batchSize is set to 2 and 5 video responses arrive (within the timeframe specified by `batchTimeout`), then three batch requests in total will be made:

1. Batch 1 will contain cache requests for 2 videos
2. Batch 2 will contain cache requests for 2 videos
3. Batch 3 will contain cache requests for 1 video

<a name="setConfig-instream-tracking"></a>

### Instream tracking

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

#### Instream Tracking Example
{: .no_toc}

```javascript
pbjs.setConfig({
        'instreamTracking': {
            enabled: true,
        }
});
```

More examples [here](/dev-docs/modules/instreamTracking.html#example-with-urlpattern).

<a name="setConfig-site"></a>

### Site Configuration

Adapters, including Prebid Server adapters, can support taking site parameters like language.
Just set the `ortb2.site` object as First Party Data to make it available to client- and server-side adapters.

```javascript
pbjs.setConfig({
  ortb2: {
    site: {
       content: {
           language: "en"
       }
    }
  }
});
```

{: .alert.alert-warning :}
In PBJS 4.29 and earlier, don't add the `ortb2` level here -- just `site` directly. Oh, and please upgrade. 4.29 was a long time ago.

<a name="setConfig-auctionOptions"></a>

### Auction Options

The `auctionOptions` object controls aspects related to auctions.

{: .table .table-bordered .table-striped }
| Field    | Scope   | Type   | Description                                                                           |
|----------+---------+--------+---------------------------------------------------------------------------------------|
| `secondaryBidders` | Optional | Array of Strings | Specifies bidders that the Prebid auction will no longer wait for before determining the auction has completed. This may be helpful if you find there are a number of low performing and/or high timeout bidders in your page's rotation. |
| `suppressStaleRender` | Optional | Boolean | When true, prevents `banner` bids from being rendered more than once. It should only be enabled after auto-refreshing is implemented correctly.  Default is false. |
| `suppressExpiredRender` | Optional | Boolean | When true, prevent bids from being rendered if TTL is reached. Default is false.

#### Examples
{: .no_toc}

Exclude status of bidder *doNotWaitForMe* when checking auction completion.

```javascript
pbjs.setConfig({
    'auctionOptions': {
        'secondaryBidders': ['doNotWaitForMe']
    }
});
```

Render winning bids only once.

```javascript
pbjs.setConfig({
    'auctionOptions': {
        'suppressStaleRender': true
    }
});
```

#### More on Stale Rendering
{: .no_toc}

When auto-refreshing is done incorrectly, it could cause the same bids to be rendered repeatedly. For instance, when googletag.pubads.refresh() is called directly without removing the PBJS targeting, the same hb_ variables get re-sent to GAM, re-chosen, and re-rendered. Over and over without ever asking PBJS for updated targeting variables.

PBJS performs following actions when stale rendering is detected.

* Log a warning in the browser console if pbjs_debug=true.
* Emit a `STALE_RENDER` event before `BID_WON` event.

Stale winning bids will continue to be rendered unless `suppressStaleRender` is set to true.  Events including `STALE_RENDER` and `BID_WON` are unaffected by this option.

Render only non-expired bids.

```javascript
pbjs.setConfig({
    'auctionOptions': {
        'suppressExpiredRender': true
    }
});
```

#### More on Expired Rendering
{: .no_toc}

We are validating the `ttl` property before rendering an ad. If the ad has exceeded its ttl value and the `suppressExpiredRender` property is enabled, the system will suppress the rendering of the expired ad.

PBJS performs the following actions when expired rendering is detected.

* Log a warning in the browser console if pbjs_debug=true.
* Emit a `EXPIRED_RENDER` event before `BID_WON` event.

Expired winning bids will continue to be rendered unless `suppressExpiredRender` is set to true.  Events including `STALE_RENDER` and `BID_WON` are unaffected by this option.

<a name="setConfig-maxNestedIframes"></a>

### maxNestedIframes

Prebid.js will loop upward through nested iframes to find the top-most referrer. This setting limits how many iterations it will attempt before giving up and not setting referrer.

```javascript
pbjs.setConfig({
    maxNestedIframes: 5   // default is 10
});
```

<a name="setConfig-realTimeData"></a>

### Real-Time Data Modules

All of the modules that fall under the [Real-Time Data (RTD) category](/dev-docs/modules/index.html#real-time-data-providers) conform to
a consistent set of publisher controls. The pub can choose to run multiple
RTD modules, define an overall amount of time they're willing to wait for
results, and even flag some of the modules as being more "important"
than others.

```javascript
pbjs.setConfig({
    // ...,
    realTimeData: {
      auctionDelay: 100,     // OPTIONAL: applies to all RTD modules.
      dataProviders: [{
          name: "RTD-MODULE-1",
          waitForIt: true,   // OPTIONAL: flag this module as important
          params: {
            // ... module-specific parameters ...
          }
      },{
          name: "RTD-MODULE-2",
          waitForIt: false,   // OPTIONAL: flag this module as less important
          params: {
            //... module-specific parameters ...
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

* The only time `waitForIt` means anything is if some modules are flagged as true and others as false. If all modules are the same (true or false), it has no effect.
* Likewise, `waitForIt` doesn't mean anything without an auctionDelay specified.

<a name="setConfig-topicsIframeConfig"></a>

### Topics Iframe Configuration

Topics iframe implementation is the enhancements of existing module under topicsFpdModule.js where different bidders will call the topic API under their domain to fetch the topics for respective domain and the segment data will be part of ORTB request under user.data object. Default config is maintained in the module itself. Below are the configuration which can be used to configure and override the default config maintained in the module.

```javascript
pbjs.setConfig({
    userSync: {
        ...,
        topics: { 
            maxTopicCaller: 3, // SSP rotation 
            bidders: [{
                bidder: 'pubmatic',
                iframeURL: 'https://ads.pubmatic.com/AdServer/js/topics/topics_frame.html',
                expiry: 7 // Configurable expiry days
            },{
                bidder: 'rubicon',
                iframeURL: 'https://rubicon.com:8080/topics/fpd/topic.html', // dummy URL
                expiry: 7 // Configurable expiry days
            },{
                bidder: 'appnexus',
                iframeURL: 'https://appnexus.com:8080/topics/fpd/topic.html', // dummy URL
                expiry: 7 // Configurable expiry days
            }]
        }
        ....
    }
})

```

{: .table .table-bordered .table-striped }
| Field | Required? | Type | Description |
|---|---|---|---|
| topics.maxTopicCaller | no | integer | Defines the maximum numbers of Bidders Iframe which needs to be loaded on the publisher page. Default is 1 which is hardcoded in Module. Eg: topics.maxTopicCaller is set to 3. If there are 10 bidders configured along with their iframe URLS, random 3 bidders iframe URL is loaded which will call TOPICS API. If topics.maxTopicCaller is set to 0, it will load random 1(default) bidder iframe atleast. |
| topics.bidders | no | Array of objects  | Array of topics callers with the iframe locations and other necessary informations like bidder(Bidder code) and expiry. Default Array of topics in the module itself.|
| topics.bidders[].bidder | yes | string  | Bidder Code of the bidder(SSP).  |
| topics.bidders[].iframeURL | yes | string  | URL which is hosted on bidder/SSP/third-party domains which will call Topics API.  |
| topics.bidders[].expiry | no | integer  | Max number of days where Topics data will be persist. If Data is stored for more than mentioned expiry day, it will be deleted from storage. Default is 21 days which is hardcoded in Module. |

<a id="setConfig-performanceMetrics"></a>

### Disable performance metrics

Since version 7.17, Prebid collects fine-grained performance metrics and attaches them to several events for the purpose of analytics. If you find that this generates too much data for your analytics provider you may disable this feature with:

```javascript
pbjs.setConfig({performanceMetrics: false})
```

<a id="setConfig-aliasRegistry"></a>

### Setting alias registry to private

The alias registry is made public by default during an auction.  It can be referenced in the following way:

```javascript
pbjs.aliasRegistry or pbjs.aliasRegistry[aliasName];
```

Inversely, if you wish for the alias registry to be private you can do so by using the option below (causing `pbjs.aliasRegistry` to return undefined):

```javascript
pbjs.setConfig({aliasRegistry: 'private'})
```

### Set Max Bid

<a id="setConfig-maxBid"></a>

Prebid ensures that the bid response price doesn't exceed the maximum bid. If the CPM (after currency conversion) is higher than the maxBid, the bid is rejected. The default maxBid value is 5000. You can adjust maxBid with:

```javascript
pbjs.setConfig({ 
  maxBid: 10  
});
```

<a name="setConfig-Generic-Configuration"></a>

### General adapter Configuration

Some adapters may support other options, as defined in their documentation. To set arbitrary configuration values:

```javascript
pbjs.setConfig({ <key>: <value> });
```

<a name="setConfig-Troubleshooting-your-configuration"></a>

### Troubleshooting your configuration

Towards catching syntax errors, one tip is to call `pbjs.setConfig` without an object, e.g.,

```javascript
pbjs.setConfig('debug', 'true');
```

then Prebid.js will print an error to the console that says:

```noformat
ERROR: setConfig options must be an object
```

If you don't see that message, you can assume the config object is valid.

<hr class="full-rule">
